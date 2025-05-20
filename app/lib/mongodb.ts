import { MongoClient, ServerApiVersion } from "mongodb"

// Check if MongoDB URI is set
if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI environment variable is not set")
  throw new Error("Please add your MongoDB URI to .env.local or Vercel environment variables")
}

const uri = process.env.MONGODB_URI

// Log a masked version of the URI for debugging
const maskedUri = uri.replace(/mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/, "mongodb$1://$2:****@")
console.log("MongoDB URI configured:", maskedUri)

const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  // Add connection timeout options
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  // Add retry options
  retryWrites: true,
  retryReads: true,
}

let client
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect().catch((error) => {
      console.error("Failed to connect to MongoDB in development:", error)
      throw error
    })
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect().catch((error) => {
    console.error("Failed to connect to MongoDB in production:", error)
    throw error
  })
}

// Add a test function to verify the connection
export async function testConnection() {
  try {
    console.log("Testing MongoDB connection...")
    const client = await clientPromise
    await client.db("admin").command({ ping: 1 })
    console.log("MongoDB connection verified successfully")
    return {
      success: true,
      message: "Connection successful",
    }
  } catch (error) {
    console.error("MongoDB connection test failed:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export default clientPromise
