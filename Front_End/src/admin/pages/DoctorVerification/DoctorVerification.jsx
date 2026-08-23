import { useEffect, useMemo, useState } from 'react'
import PageHeader from '../../components/PageHeader/PageHeader'
import SearchBar from '../../components/SearchBar/SearchBar'
import FilterBar from '../../components/FilterBar/FilterBar'
import Pagination from '../../components/Pagination/Pagination'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import EmptyState from '../../components/EmptyState/EmptyState'
import DoctorCard from '../../components/DoctorCard/DoctorCard'
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog'
import { doctorService } from '../../services/doctorService'
import { useDebounce } from '../../hooks/useDebounce'
import { usePagination } from '../../hooks/usePagination'
import { useModal } from '../../hooks/useModal'
import { useToast } from '../../hooks/useToast'
import { useNavigate } from 'react-router-dom'
import { buildPath, ROUTE_PATHS } from '../../constants/routePaths'
import styles from './DoctorVerification.module.css'

const SPECIALIZATION_FILTER_ALL = 'all'

function DoctorVerification() {
  const [doctors, setDoctors] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [specialization, setSpecialization] = useState(SPECIALIZATION_FILTER_ALL)
  const [processingId, setProcessingId] = useState(null)

  const debouncedSearch = useDebounce(searchTerm)
  const approveModal = useModal()
  const rejectModal = useModal()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const loadDoctors = () => {
    setIsLoading(true)
    doctorService.getPendingVerification().then((result) => {
      setDoctors(result)
      setIsLoading(false)
    })
  }

  useEffect(() => {
    loadDoctors()
  }, [])

  const specializations = useMemo(
    () => [SPECIALIZATION_FILTER_ALL, ...new Set(doctors.map((d) => d.specialization))],
    [doctors],
  )

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const matchesSearch = doctor.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      const matchesSpecialization = specialization === SPECIALIZATION_FILTER_ALL || doctor.specialization === specialization
      return matchesSearch && matchesSpecialization
    })
  }, [doctors, debouncedSearch, specialization])

  const { pageItems, currentPage, totalPages, goToPage, resetPage } = usePagination(filteredDoctors, 6)

  useEffect(() => {
    resetPage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, specialization])

  const handleApprove = async () => {
    const doctor = approveModal.payload
    setProcessingId(doctor.id)
    await doctorService.approve(doctor.id)
    setDoctors((prev) => prev.filter((d) => d.id !== doctor.id))
    setProcessingId(null)
    approveModal.close()
    showToast(`${doctor.name} has been verified.`, 'success')
  }

  const handleReject = async () => {
    const doctor = rejectModal.payload
    setProcessingId(doctor.id)
    await doctorService.reject(doctor.id)
    setDoctors((prev) => prev.filter((d) => d.id !== doctor.id))
    setProcessingId(null)
    rejectModal.close()
    showToast(`${doctor.name}'s application was rejected.`, 'info')
  }

  return (
    <div>
      <PageHeader
        title="Doctor Verification"
        description="Review pending doctor applications, certificates, and experience before granting platform access."
      />

      <div className={styles.toolbar}>
        <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search pending doctors…" />
        <FilterBar
          filters={[
            {
              name: 'specialization',
              value: specialization,
              onChange: setSpecialization,
              options: specializations.map((value) => ({
                value,
                label: value === SPECIALIZATION_FILTER_ALL ? 'All Specializations' : value,
              })),
            },
          ]}
        />
      </div>

      {isLoading ? (
        <LoadingSpinner fullHeight label="Loading pending applications…" />
      ) : filteredDoctors.length === 0 ? (
        <EmptyState
          icon="fa-solid fa-user-check"
          title="No pending applications"
          description="All doctor applications have been reviewed. New submissions will appear here."
        />
      ) : (
        <>
          <div className={styles.grid}>
            {pageItems.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                onViewDetails={(d) => navigate(buildPath(ROUTE_PATHS.DOCTOR_DETAILS, { doctorId: d.id }))}
                onApprove={(d) => approveModal.open(d)}
                onReject={(d) => rejectModal.open(d)}
              />
            ))}
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
        </>
      )}

      <ConfirmDialog
        isOpen={approveModal.isOpen}
        onClose={approveModal.close}
        onConfirm={handleApprove}
        title="Approve Doctor"
        message={`Approve ${approveModal.payload?.name}? They will gain full access to the HealMind platform.`}
        confirmLabel="Approve"
        variant="primary"
        isLoading={processingId === approveModal.payload?.id}
      />

      <ConfirmDialog
        isOpen={rejectModal.isOpen}
        onClose={rejectModal.close}
        onConfirm={handleReject}
        title="Reject Application"
        message={`Reject ${rejectModal.payload?.name}'s application? They will be notified of this decision.`}
        confirmLabel="Reject"
        variant="danger"
        isLoading={processingId === rejectModal.payload?.id}
      />
    </div>
  )
}

export default DoctorVerification
