import { useKeyboard } from "@opentui/react";

interface InputBoxProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: (val: string) => void;
  accentColor?: string;
}

export default function InputBox({
  value,
  onChange,
  onSubmit,
  accentColor = "#7C3AED",
}: InputBoxProps) {
  useKeyboard((key) => {
    if (key.name === "return") {
      onSubmit(value);
    } else if (key.name === "backspace") {
      onChange(value.slice(0, -1));
    } else if (key.name === "space") {
      onChange(value + " ");
    } else if (!key.ctrl && !key.meta) {
      const char = typeof key.sequence === "string" ? key.sequence : key.name;
      if (char && char.length === 1) {
        onChange(value + char);
      }
    }
  });

  return (
    <box
      style={{
        width: "100%",
        height: 3,
        backgroundColor: "#1C1C1C",
        flexDirection: "row",
      }}
    >
      {/* Left border — full height 3 lines */}
      <box
        style={{
          flexDirection: "column",
          width: 1,
          height: 3,
        }}
      >
        <text>
          <span fg={accentColor}>▌</span>
        </text>
        <text>
          <span fg={accentColor}>▌</span>
        </text>
        <text>
          <span fg={accentColor}>▌</span>
        </text>
      </box>

      {/* Input — vertically centered */}
      <box
        style={{
          flexGrow: 1,
          height: 3,
          flexDirection: "column",
          justifyContent: "center",
          paddingLeft: 1,
        }}
      >
        <text>
          <span fg="#e0e0e0">{value}█</span>
        </text>
      </box>
    </box>
  );
}
