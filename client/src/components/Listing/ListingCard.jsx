import React from "react";
import styles from "./ListingCard.module.css";
import { Link } from "react-router-dom";

function ListingCard({ listing }) {
  const handleImageError = (e) => {
    e.target.src = '/placeholder-image.jpg';
  };

  // Use the first image from imageUrls array if available
  const imageSrc =
    listing.imageUrls && listing.imageUrls.length > 0
      ? listing.imageUrls[0]
      : `https://source.unsplash.com/400x250/?apartment,home,${listing.id}`;

  return (
    <article className={styles.card}>
      <Link to={`/listing/${listing.id}`} className={styles.link}>
        <div className={styles.imageWrapper}>
          <img
            src={imageSrc}
            alt={`${listing.title} - Property in ${listing.location}`}
            className={styles.image}
            onError={handleImageError}
            loading="lazy"
          />
        </div>
        <div className={styles.info}>
          <h3 className={styles.title}>{listing.title}</h3>
          <p className={styles.location}>{listing.location}</p>
          <div className={styles.priceWrapper}>
            <span className={styles.price}>₹{listing.price?.toLocaleString()}</span>
            <span className={styles.period}> / night</span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export default ListingCard;
