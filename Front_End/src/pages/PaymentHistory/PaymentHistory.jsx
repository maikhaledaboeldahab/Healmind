import { paymentHistory } from '../../data/payments';
import Badge from '../../components/Badge/Badge';
import EmptyState from '../../components/EmptyState/EmptyState';
import { formatDate } from '../../utils/formatDate';
import styles from './PaymentHistory.module.css';

export default function PaymentHistory() {
  return (
    <div className={styles.page}>
      <h1>Payment History</h1>
      <p className={styles.subtext}>A record of your session payments and refunds.</p>

      {paymentHistory.length ? (
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
              {paymentHistory.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.doctorName}</td>
                  <td>{formatDate(payment.date)}</td>
                  <td>{payment.method}</td>
                  <td>${payment.amount.toFixed(2)}</td>
                  <td>
                    <Badge>{payment.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState title="No payments yet" description="Your payment history will appear here." />
      )}
    </div>
  );
}
