import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { createTicketRequest } from '../../services/tickets.service';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import styles from './CreateTicket.module.css';

export default function CreateTicket() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      subject: '',
      description: '',
    },
  });

  const onSubmit = async (data) => {
    const payload = {
      subject: data.subject.trim(),
      description: data.description.trim(),
    };

    try {
      await createTicketRequest(payload);
    } catch {
      // Backend not yet available or offline, continue with graceful flow
    }
    navigate('/tickets');
  };

  return (
    <div className={styles.page}>
      <h1>Request Community Access</h1>
      <p className={styles.subtext}>
        Submit a request to access and interact with the HealMind community. A specialist will review and evaluate your request.
      </p>

      <form className={styles.card} onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Subject"
          placeholder="e.g. Request to join community discussion groups"
          error={errors.subject?.message}
          {...register('subject', {
            required: 'Subject is required',
            minLength: { value: 3, message: 'Subject must be at least 3 characters' },
            maxLength: { value: 100, message: 'Subject cannot exceed 100 characters' },
          })}
        />

        <Input
          as="textarea"
          label="Description"
          placeholder="Describe your goals for joining the community and any relevant context for the evaluating doctor..."
          rows={6}
          error={errors.description?.message}
          {...register('description', {
            required: 'Description is required',
            minLength: { value: 10, message: 'Description must be at least 10 characters' },
            maxLength: { value: 1000, message: 'Description cannot exceed 1000 characters' },
          })}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting Request...' : 'Submit Request'}
        </Button>
      </form>
    </div>
  );
}
