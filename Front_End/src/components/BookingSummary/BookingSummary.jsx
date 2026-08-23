import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDay, faClock, faTag } from '@fortawesome/free-solid-svg-icons';
import { formatShortDate } from '../../utils/formatDate';
import styles from './BookingSummary.module.css';

export default function BookingSummary({ doctor, date, time }) {
  if (!doctor) return null;

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
            <FontAwesomeIcon icon={faTag} /> Session Fee
          </span>
          <strong>${doctor.fee.toFixed(2)}</strong>
        </li>
      </ul>

      <div className={styles.divider} />

      <div className={styles.total}>
        <span>Total</span>
        <span>${doctor.fee.toFixed(2)}</span>
      </div>
    </div>
  );
}
