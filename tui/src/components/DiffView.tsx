type DiffLine = {
  type: "added" | "removed" | "unchanged";
  content: string;
  lineNumber: number;
};

type Props = {
  filename: string;
  lines: DiffLine[];
};

const LINE_COLOR: Record<DiffLine["type"], string> = {
  added: "#10B981",
  removed: "#EF4444",
  unchanged: "#6B7280",
};

const LINE_PREFIX: Record<DiffLine["type"], string> = {
  added: "+ ",
  removed: "- ",
  unchanged: "  ",
};

export default function DiffView({ filename, lines }: Props) {
  if (lines.length === 0) return null;

  return (
    <box
      style={{
        width: "100%",
        flexDirection: "column",
        paddingLeft: 2,
        paddingRight: 2,
        paddingBottom: 1,
      }}
    >
      {/* File header */}
      <box style={{ width: "100%", height: 1, marginBottom: 1 }}>
        <text>
          <span fg="#7C3AED">~ Modified </span>
          <span fg="#F9FAFB">{filename}</span>
        </text>
      </box>

      {/* Diff lines */}
      {lines.map((line, i) => (
        <box key={i} style={{ width: "100%", height: 1 }}>
          <text>
            <span fg="#4B5563">{String(line.lineNumber).padStart(3, " ")}</span>
            <span fg={LINE_COLOR[line.type]}>
              {" "}
              {LINE_PREFIX[line.type]}
              {line.content}
            </span>
          </text>
        </box>
      ))}
    </box>
  );
}
