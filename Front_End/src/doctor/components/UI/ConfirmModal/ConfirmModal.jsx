import styles from "./ConfirmModal.module.css";

// Fully generic confirmation dialog — no knowledge of "community" or "patients".
// Props:
// show          -> boolean
// title, message -> text content
// confirmText   -> label on the confirm button, e.g. "Approve"
// confirmColor  -> "primary" | "error" | "neutral" — controls the confirm button's color
// onConfirm, onCancel -> callbacks
const ConfirmModal = ({ show, title, message, confirmText, confirmColor = "primary", onConfirm, onCancel }) => {
  if (!show) return null;

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h5 className={styles.title}>{title}</h5>
        <p className={styles.message}>{message}</p>

        <div className="d-flex justify-content-end gap-2 mt-4">
          <button className={styles.cancelBtn} onClick={onCancel}>
            Cancel
          </button>
          <button className={`${styles.confirmBtn} ${styles[confirmColor]}`} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;