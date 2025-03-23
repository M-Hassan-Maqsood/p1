"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Download, Search, Trash2, Edit } from "lucide-react"
import Link from "next/link"

export default function AdminDashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser()
  const router = useRouter()
  const [profiles, setProfiles] = useState<any[]>([])
  const [batches, setBatches] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBatch, setSelectedBatch] = useState("")

  useEffect(() => {
    // Redirect to sign-in if not authenticated
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in")
      return
    }

    // Check if user is admin (in a real app, this would check user metadata)
    if (isSignedIn) {
      // For demo purposes, we'll assume the user is an admin
      fetchProfiles()
    }
  }, [isLoaded, isSignedIn, router, searchTerm, selectedBatch])

  const fetchProfiles = async () => {
    try {
      let url = "/api/admin/profiles"
      const params = new URLSearchParams()

      if (searchTerm) {
        params.append("search", searchTerm)
      }

      if (selectedBatch) {
        params.append("batch", selectedBatch)
      }

      if (params.toString()) {
        url += `?${params.toString()}`
      }

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error("Failed to fetch profiles")
      }

      const data = await response.json()
      setProfiles(data.profiles)
      setBatches(data.batches)
    } catch (error) {
      console.error("Error fetching profiles:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProfile = async (id: string) => {
    if (!confirm("Are you sure you want to delete this profile?")) {
      return
    }

    try {
      const response = await fetch(`/api/admin/profiles/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete profile")
      }

      // Refresh profiles
      fetchProfiles()
    } catch (error) {
      console.error("Error deleting profile:", error)
    }
  }

  // Loading state
  if (loading || !isLoaded) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Student Profiles</h1>
        </div>
        <div className="flex justify-center items-center min-h-[60vh]">
          <p>Loading profiles...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Student Profiles</h1>
        <Button asChild>
          <Link href="/admin/export">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by name or profession"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={selectedBatch} onValueChange={setSelectedBatch}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by batch" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Batches</SelectItem>
            {batches.map((batchName) => (
              <SelectItem key={batchName} value={batchName}>
                {batchName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="text-right text-muted-foreground">
          {profiles.length} {profiles.length === 1 ? "student" : "students"} found
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <h3 className="text-xl font-medium">No profiles found</h3>
            <p className="text-muted-foreground mt-2">Try adjusting your search criteria</p>
          </div>
        ) : (
          profiles.map((profile) => (
            <Card key={profile.id} className="overflow-hidden">
              <div className="flex items-center p-6">
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarImage src={profile.profileImage || ""} alt={profile.name} />
                  <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold truncate">{profile.name}</h3>
                  {profile.profession && <p className="text-sm text-muted-foreground truncate">{profile.profession}</p>}
                </div>
              </div>
              <CardContent className="pt-0 pb-4">
                <div className="flex justify-between">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/profiles/${profile.id}`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Link>
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteProfile(profile.id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

