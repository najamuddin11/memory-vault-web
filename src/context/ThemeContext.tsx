import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { themeMode, type ThemeModeType } from "../models/state-types/ThemeModeType";

const THEME_STORAGE_KEY = "theme";

const isValidTheme = (theme: string | null): theme is ThemeModeType =>
  theme === themeMode.dark || theme === themeMode.light;

const getInitialTheme = (): ThemeModeType => {
  if (typeof window === "undefined") return themeMode.dark;
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  return isValidTheme(stored) ? stored : themeMode.dark;
};

interface ThemeContextValue {
  theme: ThemeModeType;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeModeType>(getInitialTheme);

  // Persist whenever it changes (also covers first mount so a fresh
  // browser gets "dark" written on first visit, matching old behavior).
  useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === themeMode.light ? themeMode.dark : themeMode.light));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
};
