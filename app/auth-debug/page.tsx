"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Cookies from "js-cookie"

export default function AuthDebugPage() {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [localStorageToken, setLocalStorageToken] = useState<string | null>(null)
  const [cookieToken, setCookieToken] = useState<string | null>(null)
  const [tokenInfo, setTokenInfo] = useState<any>(null)
  const [apiResponse, setApiResponse] = useState<any>(null)
  const [apiError, setApiError] = useState<string | null>(null)
  const [isTestingApi, setIsTestingApi] = useState(false)

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      try {
        setLoading(true)

        // Check tokens
        const lsToken = localStorage.getItem("token")
        setLocalStorageToken(lsToken)

        const ckToken = Cookies.get("token")
        setCookieToken(ckToken || null)

        // Parse token if available
        if (lsToken) {
          try {
            const payload = JSON.parse(atob(lsToken.split(".")[1]))
            setTokenInfo(payload)
          } catch (e) {
            console.error("Error parsing token:", e)
          }
        }

        // If we have a token, try to get user data
        if (lsToken) {
          try {
            const res = await fetch("/api/auth/me", {
              headers: {
                Authorization: `Bearer ${lsToken}`,
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

  const testApiAuth = async () => {
    setIsTestingApi(true)
    setApiResponse(null)
    setApiError(null)

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()
      setApiResponse({
        status: response.status,
        data,
      })
    } catch (error) {
      console.error("API test error:", error)
      setApiError(error instanceof Error ? error.message : "Unknown error")
    } finally {
      setIsTestingApi(false)
    }
  }

  const refreshUserData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")

      if (!token) {
        setIsAuthenticated(false)
        setLoading(false)
        return
      }

      const res = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
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
      console.error("Error refreshing user data:", error)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const clearAuth = () => {
    try {
      localStorage.removeItem("token")
      Cookies.remove("token", { path: "/" })
      window.location.reload()
    } catch (error) {
      console.error("Error clearing auth:", error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Authentication Debug Page</h1>

      <div className="mb-8 p-4 bg-yellow-50 rounded-lg">
        <p className="text-yellow-800 font-bold">Warning</p>
        <p className="text-yellow-700">
          This page is for debugging purposes only. It displays sensitive information that should not be accessible in a
          production environment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-bold mb-2">Authentication State</h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Loading:</span> {loading ? "Yes" : "No"}
            </p>
            <p>
              <span className="font-medium">Authenticated:</span> {isAuthenticated ? "Yes" : "No"}
            </p>
            <p>
              <span className="font-medium">User:</span>{" "}
              {user ? (
                <span className="text-green-600">Available</span>
              ) : (
                <span className="text-red-600">Not available</span>
              )}
            </p>
            {user && (
              <div className="mt-2 p-2 bg-gray-100 rounded text-sm">
                <pre>{JSON.stringify(user, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-bold mb-2">Token Storage</h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">LocalStorage Token:</span>{" "}
              {localStorageToken ? (
                <span className="text-green-600">Available</span>
              ) : (
                <span className="text-red-600">Not available</span>
              )}
            </p>
            <p>
              <span className="font-medium">Cookie Token:</span>{" "}
              {cookieToken ? (
                <span className="text-green-600">Available</span>
              ) : (
                <span className="text-red-600">Not available</span>
              )}
            </p>
            {localStorageToken && (
              <div className="mt-2">
                <p className="font-medium">Token Preview:</p>
                <div className="p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                  <code className="break-all">{`${localStorageToken.substring(0, 20)}...${localStorageToken.substring(
                    localStorageToken.length - 10,
                  )}`}</code>
                </div>
              </div>
            )}
          </div>
        </div>

        {tokenInfo && (
          <div className="p-4 border rounded-lg md:col-span-2">
            <h2 className="text-lg font-bold mb-2">Token Information</h2>
            <div className="p-2 bg-gray-100 rounded text-sm overflow-x-auto">
              <pre>{JSON.stringify(tokenInfo, null, 2)}</pre>
            </div>
            <div className="mt-2">
              <p>
                <span className="font-medium">Expires:</span>{" "}
                {tokenInfo.exp ? new Date(tokenInfo.exp * 1000).toLocaleString() : "N/A"}
              </p>
              <p>
                <span className="font-medium">Issued At:</span>{" "}
                {tokenInfo.iat ? new Date(tokenInfo.iat * 1000).toLocaleString() : "N/A"}
              </p>
              <p>
                <span className="font-medium">Is Expired:</span>{" "}
                {tokenInfo.exp && tokenInfo.exp * 1000 < Date.now() ? (
                  <span className="text-red-600">Yes</span>
                ) : (
                  <span className="text-green-600">No</span>
                )}
              </p>
            </div>
          </div>
        )}

        <div className="p-4 border rounded-lg md:col-span-2">
          <h2 className="text-lg font-bold mb-2">API Authentication Test</h2>
          <button
            onClick={testApiAuth}
            disabled={isTestingApi}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
          >
            {isTestingApi ? "Testing..." : "Test API Authentication"}
          </button>

          {apiResponse && (
            <div className="mt-2">
              <p>
                <span className="font-medium">Status:</span>{" "}
                <span
                  className={apiResponse.status >= 200 && apiResponse.status < 300 ? "text-green-600" : "text-red-600"}
                >
                  {apiResponse.status}
                </span>
              </p>
              <div className="p-2 bg-gray-100 rounded text-sm overflow-x-auto mt-2">
                <pre>{JSON.stringify(apiResponse.data, null, 2)}</pre>
              </div>
            </div>
          )}

          {apiError && (
            <div className="mt-2 p-2 bg-red-100 text-red-700 rounded">
              <p className="font-medium">Error:</p>
              <p>{apiError}</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        <button
          onClick={refreshUserData}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Refresh User Data
        </button>
        <button onClick={clearAuth} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Clear Authentication
        </button>
        <Link href="/" className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
          Back to Home
        </Link>
      </div>
    </div>
  )
}
