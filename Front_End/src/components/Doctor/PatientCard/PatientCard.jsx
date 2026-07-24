import { Link } from "react-router-dom";
import styles from "./PatientCard.module.css";

// Props:
// id            -> patient's unique id, used to build the details link
// patientName   -> e.g. "Arlo Sterling"
// age           -> e.g. 29
// gender        -> e.g. "Male"
// avatarImg     -> optional photo URL
// status        -> "Approved" | "Pending" | "Rejected" | "Needs Another Session"
// therapyType   -> e.g. "Cognitive Behavioral Therapy"
// lastSession   -> e.g. "Oct 24, 2023"
const PatientCard = ({
  id,
  patientName,
  age,
  gender,
  avatarImg,
  status,
  therapyType,
  lastSession,
}) => {
  const statusKey = status.toLowerCase().replace(/\s/g, "");

  return (
    <div className={`${styles.card} p-3`}>
      <div className="d-flex justify-content-between align-items-start mb-2">
        {avatarImg ? (
          <img src={avatarImg} alt={patientName} className={styles.avatar} />
        ) : (
          <div className={styles.avatar}>{patientName.charAt(0)}</div>
        )}

        <span className={`${styles.badge} ${styles[statusKey] || ""}`}>
          {status}
        </span>
      </div>

      <h5 className={styles.name}>{patientName}</h5>
      <p className={styles.subInfo}>
        {age} Years • {gender}
      </p>

      <p className={styles.detailRow}>
        <i className="fa-solid fa-clipboard me-2"></i>
        {therapyType}
      </p>
      <p className={styles.detailRow}>
        <i className="fa-solid fa-clock-rotate-left me-2"></i>
        Last session: {lastSession}
      </p>

      <Link to={`/doctor/patients/${id}`} className={styles.detailsBtn}>
        Open Details
      </Link>
    </div>
  );
};

export default PatientCard;