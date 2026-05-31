"""Clerk authentication — PKCE token verification."""

import os
import httpx
from fastapi import HTTPException


async def verify_clerk_token(token: str) -> dict:
    """Verify Clerk session token."""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://api.clerk.com/v1/sessions",
                headers={
                    "Authorization": f"Bearer {os.getenv('CLERK_SECRET_KEY')}",
                    "Content-Type": "application/json",
                },
                params={"session_token": token},
                timeout=10.0,
            )

            if response.status_code != 200:
                raise HTTPException(
                    status_code=401,
                    detail="Invalid or expired token"
                )

            return response.json()

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail=f"Token verification failed: {str(e)}"
        )
