import Card from '../../components/Card/Card'
import Button from '../../components/Button/Button'
import styles from './ReportCard.module.css'

function ReportCard({ icon, title, description, onExport, isExporting }) {
  return (
    <Card className={styles.card}>
      <div className={styles.iconCircle}>
        <i className={icon} aria-hidden="true" />
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      <div className={styles.actions}>
        <Button variant="ghost" onClick={() => onExport('csv')} isLoading={isExporting === 'csv'}>
          <i className="fa-regular fa-file-lines" /> CSV
        </Button>
        <Button variant="ghost" onClick={() => onExport('excel')} isLoading={isExporting === 'excel'}>
          <i className="fa-regular fa-file-excel" /> Excel
        </Button>
        <Button variant="ghost" onClick={() => onExport('pdf')} isLoading={isExporting === 'pdf'}>
          <i className="fa-regular fa-file-pdf" /> PDF
        </Button>
      </div>
    </Card>
  )
}

export default ReportCard
