export interface Message {
  role: "user" | "forge" | "tool";
  content: string;
  timestamp?: string;
  toolType?: "read" | "write" | "run" | "create" | "delete" | "search";
  toolFile?: string;
  toolCommand?: string;
  toolStatus?: "pending" | "done" | "error";
}

interface ChatFeedProps {
  messages: Message[];
}

const TOOL_LABEL: Record<string, string> = {
  read:   "Read    ",
  write:  "Write   ",
  run:    "Run     ",
  create: "Create  ",
  delete: "Delete  ",
  search: "Search  ",
};

const ASCII = [
  "   ███████╗   ██████╗   ██████╗    ██████╗   ███████╗   ",
  "   ██╔════╝  ██╔═══██╗  ██╔══██╗  ██╔════╝   ██╔════╝   ",
  "   █████╗    ██║   ██║  ██████╔╝  ██║  ███╗  █████╗     ",
  "   ██╔══╝    ██║   ██║  ██╔══██╗  ██║   ██║  ██╔══╝     ",
  "   ██║       ╚██████╔╝  ██║  ██║  ╚██████╔╝  ███████╗   ",
  "   ╚═╝        ╚═════╝   ╚═╝  ╚═╝   ╚═════╝   ╚══════╝   ",
]

export default function ChatFeed({ messages }: ChatFeedProps) {
  return (
    <scrollbox
      width="100%"
      height="100%"
      stickyScroll={true}
      stickyStart="bottom"
      viewportCulling={true}
      focused
    >
      {messages.length === 0 ? (
        <box
          style={{
            flexDirection: "column",
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: 8,
          }}
        >
          {ASCII.map((line, i) => (
            <text key={i}>
              <span fg="#e0e0e0">{line}</span>
            </text>
          ))}

          <box style={{ height: 2 }} />

          <text>
            <span fg="#FFFFFF">  T H E   O P E N   S O U R C E   A I   C O D I N G   A G E N T  </span>
          </text>

          <box style={{ height: 2 }} />

          <text>
            <span fg="#4B5563">  Type a task or </span>
            <span fg="#6B7280">/help</span>
            <span fg="#4B5563"> for commands  </span>
          </text>
        </box>
      ) : (
        messages.map((msg, i) => {
          if (msg.role === "user") {
            return (
              <box key={i} style={{ flexDirection: "column", marginBottom: 1, paddingLeft: 2 }}>
                <text>
                  <span fg="#e0e0e0">{msg.content}</span>
                </text>
              </box>
            );
          }

          if (msg.role === "tool") {
            const label = TOOL_LABEL[msg.toolType ?? "read"];
            const target = msg.toolFile ?? msg.toolCommand ?? "";
            return (
              <box key={i} style={{ flexDirection: "row", paddingLeft: 2 }}>
                <text>
                  <span fg="#4B5563">* </span>
                  <span fg="#6B7280">{label}</span>
                  <span fg="#e0e0e0">{target}</span>
                </text>
              </box>
            );
          }

          return (
            <box key={i} style={{ flexDirection: "column", marginBottom: 1, paddingTop: 1, paddingLeft: 2 }}>
              <text>
                <span fg="#e0e0e0">{msg.content}</span>
              </text>
            </box>
          );
        })
      )}
    </scrollbox>
  );
}
