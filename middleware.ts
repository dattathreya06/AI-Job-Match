import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Protected routes that require authentication
const protectedRoutes = ["/profile", "/recommendations"]

export function middleware(request: NextRequest) {
  // This middleware is temporarily disabled to troubleshoot navigation issues
  // Just pass through all requests without any authentication checks
  return NextResponse.next()

  // const path = request.nextUrl.pathname

  // // Check if the path is in the protected routes
  // if (protectedRoutes.some((route) => path.startsWith(route))) {
  //   // First try to get token from cookies
  //   let token = request.cookies.get("token")?.value || ""

  //   // If not in cookies, try to get from Authorization header
  //   if (!token) {
  //     const authHeader = request.headers.get("authorization")
  //     if (authHeader && authHeader.startsWith("Bearer ")) {
  //       token = authHeader.split(" ")[1]
  //     }
  //   }

  //   // Verify the token
  //   const decoded = token ? verifyToken(token) : null

  //   // If token is invalid, redirect to login
  //   if (!decoded) {
  //     console.log(`Unauthorized access attempt to ${path}, redirecting to login`)

  //     // Add a cache-busting query parameter to prevent caching issues
  //     const timestamp = Date.now()
  //     return NextResponse.redirect(new URL(`/login?redirect=${encodeURIComponent(path)}&t=${timestamp}`, request.url))
  //   }
  // }

  // return NextResponse.next()
}
