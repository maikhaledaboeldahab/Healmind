import Button from '../AdminButton/AdminButton'
import styles from './AdminEmptyState.module.css'

function AdminEmptyState({ icon = 'fa-solid fa-leaf', title, description, actionLabel, onAction }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.iconCircle}>
        <i className={icon} aria-hidden="true" />
      </div>
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
      {actionLabel && onAction && (
        <Button variant="primary" icon="fa-solid fa-plus" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

export default AdminEmptyState
