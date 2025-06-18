import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login Page/Login";
import Register from "./Register Page/Register";
// import ProtectedRoute from "./ProtectedRoute";
import ListingsPage from "./Listing/ListingsPage";
import ListingDetailPage from "./Listing Detail/ListingDetailPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ListingsPage />} />
        <Route path="/listing/:id" element={<ListingDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;
