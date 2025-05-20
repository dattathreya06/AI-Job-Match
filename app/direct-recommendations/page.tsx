"use client"

import { useEffect, useState } from "react"

export default function DirectRecommendationsPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token")

    // Redirect based on authentication status
    if (token) {
      window.location.href = "/recommendations"
    } else {
      window.location.href = "/login"
    }
  }, [])

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-lg">Redirecting to your recommendations...</p>
        <button
          onClick={() => (window.location.href = "/recommendations")}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Go to Recommendations Now
        </button>
      </div>
    </div>
  )
}
