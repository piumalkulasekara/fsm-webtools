"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu, X } from "lucide-react"
import { useUser, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"
import { useTheme as useNextThemes } from "next-themes"
import { AboutPopup } from "@/components/(models)/about-popup" // Import the AboutPopup component

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
    title: "Contact",
    href: "/contact",
    isAuthRequired: false,
  },
]

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { isLoaded, isSignedIn } = useUser()
  const { theme } = useNextThemes()

  const logoSrc =
    theme === "dark" ? "/leapkoders-logo-invert.png" : "/leapkoders-logo.png"
  const homeLink = isSignedIn ? "/dashboard" : "/"

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 sm:px-6">
        {/* Logo - Left aligned */}
        <Link href={homeLink} className="flex items-center gap-2">
          <Image
            src={logoSrc || "/placeholder.svg"}
            alt="LeapKoders Logo"
            width={40}
            height={40}
            className="rounded-sm"
          />
          <span className="hidden font-bold sm:inline-block">LeapKoders</span>
        </Link>

        {/* Desktop Navigation - Right aligned with flex-1 to push it to the right */}
        <div className="flex-1 flex justify-end">
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

            {/* About Popup for Desktop */}
            <AboutPopup
              trigger={
                <Button
                  variant="ghost"
                  className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground p-0"
                >
                  About
                </Button>
              }
              version="1.0.0"
            />

            <div className="flex items-center gap-4">
              {isLoaded && !isSignedIn ? (
                <>
                  <SignInButton mode="modal">
                    <Button variant="outline" size="sm">
                      Log in
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button size="sm">Sign up</Button>
                  </SignUpButton>
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
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="px-4 pb-6 md:hidden">
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

            {/* About Popup for Mobile */}
            <AboutPopup
              trigger={
                <Button
                  variant="ghost"
                  className="justify-start text-sm font-medium text-muted-foreground"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </Button>
              }
              version="1.0.0"
            />

            {isLoaded && !isSignedIn && (
              <div className="flex flex-col space-y-2 pt-2">
                <SignInButton mode="modal">
                  <Button variant="outline" className="w-full">
                    Log in
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="w-full">Sign up</Button>
                </SignUpButton>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
