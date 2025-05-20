"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import Link from "next/link"

export default function DbTestPage() {
  const [testResult, setTestResult] = useState<{
    status: "loading" | "success" | "error"
    message: string
    details?: string
    errorType?: string
  }>({
    status: "loading",
    message: "Testing database connection...",
  })

  useEffect(() => {
    const testDb = async () => {
      try {
        const response = await axios.get("/api/test-db-detailed")
        setTestResult({
          status: "success",
          message: response.data.message,
          details: response.data.details,
        })
      } catch (error: any) {
        console.error("Database test error:", error)
        setTestResult({
          status: "error",
          message: "Database connection failed",
          details: error.response?.data?.details || error.message,
          errorType: error.response?.data?.errorType,
        })
      }
    }

    testDb()
  }, [])

  const getErrorHelp = () => {
    switch (testResult.errorType) {
      case "dns_resolution":
        return (
          <div>
            <p className="font-bold">DNS Resolution Error</p>
            <p>The hostname in your MongoDB URI could not be resolved. Check that:</p>
            <ul className="list-disc pl-5 mt-2">
              <li>The hostname in your MongoDB URI is correct</li>
              <li>Your MongoDB Atlas cluster is up and running</li>
              <li>There are no network issues preventing DNS resolution</li>
            </ul>
          </div>
        )
      case "timeout":
        return (
          <div>
            <p className="font-bold">Connection Timeout</p>
            <p>The connection to your MongoDB server timed out. Check that:</p>
            <ul className="list-disc pl-5 mt-2">
              <li>Your MongoDB server is running and accessible</li>
              <li>Network rules allow connections from Vercel's IP addresses</li>
              <li>There are no firewall rules blocking the connection</li>
            </ul>
          </div>
        )
      case "authentication":
        return (
          <div>
            <p className="font-bold">Authentication Error</p>
            <p>Failed to authenticate with the MongoDB server. Check that:</p>
            <ul className="list-disc pl-5 mt-2">
              <li>The username and password in your MongoDB URI are correct</li>
              <li>The user has the necessary permissions to access the database</li>
              <li>The authentication database is correctly specified</li>
            </ul>
          </div>
        )
      case "network":
        return (
          <div>
            <p className="font-bold">Network Error</p>
            <p>There was a network issue connecting to MongoDB. Check that:</p>
            <ul className="list-disc pl-5 mt-2">
              <li>
                Your MongoDB Atlas network access settings allow connections from anywhere (0.0.0.0/0) or from Vercel's
                IP ranges
              </li>
              <li>There are no network restrictions preventing the connection</li>
              <li>The MongoDB server is running and accessible</li>
            </ul>
          </div>
        )
      case "parse":
        return (
          <div>
            <p className="font-bold">Parse Error</p>
            <p>Unexpected token. Did you mean {"{" > "}"} or &gt;?</p>
          </div>
        )
      default:
        return (
          <div>
            <p className="font-bold">Unknown Error</p>
            <p>There was an unknown error connecting to MongoDB. Check that:</p>
            <ul className="list-disc pl-5 mt-2">
              <li>Your MongoDB URI is correctly formatted</li>
              <li>The MongoDB server is running and accessible</li>
              <li>All environment variables are correctly set</li>
            </ul>
          </div>
        )
    }
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Database Connection Test</h1>

      <div
        className={`p-4 mb-6 rounded-md ${
          testResult.status === "loading"
            ? "bg-blue-100 text-blue-700"
            : testResult.status === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
        }`}
      >
        <p className="font-bold">
          {testResult.status === "loading" ? "Testing..." : testResult.status === "success" ? "Success!" : "Error!"}
        </p>
        <p>{testResult.message}</p>
        {testResult.details && <p className="mt-2 text-sm">{testResult.details}</p>}
      </div>

      {testResult.status === "error" && (
        <div className="bg-yellow-50 p-4 rounded-md mb-6">
          <h2 className="text-lg font-bold mb-2">Troubleshooting Help</h2>
          {getErrorHelp()}
        </div>
      )}

      <h2 className="text-xl font-bold mb-4">MongoDB Connection Checklist</h2>

      <div className="space-y-4">
        <div className="p-4 border rounded-md">
          <h3 className="font-bold">1. Check Your MongoDB URI</h3>
          <p>Make sure your MongoDB URI is correctly formatted:</p>
          <pre className="bg-gray-100 p-2 mt-2 rounded text-sm overflow-x-auto">
            mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
          </pre>
          <p className="mt-2">
            Verify that you've replaced <code>username</code>, <code>password</code>, <code>cluster</code>, and{" "}
            <code>database</code> with your actual values.
          </p>
        </div>

        <div className="p-4 border rounded-md">
          <h3 className="font-bold">2. Check Network Access</h3>
          <p>If you're using MongoDB Atlas:</p>
          <ol className="list-decimal pl-5 mt-2">
            <li>Go to the Atlas dashboard</li>
            <li>Select your cluster</li>
            <li>Go to "Network Access" in the left sidebar</li>
            <li>
              Add <code>0.0.0.0/0</code> to allow connections from anywhere, or add Vercel's IP ranges
            </li>
          </ol>
        </div>

        <div className="p-4 border rounded-md">
          <h3 className="font-bold">3. Check Database User</h3>
          <p>Verify that your database user has the correct permissions:</p>
          <ol className="list-decimal pl-5 mt-2">
            <li>Go to the Atlas dashboard</li>
            <li>Select your cluster</li>
            <li>Go to "Database Access" in the left sidebar</li>
            <li>Check that your user exists and has the appropriate roles (at least "readWrite")</li>
          </ol>
        </div>

        <div className="p-4 border rounded-md">
          <h3 className="font-bold">4. Check Environment Variables</h3>
          <p>Make sure your environment variables are correctly set in Vercel:</p>
          <ol className="list-decimal pl-5 mt-2">
            <li>Go to your Vercel project</li>
            <li>Go to "Settings" &gt; "Environment Variables"</li>
            <li>
              Verify that <code>MONGODB_URI</code> is set and correctly formatted
            </li>
            <li>If you've made changes, redeploy your application</li>
          </ol>
        </div>
      </div>

      <div className="mt-6 flex space-x-4">
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Test Again
        </button>
        <Link href="/" className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
          Back to Home
        </Link>
      </div>
    </div>
  )
}
