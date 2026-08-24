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
import { useAuth } from '../../../../shared/context/AuthContext';
import { useNotifications } from '../../../../shared/context/NotificationContext';
import { upcomingSessions } from '../../../../data/sessions';
import { tickets } from '../../../../data/tickets';
import StatCard from '../../../../shared/components/StatCard/StatCard';
import SessionCard from '../../../../shared/components/SessionCard/SessionCard';
import TicketCard from '../../../../shared/components/TicketCard/TicketCard';
import NotificationCard from '../../../../shared/components/NotificationCard/NotificationCard';
import Button from '../../../../shared/components/Button/Button';
import EmptyState from '../../../../shared/components/EmptyState/EmptyState';
import styles from './Dashboard.module.css';

const QUICK_ACTIONS = [
  { label: 'Create Ticket', icon: faPlus, to: '/tickets/new' },
  { label: 'Browse Doctors', icon: faUserDoctor, to: '/doctors' },
  { label: 'Open AI Assistant', icon: faRobot, to: '/ai-assistant' },
  { label: 'Community', icon: faUsers, to: '/community' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const { notifications, markAsRead } = useNotifications();
  const navigate = useNavigate();

  const activeTickets = tickets.filter((t) => t.status === 'Open' || t.status === 'In Progress');

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
          value={upcomingSessions.length}
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
          {upcomingSessions.length ? (
            <div className={styles.list}>
              {upcomingSessions.map((session) => (
                <SessionCard key={session.id} session={session} showJoin />
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
