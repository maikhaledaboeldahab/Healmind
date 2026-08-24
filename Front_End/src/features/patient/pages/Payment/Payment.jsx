import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faLock, faCoins } from '@fortawesome/free-solid-svg-icons';
import { getDoctorById } from '../../../../data/doctors';
import { upcomingSessions } from '../../../../data/sessions';
import { calculatePricing } from '../../../../shared/utils/pricing';
import BookingSummary from '../../../../shared/components/BookingSummary/BookingSummary';
import Input from '../../../../shared/components/Input/Input';
import Button from '../../../../shared/components/Button/Button';
import EmptyState from '../../../../shared/components/EmptyState/EmptyState';
import styles from './Payment.module.css';

export default function Payment() {
  const { bookingId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isPaying, setIsPaying] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const doctor = state?.doctorId ? getDoctorById(state.doctorId) : null;

  if (!doctor) {
    return (
      <EmptyState
        title="No booking found"
        description="Start by choosing a doctor and selecting an appointment time."
        action={<Button onClick={() => navigate('/doctors')}>Browse Doctors</Button>}
      />
    );
  }

  const { sessionPrice, depositAmount, remainingBalance } = calculatePricing(
    state?.sessionPrice || doctor.fee || doctor.sessionPrice
  );

  const onPay = async () => {
    setIsPaying(true);
    // Simulate processing delay.
    await new Promise((resolve) => setTimeout(resolve, 900));

    // Register confirmed session in upcoming sessions
    const newConfirmedSession = {
      id: bookingId || `ses-${Date.now()}`,
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorImage: doctor.image,
      date: state?.date || new Date().toISOString().split('T')[0],
      time: state?.time || 'Scheduled Time',
      status: 'Confirmed',
      depositPaid: true,
      depositAmount,
      remainingBalance,
      sessionPrice,
    };

    if (!upcomingSessions.some((s) => s.id === newConfirmedSession.id)) {
      upcomingSessions.unshift(newConfirmedSession);
    }

    navigate('/sessions/upcoming', {
      state: {
        paid: true,
        bookingId: newConfirmedSession.id,
        depositAmount,
        remainingBalance,
        sessionPrice,
        doctorName: doctor.name,
      },
    });
  };

  return (
    <div className={styles.page}>
      <h1>Payment</h1>
      <p className={styles.subtext}>Pay the required session deposit to confirm your appointment.</p>

      <div className={styles.grid}>
        <form className={styles.form} onSubmit={handleSubmit(onPay)}>
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <FontAwesomeIcon icon={faCreditCard} />
              <h2>Credit Card</h2>
            </div>

            <Input
              label="Cardholder Name"
              placeholder="Name on card"
              error={errors.cardName?.message}
              {...register('cardName', { required: 'Cardholder name is required' })}
            />

            <Input
              label="Card Number"
              placeholder="1234 5678 9012 3456"
              inputMode="numeric"
              error={errors.cardNumber?.message}
              {...register('cardNumber', {
                required: 'Card number is required',
                pattern: { value: /^[0-9\s]{13,19}$/, message: 'Enter a valid card number' },
              })}
            />

            <div className={styles.formRow}>
              <Input
                label="Expiry Date"
                placeholder="MM/YY"
                error={errors.expiry?.message}
                {...register('expiry', { required: 'Expiry date is required' })}
              />
              <Input
                label="CVV"
                placeholder="123"
                inputMode="numeric"
                error={errors.cvv?.message}
                {...register('cvv', { required: 'CVV is required' })}
              />
            </div>

            <p className={styles.secureNote}>
              <FontAwesomeIcon icon={faLock} /> Your payment info is encrypted and secure.
            </p>
          </section>

          <Button type="submit" size="lg" fullWidth disabled={isPaying}>
            {isPaying ? 'Processing Deposit...' : `Pay Deposit (${depositAmount.toFixed(2)} EGP)`}
          </Button>
        </form>

        <BookingSummary doctor={doctor} date={state?.date} time={state?.time} />
      </div>
    </div>
  );
}
