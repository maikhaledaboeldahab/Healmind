import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import RatingStars from '../../components/RatingStars/RatingStars';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import styles from './RateDoctor.module.css';

export default function RateDoctor() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    // Simulated submission — wire to ratings.service.js once backend exists.
    console.log('Rating submitted', { sessionId, rating, ...data });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className={styles.page}>
        <div className={styles.thanksCard}>
          <h2>Thank you for your feedback!</h2>
          <p>Your rating helps other patients find the right specialist.</p>
          <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1>Rate Your Session</h1>
      <p className={styles.subtext}>How was your experience with your specialist?</p>

      <form className={styles.card} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.ratingRow}>
          <RatingStars value={rating} interactive size="lg" onChange={setRating} />
        </div>

        <Input
          as="textarea"
          label="Share your feedback"
          placeholder="Tell us more about your session..."
          {...register('feedback')}
        />

        <Button type="submit" disabled={rating === 0}>
          Submit Rating
        </Button>
      </form>
    </div>
  );
}
