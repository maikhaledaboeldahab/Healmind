import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../../shared/services/api';
import RatingStars from '../../../../shared/components/RatingStars/RatingStars';
import Input from '../../../../shared/components/Input/Input';
import Button from '../../../../shared/components/Button/Button';
import styles from './RateDoctor.module.css';

export default function RateDoctor() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function loadSession() {
      try {
        const res = await api.get(`/session/${sessionId}`);
        setSession(res.data?.data || res.data);
      } catch {
        // Fallback gracefully
      }
    }
    if (sessionId) loadSession();
  }, [sessionId]);

  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    const doctorId = session?.doctorId?._id || session?.doctorId || session?.doctor;
    if (!doctorId) {
      setErrorMsg('Could not determine specialist ID for this session.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      await api.post('/reviews', {
        doctor: doctorId,
        reviewText: data.feedback?.trim() || 'Session completed with doctor.',
        rating: Number(rating),
      });
      setSubmitted(true);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to submit rating.');
    } finally {
      setLoading(false);
    }
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

  const doctorName = session?.doctorId?.name || session?.doctorName || 'Your Specialist';

  return (
    <div className={styles.page}>
      <h1>Rate Your Session</h1>
      <p className={styles.subtext}>How was your experience with Dr. {doctorName}?</p>

      {errorMsg && (
        <div style={{ padding: '0.75rem 1rem', background: '#fee2e2', color: '#b91c1c', borderRadius: '8px', marginBottom: '1rem' }}>
          {errorMsg}
        </div>
      )}

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

        <Button type="submit" disabled={rating === 0 || loading}>
          {loading ? 'Submitting...' : 'Submit Rating'}
        </Button>
      </form>
    </div>
  );
}
