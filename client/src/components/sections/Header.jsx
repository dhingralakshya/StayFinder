import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import styles from "./Header.module.css";

function getUserFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    if (decoded.exp && decoded.exp < Date.now() / 1000) {
      localStorage.removeItem("token");
      return null;
    }
    return decoded;
  } catch {
    localStorage.removeItem("token");
    return null;
  }
}

function Header() {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const user = getUserFromToken();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setShowDropdown(false);
    navigate("/");
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.logo} onClick={() => navigate("/")}>
          <span className={styles.logoIcon}>🏠</span>
          <span className={styles.logoText}>StayFinder</span>
        </div>
        <nav className={styles.nav}>
          {!user && (
            <>
              <button
                className={styles.navBtn}
                onClick={() => navigate("/register?role=host")}
              >
                Become a Host
              </button>
              <button
                className={styles.loginBtn}
                onClick={() => navigate("/login")}
              >
                Log in
              </button>
            </>
          )}
          {user && user.role !== "host" && (
            <button
              className={styles.navBtn}
              onClick={async () => {
                try {
                  const token = localStorage.getItem("token");
                  const res = await fetch(
                    `${process.env.REACT_APP_API_URL}/users/${user.id}`,
                    {
                      method: "PATCH",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({ role: "host" }),
                    }
                  );
                  if (!res.ok) {
                    throw new Error("Failed to become a host.");
                  }
                  const data = await res.json();
                  if (data.token) {
                    localStorage.setItem("token", data.token);
                  }
                  navigate("/host/dashboard");
                } catch (err) {
                  alert(err.message);
                }
              }}
            >
              Become a Host
            </button>
          )}
          {user && (
            <div className={styles.profileWrapper}>
              <button
                className={styles.profileBtn}
                onClick={() => setShowDropdown((prev) => !prev)}
                aria-label="Profile menu"
              >
                <span className={styles.avatar}>
                  <AccountBoxIcon />
                </span>
                <span className={styles.caret}>▼</span>
              </button>
              {showDropdown && (
                <div className={styles.dropdown}>
                  <div className={styles.dropdownItem} onClick={handleLogout}>
                    Logout
                  </div>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
