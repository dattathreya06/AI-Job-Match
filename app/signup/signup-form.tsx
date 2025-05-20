"use client"

import { useState } from "react"
import axios from "axios"

export default function SignupForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await axios.post("/api/auth/signup", {
        name,
        email,
        password,
      })

      if (response.data.token) {
        localStorage.setItem("token", response.data.token)
        if (response.data.user) {
          localStorage.setItem("userData", JSON.stringify(response.data.user))
        }
        setIsSuccess(true)
        setTimeout(() => {
          window.location.href = "/profile"
        }, 1000)
      } else {
        setError("No authentication token received")
      }
    } catch (err) {
      console.error("Signup error:", err)
      setError(err.response?.data?.message || "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center">
        <div className="text-green-600 text-5xl mb-4">✓</div>
        <h1 className="text-2xl font-bold mb-4">Account Created Successfully!</h1>
        <p className="mb-6">Redirecting you to your profile...</p>
        <div className="animate-pulse">
          <div className="h-2 bg-blue-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            minLength={6}
          />
          <p className="text-gray-500 text-xs mt-1">Password must be at least 6 characters</p>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
        </div>
      </form>

      <div className="text-center mt-4">
        <p>
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:text-blue-800">
            Log In
          </a>
        </p>
      </div>
    </div>
  )
}
