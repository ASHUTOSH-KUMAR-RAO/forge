"""Web search tool for the Forge agent."""

import os
import httpx
from langchain_core.tools import tool


@tool
async def web_search(query: str) -> str:
    """Search the web for information.

    Args:
        query: Search query string
    """
    try:
        api_key = os.getenv("GROQ_API_KEY")

        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": "llama-3.3-70b-versatile",
                    "messages": [
                        {
                            "role": "user",
                            "content": f"Search and summarize: {query}. Provide concise, accurate information.",
                        }
                    ],
                    "max_tokens": 500,
                },
                timeout=30.0,
            )

            data = response.json()
            return data["choices"][0]["message"]["content"]

    except Exception as e:
        return f"Error searching web: {str(e)}"
