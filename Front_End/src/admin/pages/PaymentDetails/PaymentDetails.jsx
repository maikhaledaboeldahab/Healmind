import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../../components/PageHeader/PageHeader'
import Card from '../../components/Card/Card'
import Button from '../../components/Button/Button'
import StatusBadge from '../../components/StatusBadge/StatusBadge'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import { paymentService } from '../../services/paymentService'
import { patientService } from '../../services/patientService'
import { doctorService } from '../../services/doctorService'
import { PAYMENT_STATUS_LABEL, SESSION_TYPE_LABEL } from '../../constants/statusEnums'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatDate } from '../../utils/formatDate'
import { buildPath, ROUTE_PATHS } from '../../constants/routePaths'
import styles from './PaymentDetails.module.css'

function PaymentDetails() {
  const { paymentId } = useParams()
  const navigate = useNavigate()
  const [payment, setPayment] = useState(null)
  const [patient, setPatient] = useState(null)
  const [doctor, setDoctor] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    paymentService.getById(paymentId).then(async (paymentResult) => {
      if (!paymentResult) {
        setIsLoading(false)
        return
      }
      const [patientResult, doctorResult] = await Promise.all([
        patientService.getById(paymentResult.patientId),
        doctorService.getById(paymentResult.doctorId),
      ])
      setPayment(paymentResult)
      setPatient(patientResult)
      setDoctor(doctorResult)
      setIsLoading(false)
    })
  }, [paymentId])

  if (isLoading) return <LoadingSpinner fullHeight label="Loading payment…" />

  if (!payment) {
    return (
      <Card>
        <p>Payment not found.</p>
        <Button variant="ghost" onClick={() => navigate(ROUTE_PATHS.PAYMENTS)}>
          Back to Payments
        </Button>
      </Card>
    )
  }

  return (
    <div>
      <PageHeader title={`Payment ${payment.id}`} description="Full transaction breakdown and revenue split." />

      <div className={styles.grid}>
        <Card>
          <h3 className={styles.sectionTitle}>Transaction</h3>
          <dl className={styles.infoList}>
            <div>
              <dt>Patient</dt>
              <dd className={styles.link} onClick={() => navigate(buildPath(ROUTE_PATHS.PATIENT_DETAILS, { patientId: payment.patientId }))}>
                {patient?.name || payment.patientId}
              </dd>
            </div>
            <div>
              <dt>Doctor</dt>
              <dd className={styles.link} onClick={() => navigate(buildPath(ROUTE_PATHS.DOCTOR_DETAILS, { doctorId: payment.doctorId }))}>
                {doctor?.name || payment.doctorId}
              </dd>
            </div>
            <div>
              <dt>Session</dt>
              <dd
                className={styles.link}
                onClick={() => navigate(buildPath(ROUTE_PATHS.SESSION_DETAILS, { sessionId: payment.sessionId }))}
              >
                {payment.sessionId}
              </dd>
            </div>
            <div>
              <dt>Session Type</dt>
              <dd>{SESSION_TYPE_LABEL[payment.sessionType]}</dd>
            </div>
            <div>
              <dt>Payment Date</dt>
              <dd>{formatDate(payment.paymentDate)}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>
                <StatusBadge status={payment.status} label={PAYMENT_STATUS_LABEL[payment.status]} />
              </dd>
            </div>
          </dl>
        </Card>

        <Card>
          <h3 className={styles.sectionTitle}>Revenue Split</h3>
          <div className={styles.splitRow}>
            <div className={styles.splitCard}>
              <span className={styles.splitValue}>{formatCurrency(payment.amount)}</span>
              <span className={styles.splitLabel}>Total Amount</span>
            </div>
            <div className={styles.splitCard}>
              <span className={styles.splitValue}>{formatCurrency(payment.doctorRevenue)}</span>
              <span className={styles.splitLabel}>Doctor Revenue</span>
            </div>
            <div className={styles.splitCard}>
              <span className={styles.splitValue}>{formatCurrency(payment.platformRevenue)}</span>
              <span className={styles.splitLabel}>Platform Revenue</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default PaymentDetails
