import { classNames } from '../../utils/classNames'
import styles from './Toast.module.css'

const ICON_MAP = {
  success: 'fa-solid fa-circle-check',
  danger: 'fa-solid fa-circle-exclamation',
  warning: 'fa-solid fa-triangle-exclamation',
  info: 'fa-solid fa-circle-info',
}

function Toast({ message, variant = 'success', onDismiss }) {
  return (
    <div className={classNames(styles.toast, styles[variant])} role="status">
      <i className={ICON_MAP[variant] || ICON_MAP.info} aria-hidden="true" />
      <span className={styles.message}>{message}</span>
      <button type="button" className={styles.dismiss} onClick={onDismiss} aria-label="Dismiss notification">
        <i className="fa-solid fa-xmark" aria-hidden="true" />
      </button>
    </div>
  )
}

export default Toast
