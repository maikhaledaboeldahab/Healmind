import { classNames } from '../../utils/classNames'
import styles from './Card.module.css'

function Card({ children, className, padded = true, hoverable = false, as: Component = 'div', ...rest }) {
  return (
    <Component
      className={classNames(styles.card, padded && styles.padded, hoverable && styles.hoverable, className)}
      {...rest}
    >
      {children}
    </Component>
  )
}

export default Card
