import { forwardRef } from 'react';
import { cx } from '../../utils/classNames';
import styles from './Input.module.css';

/**
 * Reusable text input designed to work with react-hook-form's register().
 * Usage: <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
 */
const Input = forwardRef(function Input(
  { label, type = 'text', error, hint, icon, id, as = 'input', rows = 4, className, ...rest },
  ref
) {
  const inputId = id || rest.name;
  const Field = as === 'textarea' ? 'textarea' : 'input';

  return (
    <div className={cx(styles.group, className)}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <div className={cx(styles.fieldWrap, error && styles.fieldError)}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <Field
          id={inputId}
          ref={ref}
          type={as === 'textarea' ? undefined : type}
          rows={as === 'textarea' ? rows : undefined}
          className={cx(styles.field, icon && styles.hasIcon)}
          {...rest}
        />
      </div>
      {error && <span className={styles.errorText}>{error}</span>}
      {!error && hint && <span className={styles.hint}>{hint}</span>}
    </div>
  );
});

export default Input;
