import { classNames } from '../../utils/classNames'
import styles from './Chip.module.css'

function Chip({ children, tone = 'sage', icon }) {
  return (
    <span className={classNames(styles.chip, styles[tone])}>
      {icon && <i className={icon} aria-hidden="true" />}
      {children}
    </span>
  )
}

export default Chip
