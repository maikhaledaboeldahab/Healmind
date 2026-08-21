import styles from "./FilterToolbar.module.css";

// Fully generic — no knowledge of "patients" or "sessions".
// Props:
// searchValue, onSearchChange, searchPlaceholder -> the search input
// filters, activeFilter, onFilterChange           -> the filter chips
// children                                        -> optional extra controls (e.g. a date dropdown)
const FilterToolbar = ({
    searchValue,
    onSearchChange,
    searchPlaceholder = "Search...",
    filters,
    activeFilter,
    onFilterChange,
    children,
}) => {
    return (
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4 pe-2">
            <div className="d-flex flex-wrap gap-2 align-items-center">
                {filters.map((filter) => (
                    <button
                        key={filter}
                        onClick={() => onFilterChange(filter)}
                        className={`${styles.chip} ${activeFilter === filter ? styles.chipActive : ""}`}
                    >
                        {filter}
                    </button>
                ))}
                {children}
            </div>
            <div className={`${styles.searchBox} me-2`}>
                <i className="fa-solid fa-magnifying-glass"></i>
                <input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>
        </div>
    );
};

export default FilterToolbar;