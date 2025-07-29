from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List
import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

app = FastAPI()

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]

@app.post("/api/chat")
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
