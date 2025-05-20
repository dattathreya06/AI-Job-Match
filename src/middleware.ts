import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "./lib/auth"

// Protected routes that require authentication
const protectedRoutes = ["/profile", "/recommendations"]

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Check if the path is in the protected routes
  if (protectedRoutes.some((route) => path.startsWith(route))) {
    // First try to get token from cookies
    let token = request.cookies.get("token")?.value || ""

    // If not in cookies, try to get from localStorage via Authorization header
    if (!token) {
      const authHeader = request.headers.get("authorization")
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1]
      }
    }

    // Verify the token
    const decoded = token ? verifyToken(token) : null

    // If token is invalid, redirect to login
    if (!decoded) {
      console.log(`Unauthorized access attempt to ${path}, redirecting to login`)
      return NextResponse.redirect(new URL("/login?redirect=" + encodeURIComponent(path), request.url))
    }
  }

  return NextResponse.next()
}
