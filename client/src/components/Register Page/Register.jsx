import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import styles from "./register.module.css";

function Register() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setServerError("");
  };

  const togglePasswordVisibility = () => setPasswordVisible((v) => !v);

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      togglePasswordVisibility();
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!form.password) {
      newErrors.password = "Password is required.";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setServerError("");
    const apiUrl = process.env.REACT_APP_API_URL;
    try {
      const res = await fetch(`${apiUrl}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password
        })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Registration failed");
      }
      const data = await res.json();
      localStorage.setItem("token", data.token);
      const decoded = jwtDecode(data.token);
      if (decoded.role === "host") {
        navigate("/host/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setServerError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <div className={styles.content}>
        <div className={styles.section}>
          <div className={styles.logoContainer}>
            <div className={styles.logoWrapper}>
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="StayFinder Logo"
              >
                <defs>
                  <linearGradient id="stayfinder-gradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#660DD4"/>
                    <stop offset="1" stopColor="#7a5fff"/>
                  </linearGradient>
                </defs>
                <path
                  d="M20 4C12.268 4 6 10.268 6 18C6 28 20 36 20 36C20 36 34 28 34 18C34 10.268 27.732 4 20 4Z"
                  fill="url(#stayfinder-gradient)"
                />
                <circle cx="20" cy="18" r="6" fill="#fff"/>
                <path
                  d="M17 19V17.5C17 16.672 17.672 16 18.5 16H21.5C22.328 16 23 16.672 23 17.5V19"
                  stroke="#660DD4"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <rect x="18" y="19" width="4" height="3" rx="1" fill="#660DD4"/>
              </svg>
            </div>
            <h1 className={styles.logoText}>StayFinder</h1>
          </div>
          <h2 className={styles.title}>Create your account</h2>
          <form onSubmit={handleSubmit} className={isLoading ? styles.formLoading : ""}>
            {serverError && (
              <div className={styles.serverError} role="alert">
                <span>⚠</span>
                {serverError}
              </div>
            )}
            <div className={styles.inputGroup}>
              <label htmlFor="name" className={styles.label}>Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
                disabled={isLoading}
                autoComplete="name"
                autoFocus
              />
              {errors.name && <div className={styles.error}>{errors.name}</div>}
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                disabled={isLoading}
                autoComplete="email"
              />
              {errors.email && <div className={styles.error}>{errors.email}</div>}
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <div className={styles.passwordContainer}>
                <input
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  name="password"
                  className={`${styles.input} ${styles.passwordInput} ${errors.password ? styles.inputError : ""}`}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  disabled={isLoading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className={styles.eye_icon}
                  onClick={togglePasswordVisibility}
                  onKeyDown={handleKeyDown}
                  aria-label={passwordVisible ? "Hide password" : "Show password"}
                  disabled={isLoading}
                  tabIndex={0}
                >
                  {passwordVisible ? (
                    <VisibilityOffOutlinedIcon className={styles.icon} />
                  ) : (
                    <VisibilityOutlinedIcon className={styles.icon} />
                  )}
                </button>
              </div>
              {errors.password && <div className={styles.error}>{errors.password}</div>}
            </div>
            <button
              type="submit"
              className={`${styles.signInButton} ${isLoading ? styles.loading : ""}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className={styles.spinner} />
                  Creating Account...
                </>
              ) : (
                "Register"
              )}
            </button>
          </form>
          <div className={styles.account}>
            <span>Already have an account? </span>
            <Link to="/login">Sign In</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
