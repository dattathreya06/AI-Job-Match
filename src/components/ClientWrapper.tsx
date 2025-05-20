"use client"

import { AuthProvider } from "../context/AuthContext"
import Navbar from "./Navbar"
import type { ReactNode } from "react"

export default function ClientWrapper({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <Navbar />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </AuthProvider>
  )
}
