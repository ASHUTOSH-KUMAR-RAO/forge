import { useState } from "react"
import { useSocket } from "./useSocket"

interface Message {
  role: "user" | "forge"
  content: string
}

interface ToolCall {
  type: "read" | "write" | "run" | "create"
  file?: string
  status: "pending" | "done" | "error"
}

export function useChat(sessionId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [toolCalls, setToolCalls] = useState<ToolCall[]>([])
  const [isThinking, setIsThinking] = useState(false)

  const { connected, send } = useSocket({
    sessionId,
    onMessage: (event) => {
      switch (event.type) {
        case "message":
          setIsThinking(false)
          setMessages((prev) => [
            ...prev,
            { role: "forge", content: event.payload.content },
          ])
          break

        case "tool_call":
          setToolCalls((prev) => [...prev, event.payload])
          break

        case "done":
          setIsThinking(false)
          break

        case "error":
          setIsThinking(false)
          setMessages((prev) => [
            ...prev,
            { role: "forge", content: `❌ Error: ${event.payload.message}` },
          ])
          break
      }
    },
  })

  const sendMessage = (content: string) => {
    if (!content.trim()) return
    setMessages((prev) => [...prev, { role: "user", content }])
    setIsThinking(true)
    send(content)
  }

  return {
    messages,
    toolCalls,
    isThinking,
    connected,
    sendMessage,
  }
}
