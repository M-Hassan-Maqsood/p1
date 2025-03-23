"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { ProfileForm } from "@/components/profile/profile-form"
import { Loader2 } from "lucide-react"

export default function EditProfilePage() {
  const { isLoaded, isSignedIn } = useUser()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Redirect to sign-in if not authenticated
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in")
      return
    }

    // Fetch profile data
    if (isSignedIn) {
      fetchProfile()
    }
  }, [isLoaded, isSignedIn, router])

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profile")
      const data = await response.json()

      if (data.exists) {
        setProfile(data.profile)
      } else {
        // Redirect to create profile if no profile exists
        router.push("/profile/create")
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    } finally {
      setLoading(false)
    }
  }

  // Loading state
  if (loading || !isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!profile) {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Edit Your Profile</h1>
      <ProfileForm profile={profile} />
    </div>
  )
}

