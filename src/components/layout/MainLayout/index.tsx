import { useEffect, type ReactNode } from "react";
import Cursor from "../Cursor";
import {
  themeMode,
  type ThemeObject,
} from "../../../models/state-types/ThemeModeType";
import { useTheme } from "../../../context/ThemeContext";

const darkTheme: ThemeObject = {
  "--bg-primary": "#1E1E1E",
  "--text-primary": "#F1F1F1",
  "--text-secondary": "#B2B2B2",
  "--bg-navbar": "#000000",
  "--bg-secondary": "#282828",
  "--bg-alternative": "#4f4f4f",
  "--box-background": "#4f4f4f",
  "--box-text": "#F1F1F1",
  "--bg-popup": "#4f4f4f",
  "--bg-icon-container": "#f2f2f2",
  "--bg-card": "#4f4f4f",
};

const lightTheme: ThemeObject = {
  "--bg-primary": "#ffffff",
  "--text-primary": "#232E35",
  "--text-secondary": "#656D72",
  "--bg-navbar": "#f0f0f0",
  "--bg-secondary": "#FBFBFB",
  "--bg-alternative": "#FBFBFB",
  "--box-background": "#eae6fe",
  "--box-text": "#7e74f1",
  "--bg-popup": "#ffffff",
  "--bg-icon-container": "#eae6fe",
  "--bg-card": "#ffffff",
};

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { theme: currentTheme } = useTheme();

  useEffect(() => {
    const root = document.documentElement;
    const theme = currentTheme === themeMode.light ? lightTheme : darkTheme;

    Object.entries(theme).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [currentTheme]);

  return (
    <div className={currentTheme}>
      <Cursor />
      {children}
    </div>
  );
};

export default MainLayout;
