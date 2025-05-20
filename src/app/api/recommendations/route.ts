import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "../../../lib/mongodb"
import { authenticateRequest } from "../../../lib/auth"
import { ObjectId } from "mongodb"
import { getJobRecommendations } from "../../../lib/ai-service"

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

    // Get all jobs
    const jobs = await jobsCollection.find({}).toArray()

    // Get AI recommendations
    const recommendations = await getJobRecommendations(user.profile, jobs)

    return NextResponse.json(recommendations)
  } catch (error) {
    console.error("Get recommendations error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
