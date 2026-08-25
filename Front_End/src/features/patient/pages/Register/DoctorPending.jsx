import { Link } from 'react-router-dom';
import Button from '../../../../shared/components/Button/Button';
import styles from './Register.module.css';

export default function DoctorPending() {
  return (
    <div className={styles.pendingCard}>
      <div className={styles.pendingHeader}>
        <span className={styles.pendingBadgeIcon}>🟡</span>
        <h2 className={styles.title}>Your account is under review.</h2>
        <p className={styles.subtitle}>Waiting for admin approval.</p>
      </div>

      <div className={styles.statusBox}>
        <span>Status:</span>
        <span className={styles.yellowDot}>🟡</span>
        <span>Pending</span>
      </div>

      <p className={styles.pendingNotice}>
        Thank you for applying. Our medical administration team will review your submitted credentials
        and certificate. You will be notified once your registration is approved.
      </p>

      <div className={styles.pendingActions}>
        <Link to="/login">
          <Button variant="outline" fullWidth>
            Back to Sign In
          </Button>
        </Link>
      </div>
    </div>
  );
}
