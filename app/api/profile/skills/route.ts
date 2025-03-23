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

    // Create skill entry
    const skill = await prisma.skill.create({
      data: {
        name: data.name,
        level: data.level || 0,
        profileId: profile.id,
      },
    })

    return NextResponse.json({ success: true, skill }, { status: 201 })
  } catch (error) {
    console.error("Error adding skill:", error)
    return NextResponse.json({ error: "Failed to add skill" }, { status: 500 })
  }
}

