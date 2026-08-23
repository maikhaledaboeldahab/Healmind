import { Link } from "react-router-dom";
import styles from "./QuickActions.module.css";

const actions = [
  { icon: "fa-calendar-days", title: "Setup Availability", description: "Update your booking slots", path: "/doctor/availability" },
  { icon: "fa-ticket", title: "Review Tickets", description: "Check unresolved inquiries", path: "/doctor/patients" },
  { icon: "fa-file-lines", title: "Patient Reports", description: "Sign off on monthly notes", path: "/doctor/patients" },
];

const QuickActions = () => {
  return (
    <div className={`${styles.card} p-3 p-md-4`}>
      <h4 className={styles.title}>Quick Actions</h4>

      <div className="d-flex flex-column gap-2">
        {actions.map((action) => (
          <Link to={action.path} key={action.title} className={styles.actionItem}>
            <div className={styles.iconBox}>
              <i className={`fa-solid ${action.icon}`}></i>
            </div>
            <div>
              <p className={styles.actionTitle}>{action.title}</p>
              <p className={styles.actionDesc}>{action.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;