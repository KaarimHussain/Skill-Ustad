import uuid
import os
import asyncio
import edge_tts
from fastapi import APIRouter, BackgroundTasks, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import logging
from typing import Optional
import tempfile
from pathlib import Path
import threading

# Configure logging
logger = logging.getLogger(__name__)

router = APIRouter()

# High-quality male voices only - using Andrew Neural as default
VOICES = {
    "en": {
        "default": "en-US-AndrewNeural",  # High-quality Andrew voice
        "andrew": "en-US-AndrewNeural",   # Primary choice
        "davis": "en-US-DavisNeural",     # Alternative 1
        "jason": "en-US-JasonNeural",     # Alternative 2
        "tony": "en-US-TonyNeural",       # Alternative 3
        "guy": "en-US-GuyNeural"          # Alternative 4
    },
    "ur": {
        "default": "ur-PK-AsadNeural",
        "asad": "ur-PK-AsadNeural"
    }
}

# Global lock to prevent concurrent audio generation
audio_lock = threading.Lock()

class SpeechRequest(BaseModel):
    text: str
    lang: str = "en"
    voice_type: str = "default"
    rate: Optional[str] = None
    volume: Optional[str] = None
    pitch: Optional[str] = None

class VoiceListResponse(BaseModel):
    voices: dict

@router.get("/voices", response_model=VoiceListResponse)
async def get_voices():
    """Get available high-quality male voices"""
    return VoiceListResponse(voices=VOICES)

@router.post("/speak")
async def speak(data: SpeechRequest, background_tasks: BackgroundTasks):
    """Convert text to speech using high-quality Andrew Neural voice"""
    
    # Input validation
    if not data.text or not data.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    if len(data.text) > 10000:  # Increased limit for longer conversations
        raise HTTPException(status_code=400, detail="Text too long (max 10000 characters)")
    
    # Prevent concurrent audio generation
    with audio_lock:
        # Get high-quality male voice configuration
        lang_voices = VOICES.get(data.lang, VOICES["en"])
        voice = lang_voices.get(data.voice_type, lang_voices["default"])
        
        # Create temporary file
        temp_dir = tempfile.gettempdir()
        output_file = os.path.join(temp_dir, f"speech_{uuid.uuid4()}.mp3")
        
        try:
            logger.info(f"Generating speech with Andrew Neural voice: {voice}")
            logger.info(f"Text: '{data.text[:100]}...'")
            
            # Clean and preprocess text
            clean_text = data.text.strip()
            
            # Add natural pauses and punctuation for better speech
            if not clean_text.endswith(('.', '!', '?')):
                clean_text += '.'
            
            # Replace common abbreviations for better pronunciation
            clean_text = clean_text.replace("JS", "JavaScript")
            clean_text = clean_text.replace("API", "A P I")
            clean_text = clean_text.replace("HTML", "H T M L")
            clean_text = clean_text.replace("CSS", "C S S")
            clean_text = clean_text.replace("DOM", "D O M")
            
            # Use Edge TTS with Andrew Neural voice
            communicate = edge_tts.Communicate(clean_text, voice)
            
            # Generate speech with extended timeout for longer text
            await asyncio.wait_for(communicate.save(output_file), timeout=60.0)
            
            # Verify file was created and has content
            if not os.path.exists(output_file):
                raise Exception("Failed to generate audio file")
            
            file_size = os.path.getsize(output_file)
            if file_size == 0:
                raise Exception("Generated audio file is empty")
            
            logger.info(f"Successfully generated audio: {file_size} bytes")
            
            # Read file content into memory for streaming
            with open(output_file, "rb") as f:
                audio_content = f.read()
            
            # Cleanup function
            def cleanup():
                try:
                    if os.path.exists(output_file):
                        os.remove(output_file)
                        logger.info(f"Cleaned up: {output_file}")
                except Exception as e:
                    logger.error(f"Cleanup error: {e}")
            
            # Schedule cleanup
            background_tasks.add_task(cleanup)
            
            # Return streaming response
            from io import BytesIO
            return StreamingResponse(
                BytesIO(audio_content),
                media_type="audio/mpeg",
                headers={
                    "Content-Disposition": "inline; filename=speech.mp3",
                    "Content-Length": str(len(audio_content)),
                    "Cache-Control": "no-cache",
                    "X-Voice-Used": voice,
                    "X-Audio-Quality": "high"
                }
            )
            
        except asyncio.TimeoutError:
            logger.error("TTS generation timed out")
            if os.path.exists(output_file):
                try:
                    os.remove(output_file)
                except:
                    pass
            raise HTTPException(
                status_code=408,
                detail="Text-to-speech generation timed out. Text might be too long."
            )
            
        except Exception as e:
            logger.error(f"TTS generation failed: {e}")
            
            # Cleanup on error
            if os.path.exists(output_file):
                try:
                    os.remove(output_file)
                except:
                    pass
            
            # Try with fallback voice if the error might be voice-related
            if "voice" in str(e).lower() or "neural" in str(e).lower():
                try:
                    logger.info("Trying with fallback Davis voice...")
                    fallback_voice = "en-US-DavisNeural"
                    communicate = edge_tts.Communicate(clean_text, fallback_voice)
                    await asyncio.wait_for(communicate.save(output_file), timeout=45.0)
                    
                    if os.path.exists(output_file) and os.path.getsize(output_file) > 0:
                        with open(output_file, "rb") as f:
                            audio_content = f.read()
                        
                        background_tasks.add_task(lambda: os.remove(output_file) if os.path.exists(output_file) else None)
                        
                        from io import BytesIO
                        return StreamingResponse(
                            BytesIO(audio_content),
                            media_type="audio/mpeg",
                            headers={
                                "Content-Disposition": "inline; filename=speech.mp3",
                                "Content-Length": str(len(audio_content)),
                                "Cache-Control": "no-cache",
                                "X-Voice-Used": fallback_voice,
                                "X-Audio-Quality": "fallback"
                            }
                        )
                except Exception as fallback_error:
                    logger.error(f"Fallback voice also failed: {fallback_error}")
            
            raise HTTPException(
                status_code=500,
                detail=f"Text-to-speech generation failed: {str(e)}"
            )

@router.get("/health")
async def health_check():
    """Health check with Andrew Neural voice testing"""
    try:
        test_text = "Health check test with Andrew Neural voice."
        temp_file = os.path.join(tempfile.gettempdir(), f"health_test_{uuid.uuid4()}.mp3")
        
        # Test Andrew Neural voice
        andrew_voice_working = False
        try:
            communicate = edge_tts.Communicate(test_text, VOICES["en"]["andrew"])
            await asyncio.wait_for(communicate.save(temp_file), timeout=15.0)
            
            if os.path.exists(temp_file) and os.path.getsize(temp_file) > 0:
                andrew_voice_working = True
                os.remove(temp_file)
                logger.info("Andrew Neural voice working perfectly")
        except Exception as e:
            logger.warning(f"Andrew Neural voice health check failed: {e}")
        
        # Test fallback voice if Andrew fails
        fallback_working = False
        if not andrew_voice_working:
            try:
                communicate = edge_tts.Communicate(test_text, VOICES["en"]["davis"])
                await asyncio.wait_for(communicate.save(temp_file), timeout=15.0)
                
                if os.path.exists(temp_file) and os.path.getsize(temp_file) > 0:
                    fallback_working = True
                    os.remove(temp_file)
            except Exception as e:
                logger.warning(f"Fallback voice health check failed: {e}")
        
        # Cleanup any remaining test files
        for file in Path(tempfile.gettempdir()).glob("health_test_*.mp3"):
            try:
                file.unlink()
            except:
                pass
        
        status = "healthy" if (andrew_voice_working or fallback_working) else "unhealthy"
        
        return {
            "status": status,
            "service": "TTS Service",
            "version": "2.0.0",
            "primary_voice": {
                "name": "en-US-AndrewNeural",
                "status": "working" if andrew_voice_working else "failed"
            },
            "fallback_voice": {
                "name": "en-US-DavisNeural", 
                "status": "working" if fallback_working else "failed"
            },
            "available_languages": list(VOICES.keys()),
            "available_voices": VOICES,
            "temp_dir": tempfile.gettempdir()
        }
        
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(status_code=503, detail=f"Service unhealthy: {str(e)}")