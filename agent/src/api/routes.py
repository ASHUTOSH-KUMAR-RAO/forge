"""REST API routes."""

from fastapi import APIRouter

router = APIRouter(prefix="/api")


@router.get("/status")
async def status() -> dict:
    return {"status": "ok"}


@router.get("/models")
async def models() -> dict:
    return {
        "models": [
            {"id": "llama-3.3-70b", "provider": "groq"},
            {"id": "gemini-2.0-flash", "provider": "gemini"},
        ]
    }


@router.get("/session/{session_id}")
async def get_session(session_id: str) -> dict:
    return {"session_id": session_id, "messages": []}
