import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "../../../lib/mongodb"
import { authenticateRequest } from "../../../lib/auth"
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

    // Return user data (excluding password)
    return NextResponse.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    })
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
