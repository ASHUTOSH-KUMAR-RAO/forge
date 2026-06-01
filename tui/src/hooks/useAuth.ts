import { useState, useEffect } from "react";
import { readFileSync, existsSync } from "fs";
import { homedir } from "os";
import { join } from "path";

const AUTH_FILE = join(homedir(), ".forge", "auth.json");

interface AuthState {
  loggedIn: boolean;
  token: string | null;
  timestamp?: string;
}

export function useAuth() {
  const [auth, setAuth] = useState<AuthState>({
    loggedIn: false,
    token: null,
  });

  const checkAuth = () => {
    if (existsSync(AUTH_FILE)) {
      try {
        const data = JSON.parse(readFileSync(AUTH_FILE, "utf-8"));
        setAuth({
          loggedIn: data.loggedIn ?? false,
          token: data.code ?? null,
          timestamp: data.timestamp,
        });
      } catch {
        setAuth({ loggedIn: false, token: null });
      }
    } else {
      setAuth({ loggedIn: false, token: null });
    }
  };

  useEffect(() => {
    // Pehli baar check karo
    checkAuth();

    // Har 2 seconds mein check karo — login ke baad auto detect
    const interval = setInterval(checkAuth, 2000);

    return () => clearInterval(interval);
  }, []);

  const logout = () => {
    setAuth({ loggedIn: false, token: null });
  };

  return { auth, logout };
}
