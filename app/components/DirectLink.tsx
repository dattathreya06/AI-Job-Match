"use client"

import type React from "react"
import { useAuth } from "../context/AuthContext"

interface DirectLinkProps {
  to: string
  children: React.ReactNode
  className?: string
}

export default function DirectLink({ to, children, className = "" }: DirectLinkProps) {
  const { isAuthenticated } = useAuth()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()

    // Use hard navigation to ensure the page loads
    window.location.href = to
  }

  return (
    <a href={to} onClick={handleClick} className={className}>
      {children}
    </a>
  )
}
