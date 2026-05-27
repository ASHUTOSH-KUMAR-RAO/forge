import { useKeyboard } from "@opentui/react";
import { useState } from "react";

interface InputBoxProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: (val: string) => void;
}

export default function InputBox({ value, onChange, onSubmit }: InputBoxProps) {
  useKeyboard((key) => {
    if (key.name === "return") {
      onSubmit(value);
    } else if (key.name === "backspace") {
      onChange(value.slice(0, -1));
    } else if (key.name && key.name.length === 1) {
      onChange(value + key.name);
    }
  });

  return (
    <box
      style={{
        width: "100%",
        height: 3,
        border: true,
        borderColor: "#7C3AED",
        paddingLeft: 2,
        paddingRight: 2,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <text>
        <span fg="#7C3AED">❯ </span>
        <span fg="#F9FAFB">{value}</span>
        <span fg="#7C3AED">█</span>
      </text>
    </box>
  );
}
