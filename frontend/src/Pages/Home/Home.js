import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import styles from "./Home.module.css";

function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.textContent}>
        <h1 className={styles.heading}>Connect Globally with Ease</h1>
        <p className={styles.subtext}>
          Join ChatterUp and start conversations with friends and new
          acquaintances around the globe.
        </p>
        <Link to="/chat" className={styles.startButton}>
          Jump In{" "}
          <FontAwesomeIcon icon={faPaperPlane} className={styles.messageIcon} />
        </Link>
      </div>
    </div>
  );
}

export default Home;
