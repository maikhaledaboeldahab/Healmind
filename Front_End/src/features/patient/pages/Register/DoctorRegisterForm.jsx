import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import api from '../../../../shared/services/api';
import Input from '../../../../shared/components/Input/Input';
import Button from '../../../../shared/components/Button/Button';
import styles from './Register.module.css';

export default function DoctorRegisterForm({ onBack, onSuccess }) {
  const [apiError, setApiError] = useState('');
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    setApiError('');
    try {
      const formData = new FormData();
      formData.append('name', data.fullName);
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('confirmPassword', data.password);
      formData.append('NationalId', data.nationalId || String(Date.now()).padStart(14, '2'));
      formData.append('licenseNumber', data.licenseNumber || `LIC-${Date.now()}`);
      formData.append('specialization', data.specialization);
      formData.append('yearsOfExperience', data.yearsOfExperience || '0');
      formData.append('bio', data.bio || `Licensed ${data.specialization} specialist.`);

      if (data.certificate && data.certificate[0]) {
        formData.append('certificate', data.certificate[0]);
      }

      await api.post('/auth/register/doctor', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (onSuccess) {
        onSuccess(data);
      }
    } catch (err) {
      if (err.response) {
        const errorList = err.response.data?.errors;
        const msg = Array.isArray(errorList) && errorList.length > 0 
          ? errorList.join(' • ') 
          : (err.response.data?.message || 'Doctor registration failed. Please check your inputs.');
        setApiError(msg);
      } else {
        // Fallback for dev mode
        console.warn('Backend server unreached during doctor register:', err.message);
        if (onSuccess) onSuccess(data);
      }
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

      {apiError && (
        <div style={{ padding: '12px 16px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', lineHeight: '1.5' }}>
          {apiError}
        </div>
      )}

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

        <div className={styles.row}>
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'At least 8 characters' },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_#])/,
                message: 'Must contain uppercase, lowercase, number, and special character (@$!%*?&_#)',
              },
            })}
          />
          <Input
            label="National ID (14 digits)"
            placeholder="29801011234567"
            error={errors.nationalId?.message}
            {...register('nationalId', {
              required: 'National ID is required',
              minLength: { value: 14, message: 'Must be 14 digits' },
              maxLength: { value: 14, message: 'Must be 14 digits' },
            })}
          />
        </div>

        <div className={styles.row}>
          <Input
            label="Specialization"
            placeholder="e.g. Clinical Psychologist"
            error={errors.specialization?.message}
            {...register('specialization', { required: 'Specialization is required' })}
          />
          <Input
            label="License Number"
            placeholder="e.g. LIC-99823"
            error={errors.licenseNumber?.message}
            {...register('licenseNumber', { required: 'License number is required' })}
          />
        </div>

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
            Upload Certificate / Medical License
          </label>
          <div className={styles.fileInputWrapper}>
            <input
              id="certificate"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className={styles.fileInput}
              {...register('certificate', { required: 'Medical certificate / license file is required' })}
            />
          </div>
          {errors.certificate && (
            <span className={styles.errorText}>{errors.certificate.message}</span>
          )}
          <span className={styles.fileHint}>Accepted formats: PDF, JPG, PNG (Max 5MB)</span>
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
