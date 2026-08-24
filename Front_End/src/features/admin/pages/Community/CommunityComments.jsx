import { useEffect, useMemo, useState } from 'react'
import PageHeader from '../../../../shared/components/PageHeader/PageHeader.jsx'
import SearchBar from '../../../../shared/components/SearchBar/SearchBar.jsx'
import DataTable from '../../../../shared/components/DataTable/DataTable.jsx'
import Button from '../../../../shared/components/AdminButton/AdminButton.jsx'
import StatusBadge from '../../../../shared/components/StatusBadge/StatusBadge.jsx'
import ConfirmDialog from '../../../../shared/components/ConfirmDialog/ConfirmDialog.jsx'
import CommunityTabs from './CommunityTabs.jsx'
import { communityService } from '../../services/communityService'
import { patientService } from '../../services/patientService'
import { useDebounce } from '../../hooks/useDebounce'
import { useModal } from '../../hooks/useModal'
import { useToast } from '../../hooks/useToast'
import { formatDate } from '../../utils/formatDate'
import styles from './Community.module.css'

function CommunityComments() {
  const [comments, setComments] = useState([])
  const [patients, setPatients] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebounce(searchTerm)
  const hideModal = useModal()
  const deleteModal = useModal()
  const { showToast } = useToast()

  const loadComments = () => {
    setIsLoading(true)
    Promise.all([communityService.getComments(), patientService.getAll()]).then(([commentsResult, patientsResult]) => {
      setComments(commentsResult)
      setPatients(patientsResult)
      setIsLoading(false)
    })
  }

  useEffect(() => {
    loadComments()
  }, [])

  const findAuthorName = (id) => patients.find((p) => p.id === id)?.name || id

  const filteredComments = useMemo(
    () =>
      comments.filter(
        (comment) =>
          comment.content.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          findAuthorName(comment.authorId).toLowerCase().includes(debouncedSearch.toLowerCase()),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [comments, debouncedSearch, patients],
  )

  const handleHide = async () => {
    await communityService.hideComment(hideModal.payload.id)
    showToast('Comment hidden.', 'info')
    hideModal.close()
    loadComments()
  }

  const handleDelete = async () => {
    await communityService.deleteComment(deleteModal.payload.id)
    showToast('Comment deleted.', 'success')
    deleteModal.close()
    loadComments()
  }

  const columns = [
    { key: 'content', header: 'Comment', render: (c) => <span className={styles.content}>{c.content}</span> },
    { key: 'postId', header: 'On Post' },
    { key: 'author', header: 'Author', render: (c) => findAuthorName(c.authorId) },
    { key: 'createdAt', header: 'Posted', render: (c) => formatDate(c.createdAt) },
    {
      key: 'status',
      header: 'Status',
      render: (c) =>
        c.isHidden ? (
          <StatusBadge status="hidden" tone="neutral" label="Hidden" />
        ) : c.isReported ? (
          <StatusBadge status="reported" tone="danger" label="Reported" />
        ) : (
          <StatusBadge status="visible" tone="success" label="Visible" />
        ),
    },
    {
      key: 'actions',
      header: '',
      render: (comment) => (
        <div className={styles.actions}>
          {!comment.isHidden && (
            <Button variant="secondary" onClick={() => hideModal.open(comment)}>
              Hide
            </Button>
          )}
          <Button variant="danger" onClick={() => deleteModal.open(comment)}>
            Delete
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader title="Community" description="Moderate posts and comments across the HealMind community." />
      <CommunityTabs />

      <div className={styles.toolbar}>
        <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search comments…" />
      </div>

      <DataTable columns={columns} rows={filteredComments} isLoading={isLoading} emptyTitle="No comments found" />

      <ConfirmDialog
        isOpen={hideModal.isOpen}
        onClose={hideModal.close}
        onConfirm={handleHide}
        title="Hide Comment"
        message="Hide this comment from the community?"
        confirmLabel="Hide"
      />
      <ConfirmDialog
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.close}
        onConfirm={handleDelete}
        title="Delete Comment"
        message="Permanently delete this comment? This cannot be undone."
        confirmLabel="Delete"
      />
    </div>
  )
}

export default CommunityComments
