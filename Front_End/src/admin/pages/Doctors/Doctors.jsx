import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/PageHeader/PageHeader'
import SearchBar from '../../components/SearchBar/SearchBar'
import FilterBar from '../../components/FilterBar/FilterBar'
import DataTable from '../../components/DataTable/DataTable'
import Pagination from '../../components/Pagination/Pagination'
import Button from '../../components/Button/Button'
import Avatar from '../../components/Avatar/Avatar'
import StatusBadge from '../../components/StatusBadge/StatusBadge'
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog'
import { doctorService } from '../../services/doctorService'
import { useDebounce } from '../../hooks/useDebounce'
import { usePagination } from '../../hooks/usePagination'
import { useModal } from '../../hooks/useModal'
import { useToast } from '../../hooks/useToast'
import { DOCTOR_STATUS, DOCTOR_STATUS_LABEL } from '../../constants/statusEnums'
import { buildPath, ROUTE_PATHS } from '../../constants/routePaths'
import { formatCurrency } from '../../utils/formatCurrency'
import styles from './Doctors.module.css'

const STATUS_FILTER_ALL = 'all'

function Doctors() {
  const [doctors, setDoctors] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState(STATUS_FILTER_ALL)
  const [sortKey, setSortKey] = useState('name')

  const debouncedSearch = useDebounce(searchTerm)
  const deleteModal = useModal()
  const disableModal = useModal()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const loadDoctors = () => {
    setIsLoading(true)
    doctorService.getAll().then((result) => {
      setDoctors(result)
      setIsLoading(false)
    })
  }

  useEffect(() => {
    loadDoctors()
  }, [])

  const filteredDoctors = useMemo(() => {
    const filtered = doctors.filter((doctor) => {
      const matchesSearch =
        doctor.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        doctor.email.toLowerCase().includes(debouncedSearch.toLowerCase())
      const matchesStatus = statusFilter === STATUS_FILTER_ALL || doctor.status === statusFilter
      return matchesSearch && matchesStatus
    })
    return [...filtered].sort((a, b) => {
      if (sortKey === 'revenue') return b.revenue - a.revenue
      if (sortKey === 'experience') return b.yearsOfExperience - a.yearsOfExperience
      return a.name.localeCompare(b.name)
    })
  }, [doctors, debouncedSearch, statusFilter, sortKey])

  const { pageItems, currentPage, totalPages, goToPage, resetPage } = usePagination(filteredDoctors, 8)

  useEffect(() => {
    resetPage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, statusFilter, sortKey])

  const handleDisable = async () => {
    const doctor = disableModal.payload
    await doctorService.disable(doctor.id)
    showToast(`${doctor.name} has been disabled.`, 'info')
    disableModal.close()
    loadDoctors()
  }

  const handleDelete = async () => {
    const doctor = deleteModal.payload
    await doctorService.remove(doctor.id)
    showToast(`${doctor.name} has been deleted.`, 'success')
    deleteModal.close()
    loadDoctors()
  }

  const columns = [
    {
      key: 'name',
      header: 'Doctor',
      render: (doctor) => (
        <div className={styles.doctorCell}>
          <Avatar name={doctor.name} size="sm" />
          <div>
            <div className={styles.doctorName}>{doctor.name}</div>
            <div className={styles.doctorEmail}>{doctor.email}</div>
          </div>
        </div>
      ),
    },
    { key: 'specialization', header: 'Specialization' },
    { key: 'yearsOfExperience', header: 'Experience', render: (d) => `${d.yearsOfExperience} yrs` },
    { key: 'patientsCount', header: 'Patients' },
    { key: 'revenue', header: 'Revenue', render: (d) => formatCurrency(d.revenue) },
    {
      key: 'status',
      header: 'Status',
      render: (d) => <StatusBadge status={d.status} label={DOCTOR_STATUS_LABEL[d.status]} />,
    },
    {
      key: 'actions',
      header: '',
      render: (doctor) => (
        <div className={styles.actions}>
          <Button variant="ghost" onClick={() => navigate(buildPath(ROUTE_PATHS.DOCTOR_DETAILS, { doctorId: doctor.id }))}>
            View
          </Button>
          <Button variant="ghost" onClick={() => navigate(buildPath(ROUTE_PATHS.DOCTOR_EDIT, { doctorId: doctor.id }))}>
            Edit
          </Button>
          <Button variant="secondary" onClick={() => disableModal.open(doctor)}>
            Disable
          </Button>
          <Button variant="danger" onClick={() => deleteModal.open(doctor)}>
            Delete
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Doctors Management"
        description="Search, filter, and manage every doctor registered on HealMind."
        actions={
          <Button icon="fa-solid fa-plus" onClick={() => navigate(ROUTE_PATHS.DOCTOR_NEW)}>
            Add Doctor
          </Button>
        }
      />

      <div className={styles.toolbar}>
        <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search by name or email…" />
        <FilterBar
          filters={[
            {
              name: 'status',
              value: statusFilter,
              onChange: setStatusFilter,
              options: [
                { value: STATUS_FILTER_ALL, label: 'All Statuses' },
                ...Object.values(DOCTOR_STATUS).map((value) => ({ value, label: DOCTOR_STATUS_LABEL[value] })),
              ],
            },
            {
              name: 'sort',
              value: sortKey,
              onChange: setSortKey,
              options: [
                { value: 'name', label: 'Sort: Name' },
                { value: 'revenue', label: 'Sort: Revenue' },
                { value: 'experience', label: 'Sort: Experience' },
              ],
            },
          ]}
        />
      </div>

      <DataTable
        columns={columns}
        rows={pageItems}
        isLoading={isLoading}
        emptyTitle="No doctors found"
        emptyDescription="Try adjusting your search or filters."
      />

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />

      <ConfirmDialog
        isOpen={disableModal.isOpen}
        onClose={disableModal.close}
        onConfirm={handleDisable}
        title="Disable Doctor"
        message={`Disable ${disableModal.payload?.name}? They will lose access until re-enabled.`}
        confirmLabel="Disable"
        variant="danger"
      />

      <ConfirmDialog
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.close}
        onConfirm={handleDelete}
        title="Delete Doctor"
        message={`Permanently delete ${deleteModal.payload?.name}? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  )
}

export default Doctors
