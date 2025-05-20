"use client"
import { useState, useEffect } from "react"
import SignupClient from "./signup-client"

export default function SignupPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check if user is already authenticated
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      setIsAuthenticated(true)
      window.location.href = "/profile"
    }
  }, [])

  if (isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg">Already logged in. Redirecting to profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Create an Account</h1>
      <SignupClient />
    </div>
  )
}
