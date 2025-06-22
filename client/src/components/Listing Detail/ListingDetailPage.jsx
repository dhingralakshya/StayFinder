import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BookingCard from "./BookingCard";
import HostProfile from "./HostProfile";
import LoadingSkeleton from "../Listing/LoadingSkeleton";
import styles from "./ListingDetailPage.module.css";

function ListingDetailPage() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/listing/${id}`);
        if (!response.ok) {
          throw new Error('Listing not found');
        }
        const data = await response.json();
        setListing(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const handleImageError = (e) => {
    e.target.src = '/placeholder-image.jpg';
  };

  if (loading) {
    return (
      <div className={styles.detailPage}>
        <div className={styles.container}>
          <DetailPageSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.detailPage}>
        <div className={styles.container}>
          <div className={styles.errorState}>
            <h2>Property Not Found</h2>
            <p>{error}</p>
            <div className={styles.errorActions}>
              <button onClick={() => navigate(-1)} className={styles.backBtn}>
                Go Back
              </button>
              <button onClick={() => navigate('/')} className={styles.homeBtn}>
                Browse Properties
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.detailPage}>
      <div className={styles.container}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <button onClick={() => navigate(-1)} className={styles.backLink}>
            ← Back to listings
          </button>
        </nav>

        <div className={styles.content}>
          <div className={styles.left}>
            {/* Fixed Image Gallery */}
            <div className={styles.imageGalleryWrapper}>
              {listing.imageUrls && listing.imageUrls.length > 0 ? (
                <div className={styles.galleryScroll}>
                  {listing.imageUrls.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`${listing.title} - Image ${idx + 1}`}
                      className={styles.galleryImage}
                      onError={handleImageError}
                    />
                  ))}
                </div>
              ) : (
                <div className={styles.singleImageWrapper}>
                  <img
                    src={`https://source.unsplash.com/800x400/?apartment,home,${listing.id}`}
                    alt={`${listing.title} - Property in ${listing.location}`}
                    className={styles.singleImage}
                    onError={handleImageError}
                  />
                </div>
              )}
            </div>
            
            <div className={styles.info}>
              <div className={styles.header}>
                <h1 className={styles.title}>{listing.title}</h1>
                <p className={styles.location}>📍 {listing.location}</p>
              </div>
              
              <div className={styles.details}>
                <div className={styles.priceDisplay}>
                  <span className={styles.price}>₹{listing.price?.toLocaleString()}</span>
                  <span className={styles.period}> / night</span>
                </div>
                
                {listing.amenities && (
                  <div className={styles.amenities}>
                    <h3>Amenities</h3>
                    <div className={styles.amenityList}>
                      {listing.amenities.map((amenity, index) => (
                        <span key={index} className={styles.amenity}>
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className={styles.description}>
                  <h3>About this place</h3>
                  <p>
                    {listing.description
                      ? listing.description.split('\n').map((line, idx) => (
                          <React.Fragment key={idx}>
                            {line}
                            <br />
                          </React.Fragment>
                        ))
                      : "No description available."}
                  </p>
                </div>
                <HostProfile host={listing.host} />
              </div>
            </div>
          </div>
          
          <div className={styles.right}>
            <BookingCard listing={listing} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading skeleton for detail page
function DetailPageSkeleton() {
  return (
    <div className={styles.content}>
      <div className={styles.left}>
        <div className={styles.skeletonImage}></div>
        <div className={styles.info}>
          <div className={styles.skeletonTitle}></div>
          <div className={styles.skeletonLocation}></div>
          <div className={styles.skeletonHost}></div>
          <div className={styles.skeletonDescription}></div>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.skeletonBooking}></div>
      </div>
    </div>
  );
}

export default ListingDetailPage;
