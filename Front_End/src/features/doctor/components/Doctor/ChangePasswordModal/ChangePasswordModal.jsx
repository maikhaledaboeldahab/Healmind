import { useState } from "react";
import styles from "./ChangePasswordModal.module.css";

// Props:
// show     -> boolean
// onClose  -> closes without saving
// onSave   -> called with { currentPassword, newPassword } once validation passes
const ChangePasswordModal = ({ show, onClose, onSave }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  if (!show) return null;

  const handleSave = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    setError("");
    // TODO: replace with a real API call once the backend exists, e.g.
    // await axios.post('/api/doctor/change-password', { currentPassword, newPassword });
    onSave({ currentPassword, newPassword });
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h5 className={styles.title}>Change Password</h5>

        {error && <p className={styles.error}>{error}</p>}

        <div className="mb-3">
          <label className={styles.label}>Current Password</label>
          <input
            type="password"
            className={styles.input}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className={styles.label}>New Password</label>
          <input
            type="password"
            className={styles.input}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className={styles.label}>Confirm New Password</label>
          <input
            type="password"
            className={styles.input}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <div className="d-flex justify-content-end gap-2 mt-4">
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.saveBtn} onClick={handleSave}>
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;