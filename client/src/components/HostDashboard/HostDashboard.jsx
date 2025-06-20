import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./HostDashboard.module.css";

function HostDashboard() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const token = localStorage.getItem("token");
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
  }, []);

  const handleEdit = (id) => {
    navigate(`/host/listing/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/listings/${id}`, {
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

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.heading}>Your Listings</h1>
      <button className={styles.addButton} onClick={handleAddNew}>Add New Listing</button>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : listings.length === 0 ? (
        <p>You have no listings yet.</p>
      ) : (
        <div className={styles.listingsGrid}>
          {listings.map(listing => (
            <div key={listing.id} className={styles.listingCard}>
              {/* Gallery: show first image, and thumbnails if more */}
              <div className={styles.galleryWrapper}>
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
                  <div className={styles.thumbnailRow}>
                    {listing.imageUrls.slice(1, 4).map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt={`${listing.title} thumbnail ${idx + 2}`}
                        className={styles.thumbnail}
                      />
                    ))}
                    {listing.imageUrls.length > 4 && (
                      <div className={styles.moreImages}>
                        +{listing.imageUrls.length - 4} more
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className={styles.listingInfo}>
                <h3>{listing.title}</h3>
                <p>{listing.location}</p>
                <p>{`\u20B9${listing.price} / night`}</p>
                <div className={styles.actions}>
                  <button onClick={() => handleEdit(listing.id)} className={styles.editButton}>Edit</button>
                  <button onClick={() => handleDelete(listing.id)} className={styles.deleteButton}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HostDashboard;
