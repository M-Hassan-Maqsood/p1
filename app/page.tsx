"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import InitNotifications from "@/components/notifications/init-notifications"

export default function Home() {
  const { isSignedIn } = useUser()

  return (
    <div className="flex flex-col items-center justify-center py-12">
      {isSignedIn && <InitNotifications />}
      <div className="text-center space-y-6 max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Student Profile Management System</h1>
        <p className="text-xl text-muted-foreground">
          Create and manage your student profile, showcase your education, experience, skills, and projects.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {isSignedIn ? (
            <>
              <Link href="/profile">
                <Button size="lg">View My Profile</Button>
              </Link>
              <Link href="/profile/edit">
                <Button size="lg" variant="outline">
                  Edit My Profile
                </Button>
              </Link>
            </>
          ) : (
            <Link href="/sign-in">
              <Button size="lg">Sign In</Button>
            </Link>
          )}
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        <div className="bg-card rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Personal Information</h2>
          <p className="text-muted-foreground">
            Add your name, profile picture, profession, batch, and a brief about section.
          </p>
        </div>
        <div className="bg-card rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Portfolio</h2>
          <p className="text-muted-foreground">Showcase your education, experience, and skills to stand out.</p>
        </div>
        <div className="bg-card rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Projects</h2>
          <p className="text-muted-foreground">Display your projects with images, descriptions, and GitHub links.</p>
        </div>
      </div>
    </div>
  )
}

