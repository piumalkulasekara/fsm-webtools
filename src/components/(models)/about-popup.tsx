"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useTheme as useNextThemes } from "next-themes"

interface AboutPopupProps {
  trigger?: React.ReactNode
  version?: string
  // New optional prop to notify when the dialog open state changes.
  onOpenChange?: (open: boolean) => void
}

export function AboutPopup({ trigger, onOpenChange }: AboutPopupProps) {
  const [open, setOpen] = useState(false)
  const { theme } = useNextThemes()
  const version = process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0"

  const logoSrc =
    theme === "dark" ? "/leapkoders-logo.png" : "/leapkoders-logo.png"

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen)
        if (onOpenChange) onOpenChange(isOpen)
      }}
    >
      <DialogTrigger asChild>
        {trigger || <Button variant="ghost">About</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-col items-center text-center">
          <div className="mx-auto mb-2 flex items-center justify-center">
            <div className="relative w-[200px] h-[20px]">
              <Image
                src={logoSrc || "/leapkoders-logo.png"}
                alt="LeapKoders Logo"
                fill
                className="object-contain rounded-sm"
              />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold">
            FSM Web Tools
          </DialogTitle>
          <Badge variant="outline" className="mt-1">
            Version {version}
          </Badge>
          <DialogDescription className="pt-4">
            Simplified and user-friendly tools 
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <h3 className="text-sm font-medium leading-none mb-2">About</h3>
            <p className="text-sm text-muted-foreground">
              FSM Web Tools provides a comprehensive suite of utilities to help with daily tasks, simply.
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium leading-none mb-2">
              Contact Us
            </h3>
            <div className="text-sm text-muted-foreground">
              <p>
                Email:{" "}
                <a
                  href="mailto:piumal.kulasekara@gmail.com"
                  className="text-primary hover:underline"
                >
                  piumal.kulasekara@gmail.com
                </a>
              </p>
              <p>
                Phone:{" "}
                <a
                  href="tel:+46739406517"
                  className="text-primary hover:underline"
                >
                  +46 73 940 6517
                </a>
              </p>
            </div>
          </div>

          <Separator />

          <div className="text-xs text-muted-foreground text-center">
            <p>© {new Date().getFullYear()} LeapKoders. All rights Reserved.</p>
          </div>
        </div>

        <DialogFooter className="flex justify-center sm:justify-center">
          <Button
            variant="destructive"
            onClick={() => setOpen(false)}
            className="w-full sm:w-auto"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
