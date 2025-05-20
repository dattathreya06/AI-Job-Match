"use client"

import { useEffect, type ReactNode } from "react"
import { useAuth } from "../context/AuthContext"

interface ProtectedRouteProps {
  children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth()

  useEffect(() => {
    // Only redirect if not loading and not authenticated
    if (!loading && !isAuthenticated) {
      // Add a small delay to prevent immediate redirect
      const timer = setTimeout(() => {
        window.location.href = "/login"
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isAuthenticated, loading])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-lg mb-4">Please log in to access this page</p>
          <a href="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Go to Login
          </a>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
