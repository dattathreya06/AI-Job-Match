import LoginClient from "./login-client"

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Log In</h1>
      <LoginClient />
    </div>
  )
}
