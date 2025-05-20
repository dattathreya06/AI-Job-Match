"use client"

import { useState, useEffect } from "react"

export default function LoginClient() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Set isClient to true when component mounts (client-side only)
  useEffect(() => {
    setIsClient(true)

    // Check if user is already authenticated
    const token = localStorage.getItem("token")
    if (token) {
      setIsAuthenticated(true)
      window.location.href = "/profile"
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Simple login request
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Login failed")
      }

      // Store token in localStorage
      localStorage.setItem("token", data.token)

      // Store user data if needed
      if (data.user) {
        localStorage.setItem("userData", JSON.stringify(data.user))
      }

      // Show success message
      setIsSuccess(true)

      // Redirect to profile page after a short delay
      setTimeout(() => {
        window.location.href = "/profile"
      }, 1000)
    } catch (err) {
      console.error("Login error:", err)
      setError(err.message || "Invalid email or password")
    } finally {
      setIsLoading(false)
    }
  }

  // If not client-side yet, show nothing to prevent hydration errors
  if (!isClient) {
    return null
  }

  // If already authenticated, show loading while redirecting
  if (isAuthenticated) {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-lg">Already logged in. Redirecting to profile...</p>
      </div>
    )
  }

  // Show success message
  if (isSuccess) {
    return (
      <div className="text-center">
        <div className="text-green-600 text-5xl mb-4">✓</div>
        <h1 className="text-2xl font-bold mb-4">Login Successful!</h1>
        <p className="mb-6">Redirecting you to your profile...</p>
        <div className="animate-pulse">
          <div className="h-2 bg-blue-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Log In"}
          </button>
        </div>
      </form>

      <div className="text-center mt-4">
        <p>
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-600 hover:text-blue-800">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  )
}
