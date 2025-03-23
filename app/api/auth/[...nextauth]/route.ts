import { NextResponse } from "next/server"

// This is a simplified mock of the NextAuth API route
// In a real application, this would use NextAuth.js properly configured

export async function GET() {
  return NextResponse.json(
    {
      error: "Authentication is disabled in this demo version",
    },
    { status: 200 },
  )
}

export async function POST() {
  return NextResponse.json(
    {
      error: "Authentication is disabled in this demo version",
    },
    { status: 200 },
  )
}

