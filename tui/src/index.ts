import { createCliRenderer } from "@opentui/core";
import { createRoot, createElement } from "@opentui/react";
import { program as cli } from "@commander-js/extra-typings";
import App from "./components/App";

cli
  .name("forge")
  .description("A terminal-based AI coding agent")
  .version("0.1.0");

cli
  .command("login")
  .description("Sign in via Clerk")
  .action(async () => {
    const { login } = await import("./commands/login");
    await login();
  });

cli
  .command("logout")
  .description("Sign out")
  .action(async () => {
    const { logout } = await import("./commands/logout");
    await logout();
  });

cli
  .command("init")
  .description("Initialize Forge in your project")
  .action(async () => {
    const { init } = await import("./commands/init");
    await init();
  });

// Default — launch TUI
cli.action(async () => {
  const renderer = await createCliRenderer({
    exitOnCtrlC: true,
    useMouse: true,
  });
  createRoot(renderer).render(createElement(App));
});

cli.parse();
