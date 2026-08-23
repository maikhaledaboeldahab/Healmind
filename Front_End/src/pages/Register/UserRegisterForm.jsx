import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import styles from './Register.module.css';

export default function UserRegisterForm({ onBack }) {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    await registerUser({
      fullName: data.fullName,
      email: data.email,
      age: Number(data.age),
      gender: data.gender,
      phone: data.phone,
    });
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className={styles.card}>
      {onBack && (
        <button type="button" onClick={onBack} className={styles.backButton}>
          &larr; Back to role selection
        </button>
      )}

      <h2 className={styles.title}>Create your account</h2>
      <p className={styles.subtitle}>Start your journey toward better mental wellness.</p>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <Input
          label="Full Name"
          placeholder="Jane Doe"
          error={errors.fullName?.message}
          {...register('fullName', { required: 'Full name is required' })}
        />

        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
          })}
        />

        <div className={styles.row}>
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'At least 8 characters' },
            })}
          />
          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) => value === password || 'Passwords do not match',
            })}
          />
        </div>

        <div className={styles.row}>
          <Input
            label="Age"
            type="number"
            min={13}
            max={120}
            error={errors.age?.message}
            {...register('age', { required: 'Age is required', min: { value: 13, message: 'Must be 13 or older' } })}
          />
          <div className={styles.selectGroup}>
            <label htmlFor="gender" className={styles.selectLabel}>
              Gender
            </label>
            <select id="gender" className={styles.select} {...register('gender', { required: true })}>
              <option value="">Select</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <Input
          label="Phone Number"
          type="tel"
          placeholder="+20 100 000 0000"
          error={errors.phone?.message}
          {...register('phone', { required: 'Phone number is required' })}
        />

        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>

      <p className={styles.footerText}>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}
