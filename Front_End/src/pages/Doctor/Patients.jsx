import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PatientCard from "../../components/Doctor/PatientCard/PatientCard";
import FilterToolbar from "../../components/UI/FilterToolbar/FilterToolbar";

const samplePatients = [
  { id: 1, patientName: "Arlo Sterling", age: 29, gender: "Male", status: "Approved", therapyType: "Cognitive Behavioral Therapy", lastSession: "Oct 24, 2023" },
  { id: 2, patientName: "Evelyn Thorne", age: 64, gender: "Female", status: "Pending", therapyType: "Grief Counseling", lastSession: "Oct 21, 2023" },
  { id: 3, patientName: "Marcus Vane", age: 42, gender: "Male", status: "Needs Another Session", therapyType: "Mindfulness Training", lastSession: "Oct 19, 2023" },
];

const DoctorPatients = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredPatients = samplePatients.filter((patient) => {
    const matchesSearch = patient.patientName
      .toLowerCase()
      .includes(searchValue.toLowerCase());
    const matchesFilter = activeFilter === "All" || patient.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h3 className="fw-bold mb-1">Patients Directory</h3>
          <p className="text-muted mb-0">
            You have {samplePatients.length} active patient records.
          </p>
        </div>

        <Link
          to="/doctor/patients/new"
          className="btn d-flex align-items-center gap-2 px-3 py-2"
          style={{
            backgroundColor: "var(--color-primary)",
            color: "var(--color-on-primary)",
            borderRadius: "var(--radius-full)",
            fontWeight: 700,
            fontSize: "0.9rem",
          }}
        >
          <i className="fa-solid fa-plus"></i>
          Add New Patient
        </Link>
      </div>

      <FilterToolbar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Search patients..."
        filters={["All", "Pending", "Approved", "Rejected", "Needs Another Session"]}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {isLoading ? (
        <div className="text-center py-5">
          <div
            className="spinner-border"
            style={{ color: "var(--color-primary)" }}
            role="status"
          ></div>
        </div>
      ) : filteredPatients.length === 0 ? (
        <div className="text-center py-5">
          <i className="fa-regular fa-face-frown fa-2x mb-2"></i>
          <p>No patients found.</p>
        </div>
      ) : (
        <div className="row g-3">
          {filteredPatients.map((patient) => (
            <div className="col-12 col-md-6 col-lg-4" key={patient.id}>
              <PatientCard {...patient} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorPatients;