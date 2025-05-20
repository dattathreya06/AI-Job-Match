"use client"

import { useState, useEffect } from "react"
import axios from "axios"

const skillOptions = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Vue.js",
  "Angular",
  "Node.js",
  "Express",
  "Python",
  "Django",
  "Flask",
  "FastAPI",
  "Java",
  "Spring Boot",
  "C#",
  ".NET",
  "PHP",
  "Laravel",
  "Ruby",
  "Ruby on Rails",
  "Go",
  "Rust",
  "Swift",
  "Kotlin",
  "HTML",
  "CSS",
  "Tailwind CSS",
  "Bootstrap",
  "SASS/SCSS",
  "GraphQL",
  "REST API",
  "SQL",
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "Redis",
  "AWS",
  "Azure",
  "GCP",
  "Docker",
  "Kubernetes",
  "Git",
  "CI/CD",
  "Testing",
  "DevOps",
  "Agile",
  "Scrum",
]

export default function ProfileEditPage() {
  const [profile, setProfile] = useState({
    location: "",
    yearsOfExperience: 0,
    skills: [],
    preferredJobType: "any",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Fetch profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
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
          await axios.get("/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          })
          setIsAuthenticated(true)
        } catch (err) {
          console.error("Authentication error:", err)
          localStorage.removeItem("token")
          setIsAuthenticated(false)
          setIsLoading(false)
          return
        }

        // Fetch profile data
        const response = await axios.get("/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })

        setProfile(response.data)
      } catch (err) {
        console.error("Error fetching profile:", err)
        setError("Failed to load profile data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleSkillChange = (skill) => {
    setProfile((prev) => {
      if (prev.skills.includes(skill)) {
        return {
          ...prev,
          skills: prev.skills.filter((s) => s !== skill),
        }
      } else {
        return {
          ...prev,
          skills: [...prev.skills, skill],
        }
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsSaving(true)

    try {
      const token = localStorage.getItem("token")

      if (!token) {
        setError("Authentication required")
        setIsSaving(false)
        return
      }

      await axios.post("/api/profile", profile, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setSuccess("Profile updated successfully!")

      // Redirect to profile page after successful save
      setTimeout(() => {
        window.location.href = "/profile"
      }, 1500)
    } catch (err) {
      console.error("Error saving profile:", err)
      setError(err.response?.data?.message || "Failed to update profile")
    } finally {
      setIsSaving(false)
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
        <p className="mb-6">Please log in to edit your profile.</p>
        <a href="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Go to Login
        </a>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Edit Your Profile</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
            Location <span className="text-red-500">*</span>
          </label>
          <input
            id="location"
            type="text"
            value={profile.location}
            onChange={(e) => setProfile({ ...profile, location: e.target.value })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="e.g., New York, NY"
            required
          />
          <p className="text-gray-500 text-xs mt-1">Required for job matching</p>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="yearsOfExperience">
            Years of Experience
          </label>
          <input
            id="yearsOfExperience"
            type="number"
            min="0"
            max="50"
            value={profile.yearsOfExperience}
            onChange={(e) => setProfile({ ...profile, yearsOfExperience: Number(e.target.value) })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Preferred Job Type</label>
          <div className="flex flex-wrap gap-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="remote"
                checked={profile.preferredJobType === "remote"}
                onChange={() => setProfile({ ...profile, preferredJobType: "remote" })}
                className="form-radio h-5 w-5 text-blue-600"
              />
              <span className="ml-2 text-gray-700">Remote</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="onsite"
                checked={profile.preferredJobType === "onsite"}
                onChange={() => setProfile({ ...profile, preferredJobType: "onsite" })}
                className="form-radio h-5 w-5 text-blue-600"
              />
              <span className="ml-2 text-gray-700">Onsite</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="any"
                checked={profile.preferredJobType === "any"}
                onChange={() => setProfile({ ...profile, preferredJobType: "any" })}
                className="form-radio h-5 w-5 text-blue-600"
              />
              <span className="ml-2 text-gray-700">Any</span>
            </label>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Skills (select all that apply) <span className="text-red-500">*</span>
          </label>
          <div className="max-h-60 overflow-y-auto p-2 border rounded">
            <div className="flex flex-wrap gap-2">
              {skillOptions.map((skill) => (
                <label key={skill} className="inline-flex items-center bg-gray-100 px-3 py-1 rounded-full">
                  <input
                    type="checkbox"
                    checked={profile.skills.includes(skill)}
                    onChange={() => handleSkillChange(skill)}
                    className="form-checkbox h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">{skill}</span>
                </label>
              ))}
            </div>
          </div>
          <p className="text-gray-500 text-xs mt-1">
            Selected skills: {profile.skills.length} <span className="text-red-500">(at least one required)</span>
          </p>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Profile"}
          </button>

          <a href="/profile" className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
            Cancel
          </a>
        </div>
      </form>
    </div>
  )
}
