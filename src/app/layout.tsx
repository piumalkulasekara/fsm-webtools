import type { Metadata } from "next"
import { Source_Sans_3, Roboto_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ClerkProvider } from "@clerk/nextjs"
import { Header } from "@/components/header"
import { Toaster } from "@/components/ui/sonner"
import { Providers } from "@/app/_providers/providers"

{
  /* Basic Fonts */
}
const sourceSansPro = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
})
const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
})

export const metadata: Metadata = {
  title: "FSM Webtools",
  description: "Developed bu Piumal Kulasekara",
  authors: [{ name: "Piumal Kulasekara", url: "https://github.com/piumal" }],
  keywords: ["fsm", "webtools", "IFS", "Field Service Management"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
              {children}
              <Toaster />
            </Providers>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
