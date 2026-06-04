"""RAG Indexer — LangChain + Supabase pgvector."""

import os
from pathlib import Path
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import SupabaseVectorStore
from supabase import create_client
from dotenv import load_dotenv

# File extensions to index
SUPPORTED_EXTENSIONS = {
    ".py", ".ts", ".tsx", ".js", ".jsx",
    ".md", ".txt", ".json", ".yaml", ".yml",
    ".html", ".css", ".env.example", ".toml",
}

# Folders to skip
SKIP_DIRS = {
    "node_modules", ".git", "__pycache__", ".venv",
    "venv", "dist", "build", ".next", "coverage",
}

# Explicitly load karo
load_dotenv(dotenv_path="C:\\Users\\aashu\\Desktop\\Forge\\agent\\.env.local")


def get_supabase_client():
    return create_client(
        os.getenv("SUPABASE_URL", ""),
        os.getenv("SUPABASE_SECRET_KEY", ""),
    )


def get_embeddings():
    return HuggingFaceEmbeddings(
        model_name="all-MiniLM-L6-v2"
    )


async def index_codebase(
    working_dir: str,
    session_id: str,
    emit=None,
) -> dict:
    """Index entire codebase into Supabase pgvector."""

    if emit:
        await emit({
            "type": "progress",
            "payload": {"label": "Indexing codebase...", "progress": 0}
        })

    # Collect all files
    files = []
    for root, dirs, filenames in os.walk(working_dir):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]

        for filename in filenames:
            ext = Path(filename).suffix
            if ext in SUPPORTED_EXTENSIONS:
                files.append(os.path.join(root, filename))

    if not files:
        return {"indexed": 0, "message": "No files found to index"}

    # Load and split documents
    documents = []
    for i, file_path in enumerate(files):
        try:
            loader = TextLoader(file_path, encoding="utf-8")
            docs = loader.load()

            for doc in docs:
                doc.metadata["session_id"] = session_id
                doc.metadata["file_path"] = file_path
                doc.metadata["working_dir"] = working_dir

            documents.extend(docs)

            if emit and i % 5 == 0:
                progress = int((i / len(files)) * 80)
                await emit({
                    "type": "progress",
                    "payload": {
                        "label": f"Loading files... {i}/{len(files)}",
                        "progress": progress
                    }
                })
        except Exception:
            continue

    # Split into chunks
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
    )
    chunks = splitter.split_documents(documents)

    if emit:
        await emit({
            "type": "progress",
            "payload": {"label": "Creating embeddings...", "progress": 85}
        })

    # Store in Supabase pgvector
    supabase = get_supabase_client()
    embeddings = get_embeddings()

    SupabaseVectorStore.from_documents(
        documents=chunks,
        embedding=embeddings,
        client=supabase,
        table_name="documents",
        query_name="match_documents",
    )

    if emit:
        await emit({
            "type": "progress",
            "payload": {"label": "Indexing complete!", "progress": 100}
        })

    return {
        "indexed": len(chunks),
        "files": len(files),
        "message": f"Indexed {len(files)} files ({len(chunks)} chunks)"
    }


async def search_codebase(
    query: str,
    session_id: str,
    k: int = 5,
) -> list[dict]:
    """Semantic search across indexed codebase."""

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
            "score": doc.metadata.get("score", 0),
        }
        for doc in results
    ]
