import React, { useEffect, useState } from "react";
import ListingCard from "./ListingCard";
import LoadingSkeleton from "./LoadingSkeleton";
import styles from "./ListingsPage.module.css";

function ListingsPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/listing`);
        if (!response.ok) {
          throw new Error('Failed to fetch listings');
        }
        const data = await response.json();
        setListings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.error}>
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.heading}>Find Your Next Stay</h1>
        <p className={styles.subtitle}>
          Discover unique places to stay around the world
        </p>
      </header>
      
      <main className={styles.grid}>
        {loading ? (
          <LoadingSkeleton count={6} />
        ) : listings.length === 0 ? (
          <div className={styles.emptyState}>
            <h3>No listings found</h3>
            <p>Check back later for new properties!</p>
          </div>
        ) : (
          listings.map(listing => (
            <ListingCard key={listing.id} listing={listing} />
          ))
        )}
      </main>
    </div>
  );
}

export default ListingsPage;
