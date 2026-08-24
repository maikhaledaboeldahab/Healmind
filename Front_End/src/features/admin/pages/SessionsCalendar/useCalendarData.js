import { useEffect, useState } from 'react'
import { sessionService } from '../../services/sessionService'
import { patientService } from '../../services/patientService'
import { doctorService } from '../../services/doctorService'

export function useCalendarData() {
  const [isLoading, setIsLoading] = useState(true)
  const [sessions, setSessions] = useState([])
  const [patients, setPatients] = useState([])
  const [doctors, setDoctors] = useState([])

  useEffect(() => {
    Promise.all([sessionService.getAll(), patientService.getAll(), doctorService.getAll()]).then(
      ([sessionsResult, patientsResult, doctorsResult]) => {
        setSessions(sessionsResult)
        setPatients(patientsResult)
        setDoctors(doctorsResult)
        setIsLoading(false)
      },
    )
  }, [])

  const findPatientName = (id) => patients.find((p) => p.id === id)?.name || id
  const findDoctorName = (id) => doctors.find((d) => d.id === id)?.name || id

  return { isLoading, sessions, findPatientName, findDoctorName }
}
