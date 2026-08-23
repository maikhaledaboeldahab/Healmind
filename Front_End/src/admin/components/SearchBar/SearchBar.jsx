import styles from './SearchBar.module.css'

function SearchBar({ value, onChange, placeholder = 'Search…' }) {
  return (
    <div className={styles.wrapper}>
      <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
      <input
        type="search"
        className={styles.input}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
      />
    </div>
  )
}

export default SearchBar
