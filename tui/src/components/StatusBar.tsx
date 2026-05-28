import { useState, useEffect } from "react";

interface StatusBarProps {
  model: string;
  theme: string;
  agent: string;
  connected: boolean;
  isThinking?: boolean;
  accentColor?: string;
}

const BLOCKS = ["▏", "▎", "▍", "▌", "▋", "▊", "▉", "█"];

export default function StatusBar({
  model,
  theme,
  agent,
  connected,
  isThinking = false,
  accentColor = "#7C3AED",
}: StatusBarProps) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!isThinking) {
      setFrame(0);
      return;
    }
    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % BLOCKS.length);
    }, 80);
    return () => clearInterval(interval);
  }, [isThinking]);

  const animated = isThinking
    ? BLOCKS.slice(0, 5)
        .map((_, i) => {
          const idx = Math.max(0, frame - (4 - i));
          return BLOCKS[idx % BLOCKS.length];
        })
        .join("")
    : "▏▎▍▌▋";

  return (
    <box style={{ width: "100%", flexDirection: "column" }}>
      {/* Bar 1 — Build · model · agent · theme */}
      <box
        style={{
          width: "100%",
          height: 1,
          flexDirection: "row",
          alignItems: "center",
          paddingLeft: 1,
          backgroundColor: "#1a1a1a",
        }}
      >
        <text>
          <span fg={accentColor}>Build</span>
          <span fg="#4B5563"> · </span>
          <span fg="#e0e0e0">{model}</span>
          <span fg="#4B5563"> · </span>
          <span fg="#6B7280">{agent}</span>
          <span fg="#4B5563"> · </span>
          <span fg="#6B7280">{theme}</span>
        </text>
      </box>

      {/* Bar 2 — animated blocks + esc left, shortcuts right */}
      <box
        style={{
          width: "100%",
          height: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          paddingLeft: 1,
          paddingRight: 2,
          backgroundColor: "#111111",
        }}
      >
        <text>
          <span fg={accentColor}>{animated} </span>
          <span fg="#6B7280">esc </span>
          <span fg="#4B5563">interrupt</span>
        </text>

        <text>
          <span fg="#6B7280">tab </span>
          <span fg="#4B5563">switch agent </span>
          <span fg="#6B7280">ctrl+p </span>
          <span fg="#4B5563">commands</span>
        </text>
      </box>
    </box>
  );
}
