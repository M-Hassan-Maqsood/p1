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

// Get a specific profile by ID (admin only)
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin or the profile owner
    const admin = await isAdmin(userId)
    const profile = await prisma.profile.findUnique({
      where: { id: params.id },
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
    })

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    if (!admin && profile.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    return NextResponse.json({ profile }, { status: 200 })
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

// Update a profile (admin only)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
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

    const data = await req.json()

    // Update profile
    const profile = await prisma.profile.update({
      where: { id: params.id },
      data: {
        name: data.name,
        email: data.email,
        profession: data.profession,
        batch: data.batch,
        about: data.about,
        phone: data.phone,
        linkedin: data.linkedin,
      },
    })

    return NextResponse.json({ success: true, profile }, { status: 200 })
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}

// Delete a profile (admin only)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
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

    // Delete profile
    await prisma.profile.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error deleting profile:", error)
    return NextResponse.json({ error: "Failed to delete profile" }, { status: 500 })
  }
}

