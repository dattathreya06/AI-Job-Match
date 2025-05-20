# AI-Powered Job Match Platform

A full-stack application that uses AI to match users with job listings based on their skills, experience, and preferences.
Access the website Live here 
https://ai-job-match.vercel.app/

## Features

- User authentication (signup, login, logout)
- User profile creation and management
- Job listings page
- AI-powered job recommendations

## Tech Stack

- **Frontend**: Next.js with App Router and Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Authentication**: JWT
- **AI Integration**: OpenAI API

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account
- OpenAI API key

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/job-match-platform.git
   cd job-match-platform
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Create a `.env.local` file in the root directory with the following variables:
   \`\`\`
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   OPENAI_API_KEY=your_openai_api_key
   \`\`\`

4. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## AI Integration Explanation

This project uses OpenAI's GPT-3.5-turbo model to provide job recommendations based on user profiles. Here's how it works:

### 1. User Profile Collection

When a user creates their profile, we collect the following information:
- Location
- Years of experience
- Skills (multi-select from a predefined list)
- Preferred job type (remote/onsite/any)

This information is stored in MongoDB and is used as input for the AI recommendation system.

### 2. AI Recommendation Process

When a user clicks the "Find My Matches" button on the recommendations page, the following process occurs:

1. The frontend sends a request to the `/api/recommendations` endpoint
2. The backend retrieves the user's profile from the database
3. The backend retrieves all available job listings from the database
4. The backend constructs a detailed prompt for the OpenAI API that includes:
   - The user's profile information (location, experience, skills, job type preference)
   - Details of all available jobs (title, company, location, skills, job type, description)
   - Instructions for the AI to analyze and match the user with the most suitable jobs

5. The prompt is sent to the OpenAI API, which returns a structured response with the top job matches
6. The backend processes the AI response and returns the top 3 job matches to the frontend
7. The frontend displays these matches in a clean card layout with match scores and reasons

### 3. AI Prompt Design

The prompt is carefully designed to guide the AI in making accurate job recommendations. Here's the structure:

\`\`\`
You are an AI career advisor helping match job seekers with appropriate job listings.

User Profile:
- Location: [user location]
- Years of Experience: [user experience]
- Skills: [user skills]
- Preferred Job Type: [user preference]

Available Jobs:
Job 1 (ID: [job id]):
- Title: [job title]
- Company: [company name]
- Location: [job location]
- Job Type: [job type]
- Skills Required: [job skills]
- Description: [job description]

[... more jobs ...]

Based on the user's profile, analyze each job and provide the top 3 most suitable matches. For each match, provide:
1. The job ID
2. A match score from 0-100
3. A brief explanation of why this job is a good match for the user

Consider the following factors in your analysis:
- Skill match: How many of the user's skills match the job requirements
- Location match: Is the job in the same location as the user
- Job type match: Does the job type match the user's preference
- Experience level: Is the user's experience appropriate for the job

Return your response in JSON format with an array of objects, each containing jobId, matchScore, and matchReason.
\`\`\`

### 4. Fallback Mechanism

In case the AI API fails or returns an invalid response, we've implemented a fallback mechanism that uses a simple algorithm to match users with jobs based on:
- Skill overlap (60% weight)
- Location match (20% weight)
- Job type preference match (20% weight)

This ensures that users always receive recommendations, even if the AI service is temporarily unavailable.

## User Flow

1. User signs up or logs in
2. User completes their profile with location, experience, skills, and job type preference
3. User navigates to the recommendations page
4. User clicks "Find My Matches" button
5. The system processes the request through the AI and displays the top 3 job matches
6. Each job match includes a match score and explanation of why it's a good fit

## Project Structure

- `app/` - Next.js App Router pages and API routes
- `app/api/` - Backend API endpoints
- `app/api/auth/` - Authentication endpoints
- `app/api/recommendations/` - AI recommendation endpoint
- `app/components/` - Reusable React components
- `app/context/` - React context for global state management
- `app/lib/` - Utility functions and services
- `app/lib/ai-service.ts` - AI integration service
- `middleware.ts` - Next.js middleware for route protection

## Future Improvements

- Add admin panel for managing job listings
- Implement job search and filtering
- Add unit and integration tests
- Enhance AI recommendations with more sophisticated algorithms
- Add email notifications for new job matches
\`\`\`

## 5. Let's update the job listings page to ensure it meets requirements:

```typescriptreact file="app/jobs/page.tsx"
[v0-no-op-code-block-prefix]"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import Link from "next/link"
import { useAuth } from "../context/AuthContext"

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
  const { isAuthenticated } = useAuth()

  useEffect(() => {
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
            <div key={job._id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
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
