import { useState } from "react";
import styles from "./TimeSelect.module.css";

const TimeSelect = ({ value, options, onChange, editable = true, clamp }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleInputChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 2);
    onChange(digits);
  };

  const handleBlur = () => {
    if (clamp) onChange(clamp(value));
  };

  return (
    <div className={styles.wrapper}>
      {editable ? (
        <input
          type="text"
          inputMode="numeric"
          className={styles.trigger}
          value={value}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onBlur={handleBlur}
        />
      ) : (
        <button
          type="button"
          className={styles.trigger}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {value}
        </button>
      )}

      {isOpen && (
        <>
          <div className={styles.backdrop} onClick={() => setIsOpen(false)} />

          <div className={styles.menu}>
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                className={`${styles.option} ${opt === value ? styles.selected : ""}`}
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TimeSelect;