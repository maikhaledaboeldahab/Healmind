import { useState } from 'react'
import PageHeader from '../../components/PageHeader/PageHeader'
import Card from '../../components/Card/Card'
import Button from '../../components/Button/Button'
import { useToast } from '../../hooks/useToast'
import styles from './Settings.module.css'

function Settings() {
  const { showToast } = useToast()
  const [general, setGeneral] = useState({
    platformName: 'HealMind',
    supportEmail: 'support@healmind.com',
    sessionDuration: 45,
    communityRules: 'Be kind, respect privacy, and avoid sharing identifying medical information publicly.',
  })
  const [notifications, setNotifications] = useState({
    doctorApprovals: true,
    paymentAlerts: true,
    sessionCancellations: true,
    communityReports: true,
  })

  const handleGeneralChange = (field) => (event) => {
    setGeneral((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleToggle = (field) => () => {
    setNotifications((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  const handleSave = (event) => {
    event.preventDefault()
    showToast('Settings saved successfully.', 'success')
  }

  return (
    <div>
      <PageHeader title="Settings" description="Configure platform-wide preferences and notification behavior." />

      <form onSubmit={handleSave} className={styles.grid}>
        <Card>
          <h3 className={styles.sectionTitle}>General Settings</h3>
          <div className={styles.formGroup}>
            <label className={styles.field}>
              <span className={styles.label}>Platform Name</span>
              <input className={styles.input} value={general.platformName} onChange={handleGeneralChange('platformName')} />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>Support Email</span>
              <input type="email" className={styles.input} value={general.supportEmail} onChange={handleGeneralChange('supportEmail')} />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>Default Session Duration (minutes)</span>
              <input type="number" className={styles.input} value={general.sessionDuration} onChange={handleGeneralChange('sessionDuration')} />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>Community Rules</span>
              <textarea rows={4} className={styles.textarea} value={general.communityRules} onChange={handleGeneralChange('communityRules')} />
            </label>
          </div>
        </Card>

        <Card>
          <h3 className={styles.sectionTitle}>Notification Settings</h3>
          <div className={styles.toggleList}>
            {[
              { key: 'doctorApprovals', label: 'Doctor approval and rejection alerts' },
              { key: 'paymentAlerts', label: 'Payment completion alerts' },
              { key: 'sessionCancellations', label: 'Session cancellation alerts' },
              { key: 'communityReports', label: 'Community report alerts' },
            ].map((item) => (
              <label key={item.key} className={styles.toggleRow}>
                <span>{item.label}</span>
                <input type="checkbox" checked={notifications[item.key]} onChange={handleToggle(item.key)} className={styles.checkbox} />
              </label>
            ))}
          </div>
        </Card>

        <div className={styles.actions}>
          <Button type="submit" icon="fa-solid fa-floppy-disk">
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  )
}

export default Settings
