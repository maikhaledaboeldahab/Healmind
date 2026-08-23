import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../../components/PageHeader/PageHeader'
import Card from '../../components/Card/Card'
import Button from '../../components/Button/Button'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import { doctorService } from '../../services/doctorService'
import { useToast } from '../../hooks/useToast'
import { ROUTE_PATHS, buildPath } from '../../constants/routePaths'
import styles from './DoctorForm.module.css'

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  specialization: '',
  yearsOfExperience: '',
  availability: '',
  bio: '',
}

function DoctorForm() {
  const { doctorId } = useParams()
  const isEditMode = Boolean(doctorId)
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [form, setForm] = useState(EMPTY_FORM)
  const [isLoading, setIsLoading] = useState(isEditMode)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!isEditMode) return
    doctorService.getById(doctorId).then((doctor) => {
      if (doctor) setForm({ ...EMPTY_FORM, ...doctor })
      setIsLoading(false)
    })
  }, [doctorId, isEditMode])

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSaving(true)
    try {
      if (isEditMode) {
        await doctorService.update(doctorId, form)
        showToast('Doctor profile updated.', 'success')
        navigate(buildPath(ROUTE_PATHS.DOCTOR_DETAILS, { doctorId }))
      } else {
        const created = await doctorService.create(form)
        showToast('Doctor created and marked pending verification.', 'success')
        navigate(buildPath(ROUTE_PATHS.DOCTOR_DETAILS, { doctorId: created.id }))
      }
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) return <LoadingSpinner fullHeight label="Loading doctor…" />

  return (
    <div>
      <PageHeader
        title={isEditMode ? 'Edit Doctor' : 'Add Doctor'}
        description={isEditMode ? 'Update this doctor\'s profile information.' : 'Create a new doctor profile on the platform.'}
      />

      <Card>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className="row g-3">
            <label className={`col-md-6 ${styles.field}`}>
              <span className={styles.label}>Full Name</span>
              <input className={styles.input} required value={form.name} onChange={handleChange('name')} />
            </label>
            <label className={`col-md-6 ${styles.field}`}>
              <span className={styles.label}>Email</span>
              <input type="email" className={styles.input} required value={form.email} onChange={handleChange('email')} />
            </label>
          </div>

          <div className="row g-3">
            <label className={`col-md-6 ${styles.field}`}>
              <span className={styles.label}>Phone</span>
              <input className={styles.input} value={form.phone} onChange={handleChange('phone')} />
            </label>
            <label className={`col-md-6 ${styles.field}`}>
              <span className={styles.label}>Specialization</span>
              <input className={styles.input} required value={form.specialization} onChange={handleChange('specialization')} />
            </label>
          </div>

          <div className="row g-3">
            <label className={`col-md-6 ${styles.field}`}>
              <span className={styles.label}>Years of Experience</span>
              <input
                type="number"
                min="0"
                className={styles.input}
                value={form.yearsOfExperience}
                onChange={handleChange('yearsOfExperience')}
              />
            </label>
            <label className={`col-md-6 ${styles.field}`}>
              <span className={styles.label}>Availability</span>
              <input className={styles.input} value={form.availability} onChange={handleChange('availability')} />
            </label>
          </div>

          <label className={styles.field}>
            <span className={styles.label}>Bio</span>
            <textarea className={styles.textarea} rows={4} value={form.bio} onChange={handleChange('bio')} />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Certificate Upload</span>
            <div className={styles.uploadField}>
              <i className="fa-solid fa-cloud-arrow-up" aria-hidden="true" />
              <span>Drag & drop certificate PDF, or click to browse</span>
              <input type="file" accept="application/pdf" className={styles.fileInput} />
            </div>
          </label>

          <div className={styles.actions}>
            <Button variant="ghost" type="button" onClick={() => navigate(ROUTE_PATHS.DOCTORS)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSaving}>
              {isEditMode ? 'Save Changes' : 'Create Doctor'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default DoctorForm
