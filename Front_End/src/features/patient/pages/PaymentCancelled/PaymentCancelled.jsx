import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PaymentCancelled() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate('/sessions/upcoming', { replace: true });
    }, 2000);
  }, [navigate]);

  return (
    <div style={{ padding: '4rem 1rem', textAlign: 'center' }}>
      <h2>Payment Cancelled</h2>
      <p style={{ color: '#666', marginTop: '0.5rem' }}>Your payment process was cancelled. Redirecting back to upcoming sessions...</p>
    </div>
  );
}
