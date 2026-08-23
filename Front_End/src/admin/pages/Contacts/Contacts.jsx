import { useEffect, useMemo, useState } from 'react'
import PageHeader from '../../components/PageHeader/PageHeader'
import SearchBar from '../../components/SearchBar/SearchBar'
import FilterBar from '../../components/FilterBar/FilterBar'
import DataTable from '../../components/DataTable/DataTable'
import Pagination from '../../components/Pagination/Pagination'
import Button from '../../components/Button/Button'
import StatusBadge from '../../components/StatusBadge/StatusBadge'
import Modal from '../../components/Modal/Modal'
import { contactService } from '../../services/contactService'
import { useDebounce } from '../../hooks/useDebounce'
import { usePagination } from '../../hooks/usePagination'
import { formatDate } from '../../utils/formatDate'
import styles from './Contacts.module.css'

const FILTER_ALL = 'all'
const FILTER_UNREAD = 'unread'
const FILTER_READ = 'read'

function Contacts() {
  const [contacts, setContacts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState(FILTER_ALL)
  const [selectedContact, setSelectedContact] = useState(null)

  // Local state for Admin Reply UI
  const [replyMessage, setReplyMessage] = useState('')
  const [replyError, setReplyError] = useState('')
  const [replyFeedback, setReplyFeedback] = useState('')

  const debouncedSearch = useDebounce(searchTerm)

  const loadContacts = async () => {
    setIsLoading(true)
    const result = await contactService.getAll()
    setContacts(result)
    setIsLoading(false)
  }

  useEffect(() => {
    loadContacts()
  }, [])

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      const search = debouncedSearch.toLowerCase()
      const matchesSearch =
        contact.name.toLowerCase().includes(search) ||
        contact.email.toLowerCase().includes(search) ||
        contact.subject.toLowerCase().includes(search) ||
        contact.message.toLowerCase().includes(search)

      const matchesStatus =
        statusFilter === FILTER_ALL ||
        (statusFilter === FILTER_UNREAD && !contact.isRead) ||
        (statusFilter === FILTER_READ && contact.isRead)

      return matchesSearch && matchesStatus
    })
  }, [contacts, debouncedSearch, statusFilter])

  const { pageItems, currentPage, totalPages, goToPage, resetPage } = usePagination(filteredContacts, 8)

  useEffect(() => {
    resetPage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, statusFilter])

  const handleOpenDetail = async (contact) => {
    setSelectedContact(contact)
    setReplyMessage('')
    setReplyError('')
    setReplyFeedback('')

    if (!contact.isRead) {
      const updated = await contactService.markAsRead(contact.id)
      if (updated) {
        setContacts((prev) => prev.map((c) => (c.id === contact.id ? { ...c, isRead: true } : c)))
        setSelectedContact({ ...contact, isRead: true })
      }
    }
  }

  const handleCloseDetail = () => {
    setSelectedContact(null)
    setReplyMessage('')
    setReplyError('')
    setReplyFeedback('')
  }

  const handleReplySubmit = (e) => {
    e.preventDefault()
    const trimmed = replyMessage.trim()
    if (!trimmed) {
      setReplyError('Reply message is required.')
      return
    }

    // TODO: Connect future backend reply endpoint (e.g. POST /admin/contact/:id/reply)
    // Payload: { contactId: selectedContact?.id, replyMessage: trimmed }
    setReplyError('')
    setReplyFeedback('Reply is ready for backend integration.')
  }

  const columns = [
    { key: 'name', header: 'Sender Name' },
    { key: 'email', header: 'Email Address' },
    { key: 'subject', header: 'Subject' },
    {
      key: 'status',
      header: 'Status',
      render: (c) => (
        <StatusBadge
          status={c.isRead ? 'read' : 'unread'}
          label={c.isRead ? 'Read' : 'Unread'}
          tone={c.isRead ? 'success' : 'warning'}
        />
      ),
    },
    { key: 'createdAt', header: 'Date Received', render: (c) => formatDate(c.createdAt) },
    {
      key: 'actions',
      header: '',
      render: (contact) => (
        <Button variant="ghost" onClick={() => handleOpenDetail(contact)}>
          View
        </Button>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Contact Us Inquiries"
        description="Review and respond to messages submitted by patients and users."
      />

      <div className={styles.toolbar}>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by sender name, email, subject, or message…"
        />
        <FilterBar
          filters={[
            {
              name: 'status',
              value: statusFilter,
              onChange: setStatusFilter,
              options: [
                { value: FILTER_ALL, label: 'All Messages' },
                { value: FILTER_UNREAD, label: 'Unread' },
                { value: FILTER_READ, label: 'Read' },
              ],
            },
          ]}
        />
      </div>

      <DataTable
        columns={columns}
        rows={pageItems}
        isLoading={isLoading}
        emptyTitle="No contact messages found"
        emptyDescription="Messages submitted through the user Contact Us form will appear here."
      />
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />

      {selectedContact && (
        <Modal
          isOpen={Boolean(selectedContact)}
          onClose={handleCloseDetail}
          title="Contact Message Details"
          size="md"
        >
          <div className={styles.modalContent}>
            <div className={styles.detailRow}>
              <span className={styles.label}>Sender</span>
              <span className={styles.value}>
                <strong>{selectedContact.name}</strong> ({selectedContact.email})
              </span>
            </div>

            <div className={styles.detailRow}>
              <span className={styles.label}>Subject</span>
              <span className={styles.value}>{selectedContact.subject}</span>
            </div>

            <div className={styles.detailRow}>
              <span className={styles.label}>Date Received</span>
              <span className={styles.value}>
                {formatDate(selectedContact.createdAt)}
                {selectedContact.updatedAt && selectedContact.updatedAt !== selectedContact.createdAt && (
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85em', marginLeft: '8px' }}>
                    (Updated: {formatDate(selectedContact.updatedAt)})
                  </span>
                )}
              </span>
            </div>

            <div className={styles.detailRow}>
              <span className={styles.label}>Status</span>
              <span>
                <StatusBadge
                  status={selectedContact.isRead ? 'read' : 'unread'}
                  label={selectedContact.isRead ? 'Read' : 'Unread'}
                  tone={selectedContact.isRead ? 'success' : 'warning'}
                />
              </span>
            </div>

            <div className={styles.detailRow}>
              <span className={styles.label}>Message</span>
              <div className={styles.messageBox}>{selectedContact.message}</div>
            </div>

            {/* Reply to User Section */}
            <div className={styles.replySection}>
              <h4 className={styles.replyTitle}>
                <i className="fa-solid fa-reply" aria-hidden="true" /> Reply to User
              </h4>

              {replyFeedback && (
                <div className={styles.replyFeedback}>
                  <i className="fa-solid fa-circle-check" aria-hidden="true" />
                  <span>{replyFeedback}</span>
                </div>
              )}

              <div className={styles.detailRow}>
                <span className={styles.label}>Reply Message</span>
                <textarea
                  className={styles.replyTextarea}
                  rows={4}
                  placeholder="Write your response to the user..."
                  value={replyMessage}
                  onChange={(e) => {
                    setReplyMessage(e.target.value)
                    if (replyError) setReplyError('')
                  }}
                />
                {replyError && <p className={styles.replyError}>{replyError}</p>}
              </div>
            </div>

            <div className={styles.modalActions}>
              <Button
                variant="primary"
                icon="fa-solid fa-paper-plane"
                disabled={!replyMessage.trim()}
                onClick={handleReplySubmit}
              >
                Send Reply
              </Button>
              <Button variant="ghost" onClick={handleCloseDetail}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default Contacts
