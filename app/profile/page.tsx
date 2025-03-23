"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

export default function ProfilePage() {
  const { isLoaded, isSignedIn, user } = useUser()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [hasProfile, setHasProfile] = useState(false)

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
        setHasProfile(true)
      } else {
        setHasProfile(false)
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

  // No profile yet
  if (!hasProfile) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        <Card>
          <CardHeader>
            <CardTitle>Create Your Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">You haven't created a profile yet. Create one to showcase your skills and projects.</p>
            <Button asChild>
              <Link href="/profile/create">Create Profile</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <Button asChild>
          <Link href="/profile/edit">Edit Profile</Link>
        </Button>
      </div>

      <div className="mb-8 bg-card rounded-lg p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={profile.profileImage || ""} alt={profile.name} />
            <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">{profile.name}</h2>
            {profile.profession && <p className="text-lg text-muted-foreground">{profile.profession}</p>}
            {profile.batch && (
              <Badge variant="outline" className="mt-1">
                {profile.batch}
              </Badge>
            )}
            {profile.about && <p className="mt-4">{profile.about}</p>}
          </div>
        </div>
      </div>

      <Tabs defaultValue="education" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="education" className="mt-6">
          {profile.education && profile.education.length > 0 ? (
            <div className="space-y-4">
              {profile.education.map((edu: any) => (
                <Card key={edu.id}>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold">{edu.institution}</h3>
                    <p className="text-muted-foreground">
                      {edu.degree} in {edu.field}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(edu.startDate).getFullYear()} -
                      {edu.endDate ? new Date(edu.endDate).getFullYear() : "Present"}
                    </p>
                    {edu.description && <p className="mt-2">{edu.description}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No education details added yet.</p>
          )}
        </TabsContent>

        <TabsContent value="experience" className="mt-6">
          {profile.experience && profile.experience.length > 0 ? (
            <div className="space-y-4">
              {profile.experience.map((exp: any) => (
                <Card key={exp.id}>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold">{exp.position}</h3>
                    <p className="text-muted-foreground">{exp.company}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(exp.startDate).getFullYear()} -
                      {exp.endDate ? new Date(exp.endDate).getFullYear() : "Present"}
                    </p>
                    {exp.description && <p className="mt-2">{exp.description}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No experience details added yet.</p>
          )}
        </TabsContent>

        <TabsContent value="skills" className="mt-6">
          {profile.skills && profile.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill: any) => (
                <Badge key={skill.id} variant="secondary">
                  {skill.name}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No skills added yet.</p>
          )}
        </TabsContent>

        <TabsContent value="projects" className="mt-6">
          {profile.projects && profile.projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.projects.map((project: any) => (
                <Card key={project.id}>
                  {project.images && project.images.length > 0 && (
                    <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                      <img
                        src={project.images[0].url || "/placeholder.svg"}
                        alt={project.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold">{project.name}</h3>
                    {project.description && <p className="mt-2">{project.description}</p>}
                    {project.githubLink && (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-sm mt-2 inline-block"
                      >
                        GitHub Repository
                      </a>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No projects added yet.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

