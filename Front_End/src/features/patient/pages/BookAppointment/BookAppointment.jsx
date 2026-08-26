import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../../shared/services/api';
import { calculatePricing } from '../../../../shared/utils/pricing';
import BookingSummary from '../../../../shared/components/BookingSummary/BookingSummary';
import Input from '../../../../shared/components/Input/Input';
import Button from '../../../../shared/components/Button/Button';
import EmptyState from '../../../../shared/components/EmptyState/EmptyState';
import Loader from '../../../../shared/components/Loader/Loader';
import { cx } from '../../../../shared/utils/classNames';
import styles from './BookAppointment.module.css';

function getDoctorImage(d) {
  if (d?.profileImage) {
    return d.profileImage.startsWith('http')
      ? d.profileImage
      : `http://localhost:3000/${d.profileImage.replace(/^\//, '')}`;
  }
  const name = d?.name || 'Doctor';
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2c5282&color=fff&size=200`;
}

export default function BookAppointment() {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null); // slot object
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    async function loadDoctorAndSlots() {
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
            fee: d.sessionPrice !== undefined ? d.sessionPrice : 0,
            rating: ratingVal,
            image: getDoctorImage(d),
          });
        }

        if (slotsRes && slotsRes.data) {
          const rawSlots = slotsRes.data.slots || slotsRes.data.data || [];
          setAvailableSlots(rawSlots);
        }
      } catch (err) {
        console.warn('Booking init error:', err.message);
      } finally {
        setIsLoading(false);
      }
    }
    loadDoctorAndSlots();
  }, [doctorId]);

  if (isLoading) {
    return <Loader label="Loading booking options..." />;
  }

  if (!doctor) {
    return (
      <EmptyState
        title="Doctor not found"
        action={<Button onClick={() => navigate('/doctors')}>Back to Doctors</Button>}
      />
    );
  }

  const { sessionPrice, depositAmount, remainingBalance } = calculatePricing(
    doctor.fee || doctor.sessionPrice
  );

  const onConfirm = async () => {
    if (!selectedSlot) return;
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      let res;
      try {
        res = await api.post('/payments/checkout-session', {
          doctorId: doctor.id,
          slotId: selectedSlot._id || selectedSlot.id,
          type: 'followup',
          mode: 'online',
        });
      } catch (e) {
        if (e.response?.status === 404) {
          res = await api.post('/payment/checkout-session', {
            doctorId: doctor.id,
            slotId: selectedSlot._id || selectedSlot.id,
            type: 'followup',
            mode: 'online',
          });
        } else {
          throw e;
        }
      }

      if (res.data?.checkoutUrl) {
        window.location.href = res.data.checkoutUrl;
        return;
      }

      const createdSession = res.data?.session;
      const bookingId = createdSession?._id || `bk-${Date.now()}`;

      navigate(`/payment/${bookingId}`, {
        state: {
          bookingId,
          doctorId: doctor.id,
          date: selectedSlot.day,
          time: selectedSlot.time || 'Scheduled',
          sessionPrice,
          depositAmount,
          remainingBalance,
          sessionId: createdSession?._id,
        },
      });
    } catch (err) {
      const apiError = err.response?.data?.errors
        ? (Array.isArray(err.response.data.errors) ? err.response.data.errors.join(', ') : err.response.data.errors)
        : (err.response?.data?.message || 'Error initiating checkout. Please try selecting another slot.');
      setErrorMsg(apiError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <h1>Book Appointment</h1>
      <p className={styles.subtext}>Select an available time slot and confirm your booking.</p>

      {errorMsg && (
        <div className="alert alert-danger mb-4" role="alert">
          {errorMsg}
        </div>
      )}

      <div className={styles.grid}>
        <form className={styles.form} onSubmit={handleSubmit(onConfirm)}>
          <section className={styles.card}>
            <h2>1. Select Available Slot</h2>
            {availableSlots.length === 0 ? (
              <p className="text-muted my-3">No available slots at this time. Please check back later.</p>
            ) : (
              <div className={styles.slotRow}>
                {availableSlots.map((slot) => (
                  <button
                    type="button"
                    key={slot._id || slot.id}
                    className={cx(
                      styles.slotChip,
                      selectedSlot?._id === slot._id && styles.slotChipActive
                    )}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    {slot.day} {slot.time ? `(${slot.time})` : ''}
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className={styles.card}>
            <h2>2. Booking Details</h2>
            <div className={styles.formGrid}>
              <Input
                label="Full Name"
                error={errors.fullName?.message}
                {...register('fullName', { required: 'Full name is required' })}
              />
              <Input
                label="Phone Number"
                error={errors.phone?.message}
                {...register('phone', { required: 'Phone number is required' })}
              />
            </div>
            <Input
              as="textarea"
              label="Reason for visit (optional)"
              placeholder="Briefly share what you'd like to focus on..."
              {...register('notes')}
            />
          </section>

          {!selectedSlot && <p className={styles.warning}>Please select a time slot to continue.</p>}

          <Button type="submit" size="lg" fullWidth disabled={!selectedSlot || isSubmitting}>
            {isSubmitting ? 'Initiating Checkout...' : 'Confirm & Proceed to Payment'}
          </Button>
        </form>

        <BookingSummary
          doctor={doctor}
          date={selectedSlot?.day}
          time={selectedSlot?.time || 'Selected Slot'}
        />
      </div>
    </div>
  );
}
