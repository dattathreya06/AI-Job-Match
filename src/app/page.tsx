import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <h1 className="text-4xl font-bold mb-6 text-center">AI-Powered Job Match Platform</h1>
      <p className="text-xl mb-8 text-center max-w-2xl">
        Find your perfect job match using our advanced AI recommendation system.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link
          href="/signup"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Sign Up
        </Link>
        <Link
          href="/login"
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Log In
        </Link>
        <Link
          href="/jobs"
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Browse Jobs
        </Link>
      </div>
    </div>
  )
}
