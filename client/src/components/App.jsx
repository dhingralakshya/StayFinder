import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login Page/Login";
import Register from "./Register Page/Register";
// import ProtectedRoute from "./ProtectedRoute";
import ListingsPage from "./Listing/ListingsPage";
import ListingDetailPage from "./Listing Detail/ListingDetailPage";
import HostDashboard from "./HostDashboard/HostDashboard";
import CreateListingForm from "./HostDashboard/CreateListingForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ListingsPage />} />
        <Route path="/listing/:id" element={<ListingDetailPage />} />
        <Route path="/host/dashboard" element={<HostDashboard />} />
        <Route path="/host/listing/new" element={<CreateListingForm />} />
      </Routes>
    </Router>
  );
}

export default App;
