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
    setValue,
    formState: { isSubmitting, isDirty },
  } = useForm({
    defaultValues: {
      fullName: user?.fullName || user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      age: user?.age || '',
    },
  });

  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.fullName,
        email: data.email,
        phone: data.phone,
      };
      const res = await api.put('/profile/profile', payload);
      const updated = res.data?.data || res.data;
      updateProfile({ ...data, name: data.fullName, ...updated });
      alert('Profile updated successfully.');
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to update profile.');
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await api.put('/profile/image', formData);
      const updated = res.data?.data || res.data;
      const imageUrl = updated.profileImage || updated.image;
      if (imageUrl) {
        updateProfile({ avatar: imageUrl, profileImage: imageUrl });
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to upload profile image.');
    }
  };

  return (
    <div className={styles.page}>
      <h1>Profile</h1>

      <div className={styles.grid}>
        <section className={styles.card}>
          <div className={styles.avatarSection}>
            <div className={styles.avatarWrap}>
              <img
                src={user?.avatar || user?.profileImage || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&h=200&fit=crop&crop=faces'}
                alt={user?.fullName || user?.name}
              />
              <label className={styles.editAvatar} aria-label="Change photo" style={{ cursor: 'pointer' }}>
                <FontAwesomeIcon icon={faPen} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
            <div>
              <h2>{user?.fullName || user?.name}</h2>
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
            <Button type="submit" disabled={isSubmitting}>
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
