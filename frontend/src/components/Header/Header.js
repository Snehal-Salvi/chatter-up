import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import styles from "./Header.module.css";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={`${styles.navbar}`}>
      <div className={styles.container}>
        <Link className={styles.brand} to="/">
          <img src={logo} alt="chatterup-logo" className={styles.logo} />
          <span className={styles.appName}>Chatter Up</span>
        </Link>
        <div className={styles.toggleButton} onClick={toggleMenu}>
          <span className={styles.toggleIcon}></span>
          <span className={styles.toggleIcon}></span>
          <span className={styles.toggleIcon}></span>
        </div>
        <div
          className={`${styles.navLinks} ${isMenuOpen ? styles.showMenu : ""}`}
        >
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <Link to="/signin">
                <button className={styles.loginButton}>Sign In</button>
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/signup">
                <button className={styles.signUpButton}>Sign Up</button>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
