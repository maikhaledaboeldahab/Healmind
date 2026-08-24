import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../../../shared/components/PageHeader/PageHeader'
import SearchBar from '../../../../shared/components/SearchBar/SearchBar'
import FilterBar from '../../../../shared/components/FilterBar/FilterBar'
import DataTable from '../../../../shared/components/DataTable/DataTable'
import Pagination from '../../../../shared/components/AdminPagination/AdminPagination'
import Button from '../../../../shared/components/AdminButton/AdminButton'
import StatusBadge from '../../../../shared/components/StatusBadge/StatusBadge'
import { ticketService } from '../../services/ticketService'
import { patientService } from '../../services/patientService'
import { doctorService } from '../../services/doctorService'
import { useDebounce } from '../../hooks/useDebounce'
import { usePagination } from '../../hooks/usePagination'
import { TICKET_STATUS, TICKET_STATUS_LABEL, TICKET_DECISION_LABEL } from '../../constants/statusEnums'
import { buildPath, ROUTE_PATHS } from '../../constants/routePaths'
import { formatDate } from '../../utils/formatDate'
import styles from './Tickets.module.css'

const STATUS_FILTER_ALL = 'all'

function Tickets() {
  const [tickets, setTickets] = useState([])
  const [patients, setPatients] = useState([])
  const [doctors, setDoctors] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState(STATUS_FILTER_ALL)

  const debouncedSearch = useDebounce(searchTerm)
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([ticketService.getAll(), patientService.getAll(), doctorService.getAll()]).then(
      ([ticketsResult, patientsResult, doctorsResult]) => {
        setTickets(ticketsResult)
        setPatients(patientsResult)
        setDoctors(doctorsResult)
        setIsLoading(false)
      },
    )
  }, [])

  const findPatientName = (id) => patients.find((p) => p.id === id)?.name || id
  const findDoctorName = (id) => doctors.find((d) => d.id === id)?.name || id

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const patientName = findPatientName(ticket.patientId).toLowerCase()
      const subject = (ticket.subject || '').toLowerCase()
      const search = debouncedSearch.toLowerCase()
      const matchesSearch =
        ticket.id.toLowerCase().includes(search) || patientName.includes(search) || subject.includes(search)
      const matchesStatus = statusFilter === STATUS_FILTER_ALL || ticket.status === statusFilter || ticket.decision === statusFilter
      return matchesSearch && matchesStatus
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tickets, debouncedSearch, statusFilter, patients])

  const { pageItems, currentPage, totalPages, goToPage, resetPage } = usePagination(filteredTickets, 8)

  useEffect(() => {
    resetPage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, statusFilter])

  const columns = [
    { key: 'id', header: 'Ticket ID' },
    { key: 'patient', header: 'Patient', render: (t) => findPatientName(t.patientId) },
    { key: 'subject', header: 'Subject', render: (t) => t.subject || 'Community Access Request' },
    { key: 'doctor', header: 'Assigned Doctor', render: (t) => findDoctorName(t.doctorId) },
    { key: 'createdAt', header: 'Created Date', render: (t) => formatDate(t.createdAt || t.bookingDate) },
    { key: 'status', header: 'Session Status', render: (t) => <StatusBadge status={t.status} label={TICKET_STATUS_LABEL[t.status]} /> },
    { key: 'decision', header: 'Doctor Decision', render: (t) => <StatusBadge status={t.decision} label={TICKET_DECISION_LABEL[t.decision]} /> },
    {
      key: 'actions',
      header: '',
      render: (ticket) => (
        <Button variant="ghost" onClick={() => navigate(buildPath(ROUTE_PATHS.TICKET_DETAILS, { ticketId: ticket.id }))}>
          View
        </Button>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Community Access Tickets"
        description="Monitor patient community access requests and doctor evaluations across the platform."
      />

      <div className={styles.toolbar}>
        <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search by ticket ID, patient, or subject…" />
        <FilterBar
          filters={[
            {
              name: 'status',
              value: statusFilter,
              onChange: setStatusFilter,
              options: [
                { value: STATUS_FILTER_ALL, label: 'All Statuses' },
                ...Object.values(TICKET_STATUS).map((value) => ({ value, label: TICKET_STATUS_LABEL[value] })),
              ],
            },
          ]}
        />
      </div>

      <DataTable columns={columns} rows={pageItems} isLoading={isLoading} emptyTitle="No tickets found" />
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
    </div>
  )
}

export default Tickets
