"""WebSocket handler — streams agent events to TUI in real time."""

import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from agent.graph import run_agent

ws_router = APIRouter()


@ws_router.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str) -> None:
    await websocket.accept()

    async def emit(event: dict) -> None:
        """Send an event to the TUI."""
        await websocket.send_text(json.dumps(event))

    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)

            async for event in run_agent(
                task=message["task"],
                session_id=session_id,
                emit=emit,
            ):
                await emit(event)

    except WebSocketDisconnect:
        pass
