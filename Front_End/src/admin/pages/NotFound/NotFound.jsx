import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button/Button'
import { ROUTE_PATHS } from '../../constants/routePaths'
import styles from './NotFound.module.css'

function NotFound() {
  const navigate = useNavigate()

  return (
    <div className={styles.wrapper}>
      <span className={styles.code}>404</span>
      <h1 className={styles.title}>Page not found</h1>
      <p className={styles.description}>The page you're looking for doesn't exist or may have been moved.</p>
      <Button onClick={() => navigate(ROUTE_PATHS.DASHBOARD)}>Back to Dashboard</Button>
    </div>
  )
}

export default NotFound
