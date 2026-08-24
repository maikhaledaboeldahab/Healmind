import { useState } from "react";
import styles from "./DoctorNavbar.module.css";

const DoctorNavbar = ({ doctorName = "Doctor", doctorImg }) => {
  // Layer 1 => (states & Global Data)
  const [notfiCount, setNotfiCount] = useState(3);

  // Layer 3 => (Handler)
  const onSettingsClick = () => {
    console.log("Settings clicked");
  };
  const onLogoutClick = () => {
    console.log("Logout clicked");
  };

  // Layer 4 => JSX (Re-render)
  return (
    <nav
      className={`${styles.navbar} d-flex justify-content-between align-items-center shadow-sm`}
    >
      <div className="d-flex align-items-center">
        <span className={styles.brand}>HealMind</span>
      </div>

      <div className={styles.doctorSection}>
        <div className={styles.notifIcon}>
          <i className="fa-solid fa-bell"></i>
          <span className={`badge rounded-pill ${styles.badge}`}>
            {notfiCount}
          </span>
        </div>

        <div className="dropdown">
          <button
            className={`${styles.profileToggle} btn d-flex align-items-center gap-2`}
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {doctorImg ? (
              <img
                src={doctorImg}
                alt="doctor"
                className={styles.avatarCircle}
              />
            ) : (
              <div className={styles.avatarCircle}>
                {doctorName.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="fw-semibold d-none d-md-block">
              Dr. {doctorName}
            </span>
            <i className={`fa-solid fa-chevron-down ${styles.chevron}`}></i>
          </button>

          <ul className={`dropdown-menu dropdown-menu-end ${styles.menu}`}>
            <li>
              <button className="dropdown-item" onClick={onSettingsClick}>
                <i className="fa-solid fa-gears me-2"></i>
                Settings
              </button>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <button className="dropdown-item" onClick={onLogoutClick}>
                <i className="fa-solid fa-right-from-bracket me-2"></i>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default DoctorNavbar;