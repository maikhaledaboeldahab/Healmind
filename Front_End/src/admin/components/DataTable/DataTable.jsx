import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import EmptyState from '../EmptyState/EmptyState'
import styles from './DataTable.module.css'

/**
 * columns: [{ key, header, render?: (row) => node, width? }]
 */
function DataTable({ columns, rows, isLoading, emptyTitle = 'No records found', emptyDescription, getRowKey }) {
  if (isLoading) {
    return <LoadingSpinner label="Loading records…" />
  }

  if (!rows || rows.length === 0) {
    return <EmptyState icon="fa-regular fa-folder-open" title={emptyTitle} description={emptyDescription} />
  }

  return (
    <div className={`table-responsive ${styles.tableWrapper}`}>
      <table className={`table align-middle mb-0 ${styles.table}`}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} style={{ width: column.width }}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={getRowKey ? getRowKey(row) : row.id}>
              {columns.map((column) => (
                <td key={column.key}>{column.render ? column.render(row) : row[column.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DataTable
