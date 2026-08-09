import { Link } from "react-router-dom";
import styles from "./PatientHeader.module.css";

// Props:
// patientName, age, gender, avatarImg, status  -> same as PatientCard
// phone, email, therapyType, patientSince      -> profile info row
const PatientHeader = ({
  patientName,
  age,
  gender,
  avatarImg,
  status,
  phone,
  email,
  therapyType,
  patientSince,
}) => {
  const statusKey = status.toLowerCase().replace(/\s/g, "");

  return (
    <div className={`${styles.card} p-3 p-md-4 mb-4`}>
      <Link to="/doctor/patients" className={styles.backLink}>
        <i className="fa-solid fa-arrow-left me-2"></i>
        Back to Patients
      </Link>

      <div className="d-flex align-items-center gap-3 mt-3 mb-4">
        {avatarImg ? (
          <img src={avatarImg} alt={patientName} className={styles.avatar} />
        ) : (
          <div className={styles.avatar}>{patientName.charAt(0)}</div>
        )}

        <div>
          <div className="d-flex align-items-center gap-2">
            <h3 className={styles.name}>{patientName}</h3>
            <span className={`${styles.badge} ${styles[statusKey] || ""}`}>
              {status}
            </span>
          </div>
          <p className={styles.subInfo}>
            {age} Years • {gender}
          </p>
        </div>
      </div>

      <div className={styles.infoGrid}>
        <div className={styles.infoItem}>
          <i className="fa-solid fa-phone"></i>
          <span>{phone}</span>
        </div>
        <div className={styles.infoItem}>
          <i className="fa-solid fa-envelope"></i>
          <span>{email}</span>
        </div>
        <div className={styles.infoItem}>
          <i className="fa-regular fa-file-lines"></i>
          <span>{therapyType}</span>
        </div>
        <div className={styles.infoItem}>
          <i className="fa-regular fa-calendar"></i>
          <span>Patient since {patientSince}</span>
        </div>
      </div>
    </div>
  );
};

export default PatientHeader;