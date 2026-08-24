import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDay, faClock, faTag, faCoins, faReceipt } from '@fortawesome/free-solid-svg-icons';
import { formatShortDate } from '../../utils/formatDate';
import { calculatePricing } from '../../utils/pricing';
import styles from './BookingSummary.module.css';

export default function BookingSummary({ doctor, date, time }) {
  if (!doctor) return null;

  const { sessionPrice, depositAmount, remainingBalance, depositPercentage } = calculatePricing(
    doctor.fee || doctor.sessionPrice
  );

  return (
    <div className={styles.card}>
      <div className={styles.doctor}>
        <img src={doctor.image} alt={doctor.name} className={styles.avatar} />
        <div>
          <h4 className={styles.name}>{doctor.name}</h4>
          <p className={styles.specialization}>{doctor.specialization}</p>
        </div>
      </div>

      <div className={styles.divider} />

      <ul className={styles.rows}>
        {date && (
          <li>
            <span>
              <FontAwesomeIcon icon={faCalendarDay} /> Date
            </span>
            <strong>{formatShortDate(date)}</strong>
          </li>
        )}
        {time && (
          <li>
            <span>
              <FontAwesomeIcon icon={faClock} /> Time
            </span>
            <strong>{time}</strong>
          </li>
        )}
        <li>
          <span>
            <FontAwesomeIcon icon={faTag} /> Session Price
          </span>
          <strong>{sessionPrice.toFixed(2)} EGP</strong>
        </li>
        <li>
          <span>
            <FontAwesomeIcon icon={faCoins} /> Deposit Required ({depositPercentage}%)
          </span>
          <strong className={styles.depositHighlight}>{depositAmount.toFixed(2)} EGP</strong>
        </li>
        <li>
          <span>
            <FontAwesomeIcon icon={faReceipt} /> Remaining Balance
          </span>
          <strong className={styles.remainingMuted}>{remainingBalance.toFixed(2)} EGP</strong>
        </li>
      </ul>

      <div className={styles.divider} />

      <div className={styles.total}>
        <div className={styles.totalLabel}>
          <span>Deposit Payable Now</span>
          <small className={styles.subtext}>Remaining {remainingBalance.toFixed(2)} EGP due at session</small>
        </div>
        <span className={styles.totalAmount}>{depositAmount.toFixed(2)} EGP</span>
      </div>
    </div>
  );
}
