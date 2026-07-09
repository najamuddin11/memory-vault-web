import { memo } from "react";
import { Link } from "react-router";
import styles from "./footer.module.css";

import git from "/assets/icons/github.svg";
import linkedin from "/assets/icons/Linkedin.svg";

const socialLinks = [
  { id: 1, icon: git, url: "https://github.com/najamuddin11" },
  {
    id: 2,
    icon: linkedin,
    url: "https://linkedin.com/in/najam-uddin-6641741ab",
  },
];

const Footer = () => (
  <footer className="container">
    <div className={styles.footer_container}>
      <div className={styles.footer_row}>
        {socialLinks.map(({ id, icon, url }) => (
          <Link
            key={id}
            to={url}
            className={styles.footer_icons_links}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit ${url}`}
          >
            <img src={icon} alt="social icon" loading="lazy" />
          </Link>
        ))}
      </div>
      <p>© {new Date().getFullYear()} - Najam Uddin</p>
    </div>
  </footer>
);

export default memo(Footer);
