"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { AdminDashboard } from "@/components/admin/AdminDashboard"
import { AdminLayout } from "@/components/admin/AdminLayout"

// Página principal del admin
export default function AdminPage() {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        console.log("Admin page - Session status:", status, "Session user:", session?.user)

        // Solo redirigir si definitivamente no está autenticado
        if (status === "unauthenticated") {
            console.log("User not authenticated, redirecting to admin login")
            router.push("/admin/login")
            return
        }

        // Si está autenticado pero no es admin, también redirigir
        if (status === "authenticated" && session?.user?.role?.toLowerCase() !== "admin") {
            console.log("User authenticated but not admin, role:", session?.user?.role)
            router.push("/admin/login")
            return
        }

        // Si está autenticado y es admin
        if (status === "authenticated" && session?.user?.role?.toLowerCase() === "admin") {
            console.log("User is admin, showing dashboard")
        }
    }, [session, status, router])

    // Mostrar loading mientras carga la sesión
    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Cargando dashboard...</p>
                </div>
            </div>
        )
    }

    // Si no está autenticado, mostrar loading hasta que redirija
    if (status === "unauthenticated") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Redirigiendo al login...</p>
                </div>
            </div>
        )
    }

    // Si no es admin, mostrar loading hasta que redirija
    if (status === "authenticated" && session?.user?.role?.toLowerCase() !== "admin") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Verificando permisos...</p>
                </div>
            </div>
        )
    }

    // Si llegamos aquí, el usuario está autenticado y es admin
    return (
        <AdminLayout>
            <AdminDashboard />
        </AdminLayout>
    )
}
