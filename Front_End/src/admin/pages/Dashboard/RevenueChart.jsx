import styles from './RevenueChart.module.css'

/**
 * Lightweight dummy bar chart (no external chart library needed for the
 * mock dashboard). Swap for real chart data once payment history is wired
 * to the backend.
 */
function RevenueChart({ payments }) {
  const monthly = Array.from({ length: 6 }).map((_, index) => {
    const date = new Date()
    date.setMonth(date.getMonth() - (5 - index))
    const label = date.toLocaleDateString('en-US', { month: 'short' })
    const total = payments
      .filter((p) => new Date(p.paymentDate).getMonth() === date.getMonth())
      .reduce((sum, p) => sum + p.amount, 0)
    return { label, total }
  })

  const max = Math.max(...monthly.map((m) => m.total), 1)

  return (
    <div className={styles.chart}>
      {monthly.map((month) => (
        <div key={month.label} className={styles.barColumn}>
          <div className={styles.barTrack}>
            <div className={styles.bar} style={{ height: `${Math.max(6, (month.total / max) * 100)}%` }} />
          </div>
          <span className={styles.barLabel}>{month.label}</span>
        </div>
      ))}
    </div>
  )
}

export default RevenueChart
