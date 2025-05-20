"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import Link from "next/link"

interface Job {
  _id: string
  title: string
  company: string
  location: string
  description: string
  skills: string[]
  jobType: "remote" | "onsite" | "hybrid"
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token")
    setIsAuthenticated(!!token)

    // Fetch jobs
    const fetchJobs = async () => {
      try {
        const res = await axios.get("/api/jobs")
        setJobs(res.data)
      } catch (err) {
        console.error("Error fetching jobs:", err)
        setError("Failed to load jobs. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-6 bg-red-50 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Available Jobs</h1>
        {isAuthenticated && (
          <Link
            href="/recommendations"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Get Job Recommendations
          </Link>
        )}
      </div>

      {jobs.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-600">No jobs available at the moment.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{job.title}</h2>
                  <p className="text-gray-600 mt-1">{job.company}</p>
                </div>
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
              </div>

              <p className="text-gray-600 mt-2">{job.location}</p>

              <p className="mt-4 text-gray-700">{job.description}</p>

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
      )}
    </div>
  )
}
