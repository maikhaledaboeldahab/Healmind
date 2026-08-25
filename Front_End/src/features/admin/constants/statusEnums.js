export const DOCTOR_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
  DISABLED: 'disabled',
}

export const DOCTOR_STATUS_LABEL = {
  [DOCTOR_STATUS.PENDING]: 'Pending',
  [DOCTOR_STATUS.VERIFIED]: 'Verified',
  [DOCTOR_STATUS.REJECTED]: 'Rejected',
  [DOCTOR_STATUS.DISABLED]: 'Disabled',
}

export const COMMUNITY_STATUS = {
  VIEW_ONLY: 'view_only',
  APPROVED: 'approved',
  NEEDS_ANOTHER_SESSION: 'needs_another_session',
  REJECTED: 'rejected',
}

export const COMMUNITY_STATUS_LABEL = {
  [COMMUNITY_STATUS.VIEW_ONLY]: 'View Only',
  [COMMUNITY_STATUS.APPROVED]: 'Approved',
  [COMMUNITY_STATUS.NEEDS_ANOTHER_SESSION]: 'Needs Another Session',
  [COMMUNITY_STATUS.REJECTED]: 'Rejected',
}

export const PATIENT_STATUS = {
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
}

export const TICKET_STATUS = {
  BOOKED: 'booked',
  PAID: 'paid',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
}

export const TICKET_STATUS_LABEL = {
  [TICKET_STATUS.BOOKED]: 'Booked',
  [TICKET_STATUS.PAID]: 'Paid',
  [TICKET_STATUS.COMPLETED]: 'Completed',
  [TICKET_STATUS.CANCELLED]: 'Cancelled',
}

export const TICKET_DECISION = {
  PENDING: 'pending',
  APPROVE: 'approve',
  REJECT: 'reject',
  NEEDS_ANOTHER_SESSION: 'needs_another_session',
}

export const TICKET_DECISION_LABEL = {
  [TICKET_DECISION.PENDING]: 'Awaiting Decision',
  [TICKET_DECISION.APPROVE]: 'Approved',
  [TICKET_DECISION.REJECT]: 'Rejected',
  [TICKET_DECISION.NEEDS_ANOTHER_SESSION]: 'Needs Another Session',
}

export const SESSION_TYPE = {
  INITIAL_TICKET: 'initial_ticket_session',
  ADDITIONAL_EVALUATION: 'additional_evaluation_session',
  DIRECT_LIVE: 'direct_live_session',
}

export const SESSION_TYPE_LABEL = {
  [SESSION_TYPE.INITIAL_TICKET]: 'Initial Ticket Session',
  [SESSION_TYPE.ADDITIONAL_EVALUATION]: 'Additional Evaluation Session',
  [SESSION_TYPE.DIRECT_LIVE]: 'Direct Live Session',
}

export const SESSION_STATUS = {
  UPCOMING: 'upcoming',
  LIVE: 'live',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  MISSED: 'missed',
}

export const SESSION_STATUS_LABEL = {
  [SESSION_STATUS.UPCOMING]: 'Upcoming',
  [SESSION_STATUS.LIVE]: 'Live',
  [SESSION_STATUS.COMPLETED]: 'Completed',
  [SESSION_STATUS.CANCELLED]: 'Cancelled',
  [SESSION_STATUS.MISSED]: 'Missed',
}

export const PAYMENT_STATUS = {
  PAID: 'paid',
  PENDING: 'pending',
  REFUNDED: 'refunded',
  FAILED: 'failed',
}

export const PAYMENT_STATUS_LABEL = {
  [PAYMENT_STATUS.PAID]: 'Paid',
  [PAYMENT_STATUS.PENDING]: 'Pending',
  [PAYMENT_STATUS.REFUNDED]: 'Refunded',
  [PAYMENT_STATUS.FAILED]: 'Failed',
}

export const NOTIFICATION_TYPE = {
  DOCTOR_APPROVED: 'doctor_approved',
  DOCTOR_REJECTED: 'doctor_rejected',
  TICKET_CREATED: 'ticket_created',
  PAYMENT_COMPLETED: 'payment_completed',
  SESSION_CANCELLED: 'session_cancelled',
  COMMUNITY_APPROVED: 'community_approved',
}

export const POST_STATUS = {
  VISIBLE: 'visible',
  HIDDEN: 'hidden',
  REPORTED: 'reported',
}

/**
 * Maps a status-like string to a StatusBadge tone.
 * Tones: success | warning | danger | neutral | info
 */
export const STATUS_TONE_MAP = {
  [DOCTOR_STATUS.VERIFIED]: 'success',
  [DOCTOR_STATUS.PENDING]: 'warning',
  [DOCTOR_STATUS.REJECTED]: 'danger',
  [DOCTOR_STATUS.DISABLED]: 'neutral',

  [COMMUNITY_STATUS.APPROVED]: 'success',
  [COMMUNITY_STATUS.VIEW_ONLY]: 'neutral',
  [COMMUNITY_STATUS.NEEDS_ANOTHER_SESSION]: 'warning',
  [COMMUNITY_STATUS.REJECTED]: 'danger',

  [TICKET_STATUS.COMPLETED]: 'success',
  [TICKET_STATUS.PAID]: 'info',
  [TICKET_STATUS.BOOKED]: 'warning',
  [TICKET_STATUS.CANCELLED]: 'danger',

  [SESSION_STATUS.COMPLETED]: 'success',
  [SESSION_STATUS.UPCOMING]: 'info',
  [SESSION_STATUS.LIVE]: 'warning',
  [SESSION_STATUS.CANCELLED]: 'danger',
  [SESSION_STATUS.MISSED]: 'danger',

  [PAYMENT_STATUS.PAID]: 'success',
  [PAYMENT_STATUS.PENDING]: 'warning',
  [PAYMENT_STATUS.REFUNDED]: 'info',
  [PAYMENT_STATUS.FAILED]: 'danger',

  active: 'success',
  suspended: 'danger',
}
