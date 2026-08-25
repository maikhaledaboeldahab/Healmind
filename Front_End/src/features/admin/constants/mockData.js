import {
  DOCTOR_STATUS,
  COMMUNITY_STATUS,
  TICKET_STATUS,
  TICKET_DECISION,
  SESSION_TYPE,
  SESSION_STATUS,
  PAYMENT_STATUS,
  NOTIFICATION_TYPE,
} from './statusEnums'

const SPECIALIZATIONS = [
  'Clinical Psychologist',
  'Psychiatrist',
  'Marriage & Family Therapist',
  'Cognitive Behavioral Therapist',
  'Child Psychologist',
  'Addiction Counselor',
  'Trauma Therapist',
]

const FIRST_NAMES_M = ['Ahmed', 'Youssef', 'Karim', 'Omar', 'Hassan', 'Tarek', 'Sami', 'Adam']
const FIRST_NAMES_F = ['Laila', 'Mona', 'Sara', 'Nour', 'Hana', 'Dina', 'Yasmin', 'Rania']
const LAST_NAMES = ['Fahmy', 'El-Sayed', 'Hassan', 'Khalil', 'Mansour', 'Aziz', 'Rashid', 'Nabil', 'Farouk', 'Adly']

function pick(arr, seed) {
  return arr[seed % arr.length]
}

function pad(id) {
  return String(id).padStart(4, '0')
}

export const MOCK_DOCTORS = Array.from({ length: 24 }).map((_, i) => {
  const id = i + 1
  const isFemale = id % 2 === 0
  const firstName = pick(isFemale ? FIRST_NAMES_F : FIRST_NAMES_M, id)
  const lastName = pick(LAST_NAMES, id * 3)
  const statusCycle = [DOCTOR_STATUS.PENDING, DOCTOR_STATUS.VERIFIED, DOCTOR_STATUS.VERIFIED, DOCTOR_STATUS.REJECTED, DOCTOR_STATUS.DISABLED]
  return {
    id: `DOC-${pad(id)}`,
    name: `Dr. ${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@healmind.com`,
    avatar: null,
    specialization: pick(SPECIALIZATIONS, id),
    yearsOfExperience: 2 + (id % 18),
    status: statusCycle[id % statusCycle.length],
    certificateUrl: '#',
    submittedDate: new Date(2026, (id % 12), (id % 27) + 1).toISOString(),
    patientsCount: 5 + (id % 40),
    sessionsCount: 20 + (id % 120),
    revenue: 1200 + id * 137.5,
    availability: id % 3 === 0 ? 'Weekdays, 9AM–5PM' : 'Flexible, evenings included',
    phone: `+20 10${id}${id}${id} ${1000 + id}`,
    bio: 'Dedicated to helping patients build sustainable coping strategies through evidence-based therapy.',
  }
})

export const MOCK_PATIENTS = Array.from({ length: 32 }).map((_, i) => {
  const id = i + 1
  const isFemale = id % 2 === 1
  const firstName = pick(isFemale ? FIRST_NAMES_F : FIRST_NAMES_M, id * 2)
  const lastName = pick(LAST_NAMES, id * 5)
  const communityCycle = [
    COMMUNITY_STATUS.VIEW_ONLY,
    COMMUNITY_STATUS.APPROVED,
    COMMUNITY_STATUS.NEEDS_ANOTHER_SESSION,
    COMMUNITY_STATUS.REJECTED,
    COMMUNITY_STATUS.APPROVED,
  ]
  return {
    id: `PAT-${pad(id)}`,
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@mail.com`,
    avatar: null,
    age: 18 + (id % 40),
    status: id % 9 === 0 ? 'suspended' : 'active',
    communityStatus: communityCycle[id % communityCycle.length],
    assignedDoctorId: `DOC-${pad((id % 24) + 1)}`,
    registeredDate: new Date(2026, (id % 12), (id % 27) + 1).toISOString(),
    medicalNotes: 'Reports mild anxiety related to work stress. No prior diagnoses on file.',
    approvalHistory: [
      {
        date: new Date(2026, (id % 12), (id % 20) + 2).toISOString(),
        decision: communityCycle[id % communityCycle.length],
        doctorId: `DOC-${pad((id % 24) + 1)}`,
      },
    ],
  }
})

export const MOCK_TICKETS = Array.from({ length: 28 }).map((_, i) => {
  const id = i + 1
  const subjects = [
    'Community Access Request',
    'Requesting Peer Discussion Access',
    'Community Group Participation Request',
    'Application for Community Support Access',
  ]
  const descriptions = [
    'Patient requests permission to view and participate in peer recovery community groups.',
    'Seeking community access after completing initial check-in session with specialist.',
    'Requesting community discussion access to interact with peers experiencing similar challenges.',
    'Wishes to share progress and engage with community support posts.',
  ]
  const preferredTimes = ['9:00 AM – 11:00 AM', '2:00 PM – 4:00 PM', '10:00 AM – 12:00 PM', '5:00 PM – 7:00 PM']
  const createdDate = new Date(2026, (id % 12), (id % 27) + 1).toISOString()
  const updatedDate = new Date(2026, (id % 12), (id % 27) + 2).toISOString()
  const preferredDate = new Date(2026, (id % 12), (id % 27) + 4).toISOString()

  // Unassigned tickets: every 3rd ticket has no doctor yet
  const isUnassigned = id % 3 === 0

  // Assigned tickets cycle through evaluation and completed states
  const assignedStatusCycle = [TICKET_STATUS.UNDER_EVALUATION, TICKET_STATUS.COMPLETED, TICKET_STATUS.COMPLETED, TICKET_STATUS.CANCELLED]
  const assignedDecisionCycle = [TICKET_DECISION.PENDING, TICKET_DECISION.APPROVE, TICKET_DECISION.NEEDS_ANOTHER_SESSION, TICKET_DECISION.REJECT]

  return {
    id: `TCK-${pad(id)}`,
    patientId: `PAT-${pad((id % 32) + 1)}`,
    doctorId: isUnassigned ? null : `DOC-${pad((id % 24) + 1)}`,
    subject: subjects[id % subjects.length],
    description: descriptions[id % descriptions.length],
    preferredDate,
    preferredTime: preferredTimes[id % preferredTimes.length],
    bookingDate: createdDate,
    sessionDate: new Date(2026, (id % 12), (id % 27) + 3).toISOString(),
    paymentStatus: id % 4 === 0 ? PAYMENT_STATUS.PENDING : PAYMENT_STATUS.PAID,
    status: isUnassigned ? TICKET_STATUS.AWAITING_ASSIGNMENT : assignedStatusCycle[id % assignedStatusCycle.length],
    decision: isUnassigned ? TICKET_DECISION.PENDING : assignedDecisionCycle[id % assignedDecisionCycle.length],
    notes: isUnassigned ? '' : 'Patient reported improved sleep patterns since last check-in.',
    createdAt: createdDate,
    updatedAt: isUnassigned ? null : updatedDate,
  }
})

export const MOCK_SESSIONS = Array.from({ length: 40 }).map((_, i) => {
  const id = i + 1
  const typeCycle = [SESSION_TYPE.INITIAL_TICKET, SESSION_TYPE.ADDITIONAL_EVALUATION, SESSION_TYPE.DIRECT_LIVE]
  const statusCycle = [SESSION_STATUS.UPCOMING, SESSION_STATUS.LIVE, SESSION_STATUS.COMPLETED, SESSION_STATUS.CANCELLED, SESSION_STATUS.MISSED]
  const day = (id % 27) + 1
  const month = id % 12
  const start = new Date(2026, month, day, 9 + (id % 8), 0)
  const end = new Date(start.getTime() + 45 * 60000)
  return {
    id: `SES-${pad(id)}`,
    patientId: `PAT-${pad((id % 32) + 1)}`,
    doctorId: `DOC-${pad((id % 24) + 1)}`,
    type: typeCycle[id % typeCycle.length],
    status: statusCycle[id % statusCycle.length],
    startTime: start.toISOString(),
    endTime: end.toISOString(),
    durationMinutes: 45,
    paymentStatus: id % 5 === 0 ? PAYMENT_STATUS.PENDING : PAYMENT_STATUS.PAID,
    doctorDecision: id % 3 === 0 ? TICKET_DECISION.NEEDS_ANOTHER_SESSION : TICKET_DECISION.APPROVE,
    notes: 'Session proceeded as scheduled with a full review of progress.',
    followUpRequired: id % 3 === 0,
  }
})

export const MOCK_PAYMENTS = Array.from({ length: 30 }).map((_, i) => {
  const id = i + 1
  const statusCycle = [PAYMENT_STATUS.PAID, PAYMENT_STATUS.PENDING, PAYMENT_STATUS.REFUNDED, PAYMENT_STATUS.FAILED]
  const amount = 250 + (id % 10) * 50
  const platformCut = Math.round(amount * 0.2)
  return {
    id: `PAY-${pad(id)}`,
    patientId: `PAT-${pad((id % 32) + 1)}`,
    doctorId: `DOC-${pad((id % 24) + 1)}`,
    sessionId: `SES-${pad((id % 40) + 1)}`,
    amount,
    status: statusCycle[id % statusCycle.length],
    sessionType: id % 2 === 0 ? SESSION_TYPE.INITIAL_TICKET : SESSION_TYPE.DIRECT_LIVE,
    paymentDate: new Date(2026, (id % 12), (id % 27) + 1).toISOString(),
    doctorRevenue: amount - platformCut,
    platformRevenue: platformCut,
  }
})

export const MOCK_NOTIFICATIONS = Array.from({ length: 18 }).map((_, i) => {
  const id = i + 1
  const typeCycle = Object.values(NOTIFICATION_TYPE)
  const type = typeCycle[id % typeCycle.length]
  const messages = {
    [NOTIFICATION_TYPE.DOCTOR_APPROVED]: 'A new doctor application was approved.',
    [NOTIFICATION_TYPE.DOCTOR_REJECTED]: 'A doctor application was rejected.',
    [NOTIFICATION_TYPE.TICKET_CREATED]: 'A new initial ticket session was booked.',
    [NOTIFICATION_TYPE.PAYMENT_COMPLETED]: 'A payment was completed successfully.',
    [NOTIFICATION_TYPE.SESSION_CANCELLED]: 'An upcoming session was cancelled.',
    [NOTIFICATION_TYPE.COMMUNITY_APPROVED]: 'A patient was approved for community access.',
  }
  return {
    id: `NOTIF-${pad(id)}`,
    type,
    message: messages[type],
    createdAt: new Date(2026, 6, 13 - id).toISOString(),
    isRead: id % 3 === 0,
  }
})

export const MOCK_COMMUNITY_POSTS = Array.from({ length: 16 }).map((_, i) => {
  const id = i + 1
  return {
    id: `POST-${pad(id)}`,
    authorId: `PAT-${pad((id % 32) + 1)}`,
    title: i % 2 === 0 ? 'Small win today' : 'Looking for advice on sleep routines',
    subject: i % 2 === 0 ? 'Small win today' : 'Looking for advice on sleep routines',
    description: 'Sharing an update with the community after a difficult week — grateful for this space.',
    content: 'Sharing an update with the community after a difficult week — grateful for this space.',
    createdAt: new Date(2026, (id % 12), (id % 27) + 1).toISOString(),
    commentsCount: 2 + (id % 6),
    reactionsCount: 5 + (id % 20),
    isReported: id % 7 === 0,
    isHidden: id % 11 === 0,
  }
})

export const MOCK_COMMUNITY_COMMENTS = Array.from({ length: 24 }).map((_, i) => {
  const id = i + 1
  return {
    id: `CMT-${pad(id)}`,
    postId: `POST-${pad((id % 16) + 1)}`,
    authorId: `PAT-${pad(((id + 3) % 32) + 1)}`,
    content: 'Thank you for sharing this — it really resonates with what I have been going through too.',
    createdAt: new Date(2026, (id % 12), (id % 27) + 2).toISOString(),
    isReported: id % 8 === 0,
    isHidden: false,
  }
})

export const MOCK_CONTACTS = Array.from({ length: 15 }).map((_, i) => {
  const id = i + 1
  const isFemale = id % 2 === 0
  const firstName = pick(isFemale ? FIRST_NAMES_F : FIRST_NAMES_M, id)
  const lastName = pick(LAST_NAMES, id * 2)
  const subjects = [
    'Issue with appointment booking schedule',
    'Question about specialist session payments',
    'Inquiry regarding community access evaluation',
    'Feedback on therapist recommendation algorithm',
    'Assistance needed with video chat connection',
  ]
  const messages = [
    'Hello, I experienced an issue when trying to confirm my appointment slot. The page reloaded and did not save my selected time.',
    'I would like to verify the invoice details for my completed consultation session on Friday.',
    'Could you please clarify how long the community access evaluation typically takes after the doctor session?',
    'The AI assistant recommendation was very helpful! I wanted to send positive feedback to the development team.',
    'During my video call yesterday, my browser had trouble connecting to the camera. Is there a recommended browser setting?',
  ]

  const createdDate = new Date(2026, (id % 12), (id % 27) + 1).toISOString()
  const updatedDate = new Date(2026, (id % 12), (id % 27) + 2).toISOString()

  return {
    id: `CONT-${pad(id)}`,
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@mail.com`,
    subject: subjects[id % subjects.length],
    message: messages[id % messages.length],
    isRead: id % 3 === 0,
    createdAt: createdDate,
    updatedAt: updatedDate,
  }
})

export const MOCK_ADMIN_PROFILE = {
  id: 'ADMIN-0001',
  name: 'Admin User',
  email: 'admin@healmind.com',
  role: 'Super Admin',
  avatar: null,
}
