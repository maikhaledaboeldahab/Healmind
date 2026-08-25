import { Outlet } from 'react-router-dom';
import styles from './AuthLayout.module.css';

export default function AuthLayout() {
  return (
    <div className={styles.shell}>
      <div className={styles.panel}>
        <div className={styles.brand}>
          <span className={styles.brandName}>HealMind</span>
          <span className={styles.brandTag}>Mental Wellness</span>
        </div>
        <h1 className={styles.headline}>A calmer mind starts here.</h1>
        <p className={styles.subtext}>
          Connect with licensed therapists, track your progress, and take the next step toward
          feeling better — at your own pace.
        </p>
      </div>
      <div className={styles.formSide}>
        <Outlet />
      </div>
    </div>
  );
}
