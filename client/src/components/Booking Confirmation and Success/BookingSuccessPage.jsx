import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./BookingSuccessPage.module.css";

function BookingSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { booking } = location.state || {};
  const { listing, checkIn, checkOut, guests, totalPrice } = booking || {};

  return (
    <div className={styles.centeredCard}>
      <div className={styles.card}>
        <div className={styles.icon}>🎉</div>
        <h2 className={styles.heading}>Booking Confirmed!</h2>
        <div className={styles.details}>
          <div>
            <span className={styles.label}>Property:</span>
            <span>{listing?.title}</span>
          </div>
          <div>
            <span className={styles.label}>Location:</span>
            <span>{listing?.location}</span>
          </div>
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
        <button className={styles.backBtn} onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default BookingSuccessPage;
