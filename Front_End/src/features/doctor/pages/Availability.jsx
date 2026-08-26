import { useState } from "react";
import TimeSlotCard from "../components/Doctor/TimeSlotCard/TimeSlotCard";
import SlotModal from "../components/Doctor/SlotModal/SlotModal";
import { useDoctor } from "../context/DoctorContext";
import styles from "./Availability.module.css";

const getMonday = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
};

const formatDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getWeekDates = (startDate) => {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    return d;
  });
};

const dayLabels = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const Availability = () => {
  const { slots: apiSlots, addSlot, deleteSlot, editSlot } = useDoctor();
  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()));

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

  const handleDeleteSlot = async (dateKey, slotId) => {
    await deleteSlot(slotId);
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

  const handleSaveSlot = async ({ start, end }) => {
    const timeStr = `${start} - ${end}`;
    if (modalMode === "edit" && modalSlot) {
      await editSlot(modalSlot.id || modalSlot._id, { day: modalDateKey, time: timeStr });
    } else {
      await addSlot({ day: modalDateKey, time: timeStr, location: "Online Video Room" });
    }
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
          const daySlots = (apiSlots || [])
            .filter((s) => {
              if (!s.day) return false;
              const sDateKey = new Date(s.day).toISOString().split("T")[0];
              return sDateKey === dateKey;
            })
            .map((s) => ({
              id: s._id || s.id,
              type: s.isBooked ? "booked" : "available",
              patientName: s.patientName || "Booked Patient",
              start: s.time?.split("-")?.[0]?.trim() || s.time || "09:00",
              end: s.time?.split("-")?.[1]?.trim() || "10:00",
            }));

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