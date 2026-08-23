import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/PageHeader/PageHeader'
import SearchBar from '../../components/SearchBar/SearchBar'
import FilterBar from '../../components/FilterBar/FilterBar'
import DataTable from '../../components/DataTable/DataTable'
import Pagination from '../../components/Pagination/Pagination'
import Button from '../../components/Button/Button'
import StatusBadge from '../../components/StatusBadge/StatusBadge'
import StatCard from '../../components/StatCard/StatCard'
import { paymentService } from '../../services/paymentService'
import { patientService } from '../../services/patientService'
import { doctorService } from '../../services/doctorService'
import { useDebounce } from '../../hooks/useDebounce'
import { usePagination } from '../../hooks/usePagination'
import { PAYMENT_STATUS, PAYMENT_STATUS_LABEL, SESSION_TYPE_LABEL } from '../../constants/statusEnums'
import { buildPath, ROUTE_PATHS } from '../../constants/routePaths'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatDate } from '../../utils/formatDate'
import styles from './Payments.module.css'

const FILTER_ALL = 'all'

function Payments() {
  const [payments, setPayments] = useState([])
  const [patients, setPatients] = useState([])
  const [doctors, setDoctors] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState(FILTER_ALL)

  const debouncedSearch = useDebounce(searchTerm)
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([paymentService.getAll(), patientService.getAll(), doctorService.getAll()]).then(
      ([paymentsResult, patientsResult, doctorsResult]) => {
        setPayments(paymentsResult)
        setPatients(patientsResult)
        setDoctors(doctorsResult)
        setIsLoading(false)
      },
    )
  }, [])

  const findPatientName = (id) => patients.find((p) => p.id === id)?.name || id
  const findDoctorName = (id) => doctors.find((d) => d.id === id)?.name || id

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const matchesSearch =
        payment.id.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        findPatientName(payment.patientId).toLowerCase().includes(debouncedSearch.toLowerCase())
      const matchesStatus = statusFilter === FILTER_ALL || payment.status === statusFilter
      return matchesSearch && matchesStatus
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payments, debouncedSearch, statusFilter, patients])

  const { pageItems, currentPage, totalPages, goToPage, resetPage } = usePagination(filteredPayments, 8)

  useEffect(() => {
    resetPage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, statusFilter])

  const totals = useMemo(
    () => ({
      total: payments.reduce((sum, p) => sum + p.amount, 0),
      doctorRevenue: payments.reduce((sum, p) => sum + p.doctorRevenue, 0),
      platformRevenue: payments.reduce((sum, p) => sum + p.platformRevenue, 0),
    }),
    [payments],
  )

  const columns = [
    { key: 'id', header: 'Payment ID' },
    { key: 'patient', header: 'Patient', render: (p) => findPatientName(p.patientId) },
    { key: 'doctor', header: 'Doctor', render: (p) => findDoctorName(p.doctorId) },
    { key: 'sessionType', header: 'Session Type', render: (p) => SESSION_TYPE_LABEL[p.sessionType] },
    { key: 'amount', header: 'Amount', render: (p) => formatCurrency(p.amount) },
    { key: 'paymentDate', header: 'Payment Date', render: (p) => formatDate(p.paymentDate) },
    { key: 'status', header: 'Status', render: (p) => <StatusBadge status={p.status} label={PAYMENT_STATUS_LABEL[p.status]} /> },
    {
      key: 'actions',
      header: '',
      render: (payment) => (
        <Button variant="ghost" onClick={() => navigate(buildPath(ROUTE_PATHS.PAYMENT_DETAILS, { paymentId: payment.id }))}>
          View
        </Button>
      ),
    },
  ]

  return (
    <div>
      <PageHeader title="Payments" description="Track every transaction, doctor revenue split, and platform earnings." />

      <div className={styles.statGrid}>
        <StatCard icon="fa-solid fa-sack-dollar" label="Total Collected" value={formatCurrency(totals.total)} tone="primary" />
        <StatCard icon="fa-solid fa-user-doctor" label="Doctor Revenue" value={formatCurrency(totals.doctorRevenue)} tone="secondary" />
        <StatCard icon="fa-solid fa-building-columns" label="Platform Revenue" value={formatCurrency(totals.platformRevenue)} tone="tertiary" />
      </div>

      <div className={styles.toolbar}>
        <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search by payment ID or patient…" />
        <FilterBar
          filters={[
            {
              name: 'status',
              value: statusFilter,
              onChange: setStatusFilter,
              options: [
                { value: FILTER_ALL, label: 'All Statuses' },
                ...Object.values(PAYMENT_STATUS).map((value) => ({ value, label: PAYMENT_STATUS_LABEL[value] })),
              ],
            },
          ]}
        />
      </div>

      <DataTable columns={columns} rows={pageItems} isLoading={isLoading} emptyTitle="No payments found" />
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
    </div>
  )
}

export default Payments
