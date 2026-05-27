type Props = {
  label: string;
  progress: number; // 0 to 100
  color?: string;
};

export default function ProgressBar({
  label,
  progress,
  color = "#7C3AED",
}: Props) {
  const filled = Math.round(progress / 5); // 20 blocks total
  const empty = 20 - filled;

  const bar = "█".repeat(filled) + "░".repeat(empty);

  return (
    <box
      style={{
        width: "100%",
        height: 1,
        paddingLeft: 2,
        flexDirection: "row",
      }}
    >
      <text>
        <span fg="#6B7280">{label} </span>
        <span fg={color}>{bar}</span>
        <span fg="#6B7280"> {progress}%</span>
      </text>
    </box>
  );
}
