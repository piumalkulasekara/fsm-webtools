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
}

export function AboutPopup({ trigger, version = "1.0.0" }: AboutPopupProps) {
  const [open, setOpen] = useState(false)
  const { theme } = useNextThemes()

  const logoSrc = theme === "dark" ? "/leapkoders-logo-invert.png" : "/leapkoders-logo.png"

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || <Button variant="ghost">About</Button>}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-col items-center text-center">
          <div className="mx-auto mb-4 flex items-center justify-center">
            <Image
              src={logoSrc || "/placeholder.svg"}
              alt="LeapKoders Logo"
              width={80}
              height={80}
              className="rounded-sm"
            />
          </div>
          <DialogTitle className="text-2xl font-bold">FSM Web Tools</DialogTitle>
          <Badge variant="outline" className="mt-1">
            Version {version}
          </Badge>
          <DialogDescription className="pt-4">
            Powerful web tools for finite state machine modeling and analysis
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <h3 className="text-sm font-medium leading-none mb-2">About</h3>
            <p className="text-sm text-muted-foreground">
              FSM Web Tools provides a comprehensive suite of utilities for designing, analyzing, and simulating finite
              state machines. Our platform offers intuitive visualization, validation, and code generation tools to
              streamline your development workflow.
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium leading-none mb-2">Features</h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Interactive FSM diagram editor</li>
              <li>State transition validation</li>
              <li>Code generation for multiple languages</li>
              <li>Simulation and testing tools</li>
              <li>Import/export capabilities</li>
            </ul>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium leading-none mb-2">Contact Us</h3>
            <div className="text-sm text-muted-foreground">
              <p>
                Email:{" "}
                <a href="mailto:piumal.kulasekara@gmail.com" className="text-primary hover:underline">
                  piumal.kulasekara@gmail.com
                </a>
              </p>
              <p>
                Phone:{" "}
                <a href="tel:+46739406517" className="text-primary hover:underline">
                  +46 73 940 6517
                </a>
              </p>
            </div>
          </div>

          <Separator />

          <div className="text-xs text-muted-foreground text-center">
            <p>© {new Date().getFullYear()} LeapKoders. All rights reserved.</p>
            <p className="mt-1">Built with Next.js and Tailwind CSS</p>
          </div>
        </div>

        <DialogFooter className="flex justify-center sm:justify-center">
          <Button variant="destructive" onClick={() => setOpen(false)} className="w-full sm:w-auto">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

