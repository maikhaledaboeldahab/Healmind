import PatientListItem from "../PatientListItems/PatientListItems";
import styles from "./RecentPatients.module.css";

const RecentPatients = ({ patients = [] }) => {
  return (
    <div className={`${styles.card} p-3 p-md-4`}>
      <h4 className={styles.title}>Recent Patients</h4>

      {patients.length === 0 ? (
        <div className={styles.emptyState}>
          <i className="fa-regular fa-user fa-2x mb-2"></i>
          <p>No recent patient activity yet.</p>
        </div>
      ) : (
        patients.map((patient) => (
          <PatientListItem key={patient.id} {...patient} />
        ))
      )}
    </div>
  );
};

export default RecentPatients;