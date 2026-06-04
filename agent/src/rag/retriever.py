
"""RAG Retriever — semantic search across indexed codebase."""

import os
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import SupabaseVectorStore
from supabase import create_client


def get_supabase_client():
    return create_client(
        os.getenv("SUPABASE_URL", ""),
        os.getenv("SUPABASE_SECRET_KEY", ""),
    )


def get_embeddings():
    return GoogleGenerativeAIEmbeddings(
        model="models/embedding-004",
        google_api_key=os.getenv("GEMINI_API_KEY", ""),
    )


async def search_codebase(
    query: str,
    session_id: str,
    k: int = 5,
) -> list[dict]:
    """Semantic search across indexed codebase."""
    try:
        supabase = get_supabase_client()
        embeddings = get_embeddings()

        vector_store = SupabaseVectorStore(
            client=supabase,
            embedding=embeddings,
            table_name="documents",
            query_name="match_documents",
        )

        results = vector_store.similarity_search(
            query,
            k=k,
            filter={"session_id": session_id},
        )

        return [
            {
                "file": doc.metadata.get("file_path", ""),
                "content": doc.page_content,
            }
            for doc in results
        ]

    except Exception as e:
        return [{"error": str(e)}]


async def get_relevant_context(
    task: str,
    session_id: str,
    k: int = 3,
) -> str:
    """Get relevant code context for agent task."""
    results = await search_codebase(task, session_id, k)

    if not results or "error" in results[0]:
        return ""

    context = ""
    for result in results:
        file_path = result.get("file", "")
        content = result.get("content", "")
        context += f"\n--- {file_path} ---\n{content}\n"

    return context
