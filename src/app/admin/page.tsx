"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

// Página de redirección inteligente para /admin
export default function AdminPage() {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === "loading") return // Esperar a que cargue la sesión

        if (status === "authenticated" && session?.user?.role === "admin") {
            // Si ya está logueado como admin, ir a productos
            router.push("/admin/products")
        } else {
            // Si no está logueado, ir al login
            router.push("/admin/login")
        }
    }, [session, status, router])

    // Mostrar loading mientras redirige
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Redirigiendo...</p>
            </div>
        </div>
    )
}
