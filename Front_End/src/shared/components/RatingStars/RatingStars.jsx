import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { cx } from '../../utils/classNames';
import styles from './RatingStars.module.css';

/**
 * Display mode: pass `value` (number, e.g. 4.9) to render a static rating.
 * Interactive mode: pass `interactive` + `value` + `onChange` for rate-doctor forms.
 */
export default function RatingStars({
  value = 0,
  max = 5,
  interactive = false,
  onChange,
  size = 'md',
}) {
  const [hovered, setHovered] = useState(null);
  const displayValue = hovered ?? value;

  return (
    <div className={cx(styles.wrap, styles[size])} role={interactive ? 'radiogroup' : undefined}>
      {Array.from({ length: max }, (_, i) => i + 1).map((starIndex) => {
        const filled = starIndex <= Math.round(displayValue);
        return (
          <button
            key={starIndex}
            type="button"
            disabled={!interactive}
            className={cx(styles.star, filled && styles.filled, !interactive && styles.static)}
            onMouseEnter={() => interactive && setHovered(starIndex)}
            onMouseLeave={() => interactive && setHovered(null)}
            onClick={() => interactive && onChange?.(starIndex)}
            aria-label={`${starIndex} star`}
          >
            <FontAwesomeIcon icon={filled ? faStarSolid : faStarRegular} />
          </button>
        );
      })}
      {!interactive && <span className={styles.value}>{value.toFixed(1)}</span>}
    </div>
  );
}
