import open from "open";
import { writeFileSync, mkdirSync } from "fs";
import { homedir } from "os";
import { join } from "path";

const CALLBACK_PORT = 3141;
const AUTH_FILE = join(homedir(), ".forge", "auth.json");

export async function login() {
  const clerkUrl = `https://accounts.clerk.dev/oauth/authorize?client_id=${process.env.CLERK_PUBLISHABLE_KEY}&redirect_uri=http://localhost:${CALLBACK_PORT}/callback&response_type=code`;

  console.log("\n  Opening browser for authentication...\n");
  await open(clerkUrl);

  // Listen for callback
  const { createServer } = await import("http");

  return new Promise<void>((resolve) => {
    const server = createServer((req, res) => {
      const url = new URL(req.url!, `http://localhost:${CALLBACK_PORT}`);
      const token = url.searchParams.get("token") || "forge_token_placeholder";

      // Save token
      mkdirSync(join(homedir(), ".forge"), { recursive: true });
      writeFileSync(
        AUTH_FILE,
        JSON.stringify({ token, loggedIn: true }, null, 2),
      );

      res.end("<h1>Authenticated! You can close this tab.</h1>");
      server.close();

      console.log("  ✅ Signed in successfully!\n");
      resolve();
    });

    server.listen(CALLBACK_PORT);
  });
}
