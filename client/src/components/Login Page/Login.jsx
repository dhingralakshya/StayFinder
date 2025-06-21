import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import styles from "./login.module.css";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const redirect = new URLSearchParams(location.search).get("redirect");
  const apiUrl = process.env.REACT_APP_API_URL;

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      togglePasswordVisibility();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: ""
      }));
    }
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!formData.password.trim()) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setErrorMessage("");
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed. Please check your credentials.");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      const decoded = jwtDecode(data.token);

      if (redirect) {
        navigate(redirect, { replace: true });
      } else if (decoded.role === "host") {
        navigate("/host/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setErrorMessage(
        err.message || "Login failed. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSignIn(e);
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
          <div className={styles.welcomeText}>
            <h2>Welcome Back</h2>
            <p>Sign in to your StayFinder account</p>
          </div>

          <form onSubmit={handleFormSubmit} className={styles.loginForm}>
            {errorMessage && (
              <div className={styles.error} role="alert">
                <span className={styles.errorIcon}>⚠</span>
                {errorMessage}
              </div>
            )}
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`${styles.input} ${fieldErrors.email ? styles.inputError : ""}`}
                placeholder="Enter your email"
                disabled={isLoading}
                autoComplete="email"
              />
              {fieldErrors.email && (
                <span className={styles.fieldError}>{fieldErrors.email}</span>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <div className={styles.passwordContainer}>
                <input
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`${styles.input} ${styles.passwordInput} ${fieldErrors.password ? styles.inputError : ""}`}
                  placeholder="Enter your password"
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className={styles.eyeIcon}
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
              {fieldErrors.password && (
                <span className={styles.fieldError}>{fieldErrors.password}</span>
              )}
              <Link to="/forgot" className={styles.forgotLink}>
                Forgot Password?
              </Link>
            </div>
            <button
              type="submit"
              className={`${styles.signInButton} ${isLoading ? styles.loading : ""}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className={styles.spinner} />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className={styles.signUpPrompt}>
            <span>Don&apos;t have an account? </span>
            <Link to="/register" className={styles.signUpLink}>
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
