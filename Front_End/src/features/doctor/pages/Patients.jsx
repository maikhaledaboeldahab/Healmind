import { useState, useEffect } from "react";
import PatientCard from "../components/Doctor/PatientCard/PatientCard";
import FilterToolbar from "../../../shared/components/FilterToolbar/FilterToolbar";
import { useDoctor } from "../context/DoctorContext";

const DoctorPatients = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const { patients } = useDoctor();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch = patient.patientName
      .toLowerCase()
      .includes(searchValue.toLowerCase());
    const matchesFilter =
      activeFilter === "All" ||
      patient.status === activeFilter ||
      patient.communityStatus === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h3 className="fw-bold mb-1">Patients Directory</h3>
          <p className="text-muted mb-0">
            You have {patients.length} active patient records.
          </p>
        </div>
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