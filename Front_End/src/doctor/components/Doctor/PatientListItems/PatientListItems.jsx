import styles from "./PatientListItems.module.css";

// Props:
// patientName  -> e.g. "David Chen"
// lastVisit    -> e.g. "2 hours ago" / "Yesterday"
// note         -> e.g. "Session notes finalized"
const PatientListItem = ({ patientName, lastVisit, note }) => {
  return (
    <div className={`${styles.row} d-flex align-items-center gap-3 py-2`}>
      <div className={styles.avatar}>{patientName.charAt(0)}</div>

      <div className="flex-grow-1">
        <p className={styles.patientName}>{patientName}</p>
        {note && <p className={styles.note}>{note}</p>}
      </div>

      <span className={styles.lastVisit}>{lastVisit}</span>
    </div>
  );
};

export default PatientListItem;