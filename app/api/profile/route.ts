import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "../../lib/mongodb"
import { authenticateRequest } from "../../lib/auth"
import { ObjectId } from "mongodb"

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

    // Find user
    const user = await usersCollection.findOne({
      _id: new ObjectId(auth.userId),
    })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Return profile data
    return NextResponse.json(
      user.profile || {
        location: "",
        yearsOfExperience: 0,
        skills: [],
        preferredJobType: "any",
      },
    )
  } catch (error) {
    console.error("Get profile error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    // Authenticate request
    const auth = await authenticateRequest(req)
    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Get profile data from request
    const profileData = await req.json()

    // Validate profile data
    if (
      !profileData.location ||
      profileData.yearsOfExperience === undefined ||
      !profileData.skills ||
      !profileData.preferredJobType
    ) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db()
    const usersCollection = db.collection("users")

    // Update user profile
    await usersCollection.updateOne({ _id: new ObjectId(auth.userId) }, { $set: { profile: profileData } })

    return NextResponse.json({ message: "Profile updated successfully" })
  } catch (error) {
    console.error("Update profile error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
