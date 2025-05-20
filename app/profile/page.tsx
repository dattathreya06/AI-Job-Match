"use client"

import { useState, useEffect } from "react"
import axios from "axios"

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    location: "",
    yearsOfExperience: 0,
    skills: [],
    preferredJobType: "any",
  })
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check authentication and fetch profile on mount
  useEffect(() => {
    const checkAuthAndFetchProfile = async () => {
      try {
        setIsLoading(true)

        // Get token from localStorage
        const token = localStorage.getItem("token")

        if (!token) {
          setIsAuthenticated(false)
          setIsLoading(false)
          return
        }

        // Fetch user data
        const userResponse = await axios.get("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })

        setUser(userResponse.data)
        setIsAuthenticated(true)

        // Fetch profile data
        const profileResponse = await axios.get("/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })

        setProfile(profileResponse.data)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load profile. Please try logging in again.")
        // Clear token if authentication failed
        localStorage.removeItem("token")
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthAndFetchProfile()
  }, []) // Empty dependency array - only run once on mount

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
        <p className="mb-6">Please log in to view and edit your profile.</p>
        <a href="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Go to Login
        </a>
      </div>
    )
  }

  // Show error message if there was an error
  if (error) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
        <p className="mb-6">{error}</p>
        <a href="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Back to Login
        </a>
      </div>
    )
  }

  // Show profile view (read-only for now to simplify)
  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>

      {user && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <p className="font-medium">Logged in as: {user.name}</p>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Profile Information</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p>
            <strong>Location:</strong> {profile.location || "Not specified"}
          </p>
          <p>
            <strong>Years of Experience:</strong> {profile.yearsOfExperience}
          </p>
          <p>
            <strong>Preferred Job Type:</strong>{" "}
            {profile.preferredJobType.charAt(0).toUpperCase() + profile.preferredJobType.slice(1)}
          </p>

          <div className="mt-4">
            <p>
              <strong>Skills:</strong>
            </p>
            {profile.skills && profile.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {profile.skills.map((skill) => (
                  <span key={skill} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 mt-2">No skills specified</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <a href="/profile-edit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Edit Profile
        </a>
        <a href="/recommendations" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Get Job Recommendations
        </a>
      </div>
    </div>
  )
}
