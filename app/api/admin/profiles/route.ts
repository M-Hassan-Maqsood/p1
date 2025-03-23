import { type NextRequest, NextResponse } from "next/server"
import { auth, clerkClient } from "@clerk/nextjs"
import prisma from "@/lib/prisma"

// Helper function to check if user is admin
async function isAdmin(userId: string) {
  try {
    const user = await clerkClient.users.getUser(userId)
    return user.publicMetadata.role === "admin"
  } catch (error) {
    return false
  }
}

// Get all profiles (admin only)
export async function GET(req: NextRequest) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const admin = await isAdmin(userId)
    if (!admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get query parameters
    const url = new URL(req.url)
    const search = url.searchParams.get("search") || ""
    const batch = url.searchParams.get("batch") || ""

    // Build filter
    const filter: any = {}
    if (search) {
      filter.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { profession: { contains: search, mode: "insensitive" } },
      ]
    }
    if (batch) {
      filter.batch = batch
    }

    // Get all profiles
    const profiles = await prisma.profile.findMany({
      where: filter,
      include: {
        education: true,
        experience: true,
        skills: true,
        projects: {
          include: {
            images: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    // Get unique batches for filtering
    const batches = await prisma.profile.findMany({
      select: {
        batch: true,
      },
      distinct: ["batch"],
      where: {
        batch: {
          not: null,
        },
      },
    })

    return NextResponse.json(
      {
        profiles,
        batches: batches.map((b) => b.batch).filter(Boolean),
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error fetching profiles:", error)
    return NextResponse.json({ error: "Failed to fetch profiles" }, { status: 500 })
  }
}

