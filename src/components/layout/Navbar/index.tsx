import React, { useState } from "react";
import { Link } from "react-router";
import { themeMode } from "../../../models/state-types/ThemeModeType";
import { useTheme } from "../../../context/ThemeContext";

import Dropdown from "./Dropdown";
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
import aboutPurple from "/assets/icons/about-purple.svg";
import aboutLight from "/assets/icons/about-light.svg";
import portfolioLight from "/assets/icons/briefcase-light.svg";
import portfolioPurple from "/assets/icons/briefcase-purple.svg";
import contactLight from "/assets/icons/phone-call-light.svg";
import contactPurple from "/assets/icons/phone-call-purple.svg";
import downDark from "/assets/icons/chevron-down-light.svg";
import downLight from "/assets/icons/chevron-down-dark.svg";
import upDark from "/assets/icons/chevron-up-dark.svg";
import upLight from "/assets/icons/chevron-up-light.svg";

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownItems = [
    { id: 1, title: "Services", link: "#services" },
    { id: 2, title: "Work Experience", link: "#work" },
    { id: 3, title: "Education and Skills", link: "#education" },
  ];

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
        <a
          href="/"
          className={`${styles.nav_anchor} ${styles.brand}`}
          onMouseOver={() => setDropdownOpen(false)}
        >
          <img src={isDark ? darkLogo : lightLogo} alt="Logo" />
        </a>

        {/* Desktop Nav Links */}
        <div className={styles.nav_items_container}>
          <a
            href="/"
            className={styles.nav_anchor}
            onMouseOver={() => setDropdownOpen(false)}
          >
            Home
          </a>

          <div
            className={styles.nav_dropdown}
            onMouseOver={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <Link to="" className={styles.nav_anchor}>
              About
            </Link>
            {dropdownOpen && (
              <Dropdown
                items={dropdownItems}
                onClick={() => setDropdownOpen(false)}
              />
            )}
          </div>

          <a
            href="#portfolio"
            className={styles.nav_anchor}
            onMouseOver={() => setDropdownOpen(false)}
          >
            Portfolio
          </a>
          <a
            href="#contact"
            className={styles.nav_anchor}
            onMouseOver={() => setDropdownOpen(false)}
          >
            Contact
          </a>
        </div>

        {/* Right side */}
        <div
          className={styles.last_nav}
          onMouseOver={() => setDropdownOpen(false)}
        >
          <img
            src={isDark ? sun : moon}
            alt="theme toggle"
            className={`hover_size ${styles.theme_toggler}`}
            onClick={toggleTheme}
          />
          <Link
            to={import.meta.env.VITE_FILES_PATH + "Najam_Uddin_Resume.pdf"}
            download
          >
            <button
              onMouseMove={handleCursorEffect}
              className={styles.resume_btn}
              onMouseOver={() => setDropdownOpen(false)}
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

              <a
                href="/"
                className={styles.nav_anchor}
                onClick={() => setMenuOpen(false)}
              >
                <img
                  className={styles.nav_link_icon}
                  src={isDark ? homeLight : homePurple}
                  alt="Home"
                />
                Home
              </a>

              {/* Mobile Dropdown */}
              <div
                className={styles.nav_dropdown}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <a href="#about" className={styles.nav_anchor}>
                  <img
                    className={styles.nav_link_icon}
                    src={isDark ? aboutLight : aboutPurple}
                    alt="About"
                  />
                  About
                </a>
                <img
                  src={
                    dropdownOpen
                      ? isDark
                        ? upLight
                        : upDark
                      : isDark
                        ? downDark
                        : downLight
                  }
                  alt="toggle"
                />
              </div>

              {dropdownOpen && (
                <Dropdown
                  items={dropdownItems}
                  onClick={() => setMenuOpen(false)}
                />
              )}

              <a
                href="#portfolio"
                className={styles.nav_anchor}
                onClick={() => setMenuOpen(false)}
              >
                <img
                  className={styles.nav_link_icon}
                  src={isDark ? portfolioLight : portfolioPurple}
                  alt="Portfolio"
                />
                Portfolio
              </a>

              <a
                href="#contact"
                className={styles.nav_anchor}
                onClick={() => setMenuOpen(false)}
              >
                <img
                  className={styles.nav_link_icon}
                  src={isDark ? contactLight : contactPurple}
                  alt="Contact"
                />
                Contact
              </a>

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
