import { cx } from '../../utils/classNames';
import styles from './Badge.module.css';

const TONE_MAP = {
  open: 'info',
  'in progress': 'warning',
  pending: 'warning',
  confirmed: 'success',
  completed: 'success',
  paid: 'success',
  approved: 'success',
  closed: 'neutral',
  rejected: 'error',
  refunded: 'neutral',
  'additional session required': 'warning',
  'needs another session': 'warning',
  'needs_another_session': 'warning',
  'view only': 'neutral',
  'view_only': 'neutral',
  unread: 'warning',
  read: 'success',
};

export default function Badge({ children, tone }) {
  const resolvedTone = tone || TONE_MAP[String(children).toLowerCase()] || 'neutral';
  return <span className={cx(styles.badge, styles[resolvedTone])}>{children}</span>;
}
