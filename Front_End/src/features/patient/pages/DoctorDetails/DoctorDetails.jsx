import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClockRotateLeft, faCircleCheck, faDollarSign, faUsers } from '@fortawesome/free-solid-svg-icons';
import { getDoctorById, getAvailableSlots } from '../../../../data/doctors';
import RatingStars from '../../../../shared/components/RatingStars/RatingStars';
import Button from '../../../../shared/components/Button/Button';
import EmptyState from '../../../../shared/components/EmptyState/EmptyState';
import styles from './DoctorDetails.module.css';

export default function DoctorDetails() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const doctor = getDoctorById(doctorId);
  const availability = getAvailableSlots();

  if (!doctor) {
    return (
      <EmptyState
        title="Doctor not found"
        description="This specialist profile doesn't exist or is no longer available."
        action={<Button onClick={() => navigate('/doctors')}>Back to Doctors</Button>}
      />
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <img src={doctor.image} alt={doctor.name} className={styles.image} />
        <div className={styles.heroInfo}>
          <h1>{doctor.name}</h1>
          <p className={styles.specialization}>{doctor.specialization}</p>
          <RatingStars value={doctor.rating} />

          <div className={styles.metaGrid}>
            <div className={styles.metaItem}>
              <FontAwesomeIcon icon={faClockRotateLeft} />
              <span>{doctor.experience}+ Years Experience</span>
            </div>
            <div className={styles.metaItem}>
              <FontAwesomeIcon icon={faDollarSign} />
              <span>${doctor.fee} / session</span>
            </div>
            <div className={styles.metaItem}>
              <FontAwesomeIcon icon={faUsers} />
              <span>{doctor.stats.patients}+ patients helped</span>
            </div>
            {doctor.verified && (
              <div className={styles.metaItem}>
                <FontAwesomeIcon icon={faCircleCheck} />
                <span>Verified specialist</span>
              </div>
            )}
          </div>

          <Button size="lg" onClick={() => navigate(`/doctors/${doctor.id}/book`)}>
            Book Appointment
          </Button>
        </div>
      </div>

      <div className={styles.grid}>
        <section className={styles.card}>
          <h2>About {doctor.name}</h2>
          <p className={styles.about}>{doctor.about}</p>
        </section>

        <section className={styles.card}>
          <h2>Available This Week</h2>
          <div className={styles.availability}>
            {availability.map((day) => (
              <div key={day.date} className={styles.day}>
                <p className={styles.dayLabel}>{day.label}</p>
                <div className={styles.slots}>
                  {day.slots.map((slot) => (
                    <span key={slot} className={styles.slot}>
                      {slot}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" fullWidth onClick={() => navigate(`/doctors/${doctor.id}/book`)}>
            Select Date &amp; Time
          </Button>
        </section>
      </div>
    </div>
  );
}
