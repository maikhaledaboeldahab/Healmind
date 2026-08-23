import { classNames } from '../../utils/classNames'
import styles from './Button.module.css'

const VARIANT_CLASS = {
  primary: styles.primary,
  secondary: styles.secondary,
  ghost: styles.ghost,
  danger: styles.danger,
}

function Button({
  children,
  variant = 'primary',
  icon,
  iconPosition = 'left',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  type = 'button',
  onClick,
  className,
  ...rest
}) {
  return (
    <button
      type={type}
      className={classNames(styles.button, VARIANT_CLASS[variant], fullWidth && styles.fullWidth, className)}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...rest}
    >
      {isLoading && <i className={classNames('fa-solid fa-spinner fa-spin', styles.icon)} aria-hidden="true" />}
      {!isLoading && icon && iconPosition === 'left' && <i className={classNames(icon, styles.icon)} aria-hidden="true" />}
      <span>{children}</span>
      {!isLoading && icon && iconPosition === 'right' && <i className={classNames(icon, styles.icon)} aria-hidden="true" />}
    </button>
  )
}

export default Button
