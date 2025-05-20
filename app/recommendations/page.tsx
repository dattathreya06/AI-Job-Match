"use client"

import { useState, useEffect } from "react"
import axios from "axios"

interface Job {
  _id: string
  title: string
  company: string
  location: string
  description: string
  skills: string[]
  jobType: "remote" | "onsite" | "hybrid"
  matchScore?: number
  matchReason?: string
}

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false)
  const [error, setError] = useState("")
  const [hasProfile, setHasProfile] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)

  // Check authentication and profile on mount
  useEffect(() => {
    const checkAuthAndProfile = async () => {
      try {
        setIsLoading(true)

        // Get token from localStorage
        const token = localStorage.getItem("token")

        if (!token) {
          setIsAuthenticated(false)
          setIsLoading(false)
          return
        }

        // Check authentication
        try {
          const res = await axios.get("/api/auth/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          setUser(res.data)
          setIsAuthenticated(true)
        } catch (err) {
          console.error("Authentication error:", err)
          localStorage.removeItem("token")
          setIsAuthenticated(false)
          setIsLoading(false)
          return
        }

        // Check profile
        const profileResponse = await axios.get("/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const profile = profileResponse.data
        setHasProfile(profile.location && profile.skills && profile.skills.length > 0)
      } catch (err) {
        console.error("Error checking profile:", err)
        setHasProfile(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthAndProfile()
  }, [])

  const getRecommendations = async () => {
    setIsLoadingRecommendations(true)
    setError("")

    try {
      const token = localStorage.getItem("token")

      if (!token) {
        setError("Authentication required")
        setIsLoadingRecommendations(false)
        return
      }

      const response = await axios.get("/api/recommendations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setRecommendations(response.data)
    } catch (err: any) {
      console.error("Error getting recommendations:", err)
      setError(err.response?.data?.message || "Failed to get recommendations")
    } finally {
      setIsLoadingRecommendations(false)
    }
  }

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
        <p className="mb-6">Please log in to view job recommendations.</p>
        <a href="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Go to Login
        </a>
      </div>
    )
  }

  // Show profile completion prompt if profile is incomplete
  if (!hasProfile) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-yellow-50 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Complete Your Profile</h1>
        <p className="mb-4">
          To get personalized job recommendations, you need to complete your profile with your skills and location.
        </p>
        <a href="/profile-edit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Complete Profile
        </a>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6">AI Job Recommendations</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

      {recommendations.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center mb-6">
          <p className="text-gray-600 mb-6">
            Our AI will analyze your profile and find the best job matches for you. Click the button below to get
            started.
          </p>
          <button
            onClick={getRecommendations}
            disabled={isLoadingRecommendations}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg"
          >
            {isLoadingRecommendations ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Finding Your Perfect Matches...
              </span>
            ) : (
              "Find My Matches"
            )}
          </button>
        </div>
      ) : (
        <div>
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            <p className="font-bold">AI Recommendation Results</p>
            <p>We found {recommendations.length} job matches based on your profile!</p>
          </div>

          <div className="space-y-6">
            {recommendations.map((job) => (
              <div
                key={job._id}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{job.title}</h2>
                    <p className="text-gray-600 mt-1">{job.company}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        job.jobType === "remote"
                          ? "bg-green-100 text-green-800"
                          : job.jobType === "onsite"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {job.jobType.charAt(0).toUpperCase() + job.jobType.slice(1)}
                    </span>
                    {job.matchScore && (
                      <span className="mt-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                        Match: {job.matchScore}%
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-gray-600 mt-2">{job.location}</p>

                <p className="mt-4 text-gray-700">{job.description}</p>

                {job.matchReason && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-md">
                    <p className="text-sm font-medium text-blue-800">Why this matches your profile:</p>
                    <p className="text-sm text-blue-700 mt-1">{job.matchReason}</p>
                  </div>
                )}

                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Required Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <span key={skill} className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={getRecommendations}
              disabled={isLoadingRecommendations}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              {isLoadingRecommendations ? "Refreshing..." : "Refresh Recommendations"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
