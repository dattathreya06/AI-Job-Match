import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "../../lib/mongodb"
import { authenticateRequest } from "../../lib/auth"
import { ObjectId } from "mongodb"
import { getJobRecommendations } from "../../lib/ai-service"

export async function GET(req: NextRequest) {
  try {
    // Authenticate request
    const auth = await authenticateRequest(req)
    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db()
    const usersCollection = db.collection("users")
    const jobsCollection = db.collection("jobs")

    // Find user
    const user = await usersCollection.findOne({
      _id: new ObjectId(auth.userId),
    })

    if (!user || !user.profile) {
      return NextResponse.json({ message: "User profile not found" }, { status: 404 })
    }

    // Validate user profile has required fields
    const { profile } = user
    if (!profile.location || !profile.skills || profile.skills.length === 0) {
      return NextResponse.json(
        { message: "Profile incomplete. Please add location and skills to your profile." },
        { status: 400 },
      )
    }

    // Get all jobs
    const jobs = await jobsCollection.find({}).toArray()

    if (jobs.length === 0) {
      return NextResponse.json({ message: "No jobs available for matching" }, { status: 404 })
    }

    // Log the recommendation request
    console.log(`Processing job recommendations for user ${auth.userId}`)
    console.log(
      `User profile: ${profile.location}, ${profile.yearsOfExperience} years, ${profile.skills.length} skills`,
    )
    console.log(`Available jobs: ${jobs.length}`)

    // Get AI recommendations
    const recommendations = await getJobRecommendations(profile, jobs)

    // Log the recommendation results
    console.log(`Found ${recommendations.length} job matches`)

    return NextResponse.json(recommendations)
  } catch (error) {
    console.error("Get recommendations error:", error)
    return NextResponse.json(
      {
        message: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
