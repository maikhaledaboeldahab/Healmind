import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faXmark, faArrowUpWideShort } from '@fortawesome/free-solid-svg-icons';
import { doctors, specialties } from '../../data/doctors';
import DoctorCard from '../../components/DoctorCard/DoctorCard';
import EmptyState from '../../components/EmptyState/EmptyState';
import { useDebounce } from '../../hooks/useDebounce';
import { cx } from '../../utils/classNames';
import styles from './Doctors.module.css';

const SORT_OPTIONS = [
  { value: 'rating', label: 'Highest Rating' },
  { value: 'experience', label: 'Most Experienced' },
  { value: 'fee', label: 'Lowest Fee' },
];

export default function Doctors() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [activeTag, setActiveTag] = useState('All');
  const [sortBy, setSortBy] = useState('rating');
  const debouncedQuery = useDebounce(query);

  const filtered = useMemo(() => {
    let result = doctors.filter((doc) => {
      const matchesQuery =
        !debouncedQuery ||
        doc.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        doc.specialization.toLowerCase().includes(debouncedQuery.toLowerCase());
      const matchesTag = activeTag === 'All' || doc.tags.includes(activeTag);
      return matchesQuery && matchesTag;
    });

    result = [...result].sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'experience') return b.experience - a.experience;
      if (sortBy === 'fee') return a.fee - b.fee;
      return 0;
    });

    return result;
  }, [debouncedQuery, activeTag, sortBy]);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Find Your Specialist</h1>
        <p className={styles.subtext}>
          Connect with our certified world-class mental health professionals tailored to your
          specific journey and healing needs.
        </p>
      </div>

      <div className={styles.searchRow}>
        <div className={styles.searchBox}>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
          <input
            type="text"
            placeholder="Search by name or specialization..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button onClick={() => setQuery('')} aria-label="Clear search">
              <FontAwesomeIcon icon={faXmark} />
            </button>
          )}
        </div>
      </div>

      <div className={styles.filterRow}>
        <div className={styles.tags}>
          {specialties.map((tag) => (
            <button
              key={tag}
              className={cx(styles.tag, activeTag === tag && styles.tagActive)}
              onClick={() => setActiveTag(tag)}
            >
              {tag}
              {activeTag === tag && tag !== 'All' && (
                <FontAwesomeIcon icon={faXmark} className={styles.tagClose} />
              )}
            </button>
          ))}
        </div>

        <div className={styles.sort}>
          <FontAwesomeIcon icon={faArrowUpWideShort} />
          <label htmlFor="sort" className={styles.sortLabel}>
            Sort By
          </label>
          <select id="sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length ? (
        <div className={styles.grid}>
          {filtered.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No specialists found"
          description="Try adjusting your search or filters to find the right fit."
        />
      )}
    </div>
  );
}
