"use client"

import { useEffect } from "react"
import { useAuth } from "../context/AuthContext"

interface DirectNavigationProps {
  to: string
  fallbackTo: string
}

export default function DirectNavigation({ to, fallbackTo }: DirectNavigationProps) {
  const { isAuthenticated, loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        window.location.href = to
      } else {
        window.location.href = fallbackTo
      }
    }
  }, [isAuthenticated, loading, to, fallbackTo])

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-lg">Redirecting...</p>
      </div>
    </div>
  )
}
