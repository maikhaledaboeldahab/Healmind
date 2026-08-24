import styles from "./WalletCard.module.css";

// Props:
// balance         -> total available balance, e.g. 4280
// currency        -> e.g. "$"
// recentEarnings  -> array of { id, patientName, sessionType, date, amount }
const WalletCard = ({ balance, currency = "$", recentEarnings = [] }) => {
  return (
    <div className={`${styles.card} p-3 p-md-4 mb-4`}>
      <div className={styles.balanceBox}>
        <span className={styles.balanceLabel}>Wallet Balance</span>
        <span className={styles.balanceValue}>
          {currency}
          {balance.toLocaleString()}
        </span>
      </div>

      <h4 className={styles.title}>Recent Earnings</h4>

      {recentEarnings.length === 0 ? (
        <div className={styles.emptyState}>
          <i className="fa-regular fa-credit-card fa-2x mb-2"></i>
          <p>No earnings recorded yet.</p>
        </div>
      ) : (
        recentEarnings.map((entry) => (
          <div key={entry.id} className={styles.earningRow}>
            <div>
              <p className={styles.patientName}>{entry.patientName}</p>
              <p className={styles.sessionType}>
                {entry.sessionType} • {entry.date}
              </p>
            </div>
            <span className={styles.amount}>
              +{currency}
              {entry.amount}
            </span>
          </div>
        ))
      )}
    </div>
  );
};

export default WalletCard;