import { useEffect } from "react";
import styles from "./Toast.module.css";

// Props:
// show     -> boolean
// message  -> text to display
// onClose  -> called automatically after the toast auto-dismisses
const Toast = ({ show, message, onClose }) => {
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className={styles.toast}>
      <i className="fa-solid fa-circle-check me-2"></i>
      {message}
    </div>
  );
};

export default Toast;