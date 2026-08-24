import { useState } from "react";
import TimeSelect from "../TimeSelect/TimeSelect";
import styles from "./SlotModal.module.css";

const hourOptions = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
const minuteOptions = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));
const periodOptions = ["AM", "PM"];

const clampHour = (val) => {
  const n = parseInt(val || "0", 10);
  if (isNaN(n) || n < 1) return "12";
  if (n > 12) return "12";
  return String(n).padStart(2, "0");
};

const clampMinute = (val) => {
  const n = parseInt(val || "0", 10);
  if (isNaN(n)) return "00";
  return String(Math.min(59, Math.max(0, n))).padStart(2, "0");
};

const from24Hour = (value, fallback) => {
  const [hStr, mStr] = (value || fallback).split(":");
  let h = parseInt(hStr, 10);
  const period = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if (h === 0) h = 12;
  return { hour: String(h).padStart(2, "0"), minute: mStr, period };
};

const to24Hour = (hour12, minute, period) => {
  let h = parseInt(hour12, 10) % 12;
  if (period === "PM") h += 12;
  return `${String(h).padStart(2, "0")}:${minute}`;
};

const SlotModal = ({ show, mode, initialData, onClose, onSave }) => {
  const startParts = from24Hour(initialData?.start, "09:00");
  const endParts = from24Hour(initialData?.end, "10:00");

  const [startHour, setStartHour] = useState(startParts.hour);
  const [startMinute, setStartMinute] = useState(startParts.minute);
  const [startPeriod, setStartPeriod] = useState(startParts.period);

  const [endHour, setEndHour] = useState(endParts.hour);
  const [endMinute, setEndMinute] = useState(endParts.minute);
  const [endPeriod, setEndPeriod] = useState(endParts.period);

  if (!show) return null;

  const handleSave = () => {
    onSave({
      start: to24Hour(startHour, startMinute, startPeriod),
      end: to24Hour(endHour, endMinute, endPeriod),
    });
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h5 className={styles.title}>{mode === "edit" ? "Edit Slot" : "Add New Slot"}</h5>

        <div className="mb-3">
          <label className={styles.label}>Start Time</label>
          <div className="d-flex align-items-center gap-2">
            <TimeSelect value={startHour} options={hourOptions} onChange={setStartHour} clamp={clampHour} />
            <span className={styles.colon}>:</span>
            <TimeSelect value={startMinute} options={minuteOptions} onChange={setStartMinute} clamp={clampMinute} />
            <TimeSelect value={startPeriod} options={periodOptions} onChange={setStartPeriod} editable={false} />
          </div>
        </div>

        <div className="mb-3">
          <label className={styles.label}>End Time</label>
          <div className="d-flex align-items-center gap-2">
            <TimeSelect value={endHour} options={hourOptions} onChange={setEndHour} clamp={clampHour} />
            <span className={styles.colon}>:</span>
            <TimeSelect value={endMinute} options={minuteOptions} onChange={setEndMinute} clamp={clampMinute} />
            <TimeSelect value={endPeriod} options={periodOptions} onChange={setEndPeriod} editable={false} />
          </div>
        </div>

        <div className="d-flex justify-content-end gap-2 mt-4">
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.saveBtn} onClick={handleSave}>
            {mode === "edit" ? "Save Changes" : "Add Slot"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SlotModal;