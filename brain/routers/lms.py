# routers/lms.py

import json
import re
from typing import Any, Dict, List, Literal, Optional
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse
import httpx
from json_repair import repair_json
from pydantic import BaseModel, HttpUrl
import asyncio
import ollama


router = APIRouter()

LLM_ENDPOINT = "http://127.0.0.1:1234/v1/completions"
request_cache = {}

# -------- SCHEMAS --------

class DifficultyRequest(BaseModel):
    data: list

class CourseRequest(BaseModel):
    nodeTitle: str
    nodeDescription: str
    nodeType: str
    roadmapTitle: str
    roadmapId: str

class VideoResource(BaseModel):
    title: str
    url: HttpUrl
    duration: str


class ArticleResource(BaseModel):
    title: str
    url: HttpUrl
    readTime: str


class ToolResource(BaseModel):
    name: str
    description: str
    url: HttpUrl


class Resources(BaseModel):
    videos: List[VideoResource]
    articles: List[ArticleResource]
    tools: List[ToolResource]


class Section(BaseModel):
    id: str
    title: str
    content: str
    duration: str
    type: Literal["theory", "practical", "quiz", "project"]


class Project(BaseModel):
    title: str
    description: str
    difficulty: str  # still a string in your TS model; change to Literal if you want to validate it strictly
    estimatedTime: str


class GeneratedCourse(BaseModel):
    title: str
    description: str
    difficulty: Literal["Beginner", "Intermediate", "Advanced"]
    estimatedDuration: str
    learningObjectives: List[str]
    prerequisites: List[str]
    sections: List[Section]
    resources: Resources
    projects: List[Project]

# -------- DO NOT MODIFY: Roadmap Difficulty --------

@router.post("/ai/roadmap-difficulty")
async def get_roadmap_difficulty(request: DifficultyRequest):
    system_prompt = (
        "You are a learning difficulty analyzer. Your ONLY job is to analyze the provided roadmap data "
        "and determine its overall difficulty level.\n\n"
        "STRICT RULES:\n"
        "- You MUST respond with EXACTLY ONE WORD only\n"
        "- Your response must be one of these three words: Easy, Medium, Hard\n"
        "- Do NOT include any explanations, punctuation, or additional text\n"
        "- Do NOT use quotes or any other formatting\n"
        "- Analyze the complexity, depth, and prerequisites of the topics to determine difficulty\n\n"
        "Examples of correct responses:\n"
        "Easy\n"
        "Medium\n"
        "Hard\n\n"
        "Remember: ONLY return the single difficulty word, nothing else."
    )
    
    user_prompt = f"Analyze this roadmap data and determine its difficulty level:\n\n{str(request.data)}"
    
    try:
        response = ollama.generate(
            model="qwen3:1.7b",
            prompt=user_prompt,
            system=system_prompt
        )
        
        print("🧪 RAW Ollama OUTPUT:", response["response"])
        
        # Extract, clean and validate the response
        answer = response["response"].strip()
        
        # Additional validation to ensure we only get valid responses
        valid_responses = ["Easy", "Medium", "Hard"]
        
        # Check if the response contains any of the valid words
        for valid_word in valid_responses:
            if valid_word.lower() in answer.lower():
                answer = valid_word
                break
        else:
            # Fallback if AI doesn't follow instructions
            print(f"⚠️  Invalid response received: '{answer}', defaulting to 'Medium'")
            answer = "Medium"
        
        return JSONResponse(content={"difficulty": answer})
        
    except Exception as e:
        print("🔥 Ollama SDK error in roadmap difficulty:", str(e))
        return JSONResponse(content={"error": "Failed to get difficulty"}, status_code=500)

# -------- COURSE GENERATION USING OLLAMA --------
@router.post("/ai/generate-course")
async def generate_course(request: CourseRequest):
    title = request.nodeTitle
    description = request.nodeDescription
    node_type = request.nodeType
    roadmap_title = request.roadmapTitle
    roadmap_id = request.roadmapId

    # 🧠 System prompt (behavior + schema enforcement)
    system_prompt = (
        "You are an expert course designer. Respond ONLY with valid JSON matching this schema:\n"
        "{ "
        "\"title\": \"Course title\", "
        "\"description\": \"Course description\", "
        "\"difficulty\": \"Beginner\" | \"Intermediate\" | \"Advanced\", "
        "\"estimatedDuration\": \"Estimated total time to complete (e.g. '6 hours')\", "
        "\"learningObjectives\": [\"What learners will gain\"], "
        "\"prerequisites\": [\"What learners should know before starting\"], "
        "\"sections\": ["
        "{ \"name\": \"Section title\", \"content\": \"Detailed explanation or lesson\", \"duration\": \"X hours\" }"
        "], "
        "\"resources\": { "
        "\"videos\": ["
        "{ \"title\": \"Video title\", \"url\": \"https://example.com\", \"duration\": \"X minutes\" }"
        "], "
        "\"articles\": ["
        "{ \"title\": \"Article title\", \"url\": \"https://example.com\", \"readTime\": \"X minutes\" }"
        "], "
        "\"tools\": ["
        "{ \"name\": \"Tool name\", \"description\": \"What the tool is for\", \"url\": \"https://example.com\" }"
        "]"
        "}, "
        "\"projects\": ["
        "{ "
        "\"title\": \"Project title\", "
        "\"description\": \"Project details\", "
        "\"difficulty\": \"Beginner\" | \"Intermediate\" | \"Advanced\", "
        "\"estimatedTime\": \"Time to complete (e.g. '3 hours')\""
        "}"
        "] "
        "} "
        "Respond ONLY with a valid JSON object. No introductions. No explanations. No markdown. "
        "Your output MUST start with '{' and end with '}'. If you do not know something, use an empty string (\"\")."
    )

    # 🗣️ User prompt (actual request)
    user_prompt = (
        f"Create a course based on the following context:\n"
        f"Title: {title}\n"
        f"Description: {description}\n"
        f"Type: {node_type}\n"
        f"Roadmap: {roadmap_title} (ID: {roadmap_id})"
    )

    try:
        response = ollama.generate(
            model="gemma:2b",
            prompt=user_prompt,
            system=system_prompt,
            format="json"  # 🧠 THIS forces structured JSON output
        )

        print("🧪 RAW Ollama OUTPUT:", response["response"])

        data = response["response"]
        # Optional: validate against your schema
        return data

    except Exception as e:
        print("🔥 Ollama SDK error:", e)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/ai/test")
async def get_res(request: Request):
    data = await request.json()
    text = data.get('input', '')

    response = ollama.generate(
        model='tinyllama:1.1b',
        prompt=text
    )

    print(f"Response: {response['response']}")

    return JSONResponse(content={"response": response['response']})