import styles from "./CommunityStatus.module.css";

// Props:
// status -> "Approved" | "Pending" | "Rejected" | "Needs Another Session"
const CommunityStatus = ({ status }) => {
  const hasFullAccess = status === "Approved";
  const statusKey = status.toLowerCase().replace(/\s/g, "");

  return (
    <div className={`${styles.card} p-3 p-md-4 mb-4`}>
      <h4 className={styles.title}>Community Status</h4>

      <div className={styles.iconRow}>
        <div className={`${styles.iconCircle} ${hasFullAccess ? styles.unlocked : styles.locked}`}>
          <i className={`fa-solid ${hasFullAccess ? "fa-unlock" : "fa-lock"}`}></i>
        </div>
        <span className={`${styles.badge} ${styles[statusKey] || ""}`}>
          {status}
        </span>
      </div>

      <p className={styles.description}>
        {hasFullAccess
          ? "This patient can post and comment in the Community."
          : "This patient can only view posts and comments until their doctor approves full access."}
      </p>
    </div>
  );
};

export default CommunityStatus;