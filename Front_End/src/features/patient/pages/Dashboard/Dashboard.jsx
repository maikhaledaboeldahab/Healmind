import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTicket,
  faCalendarCheck,
  faUsers,
  faPlus,
  faUserDoctor,
  faRobot,
  faBell,
} from '@fortawesome/free-solid-svg-icons';
import api from '../../../../shared/services/api';
import { useAuth } from '../../../../shared/context/AuthContext';
import { useNotifications } from '../../../../shared/context/NotificationContext';
import StatCard from '../../../../shared/components/StatCard/StatCard';
import SessionCard from '../../../../shared/components/SessionCard/SessionCard';
import TicketCard from '../../../../shared/components/TicketCard/TicketCard';
import NotificationCard from '../../../../shared/components/NotificationCard/NotificationCard';
import Button from '../../../../shared/components/Button/Button';
import EmptyState from '../../../../shared/components/EmptyState/EmptyState';
import Loader from '../../../../shared/components/Loader/Loader';
import styles from './Dashboard.module.css';

const QUICK_ACTIONS = [
  { label: 'Create Ticket', icon: faPlus, to: '/tickets/new' },
  { label: 'Browse Doctors', icon: faUserDoctor, to: '/doctors' },
  { label: 'Open AI Assistant', icon: faRobot, to: '/ai-assistant' },
  { label: 'Community', icon: faUsers, to: '/community' },
];

function normalizeSession(s) {
  if (!s) return null;
  return {
    id: s._id || s.id,
    doctorId: s.doctorId?._id || s.doctorId || 'doc-1',
    doctorName: s.doctorId?.name || s.doctorname || 'Doctor',
    doctorImage: s.doctorId?.profileImage || null,
    date: s.scheduledTime ? new Date(s.scheduledTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Upcoming',
    time: s.scheduledTime ? new Date(s.scheduledTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'Scheduled',
    status: s.status ? (s.status.charAt(0).toUpperCase() + s.status.slice(1)) : 'Confirmed',
    depositPaid: s.depositPaid || false,
    depositAmount: s.depositAmount || 70,
    remainingBalance: s.balance || 280,
    sessionPrice: s.sessionPrice || 350,
  };
}

function normalizeTicket(t) {
  if (!t) return null;
  return {
    id: t._id || t.id,
    subject: t.subject || 'Community Access Request',
    description: t.description || t.notes || 'Ticket submitted for mental health support.',
    status: t.status === 'completed' || t.status === 'Closed' ? 'Closed' : 'Open',
    createdAt: t.createdAt ? new Date(t.createdAt).toLocaleDateString() : 'Recent',
  };
}

export default function Dashboard() {
  const { user } = useAuth();
  const { notifications, markAsRead } = useNotifications();
  const navigate = useNavigate();

  const [liveSessions, setLiveSessions] = useState([]);
  const [liveTickets, setLiveTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      setIsLoading(true);
      try {
        const [sessionsRes, ticketsRes] = await Promise.allSettled([
          api.get('/session/my-sessions'),
          api.get('/ticket/patient'),
        ]);

        if (sessionsRes.status === 'fulfilled' && sessionsRes.value.data) {
          const rawS = sessionsRes.value.data.sessions || sessionsRes.value.data.data || sessionsRes.value.data;
          if (Array.isArray(rawS)) {
            setLiveSessions(rawS.map(normalizeSession));
          }
        }

        if (ticketsRes.status === 'fulfilled' && ticketsRes.value.data) {
          const rawT = ticketsRes.value.data.data || ticketsRes.value.data.tickets || ticketsRes.value.data;
          if (Array.isArray(rawT)) {
            setLiveTickets(rawT.map(normalizeTicket));
          }
        }
      } catch (err) {
        console.warn('Dashboard fetch error:', err.message);
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const activeTickets = liveTickets.filter((t) => t.status === 'Open' || t.status === 'In Progress');
  const confirmedUpcomingSessions = liveSessions.filter(
    (s) => s.status?.toLowerCase() === 'confirmed' || s.status?.toLowerCase() === 'pending'
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.welcome}>Welcome back, {user?.fullName?.split(' ')[0]} 👋</h1>
          <p className={styles.subtext}>Here's what's happening with your care today.</p>
        </div>
      </div>

      <div className={styles.stats}>
        <StatCard
          icon={<FontAwesomeIcon icon={faCalendarCheck} />}
          value={confirmedUpcomingSessions.length}
          label="Upcoming Sessions"
        />
        <StatCard
          icon={<FontAwesomeIcon icon={faTicket} />}
          value={activeTickets.length}
          label="Active Tickets"
        />
        <StatCard
          icon={<FontAwesomeIcon icon={faUsers} />}
          value={user?.communityStatus === 'approved' ? 'Approved' : 'Pending'}
          label="Community Status"
        />
        <StatCard
          icon={<FontAwesomeIcon icon={faBell} />}
          value={notifications.filter((n) => !n.read).length}
          label="Unread Notifications"
        />
      </div>

      <div className={styles.quickActions}>
        {QUICK_ACTIONS.map((action) => (
          <button key={action.label} className={styles.quickAction} onClick={() => navigate(action.to)}>
            <FontAwesomeIcon icon={action.icon} />
            {action.label}
          </button>
        ))}
      </div>

      <div className={styles.columns}>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Upcoming Sessions</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/sessions/upcoming')}>
              View All
            </Button>
          </div>
          {confirmedUpcomingSessions.length ? (
            <div className={styles.list}>
              {confirmedUpcomingSessions.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>
          ) : (
            <EmptyState title="No upcoming sessions" description="Book a session with a specialist to get started." />
          )}
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Active Tickets</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/tickets')}>
              View All
            </Button>
          </div>
          {activeTickets.length ? (
            <div className={styles.list}>
              {activeTickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
            </div>
          ) : (
            <EmptyState title="No active tickets" description="Need help? Create a support ticket anytime." />
          )}
        </section>
      </div>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Recent Notifications</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate('/notifications')}>
            View All
          </Button>
        </div>
        <div className={styles.list}>
          {notifications.slice(0, 3).map((n) => (
            <NotificationCard key={n.id} notification={n} onRead={markAsRead} />
          ))}
        </div>
      </section>
    </div>
  );
}
