import { unlinkSync, existsSync } from "fs";
import { homedir } from "os";
import { join } from "path";

const AUTH_FILE = join(homedir(), ".forge", "auth.json");

export async function logout() {
  if (existsSync(AUTH_FILE)) {
    unlinkSync(AUTH_FILE);
    console.log("\n  ✅ Signed out successfully!\n");
  } else {
    console.log("\n  ⚠️  You are not signed in.\n");
  }
}
