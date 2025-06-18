import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/style.css";
import styles from "./BookingCard.module.css";

function BookingCard({ listing }) {
  const [form, setForm] = useState({
    checkIn: null,
    checkOut: null,
    guests: 1,
    message: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedRange, setSelectedRange] = useState();
  const navigate = useNavigate();

  // Calculate nights and total price
  const getNights = () => {
    if (!form.checkIn || !form.checkOut) return 0;
    const start = new Date(form.checkIn);
    const end = new Date(form.checkOut);
    const diff = (end - start) / (1000 * 60 * 60 * 24);
    return diff > 0 ? diff : 0;
  };

  const nights = getNights();
  const totalPrice = nights * listing.price;

  // Format date for display
  const formatDate = (date) => {
    if (!date) return "";
    return format(date, 'MMM dd');
  };

  // Handle date range selection
  const handleRangeSelect = (range) => {
    setSelectedRange(range);
    if (range?.from && range?.to) {
      setForm({
        ...form,
        checkIn: range.from,
        checkOut: range.to
      });
      setShowDatePicker(false);
    } else if (range?.from) {
      setForm({
        ...form,
        checkIn: range.from,
        checkOut: null
      });
    }
    setError("");
  };

  const handleGuestChange = (increment) => {
    const newGuests = form.guests + increment;
    if (newGuests >= 1 && newGuests <= 16) {
      setForm({ ...form, guests: newGuests });
    }
  };

  const handleMessageChange = (e) => {
    setForm({ ...form, message: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (nights === 0) {
      setError("Please select valid dates");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate(`/login?redirect=/listing/${listing.id}`);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          listingId: listing.id,
          checkIn: form.checkIn.toISOString().split('T')[0],
          checkOut: form.checkOut.toISOString().split('T')[0],
          guests: form.guests,
          message: form.message,
          totalPrice: totalPrice
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Booking failed");
      }

      navigate(`/booking-confirmation`, { 
        state: { 
          booking: { 
            ...form, 
            checkIn: form.checkIn.toISOString().split('T')[0],
            checkOut: form.checkOut.toISOString().split('T')[0],
            listing, 
            totalPrice, 
            nights 
          } 
        }
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDatePicker && !event.target.closest(`.${styles.dateSection}`)) {
        setShowDatePicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDatePicker]);

  return (
    <div className={styles.bookingCard}>
      <div className={styles.header}>
        <div className={styles.priceRow}>
          <span className={styles.price}>₹{listing.price?.toLocaleString()}</span>
          <span className={styles.night}>/ night</span>
        </div>
        {listing.rating && (
          <div className={styles.rating}>
            ⭐ {listing.rating} ({listing.reviewCount || 0} reviews)
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Date Selector with React DayPicker */}
        <div className={styles.dateSection}>
          <div 
            className={styles.dateInputs}
            onClick={() => setShowDatePicker(!showDatePicker)}
          >
            <div className={styles.dateInput}>
              <label>Check-in</label>
              <div className={styles.dateValue}>
                {form.checkIn ? formatDate(form.checkIn) : "Add date"}
              </div>
            </div>
            <div className={styles.dateDivider}></div>
            <div className={styles.dateInput}>
              <label>Check-out</label>
              <div className={styles.dateValue}>
                {form.checkOut ? formatDate(form.checkOut) : "Add date"}
              </div>
            </div>
          </div>
          
          {showDatePicker && (
            <div className={styles.datePickerWrapper}>
              <DayPicker
                mode="range"
                selected={selectedRange}
                onSelect={handleRangeSelect}
                disabled={{ before: new Date() }}
                numberOfMonths={2}
                className={styles.dayPicker}
                modifiers={{
                  booked: [] // Add your booked dates array here
                }}
                modifiersStyles={{
                  booked: { 
                    backgroundColor: '#fecaca', 
                    color: '#dc2626',
                    textDecoration: 'line-through'
                  }
                }}
                footer={
                  selectedRange?.from && selectedRange?.to ? (
                    <div className={styles.datePickerFooter}>
                      <span>
                        {nights} night{nights > 1 ? 's' : ''} selected
                      </span>
                      <button 
                        type="button"
                        onClick={() => setShowDatePicker(false)}
                        className={styles.datePickerClose}
                      >
                        Done
                      </button>
                    </div>
                  ) : (
                    <p className={styles.datePickerHint}>
                      Select check-in and check-out dates
                    </p>
                  )
                }
              />
            </div>
          )}
        </div>

        {/* Guest Selector */}
        <div className={styles.guestSection}>
          <div className={styles.guestSelector}>
            <div className={styles.guestInfo}>
              <label>Guests</label>
              <div className={styles.guestCount}>
                {form.guests} guest{form.guests > 1 ? 's' : ''}
              </div>
            </div>
            <div className={styles.guestControls}>
              <button
                type="button"
                className={styles.guestBtn}
                onClick={() => handleGuestChange(-1)}
                disabled={form.guests <= 1}
              >
                <svg width="12" height="12" viewBox="0 0 12 12">
                  <path d="M2 6h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
              <span className={styles.guestNumber}>{form.guests}</span>
              <button
                type="button"
                className={styles.guestBtn}
                onClick={() => handleGuestChange(1)}
                disabled={form.guests >= 16}
              >
                <svg width="12" height="12" viewBox="0 0 12 12">
                  <path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Message */}
        <div className={styles.inputGroup}>
          <label htmlFor="message">Message to Host (optional)</label>
          <textarea
            id="message"
            name="message"
            value={form.message}
            onChange={handleMessageChange}
            rows="3"
            placeholder="Tell the host about your trip..."
            className={styles.textarea}
          />
        </div>

        {/* Error Display */}
        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        {/* Price Summary */}
        {nights > 0 && (
          <div className={styles.summary}>
            <div className={styles.summaryRow}>
              <span>₹{listing.price?.toLocaleString()} × {nights} night{nights > 1 ? 's' : ''}</span>
              <span>₹{totalPrice.toLocaleString()}</span>
            </div>
            <div className={styles.totalRow}>
              <span>Total</span>
              <span>₹{totalPrice.toLocaleString()}</span>
            </div>
          </div>
        )}

        <button
          type="submit"
          className={styles.bookBtn}
          disabled={isLoading || nights === 0}
        >
          {isLoading ? "Processing..." : nights > 0 ? "Reserve" : "Check availability"}
        </button>
      </form>
    </div>
  );
}

export default BookingCard;
