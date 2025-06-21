import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function isTokenExpired(token) {
  if (!token) return true;
  try {
    const { exp } = jwtDecode(token);
    return exp < Date.now() / 1000;
  } catch {
    return true;
  }
}

function ProtectedRoute() {
  const token = localStorage.getItem("token");
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem("token");
    return <Navigate to="/login?redirect=${encodeURIComponent(location.pathname)}`" replace />;
  }
  return <Outlet />;
}

export default ProtectedRoute;
