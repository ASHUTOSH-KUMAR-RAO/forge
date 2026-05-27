import { useState, useEffect } from "react";
import { readFileSync, existsSync } from "fs";
import { homedir } from "os";
import { join } from "path";

const AUTH_FILE = join(homedir(), ".forge", "auth.json");

interface AuthState {
  loggedIn: boolean;
  token: string | null;
}

export function useAuth() {
  const [auth, setAuth] = useState<AuthState>({
    loggedIn: false,
    token: null,
  });

  useEffect(() => {
    if (existsSync(AUTH_FILE)) {
      const data = JSON.parse(readFileSync(AUTH_FILE, "utf-8"));
      setAuth({ loggedIn: true, token: data.token });
    }
  }, []);

  const logout = () => {
    setAuth({ loggedIn: false, token: null });
  };

  return { auth, logout };
}
