import styles from "./PatientOverview.module.css";

// Props:
// diagnosis -> e.g. "Generalized Anxiety Disorder with mild depressive episodes."
// notes     -> array of { id, date, text }
const PatientOverview = ({ diagnosis, notes = [] }) => {
  return (
    <div className={`${styles.card} p-3 p-md-4 mb-4`}>
      <h4 className={styles.sectionTitle}>Medical Summary</h4>
      <p className={styles.diagnosis}>{diagnosis}</p>

      <h4 className={`${styles.sectionTitle} mt-4`}>Doctor Notes</h4>

      {notes.length === 0 ? (
        <p className={styles.emptyText}>No notes added yet.</p>
      ) : (
        notes.map((note) => (
          <div key={note.id} className={styles.noteRow}>
            <span className={styles.noteDate}>{note.date}</span>
            <p className={styles.noteText}>{note.text}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default PatientOverview;