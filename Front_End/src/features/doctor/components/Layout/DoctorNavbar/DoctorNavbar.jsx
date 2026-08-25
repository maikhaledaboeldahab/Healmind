import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./DoctorNavbar.module.css";

const DoctorNavbar = ({ doctorName = "Doctor", doctorImg }) => {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Session Booking",
      text: "Sarah Jenkins booked a therapy session for tomorrow at 09:00 AM.",
      time: "10m ago",
      isRead: false,
      link: "/doctor/sessions",
      state: { tab: "history" },
    },
    {
      id: 2,
      title: "New Inquiry Ticket",
      text: "Omar Khalil sent a new session request ticket.",
      time: "45m ago",
      isRead: false,
      link: "/doctor/sessions",
      state: { tab: "requests" },
    },
    {
      id: 3,
      title: "Patient Update",
      text: "Marcus Thorne updated depression screening notes.",
      time: "2h ago",
      isRead: false,
      link: "/doctor/patients",
      state: {},
    },
  ]);

  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifDropdown(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onLogoutClick = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleNotificationClick = (notif) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
    );
    setShowNotifDropdown(false);
    if (notif.link) {
      navigate(notif.link, { state: notif.state });
    }
  };

  return (
    <nav
      className={`${styles.navbar} d-flex justify-content-between align-items-center shadow-sm`}
    >
      <div className="d-flex align-items-center">
        <span className={styles.brand}>HealMind</span>
      </div>

      <div className={styles.doctorSection}>
        {/* Notification Icon & Dropdown */}
        <div className="position-relative" ref={notifRef}>
          <div
            className={styles.notifIcon}
            onClick={() => {
              setShowNotifDropdown((prev) => !prev);
              setShowProfileDropdown(false);
            }}
            title="Notifications"
          >
            <i className="fa-solid fa-bell"></i>
            {unreadCount > 0 && (
              <span className={`badge rounded-pill ${styles.badge}`}>
                {unreadCount}
              </span>
            )}
          </div>

          {showNotifDropdown && (
            <div className={styles.notifDropdown}>
              <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                <span className="fw-bold small">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    className="btn btn-link p-0 text-decoration-none small"
                    style={{ fontSize: "0.75rem", color: "var(--color-primary)" }}
                    onClick={markAllAsRead}
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <div className={styles.notifList}>
                {notifications.length === 0 ? (
                  <div className="p-3 text-center text-muted small">No notifications</div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`${styles.notifItem} ${!notif.isRead ? styles.notifUnread : ""} p-3 border-bottom`}
                      onClick={() => handleNotificationClick(notif)}
                    >
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <span className="fw-bold small">{notif.title}</span>
                        <span className="text-muted" style={{ fontSize: "0.7rem" }}>
                          {notif.time}
                        </span>
                      </div>
                      <p className="text-muted mb-0 small" style={{ fontSize: "0.8rem", lineHeight: 1.3 }}>
                        {notif.text}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="position-relative" ref={profileRef}>
          <button
            className={`${styles.profileToggle} btn d-flex align-items-center gap-2`}
            type="button"
            onClick={() => {
              setShowProfileDropdown((prev) => !prev);
              setShowNotifDropdown(false);
            }}
            aria-expanded={showProfileDropdown}
          >
            {doctorImg ? (
              <img
                src={doctorImg}
                alt="doctor"
                className={styles.avatarCircle}
              />
            ) : (
              <div className={styles.avatarCircle}>
                {doctorName.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="fw-semibold d-none d-md-block">
              Dr. {doctorName}
            </span>
            <i className={`fa-solid fa-chevron-down ${styles.chevron} ${showProfileDropdown ? "fa-rotate-180" : ""}`}></i>
          </button>

          {showProfileDropdown && (
            <div
              className={`dropdown-menu dropdown-menu-end show ${styles.menu}`}
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                display: "block",
                zIndex: 1060,
              }}
            >
              <button
                className="dropdown-item d-flex align-items-center py-2 px-3 mb-1"
                onClick={() => {
                  setShowProfileDropdown(false);
                  navigate("/doctor/profile");
                }}
              >
                <i className="fa-regular fa-user me-2 text-muted"></i>
                My Profile
              </button>
              <div className="dropdown-divider my-1"></div>
              <button
                className="dropdown-item text-danger d-flex align-items-center py-2 px-3"
                onClick={onLogoutClick}
              >
                <i className="fa-solid fa-right-from-bracket me-2"></i>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default DoctorNavbar;