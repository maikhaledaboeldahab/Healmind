import Card from '../Card/Card'
import { classNames } from '../../utils/classNames'
import styles from './StatCard.module.css'

function StatCard({ icon, label, value, trend, tone = 'primary' }) {
  return (
    <Card className={styles.card} hoverable>
      <div className={classNames(styles.iconCircle, styles[tone])}>
        <i className={icon} aria-hidden="true" />
      </div>
      <div className={styles.body}>
        <span className={styles.value}>{value}</span>
        <span className={styles.label}>{label}</span>
        {trend && <span className={styles.trend}>{trend}</span>}
      </div>
    </Card>
  )
}

export default StatCard
