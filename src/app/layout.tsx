import { cn } from "@/lib/utils"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { AuthProvider } from "@/components/providers/AuthProvider"
import { StoreProvider } from "@/components/providers/StoreProvider"
import { Toaster } from "sonner"

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
    <html lang="es">
      <body className={cn("min-h-screen bg-white text-gray-900", inter.className)}>
        <AuthProvider>
          <StoreProvider>
            {children}
            <Toaster
              position="top-right"
              richColors
              expand
              visibleToasts={4}
              closeButton
            />
          </StoreProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
