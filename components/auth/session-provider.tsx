"use client"

import { createContext, useContext, type ReactNode } from "react"

// Create a simple mock of the session context
type SessionContextType = {
  status: "loading" | "authenticated" | "unauthenticated"
  data: null
}

const SessionContext = createContext<SessionContextType>({
  status: "unauthenticated",
  data: null,
})

export const useSession = () => useContext(SessionContext)

export function SessionProvider({ children }: { children: ReactNode }) {
  // Always return unauthenticated for the demo
  const session = {
    status: "unauthenticated",
    data: null,
  } as SessionContextType

  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>
}

