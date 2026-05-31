import open from "open";
import { writeFileSync, mkdirSync } from "fs";
import { homedir } from "os";
import { join } from "path";
import { createServer } from "http";
import { config } from "dotenv";

// Load .env.local
config({ path: ".env.local" });
config({ path: "../.env.local" });

const CALLBACK_PORT = 3141;
const AUTH_FILE = join(homedir(), ".forge", "auth.json");
const FORGE_DIR = join(homedir(), ".forge");

function generateCodeVerifier(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Buffer.from(array)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Buffer.from(digest)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

export async function login() {
  const clientId = process.env.CLERK_OAUTH_CLIENT_ID ?? "";
  const authorizeUrl = process.env.CLERK_AUTHORIZE_URL ?? "";

  if (!clientId || !authorizeUrl) {
    console.log(
      "\n  ❌ CLERK_OAUTH_CLIENT_ID or CLERK_AUTHORIZE_URL not found in .env.local\n",
    );
    return;
  }

  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const redirectUri = `http://localhost:${CALLBACK_PORT}/callback`;

  const clerkUrl =
    `${authorizeUrl}` +
    `?response_type=code` +
    `&client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&code_challenge=${codeChallenge}` +
    `&code_challenge_method=S256` +
    `&scope=profile+email+offline_access`;

  console.log("\n  Opening browser for authentication...\n");
  await open(clerkUrl);

  return new Promise<void>((resolve, reject) => {
    const server = createServer(async (req, res) => {
      try {
        const url = new URL(req.url!, `http://localhost:${CALLBACK_PORT}`);
        const code = url.searchParams.get("code");

        if (!code) {
          res.end("<h1>❌ Authentication failed. No code received.</h1>");
          server.close();
          reject(new Error("No code received"));
          return;
        }

        // Save auth data
        mkdirSync(FORGE_DIR, { recursive: true });
        writeFileSync(
          AUTH_FILE,
          JSON.stringify(
            {
              code,
              codeVerifier,
              clientId,
              loggedIn: true,
              timestamp: new Date().toISOString(),
            },
            null,
            2,
          ),
        );

        res.end(`
          <html>
            <body style="font-family: monospace; background: #0f0f0f; color: #f9fafb; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0;">
              <div style="text-align: center;">
                <h1 style="color: #7C3AED;">◆ Forge</h1>
                <p>✅ Authenticated successfully!</p>
                <p style="color: #6B7280;">You can close this tab and return to the terminal.</p>
              </div>
            </body>
          </html>
        `);

        server.close();
        console.log("  ✅ Signed in successfully!\n");
        resolve();
      } catch (e) {
        res.end("<h1>❌ Authentication failed.</h1>");
        server.close();
        reject(e);
      }
    });

    server.listen(CALLBACK_PORT, () => {
      console.log(`  Waiting for authentication on port ${CALLBACK_PORT}...\n`);
    });

    // 5 minute timeout
    setTimeout(
      () => {
        server.close();
        reject(new Error("Authentication timed out"));
      },
      5 * 60 * 1000,
    );
  });
}

/**
 * PKCE — Proof Key for Code Exchange
 *
 * WHY WE NEED IT:
 * Forge is a terminal/CLI app — unlike web apps, it cannot securely store
 * a "client_secret". If we hardcoded a secret, anyone could extract it
 * from the binary. PKCE solves this without needing any secret.
 *
 * HOW IT WORKS:
 *
 * Step 1 — Generate a random secret (codeVerifier)
 *          codeVerifier = "random_string_abc123xyz..."
 *          (only lives in memory, never sent to server)
 *
 * Step 2 — Hash the secret (codeChallenge)
 *          codeChallenge = SHA256(codeVerifier)
 *          (this is what we send to the auth server)
 *
 * Step 3 — Open browser with ONLY the hash
 *          URL contains: code_challenge=SHA256_hash
 *          (even if someone intercepts the URL, they only get the hash)
 *
 * Step 4 — User logs in via Clerk in browser
 *          Clerk returns a short-lived "code" to our callback server
 *
 * Step 5 — We exchange code + original secret for a token
 *          We send: code + codeVerifier (original secret)
 *          Clerk verifies: SHA256(codeVerifier) == codeChallenge?
 *          Match → Token issued! ✅
 *
 * SECURITY:
 * - codeVerifier never leaves the app
 * - codeChallenge (hash) is useless without the original verifier
 * - Even if "code" is intercepted, attacker cannot get token without verifier
 * - Perfect for CLI/terminal apps with no client_secret
 */
