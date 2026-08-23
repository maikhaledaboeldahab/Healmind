import { useState } from 'react'
import PageHeader from '../../components/PageHeader/PageHeader'
import Card from '../../components/Card/Card'
import Avatar from '../../components/Avatar/Avatar'
import Button from '../../components/Button/Button'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import styles from './Profile.module.css'

function Profile() {
  const { admin, setAdmin } = useAuth()
  const { showToast } = useToast()

  const [profileForm, setProfileForm] = useState({ name: admin?.name || '', email: admin?.email || '' })
  const [passwordForm, setPasswordForm] = useState({ current: '', next: '', confirm: '' })

  const handleProfileChange = (field) => (event) => {
    setProfileForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handlePasswordChange = (field) => (event) => {
    setPasswordForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleProfileSave = (event) => {
    event.preventDefault()
    setAdmin((prev) => ({ ...prev, ...profileForm }))
    showToast('Profile updated successfully.', 'success')
  }

  const handlePasswordSave = (event) => {
    event.preventDefault()
    if (passwordForm.next !== passwordForm.confirm) {
      showToast('New passwords do not match.', 'danger')
      return
    }
    setPasswordForm({ current: '', next: '', confirm: '' })
    showToast('Password changed successfully.', 'success')
  }

  return (
    <div>
      <PageHeader title="My Profile" description="Manage your admin account information and security settings." />

      <div className={styles.grid}>
        <Card className={styles.avatarCard}>
          <Avatar name={admin?.name || 'Admin'} size="lg" />
          <h2 className={styles.name}>{admin?.name}</h2>
          <p className={styles.role}>{admin?.role}</p>
        </Card>

        <div className={styles.formsColumn}>
          <Card>
            <h3 className={styles.sectionTitle}>Profile Information</h3>
            <form onSubmit={handleProfileSave} className={styles.form}>
              <label className={styles.field}>
                <span className={styles.label}>Full Name</span>
                <input className={styles.input} value={profileForm.name} onChange={handleProfileChange('name')} />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>Email</span>
                <input type="email" className={styles.input} value={profileForm.email} onChange={handleProfileChange('email')} />
              </label>
              <div className={styles.actions}>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </Card>

          <Card>
            <h3 className={styles.sectionTitle}>Change Password</h3>
            <form onSubmit={handlePasswordSave} className={styles.form}>
              <label className={styles.field}>
                <span className={styles.label}>Current Password</span>
                <input type="password" className={styles.input} value={passwordForm.current} onChange={handlePasswordChange('current')} />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>New Password</span>
                <input type="password" className={styles.input} value={passwordForm.next} onChange={handlePasswordChange('next')} />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>Confirm New Password</span>
                <input type="password" className={styles.input} value={passwordForm.confirm} onChange={handlePasswordChange('confirm')} />
              </label>
              <div className={styles.actions}>
                <Button type="submit" variant="secondary">
                  Update Password
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Profile
