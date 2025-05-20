"use client"

import { useState, useEffect } from "react"

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem("token")
    setIsAuthenticated(!!token)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <h1 className="text-4xl font-bold mb-6 text-center">AI-Powered Job Match Platform</h1>
      <p className="text-xl mb-8 text-center max-w-2xl">
        Find your perfect job match using our advanced AI recommendation system. Create a profile, browse job listings,
        and get personalized recommendations tailored to your skills and preferences.
      </p>

      <div className="bg-blue-50 p-6 rounded-lg mb-8 max-w-2xl">
        <h2 className="text-2xl font-bold mb-3 text-blue-800">How It Works</h2>
        <ol className="list-decimal pl-6 space-y-2">
          <li className="text-blue-700">Create an account and complete your profile with skills and preferences</li>
          <li className="text-blue-700">Browse available job listings</li>
          <li className="text-blue-700">Click "Find My Matches" to get AI-powered job recommendations</li>
          <li className="text-blue-700">Review your personalized job matches with detailed match explanations</li>
        </ol>
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        {isAuthenticated ? (
          <>
            <a
              href="/profile"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              View Profile
            </a>
          </>
        ) : (
          <>
            <a
              href="/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Sign Up
            </a>
            <a
              href="/login"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Log In
            </a>
          </>
        )}
        <a
          href="/jobs"
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Browse Jobs
        </a>
        {isAuthenticated && (
          <a
            href="/recommendations"
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Get Recommendations
          </a>
        )}
      </div>
    </div>
  )
}
