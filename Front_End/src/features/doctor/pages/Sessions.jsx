import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SessionRow from "../components/Doctor/SessionRow/SessionRow";
import SessionRequestRow from "../components/Doctor/SessionRequestRow/SessionRequestRow";
import FilterToolbar from "../../../shared/components/FilterToolbar/FilterToolbar";
import Pagination from "../../../shared/components/DoctorPagination/DoctorPagination";
import ConfirmModal from "../../../shared/components/ConfirmModal/ConfirmModal";
import Toast from "../../../shared/components/DoctorToast/DoctorToast";
import VideoCall from "../../../shared/components/VideoCall/VideoCall";
import { useDoctor } from "../context/DoctorContext";
import sessionStyles from "./Sessions.module.css";

const itemsPerPage = 5;

const Sessions = () => {
  const location = useLocation();
  const { allSessions, requests, acceptSessionRequest, rejectSessionRequest } = useDoctor();

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
  const [confirmAction, setConfirmAction] = useState(null); // { requestId, type: "accept" | "reject" }
  const [toast, setToast] = useState({ show: false, message: "" });

  const sessionsList = allSessions || [];

  const filteredSessions = sessionsList.filter((session) => {
    const matchesSearch = (session.patientName || '')
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
      acceptSessionRequest(requestId);
      setToast({ show: true, message: "Session accepted! Patient added to directory and video call is scheduled." });
    } else {
      rejectSessionRequest(requestId);
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
            onVideoCall={() => handleStartVideoCall(request)}
          />
        ))
      )}

      {/* Unified Jitsi Video Call Component matching Patient view */}
      {activeVideoCall && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            zIndex: 1060,
            display: "flex",
            flexDirection: "column",
            padding: "20px",
          }}
        >
          <div className="d-flex justify-content-between align-items-center mb-2 px-3">
            <span className="text-white fw-bold">
              <i className="fa-solid fa-video me-2 text-success"></i>
              Clinical Video Call with {activeVideoCall.patientName}
            </span>
            <button
              className="btn btn-sm btn-outline-light"
              onClick={() => setActiveVideoCall(null)}
            >
              <i className="fa-solid fa-xmark me-1"></i> Close
            </button>
          </div>
          <div className="flex-grow-1 rounded-4 overflow-hidden bg-dark">
            <VideoCall
              sessionId={activeVideoCall.sessionId || `healmind-session-${activeVideoCall.id}`}
              onLeave={() => setActiveVideoCall(null)}
              fallbackDisplayName="Dr. Farah"
            />
          </div>
        </div>
      )}

      <ConfirmModal
        show={!!confirmAction}
        title={confirmAction?.type === "accept" ? "Accept Session Request" : "Reject Session Request"}
        message={
          confirmAction?.type === "accept"
            ? "This will confirm the session, schedule the video call, and add the patient to your active patients directory."
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