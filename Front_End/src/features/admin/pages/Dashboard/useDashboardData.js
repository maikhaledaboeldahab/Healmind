import { useEffect, useState } from 'react'
import { doctorService } from '../../services/doctorService'
import { patientService } from '../../services/patientService'
import { sessionService } from '../../services/sessionService'
import { ticketService } from '../../services/ticketService'
import { paymentService } from '../../services/paymentService'
import { notificationService } from '../../services/notificationService'
import { DOCTOR_STATUS, COMMUNITY_STATUS, SESSION_STATUS, TICKET_DECISION } from '../../constants/statusEnums'

export function useDashboardData() {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState(null)

  useEffect(() => {
    let isMounted = true

    async function load() {
      const [doctors, patients, sessions, tickets, payments, notifications] = await Promise.all([
        doctorService.getAll(),
        patientService.getAll(),
        sessionService.getAll(),
        ticketService.getAll(),
        paymentService.getAll(),
        notificationService.getAll(),
      ])

      if (!isMounted) return

      const today = new Date()
      const isSameDay = (iso) => new Date(iso).toDateString() === today.toDateString()

      setData({
        doctors,
        patients,
        sessions,
        tickets,
        payments,
        notifications,
        stats: {
          totalDoctors: doctors.length,
          verifiedDoctors: doctors.filter((d) => d.status === DOCTOR_STATUS.VERIFIED).length,
          pendingDoctors: doctors.filter((d) => d.status === DOCTOR_STATUS.PENDING).length,
          rejectedDoctors: doctors.filter((d) => d.status === DOCTOR_STATUS.REJECTED).length,
          totalPatients: patients.length,
          waitingEvaluation: patients.filter((p) => p.communityStatus === COMMUNITY_STATUS.NEEDS_ANOTHER_SESSION).length,
          communityApproved: patients.filter((p) => p.communityStatus === COMMUNITY_STATUS.APPROVED).length,
          viewOnlyPatients: patients.filter((p) => p.communityStatus === COMMUNITY_STATUS.VIEW_ONLY).length,
          todaysSessions: sessions.filter((s) => isSameDay(s.startTime)).length,
          upcomingSessions: sessions.filter((s) => s.status === SESSION_STATUS.UPCOMING).length,
          pendingTickets: tickets.filter((t) => t.decision === TICKET_DECISION.PENDING).length,
          completedTickets: tickets.filter((t) => t.decision === TICKET_DECISION.APPROVE).length,
          needsAnotherSession: tickets.filter((t) => t.decision === TICKET_DECISION.NEEDS_ANOTHER_SESSION).length,
          totalRevenue: payments.reduce((sum, p) => sum + p.amount, 0),
          monthlyRevenue: payments
            .filter((p) => new Date(p.paymentDate).getMonth() === today.getMonth())
            .reduce((sum, p) => sum + p.amount, 0),
          unreadNotifications: notifications.filter((n) => !n.isRead).length,
        },
      })
      setIsLoading(false)
    }

    load()
    return () => {
      isMounted = false
    }
  }, [])

  return { data, isLoading }
}
