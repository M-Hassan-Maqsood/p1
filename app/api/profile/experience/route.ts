import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"
import prisma from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()

    // Get profile ID from userId
    const profile = await prisma.profile.findUnique({
      where: { userId },
    })

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    // Create experience entry
    const experience = await prisma.experience.create({
      data: {
        company: data.company,
        position: data.position,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        description: data.description,
        profileId: profile.id,
      },
    })

    return NextResponse.json({ success: true, experience }, { status: 201 })
  } catch (error) {
    console.error("Error adding experience:", error)
    return NextResponse.json({ error: "Failed to add experience" }, { status: 500 })
  }
}

