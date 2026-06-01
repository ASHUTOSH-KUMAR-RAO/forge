import InputBox from "./InputBox";
interface AuthGateProps {
  onCommand: (cmd: string) => void;
  value: string;
  onChange: (val: string) => void;
  accentColor: string;
  themeName: string;
}

export default function AuthGate({
  onCommand,
  value,
  onChange,
  accentColor,
  themeName,
}: AuthGateProps) {
  return (
    <box style={{ width: "100%", height: "100%", flexDirection: "column" }}>
      {/* Welcome Screen */}
      <box
        style={{
          flexGrow: 1,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
{/* ASCII Art */}
<text><span fg="#e0e0e0">{"   ███████╗   ██████╗   ██████╗    ██████╗   ███████╗   "}</span></text>
<text><span fg="#e0e0e0">{"   ██╔════╝  ██╔═══██╗  ██╔══██╗  ██╔════╝   ██╔════╝   "}</span></text>
<text><span fg="#e0e0e0">{"   █████╗    ██║   ██║  ██████╔╝  ██║  ███╗  █████╗     "}</span></text>
<text><span fg="#e0e0e0">{"   ██╔══╝    ██║   ██║  ██╔══██╗  ██║   ██║  ██╔══╝     "}</span></text>
<text><span fg="#e0e0e0">{"   ██║       ╚██████╔╝  ██║  ██║  ╚██████╔╝  ███████╗   "}</span></text>
<text><span fg="#e0e0e0">{"   ╚═╝        ╚═════╝   ╚═╝  ╚═╝   ╚═════╝   ╚══════╝   "}</span></text>

<box style={{ height: 1 }} />

<text><span fg="#FFFFFF">{"  T H E   O P E N   S O U R C E   A I   C O D I N G   A G E N T  "}</span></text>
        <box style={{ height: 2 }} />

        {/* Auth instructions */}
        <text>
          <span fg="#6B7280"> Welcome! Sign in to start coding with AI. </span>
        </text>
        <box style={{ height: 2 }} />

        <text>
          <span fg={accentColor}> /login </span>
          <span fg="#6B7280"> — Sign in to your existing account</span>
        </text>
        <box style={{ height: 1 }} />
        <text>
          <span fg={accentColor}> /signup </span>
          <span fg="#6B7280"> — Create a new account</span>
        </text>
        <box style={{ height: 2 }} />

        <text>
          <span fg="#4B5563"> Type /login or /signup to get started </span>
        </text>
      </box>

      {/* Input Box */}
      <InputBox
        value={value}
        onChange={onChange}
        onSubmit={onCommand}
        accentColor={accentColor}
      />

      {/* Status Bar */}
      <box
        style={{
          width: "100%",
          height: 2,
          backgroundColor: "#1a1a1a",
          flexDirection: "row",
          justifyContent: "space-between",
          paddingLeft: 2,
          paddingRight: 2,
        }}
      >
        <text>
          <span fg="#4B5563">not signed in</span>
        </text>
        <text>
          <span fg="#6B7280">{themeName}</span>
        </text>
      </box>
    </box>
  );
}
