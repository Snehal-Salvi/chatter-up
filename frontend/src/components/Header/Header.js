import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import styles from "./Header.module.css";
import { faRightFromBracket, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Header({ isLoggedIn, userName, handleLogout }) {
  // State for toggling the menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to toggle the menu visibility
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle sign-out button click
  const handleSignOut = () => {
    handleLogout();
    setIsMenuOpen(false); // Close the menu after logout
  };

  return (
    <nav className={`${styles.navbar}`}>
      <div className={styles.container}>
        {/* Logo and brand name */}
        <Link className={styles.brand} to="/">
          <img src={logo} alt="chatterup-logo" className={styles.logo} />
          <span className={styles.appName}>Chatter Up</span>
        </Link>

        {/* Hamburger menu button */}
        <div className={styles.toggleButton} onClick={toggleMenu}>
          <span className={styles.toggleIcon}></span>
          <span className={styles.toggleIcon}></span>
          <span className={styles.toggleIcon}></span>
        </div>

        {/* Navigation links */}
        <div className={`${styles.navLinks} ${isMenuOpen ? styles.showMenu : ""}`}>
          <ul className={styles.navList}>
            {isLoggedIn ? ( // Display user-specific links if logged in
              <>
                <li className={styles.navItem}>
                  {/* Welcome message with user's name */}
                  <span className={styles.welcomeUser}>
                    <FontAwesomeIcon icon={faUser} /> Welcome, {userName}
                  </span>
                </li>
                <li className={styles.navItem}>
                  {/* Logout button */}
                  <button className={styles.logoutButton} onClick={handleSignOut}>
                    Logout <FontAwesomeIcon icon={faRightFromBracket} />
                  </button>
                </li>
              </>
            ) : ( // Display login and signup buttons if not logged in
              <>
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
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
