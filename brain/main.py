import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import tts, ai_chat, gemini_ai, lms, web_search, interview_tts, quiz, roadmap, performance_moniter
from pathlib import Path
import tempfile
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Voice Interview API", 
    version="2.0.0",
    description="Combined TTS and AI Chat API"
)

origins = [
    "http://localhost",
    "http://localhost:3000",
    "https://localhost:3000",
    "http://127.0.0.1",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Or use ["*"] to allow all origins (less secure)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(tts.router, prefix="/tts", tags=["Text-to-Speech"])
app.include_router(ai_chat.router, prefix="/ai", tags=["AI Chat"])
app.include_router(gemini_ai.router, prefix="/gen-ai", tags=["Gemini Service"])
app.include_router(lms.router, prefix="/lms", tags=["LM Studios Service"])
app.include_router(web_search.router, prefix="/web", tags=["Web Search Service"])
app.include_router(interview_tts.router, prefix="/interview-tts", tags=["Text to Speech for Interview Simulator"])
app.include_router(quiz.router, prefix="/quiz", tags=["AI based Quiz generation"])
app.include_router(roadmap.router, prefix="/roadmap", tags=["AI based Roadmap Generation"])
app.include_router(performance_moniter.router, prefix="/performance", tags=["Performance Moniter"])


@app.get("/", response_model=dict)
async def root():
    """Root endpoint with API information"""
    return {
        "service": "Voice Interview API",
        "version": "2.0.0",
        "status": "running",
        "services": {
            "tts": "Text-to-Speech conversion with high-quality voices",
            "ai_chat": "AI chat using Google Gemini"
        },
        "endpoints": {
            "/tts/speak": "POST - Convert text to speech",
            "/tts/voices": "GET - List available voices",
            "/tts/health": "GET - TTS health check",
            "/ai/chat": "POST - AI chat conversation"
        }
    }

@app.get("/health")
async def global_health_check():
    """Global health check for all services"""
    return {
        "status": "healthy",
        "service": "Voice Interview API",
        "version": "2.0.0",
        "services": ["TTS", "AI Chat"],
        "message": "All services operational"
    }

@app.on_event("startup")
async def startup_event():
    """Startup event handler"""
    logger.info("Voice Interview API v2.0.0 starting up...")
    logger.info("Services: TTS (Text-to-Speech) + AI Chat (Google Gemini)")
    
    # Ensure temp directory exists
    temp_dir = tempfile.gettempdir()
    if not os.path.exists(temp_dir):
        os.makedirs(temp_dir)
    
    logger.info(f"Using temporary directory: {temp_dir}")
    logger.info("Voice Interview API started successfully!")

@app.on_event("shutdown")
async def shutdown_event():
    """Shutdown event handler"""
    logger.info("Voice Interview API shutting down...")
    
    # Cleanup any remaining temp files
    temp_dir = tempfile.gettempdir()
    try:
        for file in Path(temp_dir).glob("speech_*.mp3"):
            file.unlink()
        for file in Path(temp_dir).glob("health_test_*.mp3"):
            file.unlink()
    except Exception as e:
        logger.error(f"Error during cleanup: {e}")
    
    logger.info("Voice Interview API shutdown complete!")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
        log_level="info"
    )