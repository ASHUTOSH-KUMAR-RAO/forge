"""REST API routes."""

import os
import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/api")


@router.get("/status")
async def status() -> dict:
    return {"status": "ok"}


@router.get("/models")
async def models() -> dict:
    return {
        "models": [
            {"id": "openai/gpt-oss-20b", "provider": "groq"},
            {"id": "gemini-2.0-flash", "provider": "gemini"},
        ]
    }


@router.get("/session/{session_id}")
async def get_session(session_id: str) -> dict:
    return {"session_id": session_id, "messages": []}


@router.get("/auth/url")
async def get_auth_url() -> dict:
    """Return Clerk OAuth URL for PKCE flow."""
    publishable_key = os.getenv("CLERK_PUBLISHABLE_KEY", "")
    callback_url = "http://localhost:3141/callback"

    url = (
        f"https://accounts.clerk.dev/oauth/authorize"
        f"?client_id={publishable_key}"
        f"&redirect_uri={callback_url}"
        f"&response_type=code"
    )

    return {"url": url}


@router.post("/auth/verify")
async def verify_token(body: dict) -> dict:
    """Verify Clerk token."""
    token = body.get("token")
    if not token:
        raise HTTPException(status_code=400, detail="Token required")

    from auth.clerk import verify_clerk_token
    user = await verify_clerk_token(token)
    return {"user": user, "valid": True}


@router.get("/auth/me")
async def get_me(token: str) -> dict:
    """Get current user from token."""
    from auth.clerk import verify_clerk_token
    return await verify_clerk_token(token)
