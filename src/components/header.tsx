"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu, X } from "lucide-react"
import {
  useAuth,
  UserButton,
} from "@clerk/nextjs"

interface NavItem {
  title: string
  href: string
  isAuthRequired?: boolean
}

const navItems: NavItem[] = [
  {
    title: "Home",
    href: "/",
    isAuthRequired: false,
  },
  {
    title: "Dashboard",
    href: "/dashboard",
    isAuthRequired: true,
  },
  {
    title: "About",
    href: "/about",
    isAuthRequired: false,
  },
  {
    title: "Contact",
    href: "/contact",
    isAuthRequired: false,
  },
]

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { isLoaded, isSignedIn } = useAuth()

  // Determine home link based on authentication
  const homeLink = isSignedIn ? "/dashboard" : "/"

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href={homeLink} className="flex items-center gap-2">
            <Image
              src="/leapkoders-logo.gif"
              alt="LeapKoders Logo"
              width={100}
              height={100}
              className="rounded-sm"
            />
            {/* <span className="hidden font-bold sm:inline-block">LeapKoders</span> */}
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems
            .filter(
              (item) =>
                !item.isAuthRequired || (item.isAuthRequired && isSignedIn)
            )
            .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {item.title}
              </Link>
            ))}

          <div className="flex items-center gap-4">
            {isLoaded && !isSignedIn ? (
              <>
                <Link href="/sign-in">
                  <Button variant="outline" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button size="sm">Sign up</Button>
                </Link>
              </>
            ) : isLoaded && isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : null}
            <ModeToggle />
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          {isLoaded && isSignedIn && <UserButton afterSignOutUrl="/" />}
          <ModeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="container md:hidden py-4 pb-6">
          <nav className="flex flex-col space-y-4">
            {navItems
              .filter(
                (item) =>
                  !item.isAuthRequired || (item.isAuthRequired && isSignedIn)
              )
              .map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === item.href
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.title}
                </Link>
              ))}

            {isLoaded && !isSignedIn && (
              <div className="flex flex-col space-y-2 pt-2">
                <Link
                  href="/sign-in"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button variant="outline" className="w-full">
                    Log in
                  </Button>
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button className="w-full">Sign up</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
