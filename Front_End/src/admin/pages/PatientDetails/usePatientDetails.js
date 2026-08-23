import { useEffect, useState } from 'react'
import { patientService } from '../../services/patientService'
import { doctorService } from '../../services/doctorService'
import { ticketService } from '../../services/ticketService'
import { sessionService } from '../../services/sessionService'
import { paymentService } from '../../services/paymentService'

export function usePatientDetails(patientId) {
  const [isLoading, setIsLoading] = useState(true)
  const [patient, setPatient] = useState(null)
  const [doctors, setDoctors] = useState([])
  const [tickets, setTickets] = useState([])
  const [sessions, setSessions] = useState([])
  const [payments, setPayments] = useState([])

  const reload = () => {
    setIsLoading(true)
    Promise.all([
      patientService.getById(patientId),
      doctorService.getAll(),
      ticketService.getAll(),
      sessionService.getAll(),
      paymentService.getAll(),
    ]).then(([patientResult, doctorsResult, ticketsResult, sessionsResult, paymentsResult]) => {
      setPatient(patientResult)
      setDoctors(doctorsResult)
      setTickets(ticketsResult.filter((t) => t.patientId === patientId))
      setSessions(sessionsResult.filter((s) => s.patientId === patientId))
      setPayments(paymentsResult.filter((p) => p.patientId === patientId))
      setIsLoading(false)
    })
  }

  useEffect(() => {
    reload()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId])

  const findDoctorName = (doctorId) => doctors.find((d) => d.id === doctorId)?.name || doctorId

  return { isLoading, patient, tickets, sessions, payments, findDoctorName, reload }
}
