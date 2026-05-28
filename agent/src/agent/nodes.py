"""LangGraph agent nodes."""

import os
from langchain_groq import ChatGroq
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage
from agent.state import AgentState
from tools.file_tools import read_file, write_file, create_file
from tools.shell_tools import run_command
from tools.web_search import web_search

# LLM setup
llm = ChatGroq(
    model="openai/gpt-oss-20b",
    api_key=os.getenv("GROQ_API_KEY"),
    streaming=True,
)

# Tools
tools = [read_file, write_file, create_file, run_command, web_search]
llm_with_tools = llm.bind_tools(tools)

SYSTEM_PROMPT = """You are Forge, a terminal-based AI coding agent.
You help developers write, edit, and run code directly from the terminal.
You have access to file operations, shell commands, and web search.
Always be concise, accurate, and developer-friendly.
When making file changes, always show what you changed and why."""


async def agent_node(state: AgentState) -> AgentState:
    """Main agent node — calls LLM with tools."""
    messages = [
        SystemMessage(content=SYSTEM_PROMPT),
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

    tool_map = {
        "read_file": read_file,
        "write_file": write_file,
        "create_file": create_file,
        "run_command": run_command,
        "web_search": web_search,
    }

    last_message = state["messages"][-1]
    tool_results = []
    tool_calls_log = []

    for tool_call in last_message.tool_calls:
        tool_name = tool_call["name"]
        tool_args = tool_call["args"]

        tool_calls_log.append({
            "type": tool_name.replace("_", " ").split()[0],
            "file": tool_args.get("path") or tool_args.get("command"),
            "status": "pending",
        })

        try:
            result = await tool_map[tool_name].ainvoke(tool_args)
            tool_results.append(
                ToolMessage(
                    content=str(result),
                    tool_call_id=tool_call["id"],
                )
            )
            tool_calls_log[-1]["status"] = "done"
        except Exception as e:
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
    }


def should_continue(state: AgentState) -> str:
    """Router — continue to tools or end."""
    last_message = state["messages"][-1]
    if hasattr(last_message, "tool_calls") and last_message.tool_calls:
        return "tools"
    return "end"
