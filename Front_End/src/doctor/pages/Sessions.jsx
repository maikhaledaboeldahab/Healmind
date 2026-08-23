import { useState, useEffect } from "react";
import SessionRow from "../components/Doctor/SessionRow/SessionRow";
import FilterToolbar from "../components/UI/FilterToolbar/FilterToolbar";
import Pagination from "../components/UI/Pagination/Pagination";
import sessionStyles from "./Sessions.module.css";

const dateOptions = ["Last 7 Days", "Last 30 Days", "Last 90 Days", "All Time"];
const itemsPerPage = 2; // small on purpose, just to demo pagination with 5 sample rows

const sampleSessions = [
  { id: 1, patientName: "Julian Vance", date: "Oct 24, 2023", time: "09:00 AM", sessionType: "Cognitive Behavioral Therapy (CBT)", status: "Completed", decision: "Approved" },
  { id: 2, patientName: "Maya Rossi", date: "Oct 24, 2023", time: "11:30 AM", sessionType: "Intake Session", status: "In-progress", decision: "Pending" },
  { id: 3, patientName: "David Chen", date: "Oct 23, 2023", time: "02:15 PM", sessionType: "Follow-up", status: "Cancelled", decision: "Rejected" },
  { id: 4, patientName: "Leo Brooks", date: "Oct 23, 2023", time: "10:00 AM", sessionType: "Group Session", status: "Completed", decision: "Approved" },
  { id: 5, patientName: "Sarah Jenkins", date: "Oct 22, 2023", time: "04:45 PM", sessionType: "Follow-up", status: "Completed", decision: "Approved" },
];

const Sessions = () => {
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("Last 30 Days");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredSessions = sampleSessions.filter((session) => {
    const matchesSearch = session.patientName
      .toLowerCase()
      .includes(searchValue.toLowerCase());
    const matchesStatus = statusFilter === "All" || session.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Whenever the search term or filter changes, jump back to page 1 —
  // otherwise you could be stuck on "page 3" of a list that now only has 1 page.
  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredSessions.length / itemsPerPage));
  const paginatedSessions = filteredSessions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <div className="mb-4">
        <h3 className="fw-bold mb-1">Sessions History</h3>
        <p className="text-muted mb-0">Manage and review your clinical session logs.</p>
      </div>

      <FilterToolbar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Filter by patient name..."
        filters={["All", "Completed", "In-progress", "Cancelled"]}
        activeFilter={statusFilter}
        onFilterChange={setStatusFilter}
      >
        <select
          className={sessionStyles.dateSelect}
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        >
          {dateOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </FilterToolbar>

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
                  <SessionRow key={session.id} {...session} />
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
    </div>
  );
};

export default Sessions;