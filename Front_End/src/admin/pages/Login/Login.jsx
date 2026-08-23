import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import Button from '../../components/Button/Button'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import { ROUTE_PATHS } from '../../constants/routePaths'
import styles from './Login.module.css'

function Login() {
  const { login, isAuthenticated, isLoading } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  if (isAuthenticated) {
    const redirectTo = location.state?.from?.pathname || ROUTE_PATHS.DASHBOARD
    return <Navigate to={redirectTo} replace />
  }

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    try {
      await login(form)
      showToast('Welcome back to HealMind Admin.', 'success')
      navigate(ROUTE_PATHS.DASHBOARD, { replace: true })
    } catch (err) {
      setError(err.message || 'Unable to sign in. Please check your credentials.')
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.blobTop} aria-hidden="true" />
      <div className={styles.blobBottom} aria-hidden="true" />

      <div className={styles.card}>
        <div className={styles.brand}>
          <span className={styles.brandIcon}>
            <i className="fa-solid fa-leaf" aria-hidden="true" />
          </span>
          <span className={styles.brandName}>HealMind</span>
        </div>

        <h1 className={styles.title}>Admin sign in</h1>
        <p className={styles.subtitle}>Manage doctors, patients, and the HealMind community from one place.</p>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <label className={styles.field}>
            <span className={styles.label}>Email address</span>
            <input
              type="email"
              required
              value={form.email}
              onChange={handleChange('email')}
              placeholder="admin@healmind.com"
              className={styles.input}
              autoComplete="username"
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Password</span>
            <input
              type="password"
              required
              value={form.password}
              onChange={handleChange('password')}
              placeholder="••••••••"
              className={styles.input}
              autoComplete="current-password"
            />
          </label>

          {error && (
            <p className={styles.error}>
              <i className="fa-solid fa-circle-exclamation" aria-hidden="true" /> {error}
            </p>
          )}

          <Button type="submit" fullWidth isLoading={isLoading}>
            Sign In
          </Button>
        </form>

        <p className={styles.footnote}>Protected admin area · JWT-secured session</p>
      </div>
    </div>
  )
}

export default Login
