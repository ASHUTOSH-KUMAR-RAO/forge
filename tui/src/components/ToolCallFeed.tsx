export type ToolCall = {
  type: "reading" | "writing" | "running" | "analyzing" | "searching";
  target: string;
  status: "pending" | "done" | "error";
};

const ICONS: Record<ToolCall["type"], string> = {
  reading: "⎿ Reading   ",
  writing: "⎿ Writing   ",
  running: "⎿ Running   ",
  analyzing: "⎿ Analyzing ",
  searching: "⎿ Searching ",
};

const STATUS_COLOR: Record<ToolCall["status"], string> = {
  pending: "#F59E0B",
  done: "#10B981",
  error: "#EF4444",
};

type Props = {
  toolCalls: ToolCall[];
};

export default function ToolCallFeed({ toolCalls }: Props) {
  if (toolCalls.length === 0) return null;

  return (
    <box
      style={{
        width: "100%",
        paddingLeft: 2,
        paddingBottom: 1,
        flexDirection: "column",
      }}
    >
      {toolCalls.map((call, i) => (
        <box key={i} style={{ width: "100%", height: 1 }}>
          <text>
            <span fg="#6B7280">{ICONS[call.type]}</span>
            <span fg={STATUS_COLOR[call.status]}>{call.target}</span>
          </text>
        </box>
      ))}
    </box>
  );
}
