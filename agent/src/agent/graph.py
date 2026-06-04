"""LangGraph agent graph definition."""

import json
from typing import AsyncGenerator
from langgraph.graph import StateGraph, END
from agent.state import AgentState
from agent.nodes import agent_node, tools_node, should_continue


def build_graph():
    """Build and compile the LangGraph agent."""
    graph = StateGraph(AgentState)

    graph.add_node("agent", agent_node)
    graph.add_node("tools", tools_node)

    graph.set_entry_point("agent")

    graph.add_conditional_edges(
        "agent",
        should_continue,
        {
            "tools": "tools",
            "end": END,
        },
    )

    graph.add_edge("tools", "agent")

    return graph.compile()


agent = build_graph()


async def run_agent(
    task: str,
    session_id: str,
    emit,
    working_dir: str = None,
) -> AsyncGenerator[dict, None]:
    """Run agent and stream events to TUI via WebSocket."""
    from langchain_core.messages import HumanMessage
    from rag.retriever import get_relevant_context

    # RAG context fetch karo — limit karo
    rag_context = ""
    try:
        rag_context = await get_relevant_context(
            task=task,
            session_id=session_id,
            k=3,
        )
        if len(rag_context) > 2000:
            rag_context = rag_context[:2000] + "..."
    except Exception:
        pass

    initial_state: AgentState = {
        "session_id": session_id,
        "task": task,
        "messages": [HumanMessage(content=task)],
        "tool_calls": [],
        "files_changed": [],
        "error": None,
        "done": False,
        "emit": emit,
        "rag_context": rag_context,
    }

    async for event in agent.astream_events(initial_state, version="v2"):
        kind = event["event"]

        if kind == "on_tool_start":
            await emit({
                "type": "tool_call",
                "payload": {
                    "type": event["name"].replace("_", " ").split()[0],
                    "file": event["data"].get("input", {}).get("path")
                        or event["data"].get("input", {}).get("command"),
                    "status": "pending",
                },
            })

        elif kind == "on_tool_end":
            tool_name = event["name"]
            file_path = event["data"].get("input", {}).get("path", "")

            await emit({
                "type": "tool_call",
                "payload": {
                    "type": tool_name.replace("_", " ").split()[0],
                    "file": file_path
                        or event["data"].get("input", {}).get("command"),
                    "status": "done",
                },
            })

            if tool_name in ("write_file", "create_file"):
                await emit({
                    "type": "diff",
                    "payload": {
                        "filename": file_path,
                        "content": event["data"].get("input", {}).get("content", ""),
                    },
                })

        elif kind == "on_chat_model_stream":
            chunk = event["data"]["chunk"]
            if chunk.content:
                await emit({
                    "type": "message",
                    "payload": {"content": chunk.content},
                })

        elif kind == "on_chain_end" and event["name"] == "LangGraph":
            await emit({
                "type": "done",
                "payload": {},
            })

    yield {"type": "done", "payload": {}}
