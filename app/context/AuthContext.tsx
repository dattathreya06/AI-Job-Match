"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import Cookies from "js-cookie"

interface User {
  _id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void | { success: boolean }>
  signup: (name: string, email: string, password: string) => Promise<void | { success: boolean }>
  logout: () => void
  isAuthenticated: boolean
  refreshUserData: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Helper function to store token in both localStorage and cookies
const storeToken = (token: string) => {
  try {
    localStorage.setItem("token", token)
    Cookies.set("token", token, { expires: 7, path: "/" }) // 7 days expiry
  } catch (error) {
    console.error("Error storing token:", error)
  }
}

// Helper function to get token from localStorage or cookies
const getToken = (): string | null => {
  try {
    // Try localStorage first
    const localToken = localStorage.getItem("token")
    if (localToken) return localToken

    // Fall back to cookies
    const cookieToken = Cookies.get("token")
    return cookieToken || null
  } catch (error) {
    console.error("Error retrieving token:", error)
    return null
  }
}

// Helper function to remove token from both localStorage and cookies
const removeToken = () => {
  try {
    localStorage.removeItem("token")
    Cookies.remove("token", { path: "/" })
  } catch (error) {
    console.error("Error removing token:", error)
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Function to fetch user data using the stored token
  const fetchUserData = async (): Promise<User | null> => {
    try {
      const token = getToken()
      if (!token) {
        return null
      }

      const res = await axios.get("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return res.data
    } catch (error) {
      console.error("Error fetching user data:", error)
      // If there's an error (like invalid token), clear the token
      removeToken()
      return null
    }
  }

  // Function to refresh user data (can be called after actions that might change user data)
  const refreshUserData = async () => {
    try {
      setLoading(true)
      const userData = await fetchUserData()
      setUser(userData)
    } catch (error) {
      console.error("Error refreshing user data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Check authentication status on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await fetchUserData()
        setUser(userData)
      } catch (error) {
        console.error("Error checking authentication:", error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)

      const res = await axios.post("/api/auth/login", { email, password })

      if (!res.data.token) {
        throw new Error("No token received from server")
      }

      // Store token in both localStorage and cookies
      storeToken(res.data.token)

      // Set user data
      setUser(res.data.user)

      // Return success - we'll handle navigation in the component
      return { success: true }
    } catch (error: any) {
      console.error("Login error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    try {
      setLoading(true)

      const res = await axios.post("/api/auth/signup", { name, email, password })

      if (!res.data.token) {
        throw new Error("No token received from server")
      }

      // Store token in both localStorage and cookies
      storeToken(res.data.token)

      // Set user data
      setUser(res.data.user)

      // Return success - we'll handle navigation in the component
      return { success: true }
    } catch (error) {
      console.error("Signup error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    removeToken()
    setUser(null)
    window.location.href = "/"
  }

  const contextValue = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    refreshUserData,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
