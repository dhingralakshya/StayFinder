import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";

function Header() {
  const navigate=useNavigate();
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>🏠</span>
          <span className={styles.logoText}>StayFinder</span>
        </div>
        
        <nav className={styles.nav}>
          <button className={styles.navBtn} onClick={()=> navigate("/login")}>Become a Host</button>
          <button className={styles.loginBtn} onClick={()=> navigate("/login")}>Log in</button>
        </nav>
      </div>
    </header>
  );
}

export default Header;