"use client"

import { useState, useEffect } from "react"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userName, setUserName] = useState("")

  // Check authentication on mount and when localStorage changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token")
      setIsAuthenticated(!!token)

      // Try to get user name from localStorage
      const userDataString = localStorage.getItem("userData")
      if (userDataString) {
        try {
          const userData = JSON.parse(userDataString)
          setUserName(userData.name || "")
        } catch (err) {
          console.error("Error parsing user data:", err)
        }
      }
    }

    // Check auth immediately
    checkAuth()

    // Set up event listener for storage changes
    window.addEventListener("storage", checkAuth)

    // Clean up
    return () => {
      window.removeEventListener("storage", checkAuth)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userData")
    setIsAuthenticated(false)
    setUserName("")
    window.location.href = "/"
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="text-xl font-bold text-blue-600">
              JobMatch AI
            </a>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <a href="/jobs" className="text-gray-700 hover:text-blue-600">
              Jobs
            </a>

            {isAuthenticated ? (
              <>
                <a href="/profile" className="text-gray-700 hover:text-blue-600">
                  Profile
                </a>
                <a href="/recommendations" className="text-gray-700 hover:text-blue-600">
                  Recommendations
                </a>
                <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md">
                  Logout {userName ? `(${userName})` : ""}
                </button>
              </>
            ) : (
              <>
                <a href="/login" className="text-gray-700 hover:text-blue-600">
                  Login
                </a>
                <a href="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                  Sign Up
                </a>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white pb-4 px-4">
          <a href="/jobs" className="block py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>
            Jobs
          </a>

          {isAuthenticated ? (
            <>
              <a
                href="/profile"
                className="block py-2 text-gray-700 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </a>
              <a
                href="/recommendations"
                className="block py-2 text-gray-700 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Recommendations
              </a>
              <button
                onClick={() => {
                  handleLogout()
                  setIsMenuOpen(false)
                }}
                className="block w-full text-left py-2 text-red-500 hover:text-red-600"
              >
                Logout {userName ? `(${userName})` : ""}
              </button>
            </>
          ) : (
            <>
              <a
                href="/login"
                className="block py-2 text-gray-700 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </a>
              <a
                href="/signup"
                className="block py-2 text-gray-700 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </a>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
