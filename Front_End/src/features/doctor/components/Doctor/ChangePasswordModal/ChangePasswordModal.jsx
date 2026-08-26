import { useState } from "react";
import api from "../../../../../shared/services/api";
import styles from "./ChangePasswordModal.module.css";

// Props:
// show     -> boolean
// onClose  -> closes without saving
// onSave   -> called with { currentPassword, newPassword } once API call succeeds
const ChangePasswordModal = ({ show, onClose, onSave }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!show) return null;

  const handleSave = async () => {
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

    try {
      setLoading(true);
      setError("");
      await api.patch("/auth/change-password", {
        currentPassword,
        newPassword,
      });
      onSave?.({ currentPassword, newPassword });
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (Array.isArray(err.response?.data?.errors) ? err.response.data.errors.join(", ") : null) ||
        err.message ||
        "Failed to update password. Please check your current password.";
      setError(msg);
    } finally {
      setLoading(false);
    }
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
            disabled={loading}
          />
        </div>

        <div className="mb-3">
          <label className={styles.label}>New Password</label>
          <input
            type="password"
            className={styles.input}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="mb-3">
          <label className={styles.label}>Confirm New Password</label>
          <input
            type="password"
            className={styles.input}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="d-flex justify-content-end gap-2 mt-4">
          <button className={styles.cancelBtn} onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button className={styles.saveBtn} onClick={handleSave} disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;