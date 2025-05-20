export default function TestPage() {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Test Page</h1>
      <p>If you can see this page, routing is working correctly.</p>
      <div className="mt-4">
        <a href="/" className="text-blue-600 hover:text-blue-800">
          Go back home
        </a>
      </div>
    </div>
  )
}
