import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import EditListingForm from "./EditListingForm";
import styles from "./HostDashboard.module.css";

function HostDashboard() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [editingListingId, setEditingListingId] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login?redirect=/host/dashboard");
          return;
        }
        try {
          const decoded = jwtDecode(token);
          if (decoded.role !== "host") {
            setAccessDenied(true);
            return;
          }
        } catch (e) {
          navigate("/login?redirect=/host/dashboard");
          return;
        }
        const res = await fetch(`${process.env.REACT_APP_API_URL}/listing/host/listing`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch listings");
        }
        const data = await res.json();
        setListings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [navigate]);

  if (accessDenied) {
    return (
      <div className={styles.container}>
        <div className={styles.statusCard}>
          <div className={styles.statusIcon}>🚫</div>
          <h2 className={styles.statusTitle}>Access Denied</h2>
          <p className={styles.statusMessage}>This dashboard is only accessible to hosts.</p>
          <button 
            onClick={() => navigate('/login')} 
            className={styles.actionButton}
          >
            Login as Host
          </button>
        </div>
      </div>
    );
  }

  const handleEdit = (id) => {
    setEditingListingId(id);
  };
  const handleEditClose = (updated) => {
    setEditingListingId(null);
    if (updated) {
      window.location.reload();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.REACT_APP_API_URL}/listing/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to delete listing");
      }
      setListings(listings.filter(listing => listing.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddNew = () => {
    navigate("/host/listing/new");
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.statusCard}>
          <div className={styles.loader}></div>
          <h2 className={styles.statusTitle}>Loading your listings...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.statusCard}>
          <div className={styles.statusIcon}>⚠️</div>
          <h2 className={styles.statusTitle}>Something went wrong</h2>
          <p className={styles.statusMessage}>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className={styles.actionButton}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.heading}>Your Listings</h1>
          <p className={styles.subheading}>
            {listings.length === 0 
              ? "Start by creating your first listing" 
              : `Managing ${listings.length} listing${listings.length !== 1 ? 's' : ''}`
            }
          </p>
        </div>
        <button className={styles.addButton} onClick={handleAddNew}>
          <span className={styles.addIcon}>+</span>
          Add New Listing
        </button>
      </div>

      {listings.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🏠</div>
          <h3 className={styles.emptyTitle}>No listings yet</h3>
          <p className={styles.emptyMessage}>
            Create your first listing to start welcoming guests
          </p>
          <button className={styles.emptyButton} onClick={handleAddNew}>
            Create Your First Listing
          </button>
        </div>
      ) : (
        <div className={styles.listingsGrid}>
          {listings.map(listing => (
            <div key={listing.id} className={styles.listingCard}>
              <div className={styles.imageContainer}>
                <img
                  src={
                    listing.imageUrls && listing.imageUrls.length > 0
                      ? listing.imageUrls[0]
                      : "https://source.unsplash.com/400x250/?apartment,home"
                  }
                  alt={listing.title}
                  className={styles.listingImage}
                />
                {listing.imageUrls && listing.imageUrls.length > 1 && (
                  <div className={styles.imageCount}>
                    📷 {listing.imageUrls.length}
                  </div>
                )}
              </div>
              
              <div className={styles.cardContent}>
                <div className={styles.listingInfo}>
                  <h3 className={styles.listingTitle}>{listing.title}</h3>
                  <p className={styles.listingLocation}>📍 {listing.location}</p>
                  <div className={styles.priceContainer}>
                    <span className={styles.price}>₹{listing.price}</span>
                    <span className={styles.priceUnit}>/ night</span>
                  </div>
                </div>
                
                <div className={styles.actions}>
                  <button 
                    onClick={() => handleEdit(listing.id)} 
                    className={`${styles.actionBtn} ${styles.editBtn}`}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(listing.id)} 
                    className={`${styles.actionBtn} ${styles.deleteBtn}`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {editingListingId && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button
              onClick={() => setEditingListingId(null)}
              className={styles.modalClose}
              aria-label="Close"
            >
              ×
            </button>
            <EditListingForm
              listingId={editingListingId}
              onClose={handleEditClose}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default HostDashboard;
