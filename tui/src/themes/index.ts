import { midnight } from "./midnight";
import { nord } from "./nord";
import { dracula } from "./dracula";
import { monokai } from "./monokai";

export const themes = {
  midnight,
  nord,
  dracula,
  monokai,
};

export type ThemeName = keyof typeof themes;
export type Theme = typeof midnight;

export const defaultTheme: ThemeName = "midnight";
