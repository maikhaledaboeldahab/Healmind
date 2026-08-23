import { STATUS_TONE_MAP } from '../../constants/statusEnums'
import { classNames } from '../../utils/classNames'
import styles from './StatusBadge.module.css'

const TONE_CLASS = {
  success: styles.success,
  warning: styles.warning,
  danger: styles.danger,
  info: styles.info,
  neutral: styles.neutral,
}

function StatusBadge({ status, label, tone }) {
  const resolvedTone = tone || STATUS_TONE_MAP[status] || 'neutral'
  return <span className={classNames(styles.badge, TONE_CLASS[resolvedTone])}>{label || status}</span>
}

export default StatusBadge
