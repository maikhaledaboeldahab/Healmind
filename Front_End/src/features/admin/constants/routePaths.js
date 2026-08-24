export const ROUTE_PATHS = {
  LOGIN: '/login',

  DASHBOARD: '/admin',

  DOCTOR_VERIFICATION: '/admin/doctor-verification',

  DOCTORS: '/admin/doctors',
  DOCTOR_NEW: '/admin/doctors/new',
  DOCTOR_DETAILS: '/admin/doctors/:doctorId',
  DOCTOR_EDIT: '/admin/doctors/:doctorId/edit',

  PATIENTS: '/admin/patients',
  PATIENT_NEW: '/admin/patients/new',
  PATIENT_DETAILS: '/admin/patients/:patientId',
  PATIENT_EDIT: '/admin/patients/:patientId/edit',

  TICKETS: '/admin/tickets',
  TICKET_DETAILS: '/admin/tickets/:ticketId',

  SESSIONS: '/admin/sessions',
  SESSIONS_CALENDAR: '/admin/sessions/calendar',
  SESSION_DETAILS: '/admin/sessions/:sessionId',

  PAYMENTS: '/admin/payments',
  PAYMENT_DETAILS: '/admin/payments/:paymentId',

  COMMUNITY_POSTS: '/admin/community/posts',
  COMMUNITY_COMMENTS: '/admin/community/comments',

  CONTACTS: '/admin/contacts',

  NOTIFICATIONS: '/admin/notifications',
  REPORTS: '/admin/reports',
  SETTINGS: '/admin/settings',
  PROFILE: '/admin/profile',
}

export const buildPath = (path, params = {}) => {
  let result = path
  Object.entries(params).forEach(([key, value]) => {
    result = result.replace(`:${key}`, value)
  })
  return result
}
