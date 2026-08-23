import { classNames } from '../../utils/classNames'
import styles from './Toast.module.css'

const ICON_MAP = {
  success: 'fa-solid fa-circle-check',
  danger: 'fa-solid fa-circle-exclamation',
  warning: 'fa-solid fa-triangle-exclamation',
  info: 'fa-solid fa-circle-info',
}

function ToastContainer({ toasts, onDismiss }) {
  if (!toasts.length) return null

  return (
    <div className={styles.container} aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={classNames(styles.toast, styles[toast.variant])}>
          <i className={ICON_MAP[toast.variant] || ICON_MAP.info} aria-hidden="true" />
          <span className={styles.message}>{toast.message}</span>
          <button type="button" className={styles.dismiss} onClick={() => onDismiss(toast.id)} aria-label="Dismiss notification">
            <i className="fa-solid fa-xmark" aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>
  )
}

export default ToastContainer
