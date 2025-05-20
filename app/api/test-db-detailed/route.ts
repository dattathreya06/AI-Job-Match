import { NextResponse } from "next/server"
import { MongoClient, ServerApiVersion } from "mongodb"

export async function GET() {
  try {
    // Check if MongoDB URI is set
    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        {
          status: "error",
          message: "MONGODB_URI environment variable is not set",
          step: "checking_env_var",
        },
        { status: 500 },
      )
    }

    const uri = process.env.MONGODB_URI

    // Log a masked version of the URI for debugging
    const maskedUri = uri.replace(/mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/, "mongodb$1://$2:****@")

    console.log("Attempting to connect with URI:", maskedUri)

    // Create a new MongoClient
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    })

    // Connect to the MongoDB server
    console.log("Connecting to MongoDB...")
    await client.connect()

    // Verify connection by pinging the database
    console.log("Pinging database...")
    await client.db("admin").command({ ping: 1 })

    // Close the connection
    await client.close()

    return NextResponse.json({
      status: "success",
      message: "Database connection successful",
      details: "Successfully connected to MongoDB and pinged the database",
    })
  } catch (error) {
    console.error("Detailed DB test error:", error)

    // Determine the specific error type
    let errorType = "unknown"
    let errorMessage = "Unknown error"

    if (error instanceof Error) {
      errorMessage = error.message

      if (errorMessage.includes("ENOTFOUND") || errorMessage.includes("getaddrinfo")) {
        errorType = "dns_resolution"
      } else if (errorMessage.includes("connection timed out") || errorMessage.includes("ETIMEDOUT")) {
        errorType = "timeout"
      } else if (errorMessage.includes("Authentication failed") || errorMessage.includes("not authorized")) {
        errorType = "authentication"
      } else if (errorMessage.includes("network") || errorMessage.includes("connect")) {
        errorType = "network"
      }
    }

    return NextResponse.json(
      {
        status: "error",
        message: "Database connection failed",
        errorType: errorType,
        details: errorMessage,
      },
      { status: 500 },
    )
  }
}
