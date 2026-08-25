import styles from "./ProfileCard.module.css";

// Props:
// doctorName         -> e.g. "Elena Sterling"
// title              -> e.g. "Lead Clinical Psychologist • CBT Specialist"
// avatarImg          -> optional photo URL
// verificationStatus -> "approved" | "pending" | "rejected"
//                       (matches the Admin Cycle's doctor-verification decision)
const ProfileCard = ({ doctorName, title, avatarImg, verificationStatus }) => {
  const statusConfig = {
    approved: { text: "Active Practitioner", className: styles.approved },
    pending: { text: "Pending Verification", className: styles.pending },
    rejected: { text: "Verification Rejected", className: styles.rejected },
  };

  const status = statusConfig[verificationStatus] || statusConfig.pending;

  return (
    <div className={`${styles.card} p-3 p-md-4 mb-4`}>
      <div className="d-flex flex-column flex-sm-row gap-3">
        {avatarImg ? (
          <img src={avatarImg} alt={doctorName} className={styles.avatar} />
        ) : (
          <div className={styles.avatar}>{doctorName.charAt(0)}</div>
        )}

        <div className="flex-grow-1">
          <div className="d-flex flex-wrap align-items-center gap-2">
            <h3 className={styles.name}>Dr. {doctorName}</h3>
            <span className={`${styles.badge} ${status.className}`}>{status.text}</span>
          </div>
          <p className={styles.title}>{title}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;