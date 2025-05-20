import OpenAI from "openai"

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface UserProfile {
  location: string
  yearsOfExperience: number
  skills: string[]
  preferredJobType: string
}

interface Job {
  _id: string
  title: string
  company: string
  location: string
  description: string
  skills: string[]
  jobType: string
}

export async function getJobRecommendations(userProfile: UserProfile, jobs: Job[]) {
  try {
    // Create a detailed prompt for the AI
    const prompt = `
You are an AI career advisor helping match job seekers with appropriate job listings.

User Profile:
- Location: ${userProfile.location}
- Years of Experience: ${userProfile.yearsOfExperience}
- Skills: ${userProfile.skills.join(", ")}
- Preferred Job Type: ${userProfile.preferredJobType}

Available Jobs:
${jobs
  .map(
    (job, index) => `
Job ${index + 1} (ID: ${job._id}):
- Title: ${job.title}
- Company: ${job.company}
- Location: ${job.location}
- Job Type: ${job.jobType}
- Skills Required: ${job.skills.join(", ")}
- Description: ${job.description}
`,
  )
  .join("\n")}

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
Example:
[
  {
    "jobId": "job123",
    "matchScore": 85,
    "matchReason": "Strong skill match with 5 overlapping skills. Job type matches preference."
  },
  ...
]
`

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful AI career advisor." },
        { role: "user", content: prompt },
      ],
      temperature: 0.5,
      max_tokens: 1000,
    })

    // Parse the response
    const content = response.choices[0].message.content
    if (!content) {
      throw new Error("No response from AI")
    }

    // Extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}|\[[\s\S]*\]/)
    if (!jsonMatch) {
      throw new Error("Could not parse AI response")
    }

    const recommendations = JSON.parse(jsonMatch[0])

    // Map recommendations to jobs
    return jobs
      .filter((job) => recommendations.some((rec: any) => rec.jobId === job._id.toString()))
      .map((job) => {
        const recommendation = recommendations.find((rec: any) => rec.jobId === job._id.toString())
        return {
          ...job,
          matchScore: recommendation.matchScore,
          matchReason: recommendation.matchReason,
        }
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3) // Ensure we return only the top 3 matches
  } catch (error) {
    console.error("AI recommendation error:", error)
    // Fallback to simple matching if AI fails
    return getSimpleRecommendations(userProfile, jobs)
  }
}

// Fallback function for simple recommendations without AI
function getSimpleRecommendations(userProfile: UserProfile, jobs: Job[]) {
  const recommendations = jobs.map((job) => {
    // Calculate skill match
    const userSkills = new Set(userProfile.skills)
    const jobSkills = new Set(job.skills)
    const matchingSkills = [...userSkills].filter((skill) => jobSkills.has(skill))
    const skillMatchScore = jobSkills.size > 0 ? (matchingSkills.length / jobSkills.size) * 100 : 0

    // Calculate location match
    const locationMatch = job.location.toLowerCase().includes(userProfile.location.toLowerCase()) ? 100 : 50

    // Calculate job type match
    const jobTypeMatch =
      userProfile.preferredJobType === "any" || userProfile.preferredJobType === job.jobType ? 100 : 50

    // Calculate overall match score with weighted factors
    const matchScore = Math.round(skillMatchScore * 0.6 + locationMatch * 0.2 + jobTypeMatch * 0.2)

    // Generate match reason
    let matchReason = `This job matches ${matchingSkills.length} of your skills`
    if (matchingSkills.length > 0) {
      matchReason += ` (${matchingSkills.join(", ")})`
    }

    if (userProfile.preferredJobType === job.jobType) {
      matchReason += ` and matches your preferred job type (${job.jobType})`
    } else if (userProfile.preferredJobType === "any") {
      matchReason += ` and you're open to any job type`
    }

    if (job.location.toLowerCase().includes(userProfile.location.toLowerCase())) {
      matchReason += `. The job is in your preferred location.`
    }

    return {
      ...job,
      matchScore,
      matchReason,
    }
  })

  // Sort by match score and return top 3
  return recommendations.sort((a, b) => b.matchScore - a.matchScore).slice(0, 3)
}
