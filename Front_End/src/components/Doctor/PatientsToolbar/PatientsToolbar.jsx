import styles from "./PatientsToolbar.module.css";

const filters = ["All", "Pending", "Approved", "Rejected", "Needs Another Session"];

// Props:
// searchValue    -> current search text (controlled by parent)
// onSearchChange -> function called when the user types
// activeFilter   -> currently selected filter chip
// onFilterChange -> function called when a chip is clicked
const PatientsToolbar = ({ searchValue, onSearchChange, activeFilter, onFilterChange }) => {
  return (
    <div className="mb-4">
      <div className={styles.searchBox}>
        <i className="fa-solid fa-magnifying-glass"></i>
        <input
          type="text"
          placeholder="Search patients..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="d-flex flex-wrap gap-2 mt-3">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={`${styles.chip} ${activeFilter === filter ? styles.chipActive : ""}`}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PatientsToolbar;