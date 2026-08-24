import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { sessionReport } from '../../../../data/sessions';
import Button from '../../../../shared/components/Button/Button';
import styles from './SessionReport.module.css';

export default function SessionReport() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Session Report</h1>
        <p className={styles.subtext}>Session #{sessionId}</p>
      </div>

      <section className={styles.card}>
        <h2>Summary</h2>
        <p>{sessionReport.summary}</p>
      </section>

      <section className={styles.card}>
        <h2>Notes</h2>
        <p>{sessionReport.notes}</p>
      </section>

      <section className={styles.card}>
        <h2>Recommendations</h2>
        <ul className={styles.recommendations}>
          {sessionReport.recommendations.map((rec, i) => (
            <li key={i}>
              <FontAwesomeIcon icon={faCircleCheck} /> {rec}
            </li>
          ))}
        </ul>
      </section>

      <Button onClick={() => navigate(`/sessions/${sessionId}/rate`)}>Rate This Doctor</Button>
    </div>
  );
}
