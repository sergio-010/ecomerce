"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { LogOut, Package, Settings, Home, ImageIcon, FolderOpen, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProtectedRoute } from "./ProtectedRoute"

interface AdminLayoutProps {
    children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
    const { data: session } = useSession()
    const router = useRouter()

    const handleLogout = async () => {
        await signOut({ redirect: false })
        router.push("/admin/login")
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-background">
                {/* Sidebar */}
                <div className="fixed inset-y-0 left-0 z-50 w-64 border-r bg-card shadow-lg">
                    <div className="flex flex-col h-full">
                        {/* Header */}
                        <div className="flex items-center px-6 py-4 border-b bg-gradient-to-r from-primary to-primary/80">
                            <h1 className="text-xl font-semibold tracking-tight text-primary-foreground">Panel Admin</h1>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 px-4 py-6 space-y-1">
                            <Link
                                href="/"
                                className="flex items-center px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                            >
                                <Home className="w-4 h-4 mr-3" />
                                Ver Tienda
                            </Link>

                            <Link
                                href="/admin/products"
                                className="flex items-center px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                            >
                                <Package className="w-4 h-4 mr-3" />
                                Productos
                            </Link>

                            <Link
                                href="/admin/orders"
                                className="flex items-center px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                            >
                                <ShoppingCart className="w-4 h-4 mr-3" />
                                Órdenes
                            </Link>

                            <Link
                                href="/admin/categories"
                                className="flex items-center px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                            >
                                <FolderOpen className="w-4 h-4 mr-3" />
                                Categorías
                            </Link>

                            <Link
                                href="/admin/banners"
                                className="flex items-center px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                            >
                                <ImageIcon className="w-4 h-4 mr-3" />
                                Banners
                            </Link>

                            <Link
                                href="/admin/settings"
                                className="flex items-center px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                            >
                                <Settings className="w-4 h-4 mr-3" />
                                Configuración
                            </Link>
                        </nav>

                        {/* User info y logout */}
                        <div className="px-4 py-4 border-t bg-muted/50">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">{session?.user?.name || 'Admin'}</p>
                                    <p className="text-xs text-muted-foreground">{session?.user?.email || ''}</p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleLogout}
                                    className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
                                    title="Cerrar sesión"
                                >
                                    <LogOut className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main content */}
                <div className="ml-64">
                    <main className="p-8">
                        {children}
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    )
}
