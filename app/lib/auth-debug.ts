// Utility functions for debugging authentication issues

export function logAuthState() {
  try {
    const token = localStorage.getItem("token")
    const hasToken = !!token

    console.log("Auth Debug Info:")
    console.log("- Has token:", hasToken)
    if (hasToken) {
      // Log a masked version of the token
      const maskedToken = token.substring(0, 10) + "..." + token.substring(token.length - 5)
      console.log("- Token (masked):", maskedToken)

      // Check token expiration
      try {
        const tokenData = JSON.parse(atob(token.split(".")[1]))
        const expiryDate = new Date(tokenData.exp * 1000)
        const isExpired = expiryDate < new Date()
        console.log("- Token expiry:", expiryDate.toLocaleString())
        console.log("- Token expired:", isExpired)
      } catch (e) {
        console.log("- Could not parse token data")
      }
    }

    return { hasToken }
  } catch (error) {
    console.error("Error in logAuthState:", error)
    return { hasToken: false, error }
  }
}

export function clearAuthState() {
  try {
    localStorage.removeItem("token")
    console.log("Auth state cleared")
    return true
  } catch (error) {
    console.error("Error clearing auth state:", error)
    return false
  }
}
