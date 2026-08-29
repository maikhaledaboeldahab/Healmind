import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPen,
  faCamera,
  faRightFromBracket,
  faTicket,
  faClockRotateLeft,
  faCreditCard,
  faSpinner,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import api from '../../../../shared/services/api';
import { useAuth } from '../../../../shared/context/AuthContext';
import Input from '../../../../shared/components/Input/Input';
import Button from '../../../../shared/components/Button/Button';
import Avatar from '../../../../shared/components/Avatar/Avatar';
import styles from './Profile.module.css';

const HISTORY_LINKS = [
  { to: '/tickets', label: 'Ticket History', icon: faTicket },
  { to: '/sessions/history', label: 'Session History', icon: faClockRotateLeft },
  { to: '/payments/history', label: 'Payment History', icon: faCreditCard },
];

export default function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      fullName: user?.fullName || user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      age: user?.age || '',
    },
  });

  const onSubmit = async (data) => {
    setStatusMessage({ type: '', text: '' });
    try {
      const payload = {
        name: data.fullName,
        email: data.email,
        phone: data.phone,
      };
      const res = await api.put('/profile/profile', payload);
      const updated = res.data?.data || res.data;
      updateProfile({ ...data, name: data.fullName, ...updated });
      setStatusMessage({ type: 'success', text: 'Profile information updated successfully!' });
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err.response?.data?.message || err.message || 'Failed to update profile.',
      });
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (e.g. 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setStatusMessage({ type: 'error', text: 'Image file size must be less than 5MB.' });
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setUploadingImage(true);
    setStatusMessage({ type: '', text: '' });

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await api.put('/profile/image', formData);
      const updated = res.data?.data || res.data;
      const imageUrl = updated?.profileImage || updated?.image || previewUrl;
      if (imageUrl) {
        updateProfile({ avatar: imageUrl, profileImage: imageUrl });
      }
      setStatusMessage({ type: 'success', text: 'Profile photo updated successfully!' });
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err.response?.data?.message || err.message || 'Failed to upload profile photo.',
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const currentAvatarSrc = imagePreview || user?.avatar || user?.profileImage || user?.image || '';
  const displayName = user?.fullName || user?.name || 'Patient';

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1>Patient Profile</h1>
        <p className={styles.pageSub}>Manage your personal information and photo</p>
      </div>

      {statusMessage.text && (
        <div
          className={`${styles.statusAlert} ${
            statusMessage.type === 'success' ? styles.alertSuccess : styles.alertError
          }`}
        >
          {statusMessage.type === 'success' && <FontAwesomeIcon icon={faCheck} className={styles.alertIcon} />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      <div className={styles.grid}>
        <section className={styles.card}>
          <div className={styles.avatarSection}>
            <div className={styles.avatarWrapper}>
              <div className={styles.avatarContainer}>
                <Avatar
                  src={currentAvatarSrc}
                  name={displayName}
                  size="xl"
                  className={styles.avatarElement}
                />
                {uploadingImage && (
                  <div className={styles.uploadOverlay}>
                    <FontAwesomeIcon icon={faSpinner} spin className={styles.spinner} />
                  </div>
                )}
              </div>

              <label
                className={`${styles.editAvatarBtn} ${uploadingImage ? styles.disabledBtn : ''}`}
                aria-label="Upload new photo"
                title="Upload new photo"
              >
                <FontAwesomeIcon icon={faCamera} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={uploadingImage}
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            <div className={styles.userHeaderDetails}>
              <div className={styles.nameRow}>
                <h2>{displayName}</h2>
                <span className={styles.patientBadge}>Patient Account</span>
              </div>
              <p className={styles.muted}>{user?.email || 'No email provided'}</p>
              <p className={styles.photoTip}>Recommended: Square JPG or PNG, max 5MB</p>
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
            <div className={styles.formActions}>
              <Button type="submit" disabled={isSubmitting || uploadingImage}>
                {isSubmitting ? 'Saving changes...' : 'Save Changes'}
              </Button>
            </div>
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

