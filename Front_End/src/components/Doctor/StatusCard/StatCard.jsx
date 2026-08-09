import styles from "./StatCard.module.css";


// Props:
// icon        -> FontAwesome icon class, e.g. "fa-users"
// label       -> small uppercase label, e.g. "TOTAL PATIENTS"
// value       -> the big number, e.g. 124
// badgeText   -> small pill text, e.g. "+4 this week"
// badgeColor  -> "success" | "warning" | "neutral" (controls pill color)
const StatCard = ({ icon, label, value, badgeText, badgeColor = "neutral" }) => {
  return (
    <div className={`${styles.card} p-3 p-md-4`}>
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div className={styles.iconCircle}>
          <i className={`fa-solid ${icon}`}></i>
        </div>

        {badgeText && (
          <span className={`${styles.badge} ${styles[badgeColor]}`}>
            {badgeText}
          </span>
        )}
      </div>

      <p className={styles.label}>{label}</p>
      <p className={styles.value}>{value}</p>
    </div>
  );
};

export default StatCard;