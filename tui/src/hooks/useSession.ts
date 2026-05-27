import { useState } from "react";

interface Session {
  id: string;
  name: string;
  createdAt: Date;
  messages: Message[];
}

interface Message {
  role: "user" | "forge";
  content: string;
}

export function useSession() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);

  const newSession = (name?: string) => {
    const session: Session = {
      id: crypto.randomUUID(),
      name: name ?? `Session ${sessions.length + 1}`,
      createdAt: new Date(),
      messages: [],
    };
    setSessions((prev) => [...prev, session]);
    setCurrentSession(session);
    return session;
  };

  const switchSession = (id: string) => {
    const session = sessions.find((s) => s.id === id);
    if (session) setCurrentSession(session);
  };

  const renameSession = (name: string) => {
    if (!currentSession) return;
    setSessions((prev) =>
      prev.map((s) => (s.id === currentSession.id ? { ...s, name } : s)),
    );
    setCurrentSession((prev) => (prev ? { ...prev, name } : null));
  };

  const deleteSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (currentSession?.id === id) setCurrentSession(null);
  };

  const addMessage = (message: Message) => {
    if (!currentSession) return;
    setSessions((prev) =>
      prev.map((s) =>
        s.id === currentSession.id
          ? { ...s, messages: [...s.messages, message] }
          : s,
      ),
    );
    setCurrentSession((prev) =>
      prev ? { ...prev, messages: [...prev.messages, message] } : null,
    );
  };

  return {
    sessions,
    currentSession,
    newSession,
    switchSession,
    renameSession,
    deleteSession,
    addMessage,
  };
}
