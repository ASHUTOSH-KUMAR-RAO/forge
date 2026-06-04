"""LangGraph agent nodes."""

import os
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage
from agent.state import AgentState
from tools.file_tools import read_file, write_file, create_file, delete_file
from tools.shell_tools import run_command
from tools.web_search import web_search

# LLM setup
llm = ChatGroq(
    model="openai/gpt-oss-20b",
    api_key=os.getenv("GROQ_API_KEY"),
    streaming=True,
)

# Tools
tools = [read_file, write_file, create_file, delete_file, run_command, web_search]
llm_with_tools = llm.bind_tools(tools)

SYSTEM_PROMPT = """You are Forge, a terminal-based AI coding agent.
You help developers write, edit, and run code directly from the terminal.
You have access to file operations, shell commands, and web search.
Always be concise, accurate, and developer-friendly.
When making file changes, always show what you changed and why.
When you have codebase context, use it to give more accurate answers."""


async def agent_node(state: AgentState) -> AgentState:
    """Main agent node — calls LLM with tools."""

    # RAG context inject karo agar available hai
    rag_context = state.get("rag_context", "")

    system_content = SYSTEM_PROMPT
    if rag_context:
        system_content += f"\n\n## Relevant codebase context:\n{rag_context}"

    messages = [
        SystemMessage(content=system_content),
        *state["messages"],
    ]

    response = await llm_with_tools.ainvoke(messages)

    return {
        **state,
        "messages": [response],
        "done": not response.tool_calls,
    }


async def tools_node(state: AgentState) -> AgentState:
    """Execute tool calls from agent."""
    from langchain_core.messages import ToolMessage

    emit = state.get("emit")

    tool_map = {
        "read_file": read_file,
        "write_file": write_file,
        "create_file": create_file,
        "delete_file": delete_file,
        "run_command": run_command,
        "web_search": web_search,
    }

    last_message = state["messages"][-1]
    tool_results = []
    tool_calls_log = []

    for tool_call in last_message.tool_calls:
        tool_name = tool_call["name"]
        tool_args = tool_call["args"]

        file_or_cmd = tool_args.get("path") or tool_args.get("command") or ""
        tool_type = tool_name.replace("_", " ").split()[0]

        # Emit pending event
        if emit:
            await emit({
                "type": "tool_call",
                "payload": {
                    "type": tool_type,
                    "file": file_or_cmd,
                    "status": "pending",
                },
            })

        tool_calls_log.append({
            "type": tool_type,
            "file": file_or_cmd,
            "status": "pending",
        })

        try:
            result = await tool_map[tool_name].ainvoke(tool_args)

            # Emit done event
            if emit:
                await emit({
                    "type": "tool_call",
                    "payload": {
                        "type": tool_type,
                        "file": file_or_cmd,
                        "status": "done",
                    },
                })

            # Diff emit karo agar file write hui
            if tool_name in ("write_file", "create_file") and emit:
                await emit({
                    "type": "diff",
                    "payload": {
                        "filename": file_or_cmd,
                        "content": tool_args.get("content", ""),
                    },
                })

            tool_results.append(
                ToolMessage(
                    content=str(result),
                    tool_call_id=tool_call["id"],
                )
            )
            tool_calls_log[-1]["status"] = "done"

        except Exception as e:
            if emit:
                await emit({
                    "type": "tool_call",
                    "payload": {
                        "type": tool_type,
                        "file": file_or_cmd,
                        "status": "error",
                    },
                })

            tool_results.append(
                ToolMessage(
                    content=f"Error: {str(e)}",
                    tool_call_id=tool_call["id"],
                )
            )
            tool_calls_log[-1]["status"] = "error"

    return {
        **state,
        "messages": tool_results,
        "tool_calls": state["tool_calls"] + tool_calls_log,
        "files_changed": state["files_changed"] + [
            t["file"] for t in tool_calls_log
            if t["type"] in ("write", "create") and t["status"] == "done"
        ],
    }


def should_continue(state: AgentState) -> str:
    """Router — continue to tools or end."""
    last_message = state["messages"][-1]
    if hasattr(last_message, "tool_calls") and last_message.tool_calls:
        return "tools"
    return "end"
