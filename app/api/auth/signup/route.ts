import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import clientPromise from "../../../lib/mongodb"
import { generateToken } from "../../../lib/auth"

export async function POST(req: NextRequest) {
  try {
    console.log("Signup request received")

    // Parse request body
    let body
    try {
      body = await req.json()
      console.log("Request body parsed:", { name: body.name, email: body.email })
    } catch (error) {
      console.error("Error parsing request body:", error)
      return NextResponse.json({ message: "Invalid request body" }, { status: 400 })
    }

    const { name, email, password } = body

    // Validate input
    if (!name || !email || !password) {
      console.log("Missing required fields:", { name: !!name, email: !!email, password: !!password })
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    if (password.length < 6) {
      console.log("Password too short")
      return NextResponse.json({ message: "Password must be at least 6 characters" }, { status: 400 })
    }

    // Connect to MongoDB
    console.log("Connecting to MongoDB...")
    let client
    try {
      client = await clientPromise
      console.log("MongoDB connection successful")
    } catch (error) {
      console.error("MongoDB connection error:", error)
      return NextResponse.json({ message: "Database connection error" }, { status: 500 })
    }

    const db = client.db()
    const usersCollection = db.collection("users")

    // Check if user already exists
    console.log("Checking if user exists...")
    const existingUser = await usersCollection.findOne({ email })
    if (existingUser) {
      console.log("User already exists with email:", email)
      return NextResponse.json({ message: "User already exists with this email" }, { status: 400 })
    }

    // Hash password
    console.log("Hashing password...")
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    console.log("Creating user...")
    const result = await usersCollection.insertOne({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      profile: {
        location: "",
        yearsOfExperience: 0,
        skills: [],
        preferredJobType: "any",
      },
    })

    console.log("User created with ID:", result.insertedId)

    // Generate JWT token
    const token = generateToken(result.insertedId.toString())

    // Return user data and token
    return NextResponse.json({
      user: {
        _id: result.insertedId,
        name,
        email,
      },
      token,
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json(
      {
        message: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
