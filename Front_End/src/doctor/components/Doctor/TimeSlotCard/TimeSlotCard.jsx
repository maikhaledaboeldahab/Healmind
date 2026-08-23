import styles from "./TimeSlotCard.module.css";

const TimeSlotCard = ({ type, start, end, onDelete, onEdit }) => {
  const isBooked = type === "booked";

  const handleDeleteClick = (e) => {
    e.stopPropagation(); // prevent the click from also triggering onEdit
    onDelete();
  };

  return (
    <div
      className={`${styles.slotCard} ${isBooked ? styles.booked : styles.available}`}
      onClick={!isBooked ? onEdit : undefined}
      style={{ cursor: isBooked ? "default" : "pointer" }}
    >
      <div>
        <span className={styles.slotType}>{isBooked ? "Booked" : "Available"}</span>
        <span className={styles.slotTime}>
          {start} - {end}
        </span>
      </div>

      {!isBooked && (
        <button className={styles.deleteBtn} onClick={handleDeleteClick} aria-label="Delete slot">
          <i className="fa-solid fa-trash"></i>
        </button>
      )}
    </div>
  );
};

export default TimeSlotCard;