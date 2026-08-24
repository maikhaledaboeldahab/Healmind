import styles from "./DoctorPagination.module.css";

// Builds a page list like [1, "...", 4, 5, 6, "...", 25] instead of
// showing every page number when there are many pages.
const getPageNumbers = (current, total) => {
  const pages = [1];

  if (current > 3) pages.push("...");

  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
    pages.push(p);
  }

  if (current < total - 2) pages.push("...");
  if (total > 1) pages.push(total);

  return pages;
};

const DoctorPagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <div className="d-flex align-items-center gap-1">
      <button
        className={styles.arrowBtn}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <i className="fa-solid fa-chevron-left"></i>
      </button>

      {pages.map((page, index) =>
        page === "..." ? (
          <span key={`ellipsis-${index}`} className={styles.ellipsis}>
            ...
          </span>
        ) : (
          <button
            key={page}
            className={`${styles.pageBtn} ${page === currentPage ? styles.active : ""}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        )
      )}

      <button
        className={styles.arrowBtn}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <i className="fa-solid fa-chevron-right"></i>
      </button>
    </div>
  );
};

export default DoctorPagination;