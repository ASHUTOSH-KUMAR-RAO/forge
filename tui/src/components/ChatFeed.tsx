interface Message {
  role: "user" | "forge";
  content: string;
}

interface ChatFeedProps {
  messages: Message[];
}

export default function ChatFeed({ messages }: ChatFeedProps) {
  return (
    <box
      style={{
        width: "100%",
        flexGrow: 1,
        flexDirection: "column",
        paddingLeft: 2,
        paddingRight: 2,
        paddingTop: 1,
      }}
    >
      {messages.length === 0 ? (
        <text>
          <span fg="#4B5563">Type a task or /help for commands...</span>
        </text>
      ) : (
        messages.map((msg, i) => (
          <box key={i} style={{ flexDirection: "column", marginBottom: 1 }}>
            {msg.role === "user" ? (
              <text>
                <span fg="#A78BFA">❯ </span>
                <span fg="#F9FAFB">{msg.content}</span>
              </text>
            ) : (
              <box style={{ flexDirection: "column" }}>
                <text>
                  <span fg="#7C3AED">◆ Forge</span>
                </text>
                <text>
                  <span fg="#4B5563"> </span>
                  <span fg="#F9FAFB">{msg.content}</span>
                </text>
              </box>
            )}
          </box>
        ))
      )}
    </box>
  );
}
