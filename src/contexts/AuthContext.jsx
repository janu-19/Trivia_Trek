import { createContext, useContext, useEffect, useState, useCallback } from "react"
import api from "../lib/api"

const AuthContext = createContext(undefined)

const defaultStats = {
  totalQuizzes: 0,
  bestScore: 0,
  correctAnswers: 0,
  totalAnswers: 0,
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("tt:user")
    return stored ? JSON.parse(stored) : null
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (user) {
      localStorage.setItem("tt:user", JSON.stringify(user))
    } else {
      localStorage.removeItem("tt:user")
    }
  }, [user])

  const login = useCallback(async ({ email, password }) => {
    setIsLoading(true)
    setError(null)
    try {
      const { data } = await api.get("/users", {
        params: { email, password },
      })
      if (!data?.length) {
        throw new Error("Invalid credentials")
      }
      setUser(data[0])
      return data[0]
    } catch (err) {
      setError(err.message || "Unable to login")
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const signup = useCallback(async ({ username, email, password }) => {
    setIsLoading(true)
    setError(null)
    try {
      const { data: existing } = await api.get("/users", { params: { email } })
      if (existing?.length) {
        throw new Error("Email already registered")
      }
      const payload = {
        username,
        email,
        password,
        role: "user",
        stats: defaultStats,
        badges: ["first_step"],
        joinedAt: new Date().toISOString(),
        progressionByCategory: {},
      }
      const { data } = await api.post("/users", payload)
      setUser(data)
      return data
    } catch (err) {
      setError(err.message || "Unable to sign up")
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => setUser(null), [])

  const updateUser = useCallback(async (patch) => {
    if (!user) return
    const updated = { ...user, ...patch }
    await api.patch(`/users/${user.id}`, patch)
    setUser(updated)
  }, [user])

  const value = {
    user,
    isLoading,
    error,
    login,
    signup,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

