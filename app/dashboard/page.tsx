import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Search } from "lucide-react"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { search?: string; batch?: string }
}) {
  // Since authentication is disabled, we'll use empty arrays
  const profiles = []
  const batches = []

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Student Profiles</h1>
        <Button asChild>
          <Link href="/dashboard/export">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <form>
            <Input name="search" placeholder="Search by name or profession" defaultValue="" className="pl-10" />
          </form>
        </div>

        <form>
          <Select name="batch" defaultValue="">
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
        </form>

        <div className="text-right text-muted-foreground">
          {profiles.length} {profiles.length === 1 ? "student" : "students"} found
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.length === 0 && (
          <div className="col-span-full text-center py-12">
            <h3 className="text-xl font-medium">No profiles found</h3>
            <p className="text-muted-foreground mt-2">Authentication is currently disabled</p>
          </div>
        )}
      </div>
    </div>
  )
}

