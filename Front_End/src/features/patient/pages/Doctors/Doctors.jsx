import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faXmark, faArrowUpWideShort } from '@fortawesome/free-solid-svg-icons';
import api from '../../../../shared/services/api';
import { doctors as dummyDoctors, specialties } from '../../../../data/doctors';
import DoctorCard from '../../../../shared/components/DoctorCard/DoctorCard';
import EmptyState from '../../../../shared/components/EmptyState/EmptyState';
import Loader from '../../../../shared/components/Loader/Loader';
import { useDebounce } from '../../../../shared/hooks/useDebounce';
import { cx } from '../../../../shared/utils/classNames';
import styles from './Doctors.module.css';

const SORT_OPTIONS = [
  { value: 'rating', label: 'Highest Rating' },
  { value: 'experience', label: 'Most Experienced' },
  { value: 'fee', label: 'Lowest Fee' },
];

function getDoctorImage(d) {
  if (d?.profileImage) {
    return d.profileImage.startsWith('http')
      ? d.profileImage
      : `http://localhost:3000/${d.profileImage.replace(/^\//, '')}`;
  }
  const name = d?.name || 'Doctor';
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2c5282&color=fff&size=400`;
}

function normalizeDoctorDoc(d) {
  if (!d) return null;
  const spec = d.specialization || 'Clinical Specialist';
  const name = d.name || d.fullName || `Dr. ${d.email?.split('@')[0]}`;
  const ratingVal = d.rating !== undefined ? d.rating : (d.ratingsAverage !== undefined ? d.ratingsAverage : null);

  return {
    id: d._id || d.id,
    name,
    specialization: spec,
    experience: d.yearsOfExperience !== undefined ? d.yearsOfExperience : (d.experienceYears || 0),
    fee: d.sessionPrice !== undefined ? d.sessionPrice : 0,
    rating: ratingVal,
    reviewsCount: d.reviewsCount || d.ratingsQuantity || 0,
    image: getDoctorImage(d),
    tags: ['All', spec],
    bio: d.bio || 'No biography provided yet.',
    verified: d.isApproved || d.approvalStatus === 'approved',
  };
}

export default function Doctors() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [activeTag, setActiveTag] = useState('All');
  const [sortBy, setSortBy] = useState('rating');
  const [doctorsList, setDoctorsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const debouncedQuery = useDebounce(query);

  useEffect(() => {
    async function loadBackendDoctors() {
      setIsLoading(true);
      try {
        let res;
        try {
          res = await api.get('/doctor/list');
        } catch {
          res = await api.get('/admin/doctors');
        }
        const raw = res.data?.data || res.data;
        if (Array.isArray(raw) && raw.length > 0) {
          const approved = raw.filter((d) => d.isApproved || d.approvalStatus === 'approved' || d.status === 'verified');
          const target = approved.length > 0 ? approved : raw;
          setDoctorsList(target.map(normalizeDoctorDoc));
        } else {
          setDoctorsList([]);
        }
      } catch {
        setDoctorsList([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadBackendDoctors();
  }, []);

  const filtered = useMemo(() => {
    let result = doctorsList.filter((doc) => {
      const matchesQuery =
        !debouncedQuery ||
        doc.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        doc.specialization.toLowerCase().includes(debouncedQuery.toLowerCase());
      const matchesTag = activeTag === 'All' || doc.tags.includes(activeTag) || doc.specialization.includes(activeTag);
      return matchesQuery && matchesTag;
    });

    result = [...result].sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'experience') return b.experience - a.experience;
      if (sortBy === 'fee') return a.fee - b.fee;
      return 0;
    });

    return result;
  }, [doctorsList, debouncedQuery, activeTag, sortBy]);

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
