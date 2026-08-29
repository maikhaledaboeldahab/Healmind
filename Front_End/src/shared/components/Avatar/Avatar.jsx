import { useState, useEffect } from 'react';
import styles from './Avatar.module.css';

function getInitials(name = '') {
  if (!name || typeof name !== 'string') return '';
  const clean = name.replace(/^(Dr\.|Prof\.|Mr\.|Mrs\.|Ms\.)\s+/i, '').trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function Avatar({ name = '', src = '', size = 'md', status, className = '', alt = '' }) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [src]);

  const initials = getInitials(name) || (name ? name.charAt(0).toUpperCase() : 'U');
  const showImage = Boolean(src && !imgError);

  const wrapperClasses = [
    styles.wrapper,
    styles[size] || styles.md,
    className,
  ].filter(Boolean).join(' ');

  return (
    <span className={wrapperClasses}>
      {showImage ? (
        <img
          src={src}
          alt={alt || name || 'User avatar'}
          className={styles.image}
          onError={() => setImgError(true)}
        />
      ) : (
        <span className={styles.initials} aria-label={name || 'Avatar'}>
          {initials}
        </span>
      )}
      {status && <span className={`${styles.statusDot} ${styles[status] || ''}`} />}
    </span>
  );
}

export default Avatar;

