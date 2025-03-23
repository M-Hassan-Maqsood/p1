"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Menu, Shield } from "lucide-react"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { useAuth, UserButton } from "@clerk/nextjs"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { userId, isLoaded, isSignedIn } = useAuth()

  const isActive = (path: string) => pathname === path

  // For demo purposes, check if user is admin
  // In a real app, you would check the user's role from Clerk metadata
  const isAdmin = false // This would be determined by checking user metadata

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="font-bold text-xl">
          Student Profile System
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/") ? "text-primary" : "text-muted-foreground"}`}
          >
            Home
          </Link>
          {isSignedIn && (
            <>
              <Link
                href="/profile"
                className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/profile") ? "text-primary" : "text-muted-foreground"}`}
              >
                My Profile
              </Link>
              <Link
                href="/profile/edit"
                className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/profile/edit") ? "text-primary" : "text-muted-foreground"}`}
              >
                Edit Profile
              </Link>
              <Link
                href="/dashboard"
                className={`text-sm font-medium transition-colors hover:text-primary ${pathname.startsWith("/dashboard") ? "text-primary" : "text-muted-foreground"}`}
              >
                Dashboard
              </Link>
              <Link
                href="/settings"
                className={`text-sm font-medium transition-colors hover:text-primary ${pathname.startsWith("/settings") ? "text-primary" : "text-muted-foreground"}`}
              >
                Settings
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className={`text-sm font-medium transition-colors hover:text-primary flex items-center ${pathname.startsWith("/admin") ? "text-primary" : "text-muted-foreground"}`}
                >
                  <Shield className="mr-1 h-3 w-3" /> Admin
                </Link>
              )}
            </>
          )}
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem asChild>
                <Link href="/" className="w-full cursor-pointer">
                  Home
                </Link>
              </DropdownMenuItem>
              {isSignedIn && (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="w-full cursor-pointer">
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile/edit" className="w-full cursor-pointer">
                      Edit Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="w-full cursor-pointer">
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="w-full cursor-pointer">
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/notifications" className="w-full cursor-pointer">
                      Notifications
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="w-full cursor-pointer flex items-center">
                          <Shield className="mr-2 h-4 w-4" /> Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-4">
          {isLoaded && isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <Button asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

