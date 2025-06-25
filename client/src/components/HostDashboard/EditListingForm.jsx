import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ImageUpload from "../ImageKitUtility";
import styles from "./CreateListingForm.module.css";

function EditListingForm({ listingId, onClose }) {
  const id = listingId;
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${process.env.REACT_APP_API_URL}/listing/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch listing");
        const data = await res.json();
        setForm({
          title: data.title,
          description: data.description,
          price: data.price,
          location: data.location,
          imageUrls: data.imageUrls || [],
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleImageUpload = (url) => {
    setForm((prev) => ({
      ...prev,
      imageUrls: [...prev.imageUrls, url],
    }));
  };

  const handleRemoveImage = (idx) => {
    setForm((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.REACT_APP_API_URL}/listing/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to update listing");
      }
      if (res.ok) onClose(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.formWrapper}>
        <div className={styles.heading}>Loading listing...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.formWrapper}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  if (!form) return null;

  return (
    <div className={styles.formWrapper}>
      <h2 className={styles.heading}>Edit Listing</h2>
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
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Update Listing"}
        </button>
        <button type="button" className={styles.cancelButton} onClick={() => onClose(false)}>Cancel</button>
      </form>
    </div>
  );
}

export default EditListingForm;
