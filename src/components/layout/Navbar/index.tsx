import React, { useState } from "react";
import { Link } from "react-router";
import { themeMode } from "../../../models/state-types/ThemeModeType";
import { useTheme } from "../../../context/ThemeContext";

import styles from "./navbar.module.css";

import darkLogo from "/assets/logo/logoDark.svg";
import lightLogo from "/assets/logo/logoLight.svg";

import barDark from "/assets/icons/bars-solid-dark.svg";
import barLight from "/assets/icons/bars-solid.svg";
import moon from "/assets/icons/moon.svg";
import sun from "/assets/icons/Sun.svg";
import ellipseDark from "/assets/icons/ellipse-dark.svg";
import ellipseLight from "/assets/icons/ellipse-light.svg";

import homeLight from "/assets/icons/home-light.svg";
import homePurple from "/assets/icons/home-purple.svg";
import portfolioLight from "/assets/icons/briefcase-light.svg";
import portfolioPurple from "/assets/icons/briefcase-purple.svg";

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleCursorEffect = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty(
      "--x-cursor-position",
      `${e.clientX - rect.x}`,
    );
    e.currentTarget.style.setProperty(
      "--y-cursor-position",
      `${e.clientY - rect.y}`,
    );
  };

  const isDark = theme === themeMode.dark;

  /** ---- RENDER ---- */
  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.nav}`}>
        {/* Brand */}
        <Link to="/" className={`${styles.nav_anchor} ${styles.brand}`}>
          <img src={isDark ? darkLogo : lightLogo} alt="Logo" />
        </Link>

        {/* Right side */}
        <div className={styles.last_nav}>
          <div style={{ position: "relative" }}>
            <Link
              to="/portfolios"
              className={`${styles.nav_anchor} ${styles.nav_links}`}
            >
              Portfolio
            </Link>
          </div>

          <img
            src={isDark ? sun : moon}
            alt="theme toggle"
            className={`hover_size ${styles.theme_toggler}`}
            onClick={toggleTheme}
          />
          <Link
            to={import.meta.env.VITE_FILES_PATH + "Najam_Uddin_Resume.pdf"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button
              onMouseMove={handleCursorEffect}
              className={styles.resume_btn}
            >
              Resume
            </button>
          </Link>
        </div>

        {/* Mobile Menu */}
        <div className={styles.hamburger_menu}>
          <img
            src={isDark ? barLight : barDark}
            alt="menu"
            className={styles.nav_icon}
            onClick={() => setMenuOpen(!menuOpen)}
          />
          {menuOpen && (
            <div className={styles.mobile_menu_container}>
              <div className={styles.nav_head}>
                <img src={isDark ? darkLogo : lightLogo} alt="logo" />
                <div
                  className={styles.close_nav}
                  onClick={() => setMenuOpen(false)}
                >
                  &times;
                </div>
              </div>

              <Link
                to="/"
                className={styles.nav_anchor}
                onClick={() => setMenuOpen(false)}
              >
                <img
                  className={styles.nav_link_icon}
                  src={isDark ? homeLight : homePurple}
                  alt="Home"
                />
                Home
              </Link>

              <Link
                to="/portfolios"
                className={styles.nav_anchor}
                onClick={() => setMenuOpen(false)}
              >
                <img
                  className={styles.nav_link_icon}
                  src={isDark ? portfolioLight : portfolioPurple}
                  alt="Portfolio"
                />
                Portfolio
              </Link>

              <div className={styles.splitter} />

              {/* Theme Toggle */}
              <div className={styles.mobile_theme_toggle_container}>
                <div className={styles.mobile_theme_toggle_container}>
                  <img
                    src={isDark ? sun : moon}
                    alt="theme"
                    className={`hover_size ${styles.theme_toggler}`}
                  />
                  <p>{isDark ? themeMode.light : themeMode.dark} mode</p>
                </div>
                <div
                  onClick={toggleTheme}
                  className={styles.mobile_theme_toggle}
                  style={{
                    justifyContent: isDark ? "flex-end" : "flex-start",
                  }}
                >
                  <img
                    src={isDark ? ellipseDark : ellipseLight}
                    alt="ellipse"
                  />
                </div>
              </div>

              {/* Resume Button */}
              <Link
                to={import.meta.env.VITE_FILES_PATH + "Najam_Uddin_Resume.pdf"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button
                  style={{ marginTop: "40px" }}
                  onMouseMove={handleCursorEffect}
                  className={styles.resume_btn}
                >
                  Resume
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
