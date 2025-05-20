import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "../../../lib/mongodb"

// Sample job data
const sampleJobs = [
  {
    title: "Frontend Developer",
    company: "TechCorp",
    location: "San Francisco, CA",
    description:
      "We are looking for a skilled Frontend Developer to join our team. You will be responsible for building user interfaces and implementing web designs.",
    skills: ["JavaScript", "React", "HTML", "CSS", "Tailwind CSS"],
    jobType: "remote",
  },
  {
    title: "Backend Engineer",
    company: "DataSystems",
    location: "New York, NY",
    description:
      "Join our backend team to develop robust APIs and server-side applications. Experience with Node.js and databases is required.",
    skills: ["Node.js", "Express", "MongoDB", "REST API", "JavaScript"],
    jobType: "onsite",
  },
  {
    title: "Full Stack Developer",
    company: "WebSolutions",
    location: "Austin, TX",
    description:
      "Looking for a Full Stack Developer who can work on both frontend and backend technologies. Must have experience with React and Node.js.",
    skills: ["JavaScript", "React", "Node.js", "MongoDB", "Express"],
    jobType: "hybrid",
  },
  {
    title: "Python Developer",
    company: "AI Innovations",
    location: "Seattle, WA",
    description:
      "We need a Python Developer with experience in AI/ML libraries to help build our next-generation products.",
    skills: ["Python", "FastAPI", "Machine Learning", "SQL", "Git"],
    jobType: "remote",
  },
  {
    title: "DevOps Engineer",
    company: "CloudTech",
    location: "Chicago, IL",
    description:
      "Join our DevOps team to manage cloud infrastructure and CI/CD pipelines. Experience with AWS and Docker is a must.",
    skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Linux"],
    jobType: "onsite",
  },
  {
    title: "UI/UX Designer",
    company: "DesignHub",
    location: "Los Angeles, CA",
    description:
      "We are looking for a creative UI/UX Designer to create beautiful and functional user interfaces for our web and mobile applications.",
    skills: ["Figma", "Adobe XD", "HTML", "CSS", "User Research"],
    jobType: "hybrid",
  },
  {
    title: "Mobile Developer",
    company: "AppWorks",
    location: "Miami, FL",
    description:
      "Seeking a Mobile Developer with experience in React Native to build cross-platform mobile applications.",
    skills: ["React Native", "JavaScript", "iOS", "Android", "API Integration"],
    jobType: "remote",
  },
  {
    title: "Data Scientist",
    company: "DataMinds",
    location: "Boston, MA",
    description:
      "Join our data science team to analyze complex datasets and build predictive models for business insights.",
    skills: ["Python", "Machine Learning", "SQL", "Data Visualization", "Statistics"],
    jobType: "onsite",
  },
]

export async function GET(req: NextRequest) {
  try {
    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db()
    const jobsCollection = db.collection("jobs")

    // Check if jobs collection is empty
    const count = await jobsCollection.countDocuments()

    // If empty, seed with sample data
    if (count === 0) {
      await jobsCollection.insertMany(sampleJobs)
    }

    // Get all jobs
    const jobs = await jobsCollection.find({}).toArray()

    return NextResponse.json(jobs)
  } catch (error) {
    console.error("Get jobs error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
