import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { getDoctorById, getAvailableSlots } from '../../../../data/doctors';
import BookingSummary from '../../../../shared/components/BookingSummary/BookingSummary';
import Input from '../../../../shared/components/Input/Input';
import Button from '../../../../shared/components/Button/Button';
import EmptyState from '../../../../shared/components/EmptyState/EmptyState';
import { cx } from '../../../../shared/utils/classNames';
import styles from './BookAppointment.module.css';

export default function BookAppointment() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const doctor = getDoctorById(doctorId);
  const availability = getAvailableSlots();

  const [selectedDate, setSelectedDate] = useState(availability[0]?.date);
  const [selectedTime, setSelectedTime] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  if (!doctor) {
    return (
      <EmptyState
        title="Doctor not found"
        action={<Button onClick={() => navigate('/doctors')}>Back to Doctors</Button>}
      />
    );
  }

  const activeDay = availability.find((d) => d.date === selectedDate);

  const onConfirm = (formData) => {
    if (!selectedTime) return;
    // Simulate booking creation, then move to payment.
    const bookingId = `bk-${Date.now()}`;
    navigate(`/payment/${bookingId}`, {
      state: { doctorId: doctor.id, date: selectedDate, time: selectedTime, ...formData },
    });
  };

  return (
    <div className={styles.page}>
      <h1>Book Appointment</h1>
      <p className={styles.subtext}>Choose a date and time, then confirm your details.</p>

      <div className={styles.grid}>
        <form className={styles.form} onSubmit={handleSubmit(onConfirm)}>
          <section className={styles.card}>
            <h2>1. Select Date</h2>
            <div className={styles.dateRow}>
              {availability.map((day) => (
                <button
                  type="button"
                  key={day.date}
                  className={cx(styles.dateChip, selectedDate === day.date && styles.dateChipActive)}
                  onClick={() => {
                    setSelectedDate(day.date);
                    setSelectedTime(null);
                  }}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </section>

          <section className={styles.card}>
            <h2>2. Select Time Slot</h2>
            <div className={styles.slotRow}>
              {activeDay?.slots.map((slot) => (
                <button
                  type="button"
                  key={slot}
                  className={cx(styles.slotChip, selectedTime === slot && styles.slotChipActive)}
                  onClick={() => setSelectedTime(slot)}
                >
                  {slot}
                </button>
              ))}
            </div>
          </section>

          <section className={styles.card}>
            <h2>3. Booking Information</h2>
            <div className={styles.formGrid}>
              <Input
                label="Full Name"
                defaultValue=""
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

          {!selectedTime && <p className={styles.warning}>Please select a time slot to continue.</p>}

          <Button type="submit" size="lg" fullWidth disabled={!selectedTime}>
            Confirm &amp; Proceed to Payment
          </Button>
        </form>

        <BookingSummary doctor={doctor} date={selectedDate} time={selectedTime} />
      </div>
    </div>
  );
}
