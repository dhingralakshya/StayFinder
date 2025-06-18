import React from "react";
import styles from "./LoadingSkeleton.module.css";

function LoadingSkeleton({ count = 6 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={styles.skeleton}>
          <div className={styles.imageWrapper}>
            <div className={styles.imagePlaceholder}></div>
          </div>
          <div className={styles.info}>
            <div className={styles.titlePlaceholder}></div>
            <div className={styles.locationPlaceholder}></div>
            <div className={styles.pricePlaceholder}></div>
          </div>
        </div>
      ))}
    </>
  );
}

export default LoadingSkeleton;
