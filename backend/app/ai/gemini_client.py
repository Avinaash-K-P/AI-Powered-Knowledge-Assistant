import os

from dotenv import load_dotenv
import google.generativeai as genai
from fastapi import HTTPException
from google.api_core.exceptions import ResourceExhausted

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY is not set")

genai.configure(api_key=GEMINI_API_KEY) # type: ignore

generation_model = genai.GenerativeModel("models/gemini-flash-lite-latest") # type: ignore

def generate_ai_answer(prompt: str) -> str:

    try:
        response = generation_model.generate_content(
            prompt,
            generation_config={
                "temperature": 0.2,
            },
        )

        return response.text or ""

    except ResourceExhausted:
        raise HTTPException(
            status_code=429,
            detail="Gemini quota exceeded. Please try again later or use another Gemini model/API project.",
        )


def generate_embedding(text: str) -> list[float]:
    result = genai.embed_content( # type: ignore
        model="models/gemini-embedding-001",
        content=text,
    )

    return result["embedding"]