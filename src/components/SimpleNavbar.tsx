import Link from "next/link"

export default function SimpleNavbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">
              JobMatch AI
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/jobs" className="text-gray-700 hover:text-blue-600">
              Jobs
            </Link>
            <Link href="/login" className="text-gray-700 hover:text-blue-600">
              Login
            </Link>
            <Link href="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
