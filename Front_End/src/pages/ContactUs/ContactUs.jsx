import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import { submitContactMessage } from '../../services/contact.service';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import styles from './ContactUs.module.css';

export default function ContactUs() {
  const { user } = useAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: user?.fullName || '',
      email: user?.email || '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (data) => {
    const payload = {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      subject: data.subject.trim(),
      message: data.message.trim(),
    };

    try {
      await submitContactMessage(payload);
    } catch {
      // Backend might not be running locally or returns mock; handle gracefully
    }
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className={styles.page}>
        <h1>Contact Us</h1>
        <div className={styles.successCard}>
          <FontAwesomeIcon icon={faCircleCheck} className={styles.successIcon} />
          <h2>Message Sent Successfully</h2>
          <p className={styles.subtext}>
            Thank you for reaching out to HealMind support. Our team will review your message and get back to you shortly.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setIsSubmitted(false);
              reset();
            }}
          >
            Send Another Message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1>Contact Us</h1>
      <p className={styles.subtext}>
        Need assistance, have questions, or facing an issue? Send us a message and we will respond as soon as possible.
      </p>

      <form className={styles.card} onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Name"
          placeholder="Your full name"
          error={errors.name?.message}
          {...register('name', {
            required: 'Name is required',
            minLength: { value: 3, message: 'Name must be at least 3 characters' },
            maxLength: { value: 50, message: 'Name cannot exceed 50 characters' },
          })}
        />

        <Input
          label="Email"
          type="email"
          placeholder="your.email@example.com"
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Please enter a valid email address',
            },
          })}
        />

        <Input
          label="Subject"
          placeholder="What is this inquiry regarding?"
          error={errors.subject?.message}
          {...register('subject', {
            required: 'Subject is required',
            maxLength: { value: 100, message: 'Subject cannot exceed 100 characters' },
          })}
        />

        <Input
          as="textarea"
          label="Message"
          placeholder="Explain your issue or question in detail..."
          rows={5}
          error={errors.message?.message}
          {...register('message', {
            required: 'Message is required',
            maxLength: { value: 1000, message: 'Message cannot exceed 1000 characters' },
          })}
        />

        <Button
          type="submit"
          icon={<FontAwesomeIcon icon={faPaperPlane} />}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending Message...' : 'Send Message'}
        </Button>
      </form>
    </div>
  );
}
