import { classNames } from '../../utils/classNames'
import styles from './Pagination.module.css'

function getPageNumbers(current, total) {
  const pages = []
  const windowSize = 1
  for (let page = 1; page <= total; page += 1) {
    if (page === 1 || page === total || Math.abs(page - current) <= windowSize) {
      pages.push(page)
    } else if (pages[pages.length - 1] !== '…') {
      pages.push('…')
    }
  }
  return pages
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  return (
    <nav className={styles.nav} aria-label="Pagination">
      <button
        type="button"
        className={styles.navButton}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <i className="fa-solid fa-chevron-left" aria-hidden="true" />
      </button>

      {getPageNumbers(currentPage, totalPages).map((page, index) =>
        page === '…' ? (
          <span key={`ellipsis-${index}`} className={styles.ellipsis}>
            …
          </span>
        ) : (
          <button
            key={page}
            type="button"
            className={classNames(styles.pageButton, page === currentPage && styles.active)}
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ),
      )}

      <button
        type="button"
        className={styles.navButton}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <i className="fa-solid fa-chevron-right" aria-hidden="true" />
      </button>
    </nav>
  )
}

export default Pagination
