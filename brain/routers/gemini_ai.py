import json
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List
import os
import google.generativeai as genai
import re
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

router = APIRouter()

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]

class DescriptionRequest(BaseModel):
    label: str
    context: str

class DescriptionResponse(BaseModel):
    description: str

class RoadmapRequest(BaseModel):
    prompt: str

class RoadmapResponse(BaseModel):
    nodes: list
    edges: list

@router.post("/api/chat")
async def chat(data: ChatRequest):
    model = genai.GenerativeModel("gemini-1.5-flash")

    history = []
    for msg in data.messages:
        if msg.role == 'user':
            history.append({"role": "user", "parts": [msg.content]})
        else:
            history.append({"role": "model", "parts": [msg.content]})

    chat = model.start_chat(history=history)

    def stream_gen():
        response = chat.send_message(data.messages[-1].content, stream=True)
        for chunk in response:
            yield chunk.text

    return StreamingResponse(stream_gen(), media_type='text/event-stream')


@router.post("/api/description", response_model=DescriptionResponse)
async def generate_description(data: DescriptionRequest):
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")

        prompt = f'Explain "{data.label}" in 2 short sentences for someone learning {data.context}. Only return plain text.'

        response = model.generate_content(prompt)

        return { "description": response.text.strip() }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/generate-roadmap", response_model=RoadmapResponse)
async def generate_roadmap(data: RoadmapRequest):
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")

        prompt = (
            f"Create a roadmap for learning {data.prompt}. "
            "Return only a JSON object with two keys: 'nodes' and 'edges'. "
            "You must generate at least 10 nodes. "
            "Nodes should include a variety of 'type' values such as 'start', 'concept', 'task', 'quiz', 'end', etc., not just the same type repeatedly. "
            "Each node must include: id, type, data.label, and position (x, y). "
            "Each edge must include: id, source, and target. "
            "No extra explanation or text outside the JSON object."
        )

        result = model.generate_content(prompt)
        text = result.text.strip()

        # 🧼 Remove markdown wrappers or extra text
        json_string = re.search(r"\{.*\}", text, re.DOTALL)
        if not json_string:
            raise ValueError("Could not extract valid JSON from AI output.")

        parsed = json.loads(json_string.group())

        if "nodes" not in parsed or "edges" not in parsed:
            raise ValueError("Missing keys in AI-generated roadmap")

        return parsed

    except Exception as e:
        print("GENERATION ERROR:", e)
        raise HTTPException(status_code=500, detail=f"Failed to generate roadmap from AI. {e}")