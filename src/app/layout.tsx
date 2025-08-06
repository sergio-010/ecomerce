import { cn } from "@/lib/utils"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Ecommerce SaaS",
  description: "Tu tienda online minimalista y administrable",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-white text-gray-900", inter.className)}>
        {children}
      </body>
    </html>
  )
}
