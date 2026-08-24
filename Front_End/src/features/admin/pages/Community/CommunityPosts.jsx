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

function CommunityPosts() {
  const [posts, setPosts] = useState([])
  const [patients, setPatients] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebounce(searchTerm)
  const hideModal = useModal()
  const deleteModal = useModal()
  const { showToast } = useToast()

  const loadPosts = () => {
    setIsLoading(true)
    Promise.all([communityService.getPosts(), patientService.getAll()]).then(([postsResult, patientsResult]) => {
      setPosts(postsResult)
      setPatients(patientsResult)
      setIsLoading(false)
    })
  }

  useEffect(() => {
    loadPosts()
  }, [])

  const findAuthorName = (id) => patients.find((p) => p.id === id)?.name || id

  const filteredPosts = useMemo(
    () =>
      posts.filter(
        (post) =>
          post.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          findAuthorName(post.authorId).toLowerCase().includes(debouncedSearch.toLowerCase()),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [posts, debouncedSearch, patients],
  )

  const handleHide = async () => {
    await communityService.hidePost(hideModal.payload.id)
    showToast('Post hidden from community feed.', 'info')
    hideModal.close()
    loadPosts()
  }

  const handleDelete = async () => {
    await communityService.deletePost(deleteModal.payload.id)
    showToast('Post deleted.', 'success')
    deleteModal.close()
    loadPosts()
  }

  const columns = [
    { key: 'title', header: 'Post', render: (p) => <span className={styles.title}>{p.title}</span> },
    { key: 'author', header: 'Author', render: (p) => findAuthorName(p.authorId) },
    { key: 'createdAt', header: 'Posted', render: (p) => formatDate(p.createdAt) },
    { key: 'commentsCount', header: 'Comments' },
    { key: 'reactionsCount', header: 'Reactions' },
    {
      key: 'status',
      header: 'Status',
      render: (p) =>
        p.isHidden ? (
          <StatusBadge status="hidden" tone="neutral" label="Hidden" />
        ) : p.isReported ? (
          <StatusBadge status="reported" tone="danger" label="Reported" />
        ) : (
          <StatusBadge status="visible" tone="success" label="Visible" />
        ),
    },
    {
      key: 'actions',
      header: '',
      render: (post) => (
        <div className={styles.actions}>
          {!post.isHidden && (
            <Button variant="secondary" onClick={() => hideModal.open(post)}>
              Hide
            </Button>
          )}
          <Button variant="danger" onClick={() => deleteModal.open(post)}>
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
        <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search posts by title or author…" />
      </div>

      <DataTable columns={columns} rows={filteredPosts} isLoading={isLoading} emptyTitle="No posts found" />

      <ConfirmDialog
        isOpen={hideModal.isOpen}
        onClose={hideModal.close}
        onConfirm={handleHide}
        title="Hide Post"
        message="Hide this post from the community feed?"
        confirmLabel="Hide"
      />
      <ConfirmDialog
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.close}
        onConfirm={handleDelete}
        title="Delete Post"
        message="Permanently delete this post? This cannot be undone."
        confirmLabel="Delete"
      />
    </div>
  )
}

export default CommunityPosts
