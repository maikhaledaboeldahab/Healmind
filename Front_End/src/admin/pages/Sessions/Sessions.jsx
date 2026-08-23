import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/PageHeader/PageHeader'
import SearchBar from '../../components/SearchBar/SearchBar'
import FilterBar from '../../components/FilterBar/FilterBar'
import DataTable from '../../components/DataTable/DataTable'
import Pagination from '../../components/Pagination/Pagination'
import Button from '../../components/Button/Button'
import StatusBadge from '../../components/StatusBadge/StatusBadge'
import { sessionService } from '../../services/sessionService'
import { patientService } from '../../services/patientService'
import { doctorService } from '../../services/doctorService'
import { useDebounce } from '../../hooks/useDebounce'
import { usePagination } from '../../hooks/usePagination'
import { SESSION_STATUS, SESSION_STATUS_LABEL, SESSION_TYPE, SESSION_TYPE_LABEL } from '../../constants/statusEnums'
import { buildPath, ROUTE_PATHS } from '../../constants/routePaths'
import { formatDateTime } from '../../utils/formatDate'
import styles from './Sessions.module.css'

const FILTER_ALL = 'all'

function Sessions() {
  const [sessions, setSessions] = useState([])
  const [patients, setPatients] = useState([])
  const [doctors, setDoctors] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState(FILTER_ALL)
  const [typeFilter, setTypeFilter] = useState(FILTER_ALL)

  const debouncedSearch = useDebounce(searchTerm)
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([sessionService.getAll(), patientService.getAll(), doctorService.getAll()]).then(
      ([sessionsResult, patientsResult, doctorsResult]) => {
        setSessions(sessionsResult)
        setPatients(patientsResult)
        setDoctors(doctorsResult)
        setIsLoading(false)
      },
    )
  }, [])

  const findPatientName = (id) => patients.find((p) => p.id === id)?.name || id
  const findDoctorName = (id) => doctors.find((d) => d.id === id)?.name || id

  const filteredSessions = useMemo(() => {
    return sessions
      .filter((session) => {
        const matchesSearch =
          findPatientName(session.patientId).toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          findDoctorName(session.doctorId).toLowerCase().includes(debouncedSearch.toLowerCase())
        const matchesStatus = statusFilter === FILTER_ALL || session.status === statusFilter
        const matchesType = typeFilter === FILTER_ALL || session.type === typeFilter
        return matchesSearch && matchesStatus && matchesType
      })
      .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessions, debouncedSearch, statusFilter, typeFilter, patients, doctors])

  const { pageItems, currentPage, totalPages, goToPage, resetPage } = usePagination(filteredSessions, 8)

  useEffect(() => {
    resetPage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, statusFilter, typeFilter])

  const columns = [
    { key: 'id', header: 'Session ID' },
    { key: 'patient', header: 'Patient', render: (s) => findPatientName(s.patientId) },
    { key: 'doctor', header: 'Doctor', render: (s) => findDoctorName(s.doctorId) },
    { key: 'type', header: 'Type', render: (s) => SESSION_TYPE_LABEL[s.type] },
    { key: 'startTime', header: 'Date & Time', render: (s) => formatDateTime(s.startTime) },
    { key: 'status', header: 'Status', render: (s) => <StatusBadge status={s.status} label={SESSION_STATUS_LABEL[s.status]} /> },
    {
      key: 'actions',
      header: '',
      render: (session) => (
        <Button variant="ghost" onClick={() => navigate(buildPath(ROUTE_PATHS.SESSION_DETAILS, { sessionId: session.id }))}>
          View
        </Button>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Sessions Management"
        description="Track every ticket, evaluation, and live session across the platform."
        actions={
          <Button variant="secondary" icon="fa-regular fa-calendar" onClick={() => navigate(ROUTE_PATHS.SESSIONS_CALENDAR)}>
            Calendar View
          </Button>
        }
      />

      <div className={styles.toolbar}>
        <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search by patient or doctor…" />
        <FilterBar
          filters={[
            {
              name: 'status',
              value: statusFilter,
              onChange: setStatusFilter,
              options: [
                { value: FILTER_ALL, label: 'All Statuses' },
                ...Object.values(SESSION_STATUS).map((value) => ({ value, label: SESSION_STATUS_LABEL[value] })),
              ],
            },
            {
              name: 'type',
              value: typeFilter,
              onChange: setTypeFilter,
              options: [
                { value: FILTER_ALL, label: 'All Types' },
                ...Object.values(SESSION_TYPE).map((value) => ({ value, label: SESSION_TYPE_LABEL[value] })),
              ],
            },
          ]}
        />
      </div>

      <DataTable columns={columns} rows={pageItems} isLoading={isLoading} emptyTitle="No sessions found" />
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
    </div>
  )
}

export default Sessions
