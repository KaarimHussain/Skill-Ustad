import uuid
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field, ValidationError
from typing import Literal, List
import ollama
import json

router = APIRouter()

# === Request Models ===
class QuestionRequest(BaseModel):
    title: str
    description: str
    difficulty: Literal["beginner", "intermediate", "advanced"]
    questionCount: int = Field(default=5, ge=1, le=10)  # Keep it small for small models


# === Response Model (Pydantic) ===
class QuestionItem(BaseModel):
    id: str
    question: str
    options: List[str] = Field(..., min_items=4, max_items=4)
    correctAnswer: int  # 0, 1, 2, or 3
    explanation: str

class QuestionResponse(BaseModel):
    questions: List[QuestionItem]


# === Route ===
@router.post("/questions/generate", response_model=QuestionResponse)
async def generate_response(request: QuestionRequest):
    print(request)
    system_prompt = """
        You are an expert quiz generator. Your task is to generate a quiz in a strict JSON format.
        Return a JSON object with a single key: "questions", which contains an array of question objects.   
        EXAMPLE OUTPUT:
        {
          "questions": [
            {
              "id": "q1",
              "question": "What is 2+2?",
              "options": ["3", "4", "5", "6"],
              "correctAnswer": 1,
              "explanation": "2+2 equals 4"
            }
          ]
        }
        RULES:
        - Return ONLY valid JSON
        - Each question needs: id, question, options (4 items), correctAnswer (0-3), explanation
        - No markdown or extra text""".strip()

    user_prompt = (
        f"Create {request.questionCount} {request.difficulty}-level multiple-choice questions about '{request.title}'.\n"
        f"Context: {request.description}\n"
        f"IMPORTANT: Each question must have exactly 4 answer options.\n"
        f"Return only the JSON object with the 'questions' array."
    )

    try:
        response = ollama.generate(
            model="gemma:2b",
            prompt=user_prompt,
            system=system_prompt,
            options={
                "temperature": 0.7, 
                "num_ctx": 5000,
                "num_predict": 3500  # Add this - allows up to 2000 output tokens
            },
            format="json",
        )
        
        raw_output = response["response"].strip()
        print("RAW RESPONSE:", raw_output)

        # Parse JSON
        parsed = json.loads(raw_output)
        
        # Fix malformed questions before Pydantic validation
        for i, q in enumerate(parsed.get("questions", [])):
            # Ensure unique IDs
            if not q.get("id") or q.get("id") in ["unique-uuid-here", "q1", "q2", "q3", "q4", "q5"]:
                q["id"] = f"q_{i+1}_{uuid.uuid4().hex[:8]}"
            
            # Fix options - ensure exactly 4 options
            options = q.get("options", [])
            if len(options) < 4:
                print(f"Warning: Question {i+1} has only {len(options)} options, padding to 4")
                # Pad with generic options
                while len(options) < 4:
                    options.append(f"Option {chr(65 + len(options))}")
                q["options"] = options
            elif len(options) > 4:
                print(f"Warning: Question {i+1} has {len(options)} options, trimming to 4")
                q["options"] = options[:4]
            
            # Fix correctAnswer if it's out of range
            correct_idx = q.get("correctAnswer", 0)
            if correct_idx >= len(q["options"]) or correct_idx < 0:
                print(f"Warning: Question {i+1} correctAnswer {correct_idx} is out of range, setting to 0")
                q["correctAnswer"] = 0

        # Validate against Pydantic model
        validated = QuestionResponse.model_validate(parsed)

        return validated

    except json.JSONDecodeError as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI response was not valid JSON: {str(e)}"
        )
    except ValidationError as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI response did not match expected structure: {e.errors()}"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))