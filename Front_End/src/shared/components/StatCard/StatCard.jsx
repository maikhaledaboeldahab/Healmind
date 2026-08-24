import styles from './StatCard.module.css';

export default function StatCard({ icon, label, value, hint }) {
  return (
    <div className={styles.card}>
      <div className={styles.iconWrap}>{icon}</div>
      <div>
        <p className={styles.value}>{value}</p>
        <p className={styles.label}>{label}</p>
        {hint && <p className={styles.hint}>{hint}</p>}
      </div>
    </div>
  );
}
