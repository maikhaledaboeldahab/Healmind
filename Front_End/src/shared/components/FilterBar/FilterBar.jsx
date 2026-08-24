import styles from './FilterBar.module.css'

/**
 * filters: [{ name, value, options: [{ value, label }], onChange }]
 */
function FilterBar({ filters = [] }) {
  return (
    <div className={styles.wrapper}>
      {filters.map((filter) => (
        <select
          key={filter.name}
          className={styles.select}
          value={filter.value}
          onChange={(event) => filter.onChange(event.target.value)}
          aria-label={filter.name}
        >
          {filter.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ))}
    </div>
  )
}

export default FilterBar
