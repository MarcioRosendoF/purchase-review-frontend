import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { AUTH_STORAGE_KEY, login as apiLogin, register as apiRegister } from './api'
import type { AuthResponse } from './types'

interface AuthContextValue {
  user: AuthResponse | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readStoredUser(): AuthResponse | null {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthResponse
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthResponse | null>(readStoredUser)

  const saveSession = useCallback((response: AuthResponse) => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(response))
    setUser(response)
  }, [])

  const login = useCallback((email: string, password: string): Promise<void> => {
    return apiLogin(email, password).then(saveSession)
  }, [saveSession])

  const register = useCallback((name: string, email: string, password: string): Promise<void> => {
    return apiRegister(name, email, password).then(saveSession)
  }, [saveSession])

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ user, login, register, logout }),
    [user, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
