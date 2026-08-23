import { classNames } from '../../utils/classNames'
import styles from './Avatar.module.css'

function getInitials(name = '') {
  return name
    .replace('Dr. ', '')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function Avatar({ name, src, size = 'md', status }) {
  return (
    <span className={classNames(styles.wrapper, styles[size])}>
      {src ? (
        <img src={src} alt={name} className={styles.image} />
      ) : (
        <span className={styles.initials}>{getInitials(name)}</span>
      )}
      {status && <span className={classNames(styles.statusDot, styles[status])} />}
    </span>
  )
}

export default Avatar
