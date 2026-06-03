"""WebSocket handler — streams agent events to TUI in real time."""

import json
import os
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from agent.graph import run_agent

ws_router = APIRouter()


@ws_router.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str) -> None:
    await websocket.accept()

    # Working directory — default current dir
    working_dir = os.getcwd()

    async def emit(event: dict) -> None:
        """Send an event to the TUI."""
        await websocket.send_text(json.dumps(event))

    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)

            # Working directory set karo agar TUI ne bheja
            if message.get("type") == "set_working_dir":
                working_dir = message.get("path", os.getcwd())
                os.chdir(working_dir)
                await emit({
                    "type": "message",
                    "payload": {"content": f"✅ Working directory set to: {working_dir}"}
                })
                continue

            # Agent run karo
            async for event in run_agent(
                task=message["task"],
                session_id=session_id,
                emit=emit,
                working_dir=working_dir,
            ):
                await emit(event)

    except WebSocketDisconnect:
        pass
