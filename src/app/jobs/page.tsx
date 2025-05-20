"use client"
import ClientWrapper from "../../components/ClientWrapper"
import JobsList from "../../components/JobsList"

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
  return (
    <ClientWrapper>
      <JobsList />
    </ClientWrapper>
  )
}

// JobsList component implementation can be placed here if needed
