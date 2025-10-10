import json
import re
from typing import Dict, List, Any, Optional, Literal
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException
import ollama

router = APIRouter()

class AIGenerationRequest(BaseModel):
    nodeType: Literal['project', 'quiz', 'course', 'concept']
    nodeLabel: str
    nodeDescription: str
    difficulty: Literal['easy', 'medium', 'hard']
    learningPath: Optional[str] = None

class ProjectTask(BaseModel):
    id: str
    title: str
    description: str
    completed: bool = False

class QuizQuestion(BaseModel):
    id: str
    question: str
    options: List[str]
    correctAnswer: int
    explanation: str

class CourseModule(BaseModel):
    id: str
    title: str
    content: str
    completed: bool = False

class ConceptPoint(BaseModel):
    id: str
    title: str
    description: str
    example: str
    completed: bool = False

class AIGenerationResponse(BaseModel):
    success: bool
    content: List[Dict[str, Any]]
    nodeType: str
    error: Optional[str] = None

class NodePosition(BaseModel):
    x: int
    y: int

class NodeData(BaseModel):
    label: str
    description: str = ""

class RoadmapNode(BaseModel):
    id: str
    type: str
    position: NodePosition
    data: NodeData
    completed: bool

class InterviewQuestionRequest(BaseModel):
    title: str
    nodes: List[RoadmapNode]

@router.post("/api/generate", response_model=AIGenerationResponse)
async def generate_content(data: AIGenerationRequest):
    try:
        system_prompt = (
            "You are an expert educational content creator. Generate structured learning content "
            "that is engaging, practical, and pedagogically sound. Always return valid JSON array format."
        )
        
        prompt = _build_detailed_prompt(data)
        
        response = ollama.generate(
            model="qwen3:1.7b",
            prompt=prompt,
            system=system_prompt,
            options={
                "temperature": 0.6,
                "top_p": 0.9,
                "max_tokens": 2000
            },
            format="json"
        )
        print("RAW Response from OLLAMA: " + response['response'])
        
        content = _parse_ollama_response(response['response'], data.nodeType)
        
        return AIGenerationResponse(
            success=True,
            content=content,
            nodeType=data.nodeType
        )
        
    except Exception as e:
        print(f"Error generating content: {e}")
        fallback_content = _generate_fallback_content(data)
        return AIGenerationResponse(
            success=False,
            content=fallback_content,
            nodeType=data.nodeType,
            error=str(e)
        )

def _build_detailed_prompt(data: AIGenerationRequest) -> str:
    base_info = f"""
Content Details:
- Label: {data.nodeLabel}
- Description: {data.nodeDescription}
- Difficulty: {data.difficulty}
- Learning Path: {data.learningPath or 'General'}
"""

    prompts = {
        'project': f"""{base_info}

Create a hands-on project for learning "{data.nodeLabel}".

Generate 4-6 specific, actionable tasks that build upon each other. Each task should have:
- A clear, descriptive title
- Detailed description (2-3 sentences) explaining what to do
- Specific deliverables or outcomes expected

Return ONLY a JSON array with objects containing exactly these fields:
{{"id": "1", "title": "Task Title", "description": "Detailed description of what to accomplish", "completed": false}}

Focus on practical, real-world application appropriate for {data.difficulty} level.""",

        'quiz': f"""{base_info}

Create a knowledge quiz for "{data.nodeLabel}".

Generate 5-8 multiple choice questions that test understanding at {data.difficulty} level. Each question should have:
- Clear, specific question text
- 4 plausible answer options
- Correct answer index (0-3)
- Detailed explanation of why the answer is correct

Return ONLY a JSON array with objects containing exactly these fields:
{{"id": "1", "question": "Question text?", "options": ["Option A", "Option B", "Option C", "Option D"], "correctAnswer": 0, "explanation": "Explanation text"}}

Mix conceptual understanding and practical application questions.""",

        'course': f"""{base_info}

Create a structured course for "{data.nodeLabel}".

Generate 3-5 sequential modules that progressively build knowledge from basic to advanced concepts. Each module should have:
- Descriptive title indicating what will be learned
- Comprehensive content (3-4 well-structured paragraphs)
- Clear learning progression from previous modules

Return ONLY a JSON array with objects containing exactly these fields:
{{"id": "1", "title": "Module Title", "content": "Comprehensive educational content with multiple paragraphs covering the topic thoroughly", "completed": false}}

Ensure content is appropriate for {data.difficulty} level.""",

        'concept': f"""{base_info}

Break down "{data.nodeLabel}" into digestible learning concepts.

Generate 3-4 key concepts that must be understood at {data.difficulty} level. Each should have:
- Clear concept title
- Detailed explanation (2-3 paragraphs) of the concept
- Practical example or analogy to illustrate the concept
- Connection to the broader topic

Return ONLY a JSON array with objects containing exactly these fields:
{{"id": "1", "title": "Concept Title", "description": "Detailed explanation of the concept", "example": "Practical example or analogy", "completed": false}}

Focus on building deep understanding progressively."""
    }
    
    return prompts.get(data.nodeType, f"Generate {data.nodeType} content for {data.nodeLabel}")

def _parse_ollama_response(response: str, node_type: str) -> List[Dict[str, Any]]:
    """Parse and validate Ollama response"""
    try:
        cleaned = response.strip()
        if cleaned.startswith("```json"):
            cleaned = cleaned[7:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        cleaned = cleaned.strip()
        
        # Try parsing as JSON
        parsed = json.loads(cleaned)
        
        # If response is a dict with a single key containing an array, extract the array
        if isinstance(parsed, dict) and len(parsed) == 1:
            parsed = list(parsed.values())[0]
        elif isinstance(parsed, dict):
            parsed = list(parsed.values())  # Handle case with numeric keys
        elif not isinstance(parsed, list):
            raise ValueError("Response is neither a list nor an object containing an array")
        
        # Validate structure
        return _validate_content_structure(parsed, node_type)
        
    except (json.JSONDecodeError, ValueError, AttributeError) as e:
        print(f"Failed to parse Ollama response: {e}")
        print(f"Raw response: {response}")
        return [{"id": "1", "title": "Generated Content", "description": "Content generation failed", "completed": False}]

def _validate_content_structure(content: List[Dict[str, Any]], node_type: str) -> List[Dict[str, Any]]:
    """Validate and fix content structure"""
    if not isinstance(content, list):
        return [{"id": "1", "error": "Invalid content format"}]
    
    required_fields = {
        'project': ['id', 'title', 'description', 'completed'],
        'quiz': ['id', 'question', 'options', 'correctAnswer', 'explanation'],
        'course': ['id', 'title', 'content', 'completed'],
        'concept': ['id', 'title', 'description', 'example', 'completed']
    }
    
    expected = required_fields.get(node_type, ['id', 'title'])
    
    # Fix missing fields
    for i, item in enumerate(content):
        if not isinstance(item, dict):
            content[i] = {"id": str(i + 1), "title": "Invalid Item", "description": "Invalid content format", "completed": False}
            continue
            
        # Ensure ID exists
        if 'id' not in item:
            item['id'] = str(i + 1)
            
        # Add missing fields with defaults
        for field in expected:
            if field not in item:
                if field == 'completed':
                    item[field] = False
                elif field == 'correctAnswer':
                    item[field] = 0
                elif field == 'options':
                    item[field] = ['Option A', 'Option B', 'Option C', 'Option D']
                else:
                    item[field] = f"Generated {field}"
    
    return content

def _generate_fallback_content(data: AIGenerationRequest) -> List[Dict[str, Any]]:
    fallbacks = {
        'project': [
            {
                "id": "1",
                "title": "Project Setup and Planning",
                "description": f"Set up your development environment and create a plan for {data.nodeLabel}. Research requirements and define project scope.",
                "completed": False
            },
            {
                "id": "2",
                "title": "Core Implementation",
                "description": f"Implement the main functionality for {data.nodeLabel}. Focus on creating a working prototype with core features.",
                "completed": False
            },
            {
                "id": "3",
                "title": "Testing and Documentation",
                "description": "Test your implementation thoroughly and create comprehensive documentation for future reference.",
                "completed": False
            }
        ],
        'quiz': [
            {
                "id": "1",
                "question": f"What is the primary purpose of {data.nodeLabel}?",
                "options": [
                    "To provide foundational knowledge",
                    "To test practical skills", 
                    "To demonstrate understanding",
                    "All of the above"
                ],
                "correctAnswer": 3,
                "explanation": f"Understanding {data.nodeLabel} involves multiple aspects including theory, practice, and demonstration."
            },
            {
                "id": "2", 
                "question": f"Which approach is most effective for mastering {data.nodeLabel}?",
                "options": [
                    "Reading documentation only",
                    "Hands-on practice only",
                    "Combining theory and practice",
                    "Watching tutorials only"
                ],
                "correctAnswer": 2,
                "explanation": "The most effective learning combines theoretical understanding with practical application."
            }
        ],
        'course': [
            {
                "id": "1",
                "title": f"Introduction to {data.nodeLabel}",
                "content": f"Welcome to learning {data.nodeLabel}! This course will provide you with a comprehensive understanding of the topic. {data.nodeDescription} We'll start with fundamental concepts and gradually build up to more advanced topics. By the end of this course, you'll have both theoretical knowledge and practical skills.",
                "completed": False
            },
            {
                "id": "2",
                "title": "Core Concepts and Principles", 
                "content": f"In this module, we'll explore the core concepts that form the foundation of {data.nodeLabel}. You'll learn about the key principles, understand how different components work together, and see how these concepts apply in real-world scenarios. This knowledge will serve as the basis for more advanced topics.",
                "completed": False
            }
        ],
        'concept': [
            {
                "id": "1",
                "title": f"Understanding {data.nodeLabel}",
                "description": f"{data.nodeDescription} This concept is fundamental to the broader topic and provides the foundation for more advanced learning.",
                "example": f"For example, when working with {data.nodeLabel}, you might encounter situations where you need to apply these principles to solve real-world problems.",
                "completed": False
            },
            {
                "id": "2",
                "title": "Practical Applications",
                "description": f"This concept shows how {data.nodeLabel} is used in practice. Understanding the practical applications helps bridge the gap between theory and real-world implementation.",
                "example": "Consider scenarios where these concepts are applied in professional settings or personal projects.",
                "completed": False
            }
        ]
    }
    
    return fallbacks.get(data.nodeType, [{"id": "1", "title": "Fallback Content", "description": "Content generation unavailable"}])

# Interview Questions Generations
@router.post("/api/interview-questions", response_model=str)
async def generate_questions(request: InterviewQuestionRequest):
    try:
        system_prompt = (
            "You are an expert interviewer. Generate only 10 to 13 high-quality interview questions "
            "related to the topic below. Return ONLY plain text, no formatting, no JSON, no markdown."
        )
        prompt = (
            f"Topic: {request.title}\n"
            f"Data: {request.nodes}\n"
            f"Instructions: Generate 10 to 13 interview questions for this topic. "
            "Each question should be clear, relevant, and suitable for an interview. "
            "Return ONLY the questions in plain text, separated by newlines."
        )
        response = ollama.generate(
            model="gemma3:270m",
            prompt=prompt,
            system=system_prompt,
            options={
                "temperature": 0.6,
                "top_p": 0.9,
                "max_tokens": 2000
            },
            think=False
        )
        questions_text = response['response'].strip()
        print("Ollama Response Questions: " + questions_text)
        # Optionally, split into list if you want to process further
        # questions_list = [q.strip() for q in questions_text.split('\n') if q.strip()]
        # You can add the questions to the request object if needed
        return questions_text
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate interview questions: {str(e)}")


@router.get("/api/ollama/health")
async def check_ollama_health():
    try:
        models = ollama.list()
        return {
            "status": "healthy",
            "available_models": [model['name'] for model in models['models']]
        }
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Ollama unavailable: {str(e)}")

@router.get("/api/ollama/models")
async def list_ollama_models():
    try:
        models = ollama.list()
        return {
            "models": models['models']
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list models: {str(e)}")