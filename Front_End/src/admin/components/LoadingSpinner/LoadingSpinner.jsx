import { classNames } from '../../utils/classNames'
import styles from './LoadingSpinner.module.css'

function LoadingSpinner({ size = 'md', label = 'Loading…', fullHeight = false }) {
  return (
    <div className={classNames(styles.wrapper, fullHeight && styles.fullHeight)} role="status">
      <span className={classNames(styles.spinner, styles[size])} aria-hidden="true" />
      {label && <span className={styles.label}>{label}</span>}
    </div>
  )
}

export default LoadingSpinner
