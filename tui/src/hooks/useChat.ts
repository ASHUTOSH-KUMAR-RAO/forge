import { useState } from "react";
import { useSocket } from "./useSocket";
import { type Message } from "../components/ChatFeed";

export function useChat(sessionId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  const { connected, send } = useSocket({
    sessionId,
    onMessage: (event) => {
      switch (event.type) {
        case "message":
          setIsThinking(false);
          setMessages((prev) => [
            ...prev,
            { role: "forge", content: event.payload.content },
          ]);
          break;

        case "tool_call":
          // Ab tool calls messages stream mein hi jayenge
          setMessages((prev) => [
            ...prev,
            {
              role: "tool",
              content: "",
              toolType: event.payload.type,
              toolFile: event.payload.file,
              toolCommand: event.payload.command,
              toolStatus: event.payload.status,
            },
          ]);
          break;

        case "done":
          setIsThinking(false);
          break;

        case "error":
          setIsThinking(false);
          setMessages((prev) => [
            ...prev,
            { role: "forge", content: `❌ Error: ${event.payload.message}` },
          ]);
          break;
      }
    },
  });

  const sendMessage = (content: string) => {
    if (!content.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content }]);
    setIsThinking(true);
    send(content);
  };

  return {
    messages,
    isThinking,
    connected,
    sendMessage,
  };
}
