export type ThemeModeType = "dark" | "light";

export type ThemeObject = {
  [key: string]: string;
};

export const themeMode: { [key: string]: ThemeModeType } = {
  dark: "dark",
  light: "light",
};
