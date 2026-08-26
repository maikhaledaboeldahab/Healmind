import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faFilePrescription, faUserDoctor } from '@fortawesome/free-solid-svg-icons';
import api from '../../../../shared/services/api';
import Button from '../../../../shared/components/Button/Button';
import EmptyState from '../../../../shared/components/EmptyState/EmptyState';
import styles from './SessionReport.module.css';

export default function SessionReport() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadReport() {
      try {
        setLoading(true);
        const res = await api.get(`/session/${sessionId}`);
        const data = res.data?.data || res.data;
        if (mounted) setSession(data);
      } catch {
        if (mounted) setSession(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    if (sessionId) loadReport();
    return () => {
      mounted = false;
    };
  }, [sessionId]);

  if (loading) {
    return (
      <div className={styles.page}>
        <p style={{ textAlign: 'center', padding: '3rem' }}>Loading session report...</p>
      </div>
    );
  }

  const report = session?.report;
  const prescription = session?.prescription;
  const doctorName = session?.doctorId?.name || session?.doctorName || 'Your Doctor';

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Session Visit Report</h1>
          <p className={styles.subtext}>
            Session #{sessionId} • <FontAwesomeIcon icon={faUserDoctor} /> Dr. {doctorName}
          </p>
        </div>
      </div>

      {!report && !prescription ? (
        <EmptyState
          title="Report Not Yet Submitted"
          description="The visit report and medical recommendations for this session have not been published by your doctor yet."
          action={<Button onClick={() => navigate('/sessions/history')}>Back to History</Button>}
        />
      ) : (
        <>
          {report?.Diagnosis && (
            <section className={styles.card}>
              <h2>Clinical Diagnosis & Summary</h2>
              <p>{report.Diagnosis}</p>
            </section>
          )}

          {report?.Notes && (
            <section className={styles.card}>
              <h2>Doctor's Clinical Notes</h2>
              <p>{report.Notes}</p>
            </section>
          )}

          {report?.Followup_recommendation && (
            <section className={styles.card}>
              <h2>Follow-up Recommendations</h2>
              <ul className={styles.recommendations}>
                <li>
                  <FontAwesomeIcon icon={faCircleCheck} /> {report.Followup_recommendation}
                </li>
              </ul>
            </section>
          )}

          {prescription && (
            <section className={styles.card}>
              <h2>
                <FontAwesomeIcon icon={faFilePrescription} /> Prescription & Care Plan
              </h2>
              <p style={{ whiteSpace: 'pre-wrap' }}>{prescription}</p>
            </section>
          )}

          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
            <Button onClick={() => navigate(`/sessions/${sessionId}/rate`)}>Rate This Doctor</Button>
            <Button variant="outline" onClick={() => navigate('/sessions/history')}>
              Back to History
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
