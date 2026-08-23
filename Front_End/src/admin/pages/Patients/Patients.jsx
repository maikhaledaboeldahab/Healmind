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
import { patientService } from '../../services/patientService'
import { useDebounce } from '../../hooks/useDebounce'
import { usePagination } from '../../hooks/usePagination'
import { useModal } from '../../hooks/useModal'
import { useToast } from '../../hooks/useToast'
import { COMMUNITY_STATUS, COMMUNITY_STATUS_LABEL } from '../../constants/statusEnums'
import { buildPath, ROUTE_PATHS } from '../../constants/routePaths'
import { formatDate } from '../../utils/formatDate'
import styles from './Patients.module.css'

const STATUS_FILTER_ALL = 'all'

function Patients() {
  const [patients, setPatients] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [communityFilter, setCommunityFilter] = useState(STATUS_FILTER_ALL)

  const debouncedSearch = useDebounce(searchTerm)
  const suspendModal = useModal()
  const deleteModal = useModal()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const loadPatients = () => {
    setIsLoading(true)
    patientService.getAll().then((result) => {
      setPatients(result)
      setIsLoading(false)
    })
  }

  useEffect(() => {
    loadPatients()
  }, [])

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const matchesSearch =
        patient.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        patient.email.toLowerCase().includes(debouncedSearch.toLowerCase())
      const matchesCommunity = communityFilter === STATUS_FILTER_ALL || patient.communityStatus === communityFilter
      return matchesSearch && matchesCommunity
    })
  }, [patients, debouncedSearch, communityFilter])

  const { pageItems, currentPage, totalPages, goToPage, resetPage } = usePagination(filteredPatients, 8)

  useEffect(() => {
    resetPage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, communityFilter])

  const handleSuspend = async () => {
    const patient = suspendModal.payload
    const isSuspended = patient.status === 'suspended'
    await (isSuspended ? patientService.activate(patient.id) : patientService.suspend(patient.id))
    showToast(`${patient.name} has been ${isSuspended ? 'reactivated' : 'suspended'}.`, 'info')
    suspendModal.close()
    loadPatients()
  }

  const handleDelete = async () => {
    const patient = deleteModal.payload
    await patientService.remove(patient.id)
    showToast(`${patient.name} has been deleted.`, 'success')
    deleteModal.close()
    loadPatients()
  }

  const columns = [
    {
      key: 'name',
      header: 'Patient',
      render: (patient) => (
        <div className={styles.patientCell}>
          <Avatar name={patient.name} size="sm" />
          <div>
            <div className={styles.patientName}>{patient.name}</div>
            <div className={styles.patientEmail}>{patient.email}</div>
          </div>
        </div>
      ),
    },
    { key: 'age', header: 'Age' },
    { key: 'registeredDate', header: 'Registered', render: (p) => formatDate(p.registeredDate) },
    {
      key: 'communityStatus',
      header: 'Community Status',
      render: (p) => <StatusBadge status={p.communityStatus} label={COMMUNITY_STATUS_LABEL[p.communityStatus]} />,
    },
    {
      key: 'status',
      header: 'Account',
      render: (p) => <StatusBadge status={p.status} label={p.status === 'active' ? 'Active' : 'Suspended'} />,
    },
    {
      key: 'actions',
      header: '',
      render: (patient) => (
        <div className={styles.actions}>
          <Button variant="ghost" onClick={() => navigate(buildPath(ROUTE_PATHS.PATIENT_DETAILS, { patientId: patient.id }))}>
            View
          </Button>
          <Button variant="ghost" onClick={() => navigate(buildPath(ROUTE_PATHS.PATIENT_EDIT, { patientId: patient.id }))}>
            Edit
          </Button>
          <Button variant="secondary" onClick={() => suspendModal.open(patient)}>
            {patient.status === 'suspended' ? 'Reactivate' : 'Suspend'}
          </Button>
          <Button variant="danger" onClick={() => deleteModal.open(patient)}>
            Delete
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Patients Management"
        description="Monitor patient accounts and community access across the platform."
        actions={
          <Button icon="fa-solid fa-plus" onClick={() => navigate(ROUTE_PATHS.PATIENT_NEW)}>
            Add Patient
          </Button>
        }
      />

      <div className={styles.toolbar}>
        <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search by name or email…" />
        <FilterBar
          filters={[
            {
              name: 'community',
              value: communityFilter,
              onChange: setCommunityFilter,
              options: [
                { value: STATUS_FILTER_ALL, label: 'All Community Statuses' },
                ...Object.values(COMMUNITY_STATUS).map((value) => ({ value, label: COMMUNITY_STATUS_LABEL[value] })),
              ],
            },
          ]}
        />
      </div>

      <DataTable
        columns={columns}
        rows={pageItems}
        isLoading={isLoading}
        emptyTitle="No patients found"
        emptyDescription="Try adjusting your search or filters."
      />

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />

      <ConfirmDialog
        isOpen={suspendModal.isOpen}
        onClose={suspendModal.close}
        onConfirm={handleSuspend}
        title={suspendModal.payload?.status === 'suspended' ? 'Reactivate Patient' : 'Suspend Patient'}
        message={`${suspendModal.payload?.status === 'suspended' ? 'Reactivate' : 'Suspend'} ${suspendModal.payload?.name}'s account?`}
        confirmLabel={suspendModal.payload?.status === 'suspended' ? 'Reactivate' : 'Suspend'}
      />

      <ConfirmDialog
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.close}
        onConfirm={handleDelete}
        title="Delete Patient"
        message={`Permanently delete ${deleteModal.payload?.name}? This action cannot be undone.`}
        confirmLabel="Delete"
      />
    </div>
  )
}

export default Patients
