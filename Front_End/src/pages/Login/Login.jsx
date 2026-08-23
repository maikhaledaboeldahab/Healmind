import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import styles from './Login.module.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    await login(data);
    const from = location.state?.from?.pathname;
    const redirectTo = from && !from.startsWith('/admin') && from !== '/login' && from !== '/register' && from !== '/' ? from : '/dashboard';
    navigate(redirectTo, { replace: true });
  };

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Welcome back</h2>
      <p className={styles.subtitle}>Log in to continue your wellness journey.</p>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          icon={<FontAwesomeIcon icon={faEnvelope} />}
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
          })}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          icon={<FontAwesomeIcon icon={faLock} />}
          error={errors.password?.message}
          {...register('password', { required: 'Password is required' })}
        />

        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? 'Logging in...' : 'Log In'}
        </Button>
      </form>

      <p className={styles.footerText}>
        Don't have an account? <Link to="/register">Create one</Link>
      </p>
    </div>
  );
}
