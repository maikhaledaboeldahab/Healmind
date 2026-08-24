import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserMd, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import styles from './Register.module.css';

export default function RoleSelection({ onSelectRole }) {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Register as</h2>
      <p className={styles.subtitle}>Select the type of account you want to create.</p>

      <div className={styles.roleGrid}>
        <button
          type="button"
          className={styles.roleCard}
          onClick={() => onSelectRole('user')}
        >
          <div className={styles.roleIconWrap}>
            <FontAwesomeIcon icon={faUser} />
          </div>
          <div className={styles.roleContent}>
            <span className={styles.roleTitle}>User</span>
            <span className={styles.roleDescription}>
              Access mental wellness support, explore resources, and book consultations.
            </span>
          </div>
          <span className={styles.roleArrow}>
            <FontAwesomeIcon icon={faArrowRight} />
          </span>
        </button>

        <button
          type="button"
          className={styles.roleCard}
          onClick={() => onSelectRole('doctor')}
        >
          <div className={styles.roleIconWrap}>
            <FontAwesomeIcon icon={faUserMd} />
          </div>
          <div className={styles.roleContent}>
            <span className={styles.roleTitle}>Doctor</span>
            <span className={styles.roleDescription}>
              Join as a certified mental health professional to offer patient care.
            </span>
          </div>
          <span className={styles.roleArrow}>
            <FontAwesomeIcon icon={faArrowRight} />
          </span>
        </button>
      </div>

      <p className={styles.footerText}>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}
