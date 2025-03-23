"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type User = {
  id: string
  name: string
  email: string
  role: "user" | "admin"
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<boolean>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is already logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  // Mock sign in function
  const signIn = async (email: string, password: string): Promise<boolean> => {
    // For demo purposes, accept any email/password
    // In a real app, you would validate credentials against a backend

    // Simple validation for demo
    if (!email || !password) {
      return false
    }

    const newUser: User = {
      id: "1",
      name: email.split("@")[0], // Use part of email as name
      email,
      role: email.includes("admin") ? "admin" : "user",
    }

    // Store in localStorage
    localStorage.setItem("user", JSON.stringify(newUser))
    setUser(newUser)
    return true
  }

  // Sign out function
  const signOut = () => {
    localStorage.removeItem("user")
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

