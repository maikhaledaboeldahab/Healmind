import { useState } from "react";
import styles from "./PersonalInfo.module.css";

// Props:
// initialData -> { email, phone, specialization, yearsExperience }
// onSave      -> called with the updated field values
const PersonalInfo = ({ initialData, onSave }) => {
  const [formData, setFormData] = useState(initialData);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    await onSave?.(formData);
  };

  return (
    <div className={`${styles.card} p-3 p-md-4 mb-4`}>
      <h4 className={styles.title}>Personal Information</h4>

      <div className={styles.grid}>
        <div>
          <label className={styles.label}>Email Address</label>
          <input
            type="email"
            className={styles.input}
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </div>

        <div>
          <label className={styles.label}>Phone Number</label>
          <input
            type="tel"
            className={styles.input}
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
        </div>

        <div>
          <label className={styles.label}>Specialization</label>
          <input
            type="text"
            className={styles.input}
            value={formData.specialization}
            onChange={(e) => handleChange("specialization", e.target.value)}
          />
        </div>

        <div>
          <label className={styles.label}>Years of Experience</label>
          <input
            type="number"
            min="0"
            className={styles.input}
            value={formData.yearsExperience}
            onChange={(e) => handleChange("yearsExperience", e.target.value)}
          />
        </div>
      </div>

      <button className={styles.saveBtn} onClick={handleSave}>
        Save Changes
      </button>
    </div>
  );
};

export default PersonalInfo;