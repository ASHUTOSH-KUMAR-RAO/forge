import { useKeyboard } from "@opentui/react";
import { useState } from "react";
import ChatFeed from "./ChatFeed";
import InputBox from "./InputBox";
import StatusBar from "./StatusBar";
import ProgressBar from "./ProgressBar";
import AuthGate from "./AuthGate";
import { useChat } from "../hooks/useChat";
import { useTheme } from "../hooks/useTheme";
import { useSession } from "../hooks/useSession";
import { useAuth } from "../hooks/useAuth";
import { parseCommand } from "../commands/parser";
import { handleCommand } from "../commands/handler";

export default function App() {
  const [input, setInput] = useState("");
  const [sessionId] = useState(() => crypto.randomUUID());
  const [sessionName, setSessionName] = useState("New Session");
  const [workingDir, setWorkingDir] = useState<string>(process.cwd());

  const { theme, themeName, switchTheme } = useTheme();
  const { newSession } = useSession();
  const { auth } = useAuth();
  const {
    messages,
    isThinking,
    connected,
    sendMessage,
    clearMessages,
    progress,
    setWorkingDir: setSocketWorkingDir,
  } = useChat(sessionId, workingDir);

  const handleSubmit = (msg: string) => {
    if (!msg.trim()) return;

    const command = parseCommand(msg);

    if (command) {
      handleCommand(command, {
        sendMessage,
        clearMessages,
        switchTheme,
        themeName,
        newSession,
        sessionName,
        workingDir,
        setWorkingDir: (path: string) => {
          setWorkingDir(path);
          setSocketWorkingDir(path);
        },
      });
    } else {
      if (messages.length === 0) setSessionName(msg.slice(0, 40));
      sendMessage(msg);
    }

    setInput("");
  };

  useKeyboard((key) => {
    if (key.name === "escape") process.exit(0);
  });

  // Auth gate
  if (!auth.loggedIn) {
    return (
      <AuthGate
        value={input}
        onChange={setInput}
        onCommand={handleSubmit}
        accentColor={theme.colors.primary}
        themeName={themeName}
      />
    );
  }

  return (
    <box style={{ width: "100%", height: "100%", flexDirection: "column" }}>
      {/* Chat Feed */}
      <box style={{ flexGrow: 1, width: "100%" }}>
        <ChatFeed messages={messages} />
      </box>

      {/* Progress Bar */}
      {progress && (
        <ProgressBar
          label={progress.label}
          progress={progress.progress}
          color={theme.colors.primary}
        />
      )}

      {/* Thinking indicator */}
      {isThinking && (
        <box style={{ paddingLeft: 2, height: 1 }}>
          <text>
            <span fg="#6B7280">~ Thinking...</span>
          </text>
        </box>
      )}

      {/* Input Box */}
      <box style={{ width: "100%", backgroundColor: "#1a1a1a" }}>
        <InputBox
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
          accentColor={theme.colors.primary}
        />
      </box>

      {/* Status Bar */}
      <StatusBar
        model="llama-3.3-70b"
        theme={themeName}
        agent="Forge"
        connected={connected}
        isThinking={isThinking}
        accentColor={theme.colors.primary}
      />
    </box>
  );
}
