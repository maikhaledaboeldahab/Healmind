import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDay, faClock, faVideo, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Badge from '../Badge/Badge';
import Button from '../Button/Button';
import { formatShortDate } from '../../utils/formatDate';
import styles from './SessionCard.module.css';

export default function SessionCard({ session, showJoin = false, onPayBalance }) {
  const navigate = useNavigate();
  const [isPaying, setIsPaying] = useState(false);

  const handlePayBalance = () => {
    if (onPayBalance) {
      onPayBalance(session);
      return;
    }

    const sessionId = session.id || session._id;
    const docPrice = session.sessionPrice > 0
      ? session.sessionPrice
      : (session.doctorId?.sessionPrice > 0 ? session.doctorId?.sessionPrice : 500);

    const depositAmt = session.depositAmount > 0
      ? session.depositAmount
      : Math.round(docPrice * 0.20 * 100) / 100;

    const remainingAmt = session.remainingBalance > 0
      ? session.remainingBalance
      : Math.round((docPrice - depositAmt) * 100) / 100;

    navigate(`/payment/${sessionId}`, {
      state: {
        isBalancePayment: true,
        sessionId: sessionId,
        bookingId: sessionId,
        doctorId: session.doctorId,
        doctorName: session.doctorName,
        date: session.date,
        time: session.time,
        sessionPrice: docPrice,
        depositAmount: depositAmt,
        remainingBalance: remainingAmt,
      },
    });
  };

  const isUnpaid = !session.balancePaid && (session.status?.toLowerCase() === 'pending' || (session.remainingBalance && session.remainingBalance > 0));

  const createdAt = session.rawSession?.createdAt || session.createdAt;
  let daysLeft = null;
  if (isUnpaid && createdAt) {
    const expiresAt = new Date(createdAt).getTime() + 7 * 24 * 60 * 60 * 1000;
    daysLeft = Math.max(0, Math.ceil((expiresAt - Date.now()) / (1000 * 60 * 60 * 24)));
  }

  return (
    <div className={styles.card}>
      {session.doctorImage && (
        <img src={session.doctorImage} alt={session.doctorName} className={styles.avatar} />
      )}
      <div className={styles.info}>
        <h4 className={styles.name}>{session.doctorName}</h4>
        <div className={styles.meta}>
          <span>
            <FontAwesomeIcon icon={faCalendarDay} /> {formatShortDate(session.date)}
          </span>
          <span>
            <FontAwesomeIcon icon={faClock} /> {session.time}
          </span>
        </div>
      </div>
      <div className={styles.actions}>
        <Badge variant={isUnpaid ? 'warning' : 'success'}>
          {session.status} {daysLeft !== null && `(Expires in ${daysLeft}d)`}
        </Badge>
        <div className={styles.buttons}>
          {isUnpaid && (
            <Button
              size="sm"
              icon={<FontAwesomeIcon icon={faCreditCard} />}
              disabled={isPaying}
              onClick={handlePayBalance}
            >
              {isPaying ? 'Processing...' : 'Complete Payment'}
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={() => navigate(`/sessions/${session.id}`)}>
            View Details
          </Button>
          {showJoin && (
            <Button size="sm" icon={<FontAwesomeIcon icon={faVideo} />} onClick={() => navigate(`/sessions/${session.id}/video`)}>
              Join
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
