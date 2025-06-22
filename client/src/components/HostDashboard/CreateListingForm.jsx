import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageUpload from "../ImageKitUtility";
import styles from "./CreateListingForm.module.css";

function CreateListingForm() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    imageUrls: [] // Array for multiple images
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  // Called when an image is uploaded via ImageKit
  const handleImageUpload = (url) => {
    setForm((prev) => ({
      ...prev,
      imageUrls: [...prev.imageUrls, url]
    }));
  };

  const handleRemoveImage = (idx) => {
    setForm((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      // if (!form.imageUrls.length) {
      //   setError("Please upload at least one image for your listing.");
      //   setIsLoading(false);
      //   return;
      // }
      const imagesToSend = form.imageUrls.length
        ? form.imageUrls
        : ["https://ik.imagekit.io/ejzfsxdp8l/seedPhoto1_xad19yf6X9.avif"];
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.REACT_APP_API_URL}/listing`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          imageUrls: imagesToSend,
          price: Number(form.price)
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to create listing");
      }
      navigate("/host/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.formWrapper}>
      <h2 className={styles.heading}>Add New Listing</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={styles.error}>{error}</div>}
        <div className={styles.inputGroup}>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
            required
            className={styles.input}
            placeholder="e.g. Cozy Apartment in City Center"
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            className={styles.input}
            rows={3}
            placeholder="Describe your property..."
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="price">Price per night (₹)</label>
          <input
            id="price"
            name="price"
            type="number"
            min="1"
            value={form.price}
            onChange={handleChange}
            required
            className={styles.input}
            placeholder="e.g. 1500"
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="location">Location</label>
          <input
            id="location"
            name="location"
            type="text"
            value={form.location}
            onChange={handleChange}
            required
            className={styles.input}
            placeholder="e.g. New Delhi"
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Listing Images</label>
          <ImageUpload onUpload={handleImageUpload} />
          {form.imageUrls.length > 0 && (
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 10 }}>
              {form.imageUrls.map((url, idx) => (
                <div key={idx} style={{ position: "relative" }}>
                  <img
                    src={url}
                    alt={`Preview ${idx + 1}`}
                    style={{ width: 120, borderRadius: 8, border: "1px solid #eee" }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    style={{
                      position: "absolute",
                      top: 2,
                      right: 2,
                      background: "#e53e3e",
                      color: "#fff",
                      border: "none",
                      borderRadius: "50%",
                      width: 22,
                      height: 22,
                      cursor: "pointer",
                      fontWeight: "bold"
                    }}
                    aria-label="Remove image"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          type="submit"
          className={styles.submitBtn}
          disabled={isLoading}
        >
          {isLoading ? "Adding..." : "Add Listing"}
        </button>
      </form>
    </div>
  );
}

export default CreateListingForm;
