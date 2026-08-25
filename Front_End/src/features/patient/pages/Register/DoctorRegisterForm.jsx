import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import Input from '../../../../shared/components/Input/Input';
import Button from '../../../../shared/components/Button/Button';
import styles from './Register.module.css';

export default function DoctorRegisterForm({ onBack, onSuccess }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    // Collect Doctor registration data and transition to pending review
    if (onSuccess) {
      onSuccess(data);
    }
  };

  return (
    <div className={styles.card}>
      {onBack && (
        <button type="button" onClick={onBack} className={styles.backButton}>
          &larr; Back to role selection
        </button>
      )}

      <h2 className={styles.title}>Doctor Registration</h2>
      <p className={styles.subtitle}>Apply to join HealMind as a licensed healthcare professional.</p>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <Input
          label="Full Name"
          placeholder="Dr. Sarah Johnson"
          error={errors.fullName?.message}
          {...register('fullName', { required: 'Full name is required' })}
        />

        <Input
          label="Email"
          type="email"
          placeholder="doctor@example.com"
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
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 8, message: 'At least 8 characters' },
          })}
        />

        <Input
          label="Specialization"
          placeholder="e.g. Clinical Psychologist, Psychiatrist"
          error={errors.specialization?.message}
          {...register('specialization', { required: 'Specialization is required' })}
        />

        <Input
          label="Years of Experience"
          type="number"
          min={0}
          max={60}
          placeholder="e.g. 5"
          error={errors.yearsOfExperience?.message}
          {...register('yearsOfExperience', {
            required: 'Years of experience is required',
            min: { value: 0, message: 'Years of experience must be 0 or more' },
          })}
        />

        <div className={styles.fileGroup}>
          <label htmlFor="certificate" className={styles.selectLabel}>
            Upload Certificate
          </label>
          <div className={styles.fileInputWrapper}>
            <input
              id="certificate"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              className={styles.fileInput}
              {...register('certificate', { required: 'Medical certificate / license is required' })}
            />
          </div>
          {errors.certificate && (
            <span className={styles.errorText}>{errors.certificate.message}</span>
          )}
          <span className={styles.fileHint}>Accepted formats: PDF, JPG, PNG (Max 10MB)</span>
        </div>

        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? 'Registering...' : 'Register'}
        </Button>
      </form>

      <p className={styles.footerText}>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}
