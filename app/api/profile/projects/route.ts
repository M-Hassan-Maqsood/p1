import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"
import prisma from "@/lib/prisma"
import { uploadImage } from "@/lib/cloudinary"

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

    // Create project
    const project = await prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        githubLink: data.githubLink,
        profileId: profile.id,
      },
    })

    // Handle project images
    if (data.images && Array.isArray(data.images)) {
      for (const imageBase64 of data.images) {
        if (imageBase64.startsWith("data:image")) {
          const imageUrl = await uploadImage(imageBase64)
          await prisma.projectImage.create({
            data: {
              url: imageUrl,
              projectId: project.id,
            },
          })
        }
      }
    }

    return NextResponse.json({ success: true, project }, { status: 201 })
  } catch (error) {
    console.error("Error adding project:", error)
    return NextResponse.json({ error: "Failed to add project" }, { status: 500 })
  }
}

