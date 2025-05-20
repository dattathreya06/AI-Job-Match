"use client"

import type React from "react"
import { AuthProvider } from "../context/AuthContext"
import Navbar from "../components/Navbar"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Navbar />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </AuthProvider>
  )
}
