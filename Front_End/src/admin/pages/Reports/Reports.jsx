import { useState } from 'react'
import PageHeader from '../../components/PageHeader/PageHeader.jsx'
import { reportService } from '../../services/reportService'
import { useToast } from '../../hooks/useToast'
import ReportCard from './ReportCard.jsx'
import styles from './Reports.module.css'

const REPORT_TYPES = [
  { key: 'doctors', icon: 'fa-solid fa-user-doctor', title: 'Doctors Report', description: 'Verification rates, specializations, and doctor performance.' },
  { key: 'patients', icon: 'fa-solid fa-hospital-user', title: 'Patients Report', description: 'Registrations, community status distribution, and engagement.' },
  { key: 'revenue', icon: 'fa-solid fa-sack-dollar', title: 'Revenue Report', description: 'Platform and doctor revenue broken down by period.' },
  { key: 'sessions', icon: 'fa-regular fa-calendar-check', title: 'Sessions Report', description: 'Session volume, completion rates, and cancellations.' },
  { key: 'payments', icon: 'fa-solid fa-credit-card', title: 'Payments Report', description: 'Transaction history and payment status breakdown.' },
  { key: 'community', icon: 'fa-solid fa-people-group', title: 'Community Statistics', description: 'Posts, comments, reports, and moderation activity.' },
]

function Reports() {
  const { showToast } = useToast()
  const [exportingKey, setExportingKey] = useState(null)

  const handleExport = async (reportKey, format) => {
    setExportingKey(`${reportKey}-${format}`)
    await reportService.exportReport(reportKey, format)
    setExportingKey(null)
    showToast(`${format.toUpperCase()} export ready for download.`, 'success')
  }

  return (
    <div>
      <PageHeader title="Reports & Analytics" description="Generate and export detailed reports across every module of HealMind." />

      <div className={styles.grid}>
        {REPORT_TYPES.map((report) => (
          <ReportCard
            key={report.key}
            icon={report.icon}
            title={report.title}
            description={report.description}
            onExport={(format) => handleExport(report.key, format)}
            isExporting={exportingKey?.startsWith(report.key) ? exportingKey.split('-')[1] : null}
          />
        ))}
      </div>
    </div>
  )
}

export default Reports
