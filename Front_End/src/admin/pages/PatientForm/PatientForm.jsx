import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../../components/PageHeader/PageHeader'
import Card from '../../components/Card/Card'
import Button from '../../components/Button/Button'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import { patientService } from '../../services/patientService'
import { doctorService } from '../../services/doctorService'
import { useToast } from '../../hooks/useToast'
import { buildPath, ROUTE_PATHS } from '../../constants/routePaths'
import styles from './PatientForm.module.css'

const EMPTY_FORM = {
  name: '',
  email: '',
  age: '',
  assignedDoctorId: '',
  medicalNotes: '',
}

function PatientForm() {
  const { patientId } = useParams()
  const isEditMode = Boolean(patientId)
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [form, setForm] = useState(EMPTY_FORM)
  const [doctors, setDoctors] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    Promise.all([doctorService.getAll(), isEditMode ? patientService.getById(patientId) : Promise.resolve(null)]).then(
      ([doctorsResult, patientResult]) => {
        setDoctors(doctorsResult)
        if (patientResult) setForm({ ...EMPTY_FORM, ...patientResult })
        setIsLoading(false)
      },
    )
  }, [patientId, isEditMode])

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSaving(true)
    try {
      if (isEditMode) {
        await patientService.update(patientId, form)
        showToast('Patient profile updated.', 'success')
        navigate(buildPath(ROUTE_PATHS.PATIENT_DETAILS, { patientId }))
      } else {
        const created = await patientService.create(form)
        showToast('Patient created successfully.', 'success')
        navigate(buildPath(ROUTE_PATHS.PATIENT_DETAILS, { patientId: created.id }))
      }
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) return <LoadingSpinner fullHeight label="Loading patient…" />

  return (
    <div>
      <PageHeader
        title={isEditMode ? 'Edit Patient' : 'Add Patient'}
        description={isEditMode ? "Update this patient's profile information." : 'Create a new patient profile on the platform.'}
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
              <span className={styles.label}>Age</span>
              <input type="number" min="0" className={styles.input} value={form.age} onChange={handleChange('age')} />
            </label>
            <label className={`col-md-6 ${styles.field}`}>
              <span className={styles.label}>Assigned Doctor</span>
              <select className={styles.input} value={form.assignedDoctorId} onChange={handleChange('assignedDoctorId')}>
                <option value="">Unassigned</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className={styles.field}>
            <span className={styles.label}>Medical Notes</span>
            <textarea className={styles.textarea} rows={4} value={form.medicalNotes} onChange={handleChange('medicalNotes')} />
          </label>

          <div className={styles.actions}>
            <Button variant="ghost" type="button" onClick={() => navigate(ROUTE_PATHS.PATIENTS)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSaving}>
              {isEditMode ? 'Save Changes' : 'Create Patient'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default PatientForm
