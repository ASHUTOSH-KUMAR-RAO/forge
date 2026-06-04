"""LangGraph agent state definition."""

from typing import Annotated, TypedDict, Callable, Awaitable
from langgraph.graph.message import add_messages


class AgentState(TypedDict):
    session_id: str
    task: str
    messages: Annotated[list, add_messages]
    tool_calls: list
    files_changed: list
    error: str | None
    done: bool
    emit: Callable[[dict], Awaitable[None]] | None
    rag_context: str | None
