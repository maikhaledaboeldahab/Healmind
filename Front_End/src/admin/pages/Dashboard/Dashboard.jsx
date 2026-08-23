import PageHeader from '../../components/PageHeader/PageHeader.jsx'
import StatCard from '../../components/StatCard/StatCard.jsx'
import Card from '../../components/Card/Card.jsx'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner.jsx'
import DoctorCard from '../../components/DoctorCard/DoctorCard.jsx'
import PatientCard from '../../components/PatientCard/PatientCard.jsx'
import SessionCard from '../../components/SessionCard/SessionCard.jsx'
import { useDashboardData } from './useDashboardData.js'
import { useNavigate } from 'react-router-dom'
import { buildPath, ROUTE_PATHS } from '../../constants/routePaths'
import { formatCurrency } from '../../utils/formatCurrency'
import RevenueChart from './RevenueChart.jsx'
import QuickActions from './QuickActions.jsx'
import MiniCalendar from './MiniCalendar.jsx'
import styles from './Dashboard.module.css'

function Dashboard() {
  const { data, isLoading } = useDashboardData()
  const navigate = useNavigate()

  if (isLoading || !data) {
    return <LoadingSpinner fullHeight label="Loading dashboard…" />
  }

  const { stats, doctors, patients, sessions, notifications } = data

  const findDoctorName = (id) => doctors.find((d) => d.id === id)?.name || id
  const findPatientName = (id) => patients.find((p) => p.id === id)?.name || id

  const latestDoctors = [...doctors].slice(0, 4)
  const latestPatients = [...patients].slice(0, 4)
  const todaysSessions = sessions
    .filter((s) => new Date(s.startTime).toDateString() === new Date().toDateString())
    .slice(0, 4)
  const recentActivities = [...notifications].slice(0, 5)

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="A real-time overview of doctors, patients, sessions, and platform revenue."
      />

      <div className={`row g-3 ${styles.statGrid}`}>
        {[
          { icon: 'fa-solid fa-user-doctor', label: 'Total Doctors', value: stats.totalDoctors, tone: 'primary' },
          { icon: 'fa-solid fa-user-check', label: 'Verified Doctors', value: stats.verifiedDoctors, tone: 'secondary' },
          { icon: 'fa-solid fa-hourglass-half', label: 'Pending Doctors', value: stats.pendingDoctors, tone: 'tertiary' },
          { icon: 'fa-solid fa-user-slash', label: 'Rejected Doctors', value: stats.rejectedDoctors, tone: 'danger' },
          { icon: 'fa-solid fa-hospital-user', label: 'Total Patients', value: stats.totalPatients, tone: 'primary' },
          { icon: 'fa-solid fa-clock', label: 'Waiting Evaluation', value: stats.waitingEvaluation, tone: 'tertiary' },
          { icon: 'fa-solid fa-people-group', label: 'Community Approved', value: stats.communityApproved, tone: 'secondary' },
          { icon: 'fa-regular fa-eye', label: 'View Only Patients', value: stats.viewOnlyPatients, tone: 'primary' },
          { icon: 'fa-regular fa-calendar-check', label: "Today's Sessions", value: stats.todaysSessions, tone: 'secondary' },
          { icon: 'fa-regular fa-calendar', label: 'Upcoming Sessions', value: stats.upcomingSessions, tone: 'primary' },
          { icon: 'fa-solid fa-ticket', label: 'Pending Tickets', value: stats.pendingTickets, tone: 'tertiary' },
          { icon: 'fa-solid fa-circle-check', label: 'Completed Tickets', value: stats.completedTickets, tone: 'secondary' },
          { icon: 'fa-solid fa-rotate', label: 'Needs Another Session', value: stats.needsAnotherSession, tone: 'tertiary' },
          { icon: 'fa-solid fa-sack-dollar', label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), tone: 'primary' },
          { icon: 'fa-solid fa-chart-line', label: 'Monthly Revenue', value: formatCurrency(stats.monthlyRevenue), tone: 'secondary' },
          { icon: 'fa-regular fa-bell', label: 'Unread Notifications', value: stats.unreadNotifications, tone: 'danger' },
        ].map((stat) => (
          <div key={stat.label} className="col-6 col-md-4 col-xl-3">
            <StatCard icon={stat.icon} label={stat.label} value={stat.value} tone={stat.tone} />
          </div>
        ))}
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.leftColumn}>
          <Card>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Revenue Overview</h2>
              <span className={styles.sectionHint}>Last 6 months</span>
            </div>
            <RevenueChart payments={data.payments} />
          </Card>

          <QuickActions />

          <Card>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Latest Registered Doctors</h2>
              <button type="button" className={styles.viewAll} onClick={() => navigate(ROUTE_PATHS.DOCTORS)}>
                View all
              </button>
            </div>
            <div className={styles.doctorGrid}>
              {latestDoctors.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  onViewDetails={(d) => navigate(buildPath(ROUTE_PATHS.DOCTOR_DETAILS, { doctorId: d.id }))}
                />
              ))}
            </div>
          </Card>
        </div>

        <div className={styles.rightColumn}>
          <MiniCalendar sessions={sessions} />

          <Card>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Today's Sessions</h2>
              <button type="button" className={styles.viewAll} onClick={() => navigate(ROUTE_PATHS.SESSIONS_CALENDAR)}>
                Calendar
              </button>
            </div>
            <div className={styles.stackList}>
              {todaysSessions.length === 0 && <p className={styles.emptyHint}>No sessions scheduled for today.</p>}
              {todaysSessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  patientName={findPatientName(session.patientId)}
                  doctorName={findDoctorName(session.doctorId)}
                  onClick={(s) => navigate(buildPath(ROUTE_PATHS.SESSION_DETAILS, { sessionId: s.id }))}
                />
              ))}
            </div>
          </Card>

          <Card>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Recent Activities</h2>
              <button type="button" className={styles.viewAll} onClick={() => navigate(ROUTE_PATHS.NOTIFICATIONS)}>
                View all
              </button>
            </div>
            <ul className={styles.activityList}>
              {recentActivities.map((activity) => (
                <li key={activity.id} className={styles.activityItem}>
                  <span className={styles.activityDot} />
                  {activity.message}
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Latest Registered Patients</h2>
              <button type="button" className={styles.viewAll} onClick={() => navigate(ROUTE_PATHS.PATIENTS)}>
                View all
              </button>
            </div>
            <div className={styles.stackList}>
              {latestPatients.map((patient) => (
                <PatientCard
                  key={patient.id}
                  patient={patient}
                  onClick={(p) => navigate(buildPath(ROUTE_PATHS.PATIENT_DETAILS, { patientId: p.id }))}
                />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
