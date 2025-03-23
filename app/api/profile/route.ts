import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"
import prisma from "@/lib/prisma"
import { uploadImage } from "@/lib/cloudinary"

// Get the current user's profile
export async function GET(req: NextRequest) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const profile = await prisma.profile.findUnique({
      where: { userId },
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
      return NextResponse.json({ exists: false }, { status: 200 })
    }

    return NextResponse.json({ exists: true, profile }, { status: 200 })
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

// Create or update a profile
export async function POST(req: NextRequest) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()

    // Handle profile image upload if provided
    let profileImageUrl = data.profileImage
    if (data.profileImageBase64 && data.profileImageBase64.startsWith("data:image")) {
      profileImageUrl = await uploadImage(data.profileImageBase64)
    }

    // Check if profile exists
    const existingProfile = await prisma.profile.findUnique({
      where: { userId },
    })

    // Create or update profile
    const profile = await prisma.profile.upsert({
      where: { userId },
      update: {
        name: data.name,
        email: data.email,
        profession: data.profession,
        batch: data.batch,
        about: data.about,
        profileImage: profileImageUrl,
        phone: data.phone,
        linkedin: data.linkedin,
      },
      create: {
        userId,
        name: data.name,
        email: data.email,
        profession: data.profession || "",
        batch: data.batch || "",
        about: data.about || "",
        profileImage: profileImageUrl,
        phone: data.phone || "",
        linkedin: data.linkedin || "",
      },
    })

    // Handle education, experience, skills, and projects in separate API endpoints
    // for better organization and to avoid making this endpoint too complex

    return NextResponse.json(
      {
        success: true,
        message: existingProfile ? "Profile updated successfully" : "Profile created successfully",
        profile,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error creating/updating profile:", error)
    return NextResponse.json({ error: "Failed to create/update profile" }, { status: 500 })
  }
}

