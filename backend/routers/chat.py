"""Recruiter chat router."""
from fastapi import APIRouter, HTTPException
from openai import OpenAI

from core.config import settings
from models.requests import RecruiterChatRequest

router = APIRouter(prefix="/api/chat", tags=["Chat"])

client = OpenAI(api_key=settings.openai_api_key)


@router.post("/recruiter")
async def recruiter_chat(req: RecruiterChatRequest):
    """Lightweight recruiter chatbot: returns a brief helpful answer."""
    try:
        system_prompt = "You are a concise assistant that helps recruiters. Keep replies under 120 words."
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": req.prompt},
            ],
            max_tokens=250,
            temperature=0.3,
        )
        
        content = response.choices[0].message.content.strip()
        return {"reply": content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Legacy endpoint for backwards compatibility
@router.post("/recruiter-chat", include_in_schema=False)
async def recruiter_chat_legacy(req: RecruiterChatRequest):
    """Legacy endpoint."""
    return await recruiter_chat(req)

