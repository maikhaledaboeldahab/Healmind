import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faClockRotateLeft, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import Button from '../Button/Button';
import styles from './DoctorCard.module.css';

export default function DoctorCard({ doctor }) {
  const navigate = useNavigate();

  return (
    <div className={styles.card}>
      <div className={styles.imageWrap}>
        <img src={doctor.image} alt={doctor.name} className={styles.image} />
        <span className={styles.rating}>
          <FontAwesomeIcon icon={faStar} /> {doctor.rating.toFixed(1)}
        </span>
      </div>

      <div className={styles.body}>
        <h3 className={styles.name}>{doctor.name}</h3>
        <p className={styles.specialization}>{doctor.specialization}</p>

        <div className={styles.meta}>
          <span>
            <FontAwesomeIcon icon={faClockRotateLeft} /> {doctor.experience}+ Years Exp.
          </span>
          {doctor.verified && (
            <span>
              <FontAwesomeIcon icon={faCircleCheck} /> Verified
            </span>
          )}
        </div>

        <Button
          fullWidth
          onClick={() => navigate(`/doctors/${doctor.id}/book`)}
        >
          Book Now
        </Button>
        <button className={styles.viewProfile} onClick={() => navigate(`/doctors/${doctor.id}`)}>
          View Profile
        </button>
      </div>
    </div>
  );
}
