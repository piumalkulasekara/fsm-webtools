import type { Metadata, Viewport } from "next"
import { Source_Sans_3, Roboto_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ClerkProvider } from "@clerk/nextjs"
import { Header } from "@/components/header"
import { Toaster } from "@/components/ui/sonner"
import { Providers } from "@/app/_providers/providers"
import { SpeedInsights } from '@vercel/speed-insights/next';
// Optimize fonts with display: swap for better performance
const sourceSansPro = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
})

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  preload: true,
})

export const metadata: Metadata = {
  title: "FSM Webtools",
  description: "Developed by Piumal Kulasekara",
  authors: [{ name: "Piumal Kulasekara", url: "https://github.com/piumal" }],
  keywords: ["fsm", "webtools", "IFS", "Field Service Management"],
  formatDetection: {
    telephone: false,
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "#111827" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to external resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${sourceSansPro.variable} ${robotoMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkProvider>
            <Providers>
              <Header />
              <main>{children}</main>
              <Toaster />
              <SpeedInsights />
            </Providers>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
