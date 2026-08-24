import { createContext, useCallback, useMemo, useState } from 'react'
import { MOCK_ADMIN_PROFILE } from '../constants/mockData'

export const AuthContext = createContext(null)

const TOKEN_KEY = 'healmind_admin_token'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY))
  const [admin, setAdmin] = useState(() => (sessionStorage.getItem(TOKEN_KEY) ? MOCK_ADMIN_PROFILE : null))
  const [isLoading, setIsLoading] = useState(false)

  const login = useCallback(async ({ email, password }) => {
    setIsLoading(true)
    try {
      // Simulated JWT auth call — replace with real authService call.
      await new Promise((resolve) => setTimeout(resolve, 600))
      if (!email || !password) {
        throw new Error('Email and password are required.')
      }
      const fakeToken = `mock-jwt-token.${btoa(email)}.signature`
      sessionStorage.setItem(TOKEN_KEY, fakeToken)
      setToken(fakeToken)
      setAdmin({ ...MOCK_ADMIN_PROFILE, email })
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
