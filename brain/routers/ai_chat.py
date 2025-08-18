from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List
import os
import google.generativeai as genai
from dotenv import load_dotenv
import logging
import re
from typing import List, Dict


# Configure logging
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Configure Gemini AI
try:
    genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
    logger.info("Google Gemini AI configured successfully")
except Exception as e:
    logger.error(f"Failed to configure Google Gemini AI: {e}")

router = APIRouter()

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]

@router.post("/chat")
async def chat(data: ChatRequest):
    """AI chat conversation using Google Gemini"""
    try:
        # Validate API key
        if not os.getenv("GOOGLE_API_KEY"):
            raise HTTPException(
                status_code=500, 
                detail="Google API key not configured"
            )
        
        # Validate input
        if not data.messages:
            raise HTTPException(
                status_code=400,
                detail="No messages provided"
            )
        
        # Initialize the model
        model = genai.GenerativeModel("gemini-1.5-flash")
        
        # Convert messages to Gemini format
        history = []
        for msg in data.messages:
            if msg.role == 'user':
                history.append({"role": "user", "parts": [msg.content]})
            else:
                history.append({"role": "model", "parts": [msg.content]})
        
        # Start chat session
        chat = model.start_chat(history=history)
        
        # Generator function for streaming response
        def stream_gen():
            try:
                response = chat.send_message(data.messages[-1].content, stream=True)
                for chunk in response:
                    if chunk.text:
                        yield chunk.text
            except Exception as e:
                logger.error(f"Error during streaming: {e}")
                yield f"Error: {str(e)}"
        
        return StreamingResponse(
            stream_gen(), 
            media_type='text/event-stream',
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-AI-Model": "gemini-1.5-flash"
            }
        )
        
    except Exception as e:
        logger.error(f"Chat endpoint error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"AI chat failed: {str(e)}"
        )

@router.get("/health")
async def ai_health_check():
    """Health check for AI chat service"""
    try:
        # Check if API key is configured
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            return {
                "status": "unhealthy",
                "service": "AI Chat Service",
                "error": "Google API key not configured",
                "model": "gemini-1.5-flash"
            }
        
        # Test basic model initialization
        model = genai.GenerativeModel("gemini-1.5-flash")
        
        # Simple test generation (non-streaming)
        test_response = model.generate_content("Hello, this is a health check.")
        
        return {
            "status": "healthy",
            "service": "AI Chat Service",
            "model": "gemini-1.5-flash",
            "api_key_configured": True,
            "test_response_length": len(test_response.text) if test_response.text else 0
        }
        
    except Exception as e:
        logger.error(f"AI health check failed: {e}")
        return {
            "status": "unhealthy",
            "service": "AI Chat Service",
            "error": str(e),
            "model": "gemini-1.5-flash"
        }

@router.get("/models")
async def get_available_models():
    """Get information about available AI models"""
    return {
        "current_model": "gemini-1.5-flash",
        "features": [
            "Text generation",
            "Conversational AI",
            "Streaming responses",
            "Context awareness"
        ],
        "limitations": [
            "Requires Google API key",
            "Rate limits apply",
            "Content policy restrictions"
        ]
    }

@router.post("/generate-example")
async def generate_example():
    """Generate an example response from the AI model in structured JSON"""
    try:
        # SYSTEM PROMPT: tells Gemini to return clean structured JSON
        # system_prompt = (
        #     "You are a data formatter. I want you to return chatbot prompt suggestions "
        #     "For each use case (like Customer Support, Healthcare, Education, etc.), organize the data like this:\n\n"
        #     "[\n"
        #     "  {\n"
        #     "    \"use_case\": \"Use Case Name\",\n"
        #     "    \"categories\": [\n"
        #     "      {\n"
        #     "        \"category\": \"Category Name\",\n"
        #     "        \"prompts\": [\"prompt 1\", \"prompt 2\"]\n"
        #     "      }\n"
        #     "    ]\n"
        #     "  }\n"
        #     "]\n\n"
        #     "Only return the data in raw JSON format. Do not include any explanations, markdown, or code blocks. "
        #     "No headings, no extra text — only valid JSON."
        # )

        model = genai.GenerativeModel("gemini-2.5-flash")
        prompt = (
            "Generate 4 to 5 really simple and short chatbot prompts that are ready to pass the chatbox for different use cases, such as "
            "Customer Support, Education, Healthcare, E-commerce, and Finance. "
            "Each use case should contain a single and short line of prompts. which explain the use case. "
            "Don't provide anything else other than the structured data of yours not even your explaination just plain text"
            "Return everything in valid JSON as instructed."
        )
        system_prompt = ""
        example_response = model.generate_content(prompt)

        if not example_response or not hasattr(example_response, 'text') or not example_response.text:
            raise HTTPException(
                status_code=500,
                detail="Failed to generate example response"
            )

        logger.info(f"Generated example response: {example_response.text}")
        return {
            "example_response": example_response.text
        }

    except Exception as e:
        logger.error(f"Example generation failed: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate example: {str(e)}"
        )
