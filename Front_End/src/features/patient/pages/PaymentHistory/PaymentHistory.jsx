import { useEffect, useState } from 'react';
import api from '../../../../shared/services/api';
import Badge from '../../../../shared/components/Badge/Badge';
import EmptyState from '../../../../shared/components/EmptyState/EmptyState';
import { formatDate } from '../../../../shared/utils/formatDate';
import styles from './PaymentHistory.module.css';

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadPayments() {
      try {
        setLoading(true);
        const res = await api.get('/session/my-sessions');
        const raw = res.data?.data || res.data?.sessions || res.data;
        if (mounted && Array.isArray(raw)) {
          const list = raw.map((s) => {
            const amount =
              (s.depositPaid ? Number(s.depositAmount || 0) : 0) +
                (s.balancePaid ? Number(s.balance || 0) : 0) ||
              Number(s.sessionPrice || 50);
            return {
              id: s.stripePaymentIntentId || s._id || s.id,
              doctorName: s.doctorId?.name || s.doctorName || 'Specialist Doctor',
              date: s.updatedAt || s.createdAt || s.scheduledTime || new Date().toISOString(),
              method: s.paymentMethod || 'Online Card (Stripe)',
              amount,
              status: s.depositPaid || s.balancePaid || s.status === 'completed' ? 'paid' : 'pending',
            };
          });
          setPayments(list);
        }
      } catch {
        if (mounted) setPayments([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadPayments();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className={styles.page}>
      <h1>Payment & Transaction History</h1>
      <p className={styles.subtext}>A comprehensive record of your session deposits, balance payments, and refunds.</p>

      {loading ? (
        <p style={{ textAlign: 'center', padding: '2rem' }}>Loading transaction history...</p>
      ) : payments.length ? (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Doctor</th>
                <th>Date</th>
                <th>Method</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.doctorName}</td>
                  <td>{formatDate(payment.date)}</td>
                  <td>{payment.method}</td>
                  <td>${Number(payment.amount).toFixed(2)}</td>
                  <td>
                    <Badge variant={payment.status === 'paid' ? 'success' : 'warning'}>
                      {payment.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState title="No transactions yet" description="Your session payments and booking receipts will appear here." />
      )}
    </div>
  );
}
