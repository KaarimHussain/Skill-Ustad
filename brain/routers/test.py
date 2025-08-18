from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
import wave
import os
import tempfile
import uuid
from piper import PiperVoice, SynthesisConfig

router = APIRouter()

# Load the voice model once at startup
voice = PiperVoice.load("./models/en_US-lessac-medium.onnx")

class SpeakRequest(BaseModel):
    text: str

@router.post("/speak")
async def speak(request: SpeakRequest):
    try:
        filename = f"speech_{uuid.uuid4().hex}.wav"
        
        syn_config = SynthesisConfig(
            volume=1,
            length_scale=1,
            noise_scale=1.0,
            noise_w_scale=1.0,
            normalize_audio=True
        )
        
        with wave.open(filename, "wb") as wav_file:
            voice.synthesize_wav(request.text, wav_file, syn_config=syn_config)
        
        def cleanup():
            try:
                if os.path.exists(filename):
                    os.remove(filename)
            except Exception as e:
                print(f"Error cleaning up file {filename}: {e}")
        
        return FileResponse(
            filename, 
            media_type="audio/wav",
            filename="speech.wav",
            background=cleanup  # This will delete the file after response
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Speech generation failed: {str(e)}")
