import { writeFileSync, mkdirSync, existsSync } from "fs";
import { homedir } from "os";
import { join } from "path";

const FORGE_DIR = join(homedir(), ".forge");
const CONFIG_FILE = join(FORGE_DIR, "config.json");

export async function init() {
  if (existsSync(CONFIG_FILE)) {
    console.log("\n  ⚡ Forge already initialized!\n");
    console.log(`  Config: ${CONFIG_FILE}\n`);
    return;
  }

  console.log("\n  Initializing Forge...\n");

  // Create ~/.forge/ directory
  mkdirSync(FORGE_DIR, { recursive: true });

  // Default config
  const defaultConfig = {
    version: "0.1.0",
    model: "llama-3.3-70b",
    temperature: 0.7,
    theme: "midnight",
    compactMode: false,
    timestamps: false,
    verbose: false,
  };

  writeFileSync(CONFIG_FILE, JSON.stringify(defaultConfig, null, 2));

  console.log("  ✅ Forge initialized successfully!\n");
  console.log(`  Config saved to: ${CONFIG_FILE}`);
  console.log("  Run `forge login` to authenticate.\n");
}
