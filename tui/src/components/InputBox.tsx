import { useKeyboard, usePaste } from "@opentui/react";
import { decodePasteBytes } from "@opentui/core";
import { useState } from "react";

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
  const [cursor, setCursor] = useState(0);
  const [focused, setFocused] = useState(true);

  // Paste via usePaste hook
  usePaste((event) => {
    const text = decodePasteBytes(event.bytes);
    const newVal = value.slice(0, cursor) + text + value.slice(cursor);
    onChange(newVal);
    setCursor(cursor + text.length);
  });

  useKeyboard((key) => {
    if (key.name === "return") {
      onSubmit(value);
      setCursor(0);
    } else if (key.name === "backspace") {
      if (cursor > 0) {
        onChange(value.slice(0, cursor - 1) + value.slice(cursor));
        setCursor(cursor - 1);
      }
    } else if (key.name === "delete") {
      onChange(value.slice(0, cursor) + value.slice(cursor + 1));
    } else if (key.name === "left") {
      setCursor(Math.max(0, cursor - 1));
    } else if (key.name === "right") {
      setCursor(Math.min(value.length, cursor + 1));
    } else if (key.name === "home") {
      setCursor(0);
    } else if (key.name === "end") {
      setCursor(value.length);
    } else if (key.name === "space") {
      const newVal = value.slice(0, cursor) + " " + value.slice(cursor);
      onChange(newVal);
      setCursor(cursor + 1);
    } else if (key.ctrl && key.name === "v") {
      // Windows clipboard paste
      import("child_process").then(({ execSync }) => {
        try {
          const text = execSync("powershell -command Get-Clipboard", {
            encoding: "utf8",
          }).trim();
          if (text) {
            const newVal = value.slice(0, cursor) + text + value.slice(cursor);
            onChange(newVal);
            setCursor(cursor + text.length);
          }
        } catch (e) {
          // ignore
        }
      });
    } else if ((key as any).char && !key.ctrl && !key.meta) {
      const ch = (key as any).char as string;
      const newVal = value.slice(0, cursor) + ch + value.slice(cursor);
      onChange(newVal);
      setCursor(cursor + 1);
    } else if (key.name && key.name.length === 1 && !key.ctrl && !key.meta) {
      const newVal = value.slice(0, cursor) + key.name + value.slice(cursor);
      onChange(newVal);
      setCursor(cursor + 1);
    }
  });

  const before = value.slice(0, cursor);
  const after = value.slice(cursor);

  return (
    <box
      style={{
        width: "100%",
        height: 5,
        backgroundColor: "#111111",
        flexDirection: "row",
      }}
    >
      {/* Prompt icon */}
      <box
        style={{
          width: 4,
          height: 5,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <text>
          <span fg={accentColor}>❯</span>
        </text>
      </box>

      {/* Input text */}
      <box
        style={{
          flexGrow: 1,
          height: 5,
          flexDirection: "column",
          justifyContent: "center",
          paddingRight: 2,
        }}
      >
        {value.length === 0 ? (
          <text>
            <span fg="#374151">Type a task or /help for commands...</span>
            <span fg={accentColor}></span>
          </text>
        ) : (
          <text>
            <span fg="#e0e0e0">{before}</span>
            <span fg={accentColor}>▏</span>
            <span fg="#e0e0e0">{after}</span>
          </text>
        )}
      </box>
    </box>
  );
}
