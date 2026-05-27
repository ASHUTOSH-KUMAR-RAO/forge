import { useState } from "react";
import { themes, defaultTheme, type ThemeName, type Theme } from "../themes";

export function useTheme() {
  const [themeName, setThemeName] = useState<ThemeName>(defaultTheme);

  const theme: Theme = themes[themeName];

  const switchTheme = (name: ThemeName) => {
    if (themes[name]) {
      setThemeName(name);
    } else {
      console.error(`Theme "${name}" not found!`);
    }
  };

  return {
    theme,
    themeName,
    switchTheme,
    availableThemes: Object.keys(themes) as ThemeName[],
  };
}
