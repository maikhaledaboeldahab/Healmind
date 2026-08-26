import { createContext, useCallback, useMemo, useState } from 'react'
import { MOCK_ADMIN_PROFILE } from '../constants/mockData'
import { authService } from '../services/authService'

export const AuthContext = createContext(null)

const TOKEN_KEY = 'healmind_admin_token'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem('healmind_token'))
  const [admin, setAdmin] = useState(() => (sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem('healmind_token') ? MOCK_ADMIN_PROFILE : null))
  const [isLoading, setIsLoading] = useState(false)

  const login = useCallback(async ({ email, password }) => {
    setIsLoading(true)
    try {
      if (!email || !password) {
        throw new Error('Email and password are required.')
      }
      const user = await authService.login({ email, password })
      const realToken = sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem('healmind_token')
      setToken(realToken)
      setAdmin({
        ...MOCK_ADMIN_PROFILE,
        id: user.id || user._id || 'admin-001',
        name: user.name || user.fullName || 'Admin',
        email: user.email || email,
      })
      return true
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setAdmin(null)
  }, [])

  const value = useMemo(
    () => ({
      admin,
      token,
      isAuthenticated: Boolean(token),
      isLoading,
      login,
      logout,
      setAdmin,
    }),
    [admin, token, isLoading, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
