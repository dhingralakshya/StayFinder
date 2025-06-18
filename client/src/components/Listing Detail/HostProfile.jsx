// HostProfile.jsx
import React from "react";
import styles from "./HostProfile.module.css";

function HostProfile({ host }) {
  if (!host) return null;

  return (
    <div className={styles.hostProfile}>
      <div className={styles.hostInfo}>
        <h3 className={styles.hostName}>Hosted by {host.name}</h3>
        <div className={styles.hostContact}>
          <span className={styles.contactLabel}>Contact:</span>
          <a href={`mailto:${host.email}`} className={styles.emailLink}>
            {host.email}
          </a>
        </div>
      </div>
    </div>
  );
}

export default HostProfile;
