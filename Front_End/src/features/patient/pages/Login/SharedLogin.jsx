import { useState } from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faLeaf } from '@fortawesome/free-solid-svg-icons';
import { useAuth as useUserAuth } from '../../../../shared/context/AuthContext';
import { useAuth as useAdminAuth } from '../../../admin/hooks/useAuth';
import styles from './SharedLogin.module.css';

export default function SharedLogin() {
  const { isAuthenticated: isUserAuth, login: userLogin } = useUserAuth();
  const { isAuthenticated: isAdminAuth, login: adminLogin } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect to the appropriate dashboard
  if (isAdminAuth) {
    const from = location.state?.from?.pathname;
    const redirectTo = from && from.startsWith('/admin') && from !== '/admin/login' ? from : '/admin';
    return <Navigate to={redirectTo} replace />;
  }

  if (isUserAuth) {
    const from = location.state?.from?.pathname;
    const redirectTo = from && !from.startsWith('/admin') && from !== '/login' && from !== '/register' && from !== '/' ? from : '/dashboard';
    return <Navigate to={redirectTo} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const cleanEmail = email.trim().toLowerCase();
      // Role detection logic based on email format
      if (cleanEmail.startsWith('admin') || cleanEmail.includes('admin@healmind.com')) {
        await adminLogin({ email: cleanEmail, password });
        const from = location.state?.from?.pathname;
        const redirectTo = from && from.startsWith('/admin') && from !== '/admin/login' ? from : '/admin';
        navigate(redirectTo, { replace: true });
      } else if (cleanEmail.startsWith('doctor') || cleanEmail.includes('doctor@healmind.com') || cleanEmail === 'farah@healmind.com') {
        const from = location.state?.from?.pathname;
        const redirectTo = from && from.startsWith('/doctor') && from !== '/doctor/login' ? from : '/doctor/dashboard';
        navigate(redirectTo, { replace: true });
      } else {
        await userLogin({ email: cleanEmail, password });
        const from = location.state?.from?.pathname;
        const redirectTo = from && !from.startsWith('/admin') && !from.startsWith('/doctor') && from !== '/login' && from !== '/register' && from !== '/' ? from : '/dashboard';
        navigate(redirectTo, { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Unable to sign in. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <span className={styles.brandIcon}>
            <FontAwesomeIcon icon={faLeaf} />
          </span>
          <span className={styles.brandName}>HealMind</span>
        </div>

        <h2 className={styles.title}>Welcome back</h2>
        <p className={styles.subtitle}>Sign in to continue to your HealMind workspace.</p>

        {error && <div className={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Email Address</label>
            <div className={styles.inputWrapper}>
              <FontAwesomeIcon icon={faEnvelope} className={styles.icon} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Password</label>
            <div className={styles.inputWrapper}>
              <FontAwesomeIcon icon={faLock} className={styles.icon} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={styles.input}
              />
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className={styles.footerText}>
          Don't have an account? <Link to="/register" className={styles.link}>Create one</Link>
        </p>
      </div>
    </div>
  );
}
