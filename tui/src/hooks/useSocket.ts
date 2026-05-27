import { useState, useEffect, useCallback } from "react";

interface SocketEvent {
  type: "message" | "tool_call" | "diff" | "progress" | "error" | "done";
  payload: any;
}

interface UseSocketOptions {
  sessionId: string;
  onMessage?: (event: SocketEvent) => void;
}

export function useSocket({ sessionId, onMessage }: UseSocketOptions) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/${sessionId}`);

    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);

    ws.onmessage = (event) => {
      const data: SocketEvent = JSON.parse(event.data);
      onMessage?.(data);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [sessionId]);

  const send = useCallback(
    (task: string) => {
      if (socket && connected) {
        socket.send(JSON.stringify({ task }));
      }
    },
    [socket, connected],
  );

  return { connected, send };
}
