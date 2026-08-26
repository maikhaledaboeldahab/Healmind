import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClockRotateLeft, faCircleCheck, faDollarSign, faUsers } from '@fortawesome/free-solid-svg-icons';
import api from '../../../../shared/services/api';
import RatingStars from '../../../../shared/components/RatingStars/RatingStars';
import Button from '../../../../shared/components/Button/Button';
import EmptyState from '../../../../shared/components/EmptyState/EmptyState';
import Loader from '../../../../shared/components/Loader/Loader';
import styles from './DoctorDetails.module.css';

function getDoctorImage(d) {
  if (d?.profileImage) {
    return d.profileImage.startsWith('http')
      ? d.profileImage
      : `http://localhost:3000/${d.profileImage.replace(/^\//, '')}`;
  }
  const name = d?.name || 'Doctor';
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2c5282&color=fff&size=500`;
}

export default function DoctorDetails() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDoctorDetails() {
      setIsLoading(true);
      try {
        let docRes;
        try {
          docRes = await api.get(`/doctor/public/${doctorId}`);
        } catch {
          docRes = await api.get(`/admin/doctors/${doctorId}`);
        }
        const slotsRes = await api.get(`/doctor/${doctorId}/available-slots`).catch(() => null);

        if (docRes && docRes.data) {
          const d = docRes.data.data || docRes.data;
          const ratingVal = d.rating !== undefined ? d.rating : (d.ratingsAverage !== undefined ? d.ratingsAverage : null);
          setDoctor({
            id: d._id || d.id,
            name: d.name || `Dr. ${d.email?.split('@')[0]}`,
            specialization: d.specialization || 'Clinical Specialist',
            experience: d.yearsOfExperience !== undefined ? d.yearsOfExperience : (d.experience || 0),
            fee: d.sessionPrice !== undefined ? d.sessionPrice : 0,
            rating: ratingVal,
            image: getDoctorImage(d),
            about: d.bio || 'No biography provided yet.',
            stats: { patients: d.patientsCount || 0 },
            verified: d.isApproved || d.approvalStatus === 'approved',
          });
        }

        if (slotsRes && slotsRes.data) {
          const rawSlots = slotsRes.data.slots || slotsRes.data.data || [];
          setSlots(rawSlots);
        }
      } catch (err) {
        console.warn('Doctor details fetch error:', err.message);
      } finally {
        setIsLoading(false);
      }
    }
    loadDoctorDetails();
  }, [doctorId]);

  if (isLoading) {
    return <Loader label="Loading specialist profile..." />;
  }

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
              <span>{doctor.fee} EGP / session</span>
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
          <h2>Available Time Slots</h2>
          {slots.length === 0 ? (
            <p className="text-muted my-3">No available slots at the moment.</p>
          ) : (
            <div className={styles.availability}>
              <div className={styles.slots}>
                {slots.map((slot) => (
                  <span key={slot._id || slot.id} className={styles.slot}>
                    {slot.day} - {slot.time || 'Available'}
                  </span>
                ))}
              </div>
            </div>
          )}
          <Button variant="outline" fullWidth onClick={() => navigate(`/doctors/${doctor.id}/book`)}>
            Select Date &amp; Time
          </Button>
        </section>
      </div>
    </div>
  );
}
