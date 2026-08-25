import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SessionRow from "../../components/Doctor/SessionRow/SessionRow";
import SessionRequestRow from "../../components/Doctor/SessionRequestRow/SessionRequestRow";
import FilterToolbar from "../../components/UI/FilterToolbar/FilterToolbar";
import Pagination from "../../components/UI/Pagination/Pagination";
import ConfirmModal from "../../components/UI/ConfirmModal/ConfirmModal";
import Toast from "../../components/UI/Toast/Toast";
import VideoCallModal from "../../components/Doctor/VideoCallModal/VideoCallModal";
import sessionStyles from "./Sessions.module.css";

const itemsPerPage = 5;

const sampleSessions = [
  { id: 1, sessionId: "6a8965eda6ce8b3fb9a9a1e8", patientName: "Julian Vance", date: "Oct 24, 2023", time: "09:00 AM", sessionType: "Cognitive Behavioral Therapy (CBT)", status: "Completed", decision: "Approved" },
  { id: 2, sessionId: "6a8965eda6ce8b3fb9a9a1e9", patientName: "Maya Rossi", date: "Oct 24, 2023", time: "11:30 AM", sessionType: "Intake Session", status: "In-progress", decision: "Pending" },
  { id: 3, sessionId: "6a8965eda6ce8b3fb9a9a1ea", patientName: "David Chen", date: "Oct 23, 2023", time: "02:15 PM", sessionType: "Follow-up", status: "Cancelled", decision: "Rejected" },
  { id: 4, sessionId: "6a8965eda6ce8b3fb9a9a1eb", patientName: "Leo Brooks", date: "Oct 23, 2023", time: "10:00 AM", sessionType: "Group Session", status: "Completed", decision: "Approved" },
  { id: 5, sessionId: "6a8965eda6ce8b3fb9a9a1ec", patientName: "Sarah Jenkins", date: "Oct 22, 2023", time: "04:45 PM", sessionType: "Follow-up", status: "Completed", decision: "Approved" },
];

const initialRequests = [
  { id: 1, sessionId: "6a8965eda6ce8b3fb9a9a1ed", patientName: "Nora Sami", requestedDate: "Oct 26, 2023", requestedTime: "01:00 PM", message: "I've been struggling with sleep and constant worry about work. I'd like to talk through some coping strategies.", status: "pending" },
  { id: 2, sessionId: "6a8965eda6ce8b3fb9a9a1ee", patientName: "Omar Khalil", requestedDate: "Oct 27, 2023", requestedTime: "10:00 AM", message: "First-time session — looking for support with managing stress after a recent job change.", status: "pending" },
];

const Sessions = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.tab || "history"); // "history" | "requests"

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

  // History tab state
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  // Video call modal state
  const [activeVideoCall, setActiveVideoCall] = useState(null); // session object

  // Requests tab state
  const [requests, setRequests] = useState(initialRequests);
  const [confirmAction, setConfirmAction] = useState(null); // { requestId, type: "accept" | "reject" }
  const [toast, setToast] = useState({ show: false, message: "" });

  const filteredSessions = sampleSessions.filter((session) => {
    const matchesSearch = session.patientName
      .toLowerCase()
      .includes(searchValue.toLowerCase());
    const matchesStatus = statusFilter === "All" || session.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSearchChange = (value) => {
    setSearchValue(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(filteredSessions.length / itemsPerPage));
  const paginatedSessions = filteredSessions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleStartVideoCall = (session) => {
    setActiveVideoCall(session);
  };

  const handleConfirmDecision = () => {
    const { requestId, type } = confirmAction;

    if (type === "accept") {
      setRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status: "accepted" } : r))
      );
      setToast({ show: true, message: "Session accepted. Video call is now available." });
    } else {
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
      setToast({ show: true, message: "Session request rejected." });
    }

    setConfirmAction(null);
  };

  return (
    <div>
      <div className="mb-4">
        <h3 className="fw-bold mb-1">Sessions</h3>
        <p className="text-muted mb-0">Manage session requests and review your clinical history.</p>
      </div>

      <div className="d-flex gap-2 mb-4">
        <button
          className={`${sessionStyles.tabBtn} ${activeTab === "history" ? sessionStyles.tabActive : ""}`}
          onClick={() => setActiveTab("history")}
        >
          History
        </button>
        <button
          className={`${sessionStyles.tabBtn} ${activeTab === "requests" ? sessionStyles.tabActive : ""}`}
          onClick={() => setActiveTab("requests")}
        >
          Requests
          {requests.filter((r) => r.status === "pending").length > 0 && (
            <span className={sessionStyles.tabBadge}>
              {requests.filter((r) => r.status === "pending").length}
            </span>
          )}
        </button>
      </div>

      {activeTab === "history" ? (
        <>
          <FilterToolbar
            searchValue={searchValue}
            onSearchChange={handleSearchChange}
            searchPlaceholder="Filter by patient name..."
            filters={["All", "Completed", "In-progress", "Cancelled"]}
            activeFilter={statusFilter}
            onFilterChange={handleFilterChange}
          />

          <div className="bg-white rounded-4 shadow-sm p-3 p-md-4">
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead>
                  <tr>
                    <th>PATIENT</th>
                    <th>DATE</th>
                    <th>TIME</th>
                    <th>SESSION TYPE</th>
                    <th>STATUS</th>
                    <th>DECISION</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedSessions.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center text-muted py-4">
                        No sessions found.
                      </td>
                    </tr>
                  ) : (
                    paginatedSessions.map((session) => (
                      <SessionRow
                        key={session.id}
                        {...session}
                        onVideoCall={() => handleStartVideoCall(session)}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
              <span className="text-muted" style={{ fontSize: "0.85rem" }}>
                Showing {filteredSessions.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}-
                {Math.min(currentPage * itemsPerPage, filteredSessions.length)} of{" "}
                {filteredSessions.length} sessions
              </span>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </>
      ) : requests.length === 0 ? (
        <div className="bg-white rounded-4 shadow-sm p-3 p-md-4 text-center text-muted py-5">
          <i className="fa-regular fa-calendar-check fa-2x mb-2"></i>
          <p className="mb-0">No pending session requests.</p>
        </div>
      ) : (
        requests.map((request) => (
          <SessionRequestRow
            key={request.id}
            {...request}
            onAccept={() => setConfirmAction({ requestId: request.id, type: "accept" })}
            onReject={() => setConfirmAction({ requestId: request.id, type: "reject" })}
          />
        ))
      )}

      {/* Jitsi Video Call Modal Component */}
      <VideoCallModal
        show={!!activeVideoCall}
        onClose={() => setActiveVideoCall(null)}
        sessionId={activeVideoCall?.sessionId || "6a8965eda6ce8b3fb9a9a1e8"}
        patientName={activeVideoCall?.patientName || "Patient"}
        doctorName="Farah"
      />

      <ConfirmModal
        show={!!confirmAction}
        title={confirmAction?.type === "accept" ? "Accept Session Request" : "Reject Session Request"}
        message={
          confirmAction?.type === "accept"
            ? "This will confirm the session and unlock the video call at the scheduled time."
            : "This will decline the request. The patient will be notified."
        }
        confirmText={confirmAction?.type === "accept" ? "Accept" : "Reject"}
        confirmColor={confirmAction?.type === "accept" ? "primary" : "error"}
        onConfirm={handleConfirmDecision}
        onCancel={() => setConfirmAction(null)}
      />

      <Toast
        show={toast.show}
        message={toast.message}
        onClose={() => setToast({ show: false, message: "" })}
      />
    </div>
  );
};

export default Sessions;