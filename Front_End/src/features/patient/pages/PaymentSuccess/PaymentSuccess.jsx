import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Loader from '../../../../shared/components/Loader/Loader';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const sessionId = searchParams.get('app_session_id') || searchParams.get('session_id');
    setTimeout(() => {
      navigate('/sessions/upcoming', {
        state: {
          paid: true,
          bookingId: sessionId,
        },
        replace: true,
      });
    }, 1500);
  }, [navigate, searchParams]);

  return (
    <div style={{ padding: '4rem 1rem', textAlign: 'center' }}>
      <Loader label="Payment completed successfully! Redirecting to upcoming sessions..." />
    </div>
  );
}
