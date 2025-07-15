import uuid
import os
import asyncio
import edge_tts
from fastapi import FastAPI, BackgroundTasks
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 👈 or use ["http://localhost:5173"] for Vite
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

VOICES = {
    "en": "en-GB-RyanNeural",
    "ur": "ur-PK-AsadNeural"
}



class SpeechRequest(BaseModel):
    text: str
    lang: str = "en"

@app.post("/speak")
async def speak(data: SpeechRequest, background_tasks: BackgroundTasks):
    voice = VOICES.get(data.lang, VOICES["en"])
    output_file = f"{uuid.uuid4()}.mp3"

    try:
        # Generate the speech file
        communicate = edge_tts.Communicate(data.text, voice)
        await communicate.save(output_file)

        # Open the file for reading
        file = open(output_file, "rb")

        # Cleanup task
        def cleanup():
            file.close()
            os.remove(output_file)

        # Schedule it as a background task
        background_tasks.add_task(cleanup)

        # Send the file as streaming response
        return StreamingResponse(
            file,
            media_type="audio/mpeg",
            headers={"Content-Disposition": "inline; filename=speech.mp3"}
        )

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
