import { useState } from "react";
import TimeSlotCard from "../../components/Doctor/TimeSlotCard/TimeSlotCard";
import SlotModal from "../../components/Doctor/SlotModal/SlotModal";
import styles from "./Availability.module.css";

const initialSlots = {
  "2023-10-17": [
    { id: 1, type: "available", start: "09:00", end: "10:30" },
    { id: 2, type: "booked", patientName: "Sarah Jenkins", start: "11:00", end: "12:00" },
  ],
  "2023-10-19": [
    { id: 3, type: "available", start: "14:00", end: "15:00" },
    { id: 4, type: "booked", patientName: "Omar Khalil", start: "16:00", end: "17:00" },
  ],
};

const getWeekDates = (startDate) => {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    return d;
  });
};

const getMonday = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
};

const dayLabels = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const Availability = () => {
  const [weekStart, setWeekStart] = useState(getMonday(new Date("2023-10-16")));
  const [slots, setSlots] = useState(initialSlots);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [modalDateKey, setModalDateKey] = useState(null);
  const [modalSlot, setModalSlot] = useState(null);

  const weekDates = getWeekDates(weekStart);
  const monthLabel = weekStart.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const handlePrevWeek = () => {
    const prev = new Date(weekStart);
    prev.setDate(prev.getDate() - 7);
    setWeekStart(prev);
  };

  const handleNextWeek = () => {
    const next = new Date(weekStart);
    next.setDate(next.getDate() + 7);
    setWeekStart(next);
  };

  const handleDeleteSlot = (dateKey, slotId) => {
    setSlots((prev) => ({
      ...prev,
      [dateKey]: prev[dateKey].filter((s) => s.id !== slotId),
    }));
  };

  const handleOpenAddModal = (dateKey) => {
    setModalMode("add");
    setModalDateKey(dateKey);
    setModalSlot(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (dateKey, slot) => {
    setModalMode("edit");
    setModalDateKey(dateKey);
    setModalSlot(slot);
    setModalOpen(true);
  };

  const handleCloseModal = () => setModalOpen(false);

  const handleSaveSlot = ({ start, end }) => {
    setSlots((prev) => {
      const daySlots = prev[modalDateKey] || [];

      if (modalMode === "edit") {
        return {
          ...prev,
          [modalDateKey]: daySlots.map((s) =>
            s.id === modalSlot.id ? { ...s, start, end } : s
          ),
        };
      }

      const newSlot = { id: Date.now(), type: "available", start, end };
      return { ...prev, [modalDateKey]: [...daySlots, newSlot] };
    });
    setModalOpen(false);
  };

  const formatDateKey = (date) => date.toISOString().split("T")[0];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h3 className="fw-bold mb-1">{monthLabel}</h3>
          <p className="text-muted mb-0">Manage your clinical hours and session availability.</p>
        </div>

        <div className="d-flex gap-2">
          <button className={styles.navBtn} onClick={handlePrevWeek}>
            <i className="fa-solid fa-chevron-left me-1"></i> Previous
          </button>
          <button className={styles.navBtn} onClick={handleNextWeek}>
            Next <i className="fa-solid fa-chevron-right ms-1"></i>
          </button>
        </div>
      </div>

      <div className="row g-3">
        {weekDates.map((date, index) => {
          const dateKey = formatDateKey(date);
          const daySlots = slots[dateKey] || [];

          return (
            <div className="col" key={dateKey}>
              <div className={styles.dayColumn}>
                <div className={styles.dayHeader}>
                  <span className={styles.dayLabel}>{dayLabels[index]}</span>
                  <span className={styles.dayNumber}>{date.getDate()}</span>
                </div>

                {daySlots.length === 0 ? (
                  <div className={styles.emptyDay}>
                    <i className="fa-regular fa-calendar-xmark"></i>
                    <span>No slots added</span>
                  </div>
                ) : (
                  daySlots.map((slot) => (
                    <TimeSlotCard
                      key={slot.id}
                      type={slot.type}
                      patientName={slot.patientName}
                      start={slot.start}
                      end={slot.end}
                      onDelete={() => handleDeleteSlot(dateKey, slot.id)}
                      onEdit={() => handleOpenEditModal(dateKey, slot)}
                    />
                  ))
                )}

                <button className={styles.addSlotBtn} onClick={() => handleOpenAddModal(dateKey)}>
                  <i className="fa-solid fa-plus me-1"></i> Add Slot
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <SlotModal
        show={modalOpen}
        mode={modalMode}
        initialData={modalSlot}
        onClose={handleCloseModal}
        onSave={handleSaveSlot}
      />
    </div>
  );
};

export default Availability;