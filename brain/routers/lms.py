# routers/lms.py
import json
import re
from typing import Any, Dict, List, Optional
from fastapi import APIRouter
from fastapi.responses import JSONResponse
import httpx
from json_repair import repair_json
from pydantic import BaseModel
from utils.web_search import perform_web_search
import asyncio

router = APIRouter()

LLM_ENDPOINT = "http://127.0.0.1:1234/v1/completions"

# Cache to prevent duplicate requests
request_cache = {}

# pydantic schema
class PromptRequest(BaseModel):
    prompt: str


class DifficultyRequest(BaseModel):
    prompt: str
    data: list

# Pydantic schemas
class CourseGenerationRequest(BaseModel):
    nodeTitle: str
    nodeDescription: str
    nodeType: str
    roadmapTitle: str
    roadmapId: str

class CourseSection(BaseModel):
    id: str
    title: str
    content: str
    duration: str
    type: str  # "theory", "practical", "quiz", "project"

class Resource(BaseModel):
    title: str
    url: str
    duration: Optional[str] = None
    readTime: Optional[str] = None

class Tool(BaseModel):
    name: str
    description: str
    url: str

class Project(BaseModel):
    title: str
    description: str
    difficulty: str
    estimatedTime: str

class GeneratedCourse(BaseModel):
    title: str
    description: str
    difficulty: str  # "Beginner", "Intermediate", "Advanced"
    estimatedDuration: str
    learningObjectives: List[str]
    prerequisites: List[str]
    sections: List[CourseSection]
    resources: Dict[str, List[Any]]
    projects: List[Project]

@router.post("/ai/roadmap-difficulty")
async def get_roadmap_difficulty(request: DifficultyRequest):
    system_prompt = "You are an assistant that only returns a single word: Easy, Medium, or Hard, based on the provided data. Do not return anything else."
    enhanced_prompt = f"{system_prompt}\n{request.prompt}\n\nData:\n{str(request.data)}"

    payload = {
        "prompt": enhanced_prompt,
        "max_tokens": 1000,
        "temperature": 1,
        "stop": None,
        "stream": False
    }

    try:
        async with httpx.AsyncClient(timeout=60) as client:
            res = await client.post(LLM_ENDPOINT, json=payload)
            res.raise_for_status()
            data = res.json()
            answer = data["choices"][0]["text"].strip()
            return JSONResponse(content={"difficulty": answer})
    except Exception as e:
        print("Error in roadmap difficulty:", str(e))
        return JSONResponse(content={"error": "Failed to get difficulty"}, status_code=500)
@router.post("/ai/generate-course")
async def generate_course(request: CourseGenerationRequest):
    """
    Generate a comprehensive course using AI based on the provided node data and roadmap context.
    """
    # Create a unique cache key to prevent duplicate requests
    cache_key = f"{request.nodeTitle}_{request.nodeDescription}_{request.roadmapTitle}"
    
    # Check if we're already processing this request
    if cache_key in request_cache:
        print(f"⚠️ Duplicate request detected for: {request.nodeTitle}")
        print("🔄 Waiting for existing request to complete...")
        
        # Wait for the existing request to complete (max 5 minutes)
        for _ in range(300):  # 300 seconds = 5 minutes
            if cache_key not in request_cache:
                break
            await asyncio.sleep(1)
        
        # If still processing, return fallback
        if cache_key in request_cache:
            print("⏰ Existing request still processing, returning fallback")
            return JSONResponse(content=create_fallback_course(request, ""))
    
    # Mark this request as being processed
    request_cache[cache_key] = True
    
    try:
        print(f"🚀 Starting course generation for: {request.nodeTitle}")
        print(f"📝 Description: {request.nodeDescription}")
        print(f"🗺️ Roadmap: {request.roadmapTitle}")
        
        # Create a detailed prompt for course generation
        system_prompt = """You are an expert course designer and educator. Create a comprehensive, structured course based on the provided topic. 

IMPORTANT: Your response must be a valid JSON object. Ensure all strings are properly quoted, all objects have commas between properties, and there are no trailing commas. Escape any special characters within strings.

Your response must follow this exact structure:
{
    "title": "Course title",
    "description": "Detailed course description",
    "difficulty": "Beginner|Intermediate|Advanced",
    "estimatedDuration": "X-Y hours",
    "learningObjectives": ["objective1", "objective2", "objective3", "objective4"],
    "prerequisites": ["prerequisite1", "prerequisite2", "prerequisite3"],
    "sections": [
        {
            "id": "1",
            "title": "Section title",
            "content": "Detailed section content description",
            "duration": "X minutes",
            "type": "theory"
        }
    ],
    "resources": {
        "videos": [
            {
                "title": "Video title",
                "url": "https://www.youtube.com/embed/placeholder",
                "duration": "XX:XX"
            }
        ],
        "articles": [
            {
                "title": "Article title",
                "url": "#",
                "readTime": "X min read"
            }
        ],
        "tools": [
            {
                "name": "Tool name",
                "description": "Tool description",
                "url": "#"
            }
        ]
    },
    "projects": [
        {
            "title": "Project title",
            "description": "Project description",
            "difficulty": "Beginner|Intermediate|Advanced",
            "estimatedTime": "X-Y hours"
        }
    ]
}

Make the course practical, engaging, and comprehensive. Include 4-6 sections, 3-4 learning objectives, 2-3 prerequisites, 2-3 videos, 2-3 articles, 2-3 tools, and 1-2 projects. Ensure all content is relevant to the topic and skill level."""

        user_prompt = f"""Create a comprehensive course for the following topic:

Topic: {request.nodeTitle}
Description: {request.nodeDescription}
Context: This is part of a learning roadmap titled "{request.roadmapTitle}"
Node Type: {request.nodeType}

Generate a complete course structure that will help learners master this topic effectively. Make sure the content is practical, up-to-date, and includes hands-on learning opportunities."""

        enhanced_prompt = f"{system_prompt}\n\n{user_prompt}"

        payload = {
            "prompt": enhanced_prompt,
            "max_tokens": 3000,
            "temperature": 0.7,
            "stop": None,
            "stream": False
        }

        print("📤 Sending request to LM Studio...")
        print(f"🔧 Max tokens: {payload['max_tokens']}")
        print(f"🌡️ Temperature: {payload['temperature']}")

        # Increased timeout to 5 minutes for course generation
        async with httpx.AsyncClient(timeout=300) as client:
            response = await client.post(LLM_ENDPOINT, json=payload)
            response.raise_for_status()
            
            data = response.json()
            ai_response = data["choices"][0]["text"].strip()
            
            print("📥 Received response from LM Studio")
            print(f"🏁 Finish reason: {data['choices'][0]['finish_reason']}")
            print(f"📊 Token usage: {data.get('usage', {})}")
            
            # Check if response was truncated
            if data["choices"][0]["finish_reason"] != "stop":
                print("⚠️ Warning: AI response was truncated, using fallback structure")
                return JSONResponse(content=create_fallback_course(request, ai_response))
            
            # Try to extract and repair JSON from the response
            course_data = extract_and_repair_json(ai_response)
            
            if not course_data:
                print("❌ Failed to extract/repair JSON from AI response")
                print(f"📄 Raw response preview: {ai_response[:500]}...")
                course_data = create_fallback_course(request, ai_response)
            else:
                print("✅ Successfully extracted and repaired JSON from AI response")
            
            # Validate and clean the course data
            validated_course = validate_course_structure(course_data, request)
            
            print(f"🎉 Course generation completed for: {validated_course['title']}")
            return JSONResponse(content=validated_course)
            
    except httpx.TimeoutException:
        print(f"⏰ AI request timed out after 5 minutes for: {request.nodeTitle}")
        return JSONResponse(
            content=create_fallback_course(request, "Request timed out - using fallback course structure"),
            status_code=200
        )
    except httpx.HTTPStatusError as e:
        print(f"🚫 HTTP error from LM Studio: {e.response.status_code}")
        print(f"📄 Error response: {e.response.text}")
        return JSONResponse(
            content=create_fallback_course(request, f"LM Studio error: {e.response.status_code}"),
            status_code=200
        )
    except Exception as e:
        print(f"❌ Unexpected error in course generation: {str(e)}")
        return JSONResponse(
            content=create_fallback_course(request, f"Unexpected error: {str(e)}"),
            status_code=200
        )
    finally:
        # Remove from cache when done
        if cache_key in request_cache:
            del request_cache[cache_key]
            print(f"🧹 Cleaned up cache for: {request.nodeTitle}")

def extract_and_repair_json(response_text: str) -> Optional[Dict]:
    """Extract JSON object from AI response text and attempt to repair it."""
    try:
        # Step 1: Remove markdown code block wrappers if present
        cleaned_text = response_text.strip()
        if cleaned_text.startswith("```json"):
            cleaned_text = cleaned_text[len("```json"):].strip()
            if cleaned_text.endswith("```"):
                cleaned_text = cleaned_text[:-len("```")].strip()
        elif cleaned_text.startswith("```"): # Generic code block
            cleaned_text = cleaned_text[len("```"):].strip()
            if cleaned_text.endswith("```"):
                cleaned_text = cleaned_text[:-len("```")].strip()

        # Step 2: Find the actual JSON object within the cleaned text
        json_match = re.search(r'\{.*\}', cleaned_text, re.DOTALL)
        if not json_match:
            print("❌ No JSON-like structure found in response after cleaning.")
            return None
            
        json_str = json_match.group(0) # This should now be a pure JSON string
        
        print("🔧 Attempting to repair JSON using json_repair library...")
        repaired_json_obj = repair_json(json_str) # This should return a dict
        
        print("✅ JSON successfully repaired and parsed.")
        return repaired_json_obj # This should be a dict
        
    except Exception as e:
        print(f"❌ Error during JSON extraction or repair: {str(e)}")
        return None

def create_fallback_course(request: CourseGenerationRequest, ai_content: str = "") -> Dict:
    """Create a structured course when AI generation fails or needs enhancement."""
    
    print(f"🔄 Creating fallback course for: {request.nodeTitle}")
    if ai_content:
        print(f"📝 Fallback reason: {ai_content[:100]}...")
    
    # Determine difficulty based on node type or content
    difficulty = "Intermediate"
    if "beginner" in request.nodeDescription.lower() or "basic" in request.nodeDescription.lower():
        difficulty = "Beginner"
    elif "advanced" in request.nodeDescription.lower() or "expert" in request.nodeDescription.lower():
        difficulty = "Advanced"
    
    return {
        "title": f"Master {request.nodeTitle}",
        "description": f"A comprehensive course designed to help you understand and master {request.nodeTitle}. {request.nodeDescription}",
        "difficulty": difficulty,
        "estimatedDuration": "4-6 hours",
        "learningObjectives": [
            f"Understand the core concepts of {request.nodeTitle}",
            "Apply practical techniques and best practices",
            "Build real-world projects using these skills",
            "Troubleshoot common issues and challenges"
        ],
        "prerequisites": [
            "Basic programming knowledge",
            "Familiarity with development tools",
            "Understanding of fundamental concepts"
        ],
        "sections": [
            {
                "id": "1",
                "title": "Introduction and Fundamentals",
                "content": f"Welcome to the {request.nodeTitle} course! In this section, we'll cover the fundamental concepts and principles that form the foundation of {request.nodeTitle}. You'll learn about the core terminology, key concepts, and why {request.nodeTitle} is important in modern development.",
                "duration": "45 minutes",
                "type": "theory"
            },
            {
                "id": "2",
                "title": "Hands-on Practice",
                "content": f"Now that you understand the basics, let's dive into practical implementation. We'll work through real examples and build something tangible using {request.nodeTitle}. This hands-on approach will help solidify your understanding.",
                "duration": "90 minutes",
                "type": "practical"
            },
            {
                "id": "3",
                "title": "Advanced Techniques",
                "content": f"Take your skills to the next level with advanced techniques and best practices. Learn how professionals use {request.nodeTitle} in production environments and discover optimization strategies.",
                "duration": "60 minutes",
                "type": "theory"
            },
            {
                "id": "4",
                "title": "Knowledge Check",
                "content": f"Test your understanding of {request.nodeTitle} concepts with interactive quizzes and challenges. This will help identify areas that need more attention.",
                "duration": "30 minutes",
                "type": "quiz"
            },
            {
                "id": "5",
                "title": "Final Project",
                "content": f"Apply everything you've learned by building a comprehensive project. This capstone project will demonstrate your mastery of {request.nodeTitle} and serve as a portfolio piece.",
                "duration": "120 minutes",
                "type": "project"
            }
        ],
        "resources": {
            "videos": [
                {
                    "title": f"{request.nodeTitle} Fundamentals Explained",
                    "url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "duration": "15:30"
                },
                {
                    "title": f"Building with {request.nodeTitle} - Step by Step",
                    "url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "duration": "22:45"
                },
                {
                    "title": f"Advanced {request.nodeTitle} Techniques",
                    "url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "duration": "18:20"
                }
            ],
            "articles": [
                {
                    "title": f"The Complete Guide to {request.nodeTitle}",
                    "url": "#",
                    "readTime": "12 min read"
                },
                {
                    "title": f"Best Practices for {request.nodeTitle}",
                    "url": "#",
                    "readTime": "8 min read"
                },
                {
                    "title": f"Common {request.nodeTitle} Pitfalls and How to Avoid Them",
                    "url": "#",
                    "readTime": "10 min read"
                }
            ],
            "tools": [
                {
                    "name": "Development Environment",
                    "description": f"Recommended setup for working with {request.nodeTitle}",
                    "url": "#"
                },
                {
                    "name": "Testing Framework",
                    "description": f"Tools for testing your {request.nodeTitle} implementations",
                    "url": "#"
                },
                {
                    "name": "Documentation Hub",
                    "description": f"Official documentation and community resources for {request.nodeTitle}",
                    "url": "#"
                }
            ]
        },
        "projects": [
            {
                "title": f"Build a {request.nodeTitle} Application",
                "description": f"Create a fully functional application that demonstrates your understanding of {request.nodeTitle} concepts and best practices.",
                "difficulty": difficulty,
                "estimatedTime": "2-3 hours"
            }
        ]
    }

def validate_course_structure(course_data: Dict, request: CourseGenerationRequest) -> Dict:
    """Validate and ensure the course data has the correct structure."""
    
    # Ensure required fields exist
    required_fields = ["title", "description", "difficulty", "estimatedDuration", 
                      "learningObjectives", "prerequisites", "sections", "resources", "projects"]
    
    for field in required_fields:
        if field not in course_data:
            print(f"⚠️ Missing required field: {field}")
            return create_fallback_course(request)
    
    # Validate difficulty
    if course_data["difficulty"] not in ["Beginner", "Intermediate", "Advanced"]:
        print(f"⚠️ Invalid difficulty: {course_data['difficulty']}, defaulting to Intermediate")
        course_data["difficulty"] = "Intermediate"
    
    # Ensure sections have required fields and add missing type
    for i, section in enumerate(course_data.get("sections", [])):
        if not all(key in section for key in ["id", "title", "content", "duration"]):
            print(f"⚠️ Invalid section structure at index {i}")
            course_data["sections"][i] = {
                "id": str(i + 1),
                "title": section.get("title", f"Section {i + 1}"),
                "content": section.get("content", "Section content"),
                "duration": section.get("duration", "30 minutes"),
                "type": section.get("type", "theory")
            }
        else:
            # Add type if missing
            if "type" not in section:
                course_data["sections"][i]["type"] = "theory"
    
    # Ensure resources structure
    if "resources" not in course_data or not isinstance(course_data["resources"], dict):
        print("⚠️ Invalid resources structure")
        course_data["resources"] = {"videos": [], "articles": [], "tools": []}
    
    for resource_type in ["videos", "articles", "tools"]:
        if resource_type not in course_data["resources"]:
            course_data["resources"][resource_type] = []
    
    print("✅ Course structure validation completed")
    return course_data

@router.post("/ai/enhance-course-section")
async def enhance_course_section(request: dict):
    """
    Enhance a specific course section with more detailed content.
    """
    try:
        section_title = request.get("sectionTitle", "")
        section_type = request.get("sectionType", "theory")
        course_topic = request.get("courseTopic", "")
        
        system_prompt = f"""You are an expert educator. Create detailed, engaging content for a course section.
        
Section Type: {section_type}
Course Topic: {course_topic}
Section Title: {section_title}

Provide detailed content that is:
- Educational and comprehensive
- Practical with real-world examples
- Engaging and easy to understand
- Appropriate for the section type ({section_type})

Return only the enhanced content text, no JSON or formatting."""

        payload = {
            "prompt": system_prompt,
            "max_tokens": 800,
            "temperature": 0.7,
            "stop": None,
            "stream": False
        }

        async with httpx.AsyncClient(timeout=120) as client:
            response = await client.post(LLM_ENDPOINT, json=payload)
            response.raise_for_status()
            
            data = response.json()
            enhanced_content = data["choices"][0]["text"].strip()
            
            return JSONResponse(content={"enhancedContent": enhanced_content})
            
    except Exception as e:
        print(f"Section enhancement error: {str(e)}")
        return JSONResponse(
            content={"error": "Failed to enhance section"}, 
            status_code=500
        )

    """
    Enhance a specific course section with more detailed content.
    """
    try:
        section_title = request.get("sectionTitle", "")
        section_type = request.get("sectionType", "theory")
        course_topic = request.get("courseTopic", "")
        
        system_prompt = f"""You are an expert educator. Create detailed, engaging content for a course section.
        
Section Type: {section_type}
Course Topic: {course_topic}
Section Title: {section_title}

Provide detailed content that is:
- Educational and comprehensive
- Practical with real-world examples
- Engaging and easy to understand
- Appropriate for the section type ({section_type})

Return only the enhanced content text, no JSON or formatting."""

        payload = {
            "prompt": system_prompt,
            "max_tokens": 800,
            "temperature": 0.7,
            "stop": None,
            "stream": False
        }

        async with httpx.AsyncClient(timeout=120) as client:
            response = await client.post(LLM_ENDPOINT, json=payload)
            response.raise_for_status()
            
            data = response.json()
            enhanced_content = data["choices"][0]["text"].strip()
            
            return JSONResponse(content={"enhancedContent": enhanced_content})
            
    except Exception as e:
        print(f"Section enhancement error: {str(e)}")
        return JSONResponse(
            content={"error": "Failed to enhance section"}, 
            status_code=500
        )

    """
    Enhance a specific course section with more detailed content.
    """
    try:
        section_title = request.get("sectionTitle", "")
        section_type = request.get("sectionType", "theory")
        course_topic = request.get("courseTopic", "")
        
        system_prompt = f"""You are an expert educator. Create detailed, engaging content for a course section.
        
Section Type: {section_type}
Course Topic: {course_topic}
Section Title: {section_title}

Provide detailed content that is:
- Educational and comprehensive
- Practical with real-world examples
- Engaging and easy to understand
- Appropriate for the section type ({section_type})

Return only the enhanced content text, no JSON or formatting."""

        payload = {
            "prompt": system_prompt,
            "max_tokens": 800,
            "temperature": 0.7,
            "stop": None,
            "stream": False
        }

        async with httpx.AsyncClient(timeout=120) as client:
            response = await client.post(LLM_ENDPOINT, json=payload)
            response.raise_for_status()
            
            data = response.json()
            enhanced_content = data["choices"][0]["text"].strip()
            
            return JSONResponse(content={"enhancedContent": enhanced_content})
            
    except Exception as e:
        print(f"Section enhancement error: {str(e)}")
        return JSONResponse(
            content={"error": "Failed to enhance section"}, 
            status_code=500
        )
    """
    Enhance a specific course section with more detailed content.
    """
    try:
        section_title = request.get("sectionTitle", "")
        section_type = request.get("sectionType", "theory")
        course_topic = request.get("courseTopic", "")
        
        system_prompt = f"""You are an expert educator. Create detailed, engaging content for a course section.
        
Section Type: {section_type}
Course Topic: {course_topic}
Section Title: {section_title}

Provide detailed content that is:
- Educational and comprehensive
- Practical with real-world examples
- Engaging and easy to understand
- Appropriate for the section type ({section_type})

Return only the enhanced content text, no JSON or formatting."""

        payload = {
            "prompt": system_prompt,
            "max_tokens": 800,
            "temperature": 0.7,
            "stop": None,
            "stream": False
        }

        async with httpx.AsyncClient(timeout=60) as client:
            response = await client.post(LLM_ENDPOINT, json=payload)
            response.raise_for_status()
            
            data = response.json()
            enhanced_content = data["choices"][0]["text"].strip()
            
            return JSONResponse(content={"enhancedContent": enhanced_content})
            
    except Exception as e:
        print(f"Section enhancement error: {str(e)}")
        return JSONResponse(
            content={"error": "Failed to enhance section"}, 
            status_code=500
        )

    """
    Enhance a specific course section with more detailed content.
    """
    try:
        section_title = request.get("sectionTitle", "")
        section_type = request.get("sectionType", "theory")
        course_topic = request.get("courseTopic", "")
        
        system_prompt = f"""You are an expert educator. Create detailed, engaging content for a course section.
        
Section Type: {section_type}
Course Topic: {course_topic}
Section Title: {section_title}

Provide detailed content that is:
- Educational and comprehensive
- Practical with real-world examples
- Engaging and easy to understand
- Appropriate for the section type ({section_type})

Return only the enhanced content text, no JSON or formatting."""

        payload = {
            "prompt": system_prompt,
            "max_tokens": 800,
            "temperature": 0.7,
            "stop": None,
            "stream": False
        }

        async with httpx.AsyncClient(timeout=60) as client:
            response = await client.post(LLM_ENDPOINT, json=payload)
            response.raise_for_status()
            
            data = response.json()
            enhanced_content = data["choices"][0]["text"].strip()
            
            return JSONResponse(content={"enhancedContent": enhanced_content})
            
    except Exception as e:
        print(f"Section enhancement error: {str(e)}")
        return JSONResponse(
            content={"error": "Failed to enhance section"}, 
            status_code=500
        )