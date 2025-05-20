"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { useRouter } from "next/navigation"
import axios from "axios"

interface UserProfile {
  location: string
  yearsOfExperience: number
  skills: string[]
  preferredJobType: "remote" | "onsite" | "any"
}

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

export default function ProfileForm() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()

  const [profile, setProfile] = useState<UserProfile>({
    location: "",
    yearsOfExperience: 0,
    skills: [],
    preferredJobType: "any",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    } else if (isAuthenticated) {
      fetchProfile()
    }
  }, [isAuthenticated, loading, router])

  const fetchProfile = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      const res = await axios.get("/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setProfile(res.data)
    } catch (err) {
      console.error("Error fetching profile:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsSaving(true)

    try {
      const token = localStorage.getItem("token")
      await axios.post("/api/profile", profile, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setSuccess("Profile updated successfully!")
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  const handleSkillChange = (skill: string) => {
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

  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
            Location
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
            onChange={(e) => setProfile({ ...profile, yearsOfExperience: Number.parseInt(e.target.value) })}
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
          <label className="block text-gray-700 text-sm font-bold mb-2">Skills (select all that apply)</label>
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
          <p className="text-gray-500 text-xs mt-1">Selected skills: {profile.skills.length}</p>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  )
}
