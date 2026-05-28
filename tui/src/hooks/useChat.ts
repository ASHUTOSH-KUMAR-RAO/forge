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
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last && last.role === "forge") {
              return [
                ...prev.slice(0, -1),
                { ...last, content: last.content + event.payload.content },
              ];
            }
            return [...prev, { role: "forge", content: event.payload.content }];
          });
          break;

        case "tool_call":
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

  const clearMessages = () => setMessages([]);
  return {
    messages,
    isThinking,
    connected,
    sendMessage,
    clearMessages,
  };
}
