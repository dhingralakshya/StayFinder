import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./BookingConfirmationPage.module.css";

function BookingConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { booking } = location.state || {};
  const { listing, checkIn, checkOut, guests, totalPrice, message } = booking || {};

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.REACT_APP_API_URL}/booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          listingId: listing.id,
          startDate: checkIn,
          endDate: checkOut,
          guests: guests,
          message: message,
          totalPrice: totalPrice
        })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Booking failed");
      }
      const bookingData = await res.json();
      navigate("/booking/success", { state: { booking: { ...booking, id: bookingData.id } } });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!listing) {
    return (
      <div className={styles.centeredCard}>
        <div className={styles.card}>
          <h2 className={styles.heading}>No booking data</h2>
          <p className={styles.text}>Please start your booking from a property page.</p>
          <button className={styles.backBtn} onClick={() => navigate("/")}>
            Back to Listings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.centeredCard}>
      <div className={styles.card}>
        <h2 className={styles.heading}>Confirm Your Booking</h2>
        <div className={styles.propertyInfo}>
          <img
            src={listing.imageUrls?.[0] || "https://source.unsplash.com/400x250/?apartment,home"}
            alt={listing.title}
            className={styles.propertyImage}
          />
          <div>
            <h3 className={styles.propertyTitle}>{listing.title}</h3>
            <p className={styles.propertyLocation}>{listing.location}</p>
          </div>
        </div>
        <div className={styles.details}>
          <div>
            <span className={styles.label}>Dates:</span>
            <span>{checkIn} to {checkOut}</span>
          </div>
          <div>
            <span className={styles.label}>Guests:</span>
            <span>{guests}</span>
          </div>
          <div>
            <span className={styles.label}>Total Price:</span>
            <span className={styles.price}>₹{totalPrice?.toLocaleString()}</span>
          </div>
        </div>
        {error && <div className={styles.error}>{error}</div>}
        <button className={styles.confirmBtn} onClick={handleConfirm} disabled={isLoading}>
          {isLoading ? "Booking..." : "Confirm Booking"}
        </button>
        <button className={styles.cancelBtn} onClick={() => navigate(-1)} disabled={isLoading}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default BookingConfirmationPage;
