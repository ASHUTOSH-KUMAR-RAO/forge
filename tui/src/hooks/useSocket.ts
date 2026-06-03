import { useState, useEffect, useCallback } from "react"

interface SocketEvent {
  type: "message" | "tool_call" | "diff" | "progress" | "error" | "done"
  payload: any
}

interface UseSocketOptions {
  sessionId: string
  onMessage?: (event: SocketEvent) => void
  workingDir?: string
}

export function useSocket({ sessionId, onMessage, workingDir }: UseSocketOptions) {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/${sessionId}`)

    ws.onopen = () => {
      setConnected(true)

      // Working directory send karo jaise hi connect ho
      if (workingDir) {
        ws.send(JSON.stringify({
          type: "set_working_dir",
          path: workingDir,
        }))
      }
    }

    ws.onclose = () => setConnected(false)

    ws.onmessage = (event) => {
      const data: SocketEvent = JSON.parse(event.data)
      onMessage?.(data)
    }

    setSocket(ws)

    return () => {
      ws.close()
    }
  }, [sessionId])

  const send = useCallback(
    (task: string) => {
      if (socket && connected) {
        socket.send(JSON.stringify({ task }))
      }
    },
    [socket, connected]
  )

  const setWorkingDir = useCallback(
    (path: string) => {
      if (socket && connected) {
        socket.send(JSON.stringify({
          type: "set_working_dir",
          path,
        }))
      }
    },
    [socket, connected]
  )

  return { connected, send, setWorkingDir }
}
