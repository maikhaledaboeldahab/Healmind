import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { createTicketRequest } from '../../../../shared/services/tickets.service';
import Input from '../../../../shared/components/Input/Input';
import Button from '../../../../shared/components/Button/Button';
import styles from './CreateTicket.module.css';

export default function CreateTicket() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  // Default to tomorrow 10:00 AM
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);
  const minDateTimeStr = new Date(Date.now() + 60000 * 30).toISOString().slice(0, 16);
  const defaultDateTimeStr = tomorrow.toISOString().slice(0, 16);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      mode: 'video',
      scheduledTime: defaultDateTimeStr,
      notes: '',
    },
  });

  const onSubmit = async (data) => {
    setServerError('');
    try {
      const payload = {
        mode: data.mode,
        scheduledTime: new Date(data.scheduledTime).toISOString(),
      };
      await createTicketRequest(payload);
      navigate('/tickets');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to submit ticket request.';
      setServerError(msg);
    }
  };

  return (
    <div className={styles.page}>
      <h1>Request Initial Evaluation Ticket</h1>
      <p className={styles.subtext}>
        Submit a request to be evaluated by a specialist for personalized mental healthcare and community access.
      </p>

      {serverError && (
        <div style={{ padding: '0.75rem 1rem', background: '#fee2e2', color: '#b91c1c', borderRadius: '8px', marginBottom: '1rem' }}>
          {serverError}
        </div>
      )}

      <form className={styles.card} onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Evaluation Mode</label>
          <select
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', marginBottom: '1rem' }}
            {...register('mode', { required: 'Mode is required' })}
          >
            <option value="video">Video Call Evaluation</option>
            <option value="chat">Chat-based Evaluation</option>
          </select>
        </div>

        <Input
          type="datetime-local"
          label="Preferred Session Time"
          min={minDateTimeStr}
          error={errors.scheduledTime?.message}
          {...register('scheduledTime', {
            required: 'Scheduled time is required',
            validate: (value) => new Date(value) > new Date() || 'Scheduled time must be in the future',
          })}
        />

        <Input
          as="textarea"
          label="Notes / Reason (Optional)"
          placeholder="Briefly describe what you'd like to discuss during your evaluation session..."
          rows={4}
          {...register('notes')}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting Request...' : 'Submit Evaluation Ticket'}
        </Button>
      </form>
    </div>
  );
}
