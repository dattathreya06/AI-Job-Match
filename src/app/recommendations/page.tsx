"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import { useRouter } from "next/navigation"
import axios from "axios"
import Link from "next/link"
import ClientWrapper from "../../components/ClientWrapper"
import RecommendationsList from "../../components/RecommendationsList"

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
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()

  const [recommendations, setRecommendations] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [hasProfile, setHasProfile] = useState(true)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    } else if (isAuthenticated) {
      checkProfile()
    }
  }, [isAuthenticated, loading, router])

  const checkProfile = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await axios.get("/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      // Check if profile has required fields
      const profile = res.data
      if (!profile.location || profile.skills.length === 0) {
        setHasProfile(false)
      }
    } catch (err) {
      console.error("Error checking profile:", err)
      setHasProfile(false)
    }
  }

  const getRecommendations = async () => {
    setIsLoading(true)
    setError("")

    try {
      const token = localStorage.getItem("token")
      const res = await axios.get("/api/recommendations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setRecommendations(res.data)
    } catch (err: any) {
      console.error("Error getting recommendations:", err)
      setError(err.response?.data?.message || "Failed to get recommendations")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ClientWrapper>
      {loading ? (
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : !hasProfile ? (
        <div className="max-w-2xl mx-auto mt-8 p-6 bg-yellow-50 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">Complete Your Profile</h1>
          <p className="mb-4">
            To get personalized job recommendations, you need to complete your profile with your skills and location.
          </p>
          <Link href="/profile" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Update Profile
          </Link>
        </div>
      ) : (
        <RecommendationsList
          recommendations={recommendations}
          isLoading={isLoading}
          error={error}
          getRecommendations={getRecommendations}
        />
      )}
    </ClientWrapper>
  )
}
