"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { AdminDashboard } from "@/components/admin/AdminDashboard"
import { AdminLayout } from "@/components/admin/AdminLayout"

// Página principal del admin
export default function AdminPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (status === "loading") return // Esperar a que cargue la sesión

        if (status === "authenticated" && session?.user?.role === "admin") {
            // Si está logueado como admin, mostrar dashboard
            setIsLoading(false)
        } else {
            // Si no está logueado, ir al login
            router.push("/admin/login")
        }
    }, [session, status, router])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Cargando dashboard...</p>
                </div>
            </div>
        )
    }

    return (
        <AdminLayout>
            <AdminDashboard />
        </AdminLayout>
    )
}
