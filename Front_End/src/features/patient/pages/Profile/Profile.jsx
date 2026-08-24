import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faRightFromBracket, faTicket, faClockRotateLeft, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../shared/context/AuthContext';
import Input from '../../../../shared/components/Input/Input';
import Button from '../../../../shared/components/Button/Button';
import styles from './Profile.module.css';

const HISTORY_LINKS = [
  { to: '/tickets', label: 'Ticket History', icon: faTicket },
  { to: '/sessions/history', label: 'Session History', icon: faClockRotateLeft },
  { to: '/payments/history', label: 'Payment History', icon: faCreditCard },
];

export default function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = useForm({ defaultValues: user });

  const onSubmit = async (data) => {
    updateProfile(data);
  };

  return (
    <div className={styles.page}>
      <h1>Profile</h1>

      <div className={styles.grid}>
        <section className={styles.card}>
          <div className={styles.avatarSection}>
            <div className={styles.avatarWrap}>
              <img src={user?.avatar} alt={user?.fullName} />
              <button className={styles.editAvatar} aria-label="Change photo">
                <FontAwesomeIcon icon={faPen} />
              </button>
            </div>
            <div>
              <h2>{user?.fullName}</h2>
              <p className={styles.muted}>{user?.email}</p>
            </div>
          </div>

          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.formRow}>
              <Input label="Full Name" {...register('fullName')} />
              <Input label="Email" type="email" {...register('email')} />
            </div>
            <div className={styles.formRow}>
              <Input label="Age" type="number" {...register('age')} />
              <Input label="Phone Number" {...register('phone')} />
            </div>
            <Button type="submit" disabled={!isDirty || isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </section>

        <section className={styles.sidebarCard}>
          <h3>Quick Links</h3>
          <div className={styles.links}>
            {HISTORY_LINKS.map((link) => (
              <button key={link.to} className={styles.linkItem} onClick={() => navigate(link.to)}>
                <FontAwesomeIcon icon={link.icon} /> {link.label}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            fullWidth
            icon={<FontAwesomeIcon icon={faRightFromBracket} />}
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            Log Out
          </Button>
        </section>
      </div>
    </div>
  );
}
