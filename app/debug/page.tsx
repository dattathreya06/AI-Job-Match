"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export default function DebugPage() {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState<string | null>(null)
  const [decodedToken, setDecodedToken] = useState<any>(null)

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      try {
        setLoading(true)

        // Get token from localStorage
        const storedToken = localStorage.getItem("token")
        setToken(storedToken)

        // Try to decode the token
        if (storedToken) {
          try {
            const parts = storedToken.split(".")
            if (parts.length === 3) {
              const payload = JSON.parse(atob(parts[1]))
              setDecodedToken(payload)
            }
          } catch (error) {
            console.error("Error decoding token:", error)
          }
        }

        // If we have a token, try to get user data
        if (storedToken) {
          try {
            const res = await fetch("/api/auth/me", {
              headers: {
                Authorization: `Bearer ${storedToken}`,
              },
            })

            if (res.ok) {
              const userData = await res.json()
              setUser(userData)
              setIsAuthenticated(true)
            } else {
              setIsAuthenticated(false)
            }
          } catch (error) {
            console.error("Error fetching user data:", error)
            setIsAuthenticated(false)
          }
        } else {
          setIsAuthenticated(false)
        }
      } catch (error) {
        console.error("Error checking auth:", error)
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const clearToken = () => {
    localStorage.removeItem("token")
    window.location.reload()
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Authentication Debug Page</h1>

      <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
        <p className="text-yellow-800">
          This page is for debugging authentication issues. It displays sensitive information that should not be
          accessible in a production environment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-bold mb-2">Auth State</h2>
          <p>
            <strong>Loading:</strong> {loading ? "Yes" : "No"}
          </p>
          <p>
            <strong>Authenticated:</strong> {isAuthenticated ? "Yes" : "No"}
          </p>
          <p>
            <strong>User:</strong> {user ? "Available" : "Not available"}
          </p>
          {user && (
            <div className="mt-2 p-2 bg-gray-100 rounded">
              <pre className="text-xs overflow-auto">{JSON.stringify(user, null, 2)}</pre>
            </div>
          )}
        </div>

        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-bold mb-2">Token Information</h2>
          <p>
            <strong>Token in localStorage:</strong> {token ? "Available" : "Not available"}
          </p>
          {token && (
            <div className="mt-2">
              <p className="text-xs break-all bg-gray-100 p-2 rounded">
                {token.substring(0, 20)}...{token.substring(token.length - 20)}
              </p>
            </div>
          )}
          {decodedToken && (
            <div className="mt-2">
              <p>
                <strong>Expires:</strong>{" "}
                {decodedToken.exp ? new Date(decodedToken.exp * 1000).toLocaleString() : "N/A"}
              </p>
              <p>
                <strong>User ID:</strong> {decodedToken.userId || "N/A"}
              </p>
              <div className="mt-2 p-2 bg-gray-100 rounded">
                <pre className="text-xs overflow-auto">{JSON.stringify(decodedToken, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <button onClick={clearToken} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Clear Token
        </button>
        <a
          href="/profile"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-block"
        >
          Go to Profile (Direct Link)
        </a>
        <Link
          href="/profile"
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-block"
        >
          Go to Profile (Next.js Link)
        </Link>
      </div>

      <div className="p-4 border rounded-lg">
        <h2 className="text-lg font-bold mb-2">Navigation Test</h2>
        <p className="mb-4">
          If you're experiencing navigation issues, try these different navigation methods to see which one works:
        </p>
        <div className="space-y-2">
          <p>
            <strong>1. Direct URL:</strong> Type <code>/profile</code> directly in your browser's address bar
          </p>
          <p>
            <strong>2. HTML anchor tag:</strong>{" "}
            <a href="/profile" className="text-blue-600 hover:underline">
              Go to Profile
            </a>
          </p>
          <p>
            <strong>3. JavaScript navigation:</strong>{" "}
            <button onClick={() => (window.location.href = "/profile")} className="text-blue-600 hover:underline">
              Go to Profile
            </button>
          </p>
          <p>
            <strong>4. Next.js Link:</strong>{" "}
            <Link href="/profile" className="text-blue-600 hover:underline">
              Go to Profile
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
