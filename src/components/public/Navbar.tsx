"use client"

import Link from "next/link"
import { LogIn, LogOut, Menu } from "lucide-react"
import { Button } from "../ui/button"
import { CartButton } from "./CartButton"
import { getCurrentUser } from "@/lib"
import { useCategoryStore } from "@/store/category-store"
import { useState, useEffect } from "react"

interface User {
    id: string
    email: string
    name: string
    role: "admin" | "user"
}

export function Navbar() {
    const { getParentCategories } = useCategoryStore()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isHydrated, setIsHydrated] = useState(false)
    const [user, setUser] = useState<User | null>(null)

    // Ensure hydration consistency
    useEffect(() => {
        setIsHydrated(true)
        setUser(getCurrentUser())
    }, [])

    const categories = isHydrated ? getParentCategories().slice(0, 4) : [] // Mostrar máximo 4 categorías

    const handleLogout = () => {
        console.log("Cerrar sesión")
    }

    return (
        <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                {/* Logo + nombre de tienda */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 flex items-center justify-center bg-primary text-primary-foreground font-bold rounded-md text-sm">
                        E
                    </div>
                    <span className="text-lg font-semibold">Mi Tienda</span>
                </Link>

                {/* Categorías - Desktop */}
                <nav className="hidden md:flex gap-6 text-sm">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/category/${category.slug}`}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {category.name}
                        </Link>
                    ))}
                    <Link
                        href="/admin/login"
                        className="text-primary hover:text-primary/80 transition-colors font-medium"
                    >
                        Admin
                    </Link>
                </nav>

                {/* Menu Mobile */}
                <Button
                    variant="ghost"
                    size="sm"
                    className="md:hidden"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <Menu className="h-5 w-5" />
                </Button>

                {/* Carrito + login - Desktop */}
                <div className="hidden md:flex items-center gap-3">
                    <CartButton />

                    {isHydrated && user ? (
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium">Hola, {user.name}</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleLogout}
                                className="flex items-center gap-1"
                            >
                                <LogOut className="w-4 h-4" />
                                Salir
                            </Button>
                        </div>
                    ) : isHydrated ? (
                        <Link href="/login">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-1"
                            >
                                <LogIn className="w-4 h-4" />
                                Iniciar sesión
                            </Button>
                        </Link>
                    ) : (
                        <div className="w-[120px] h-9"></div> // Placeholder para evitar layout shift
                    )}
                </div>

                {/* Carrito - Mobile */}
                <div className="md:hidden">
                    <CartButton />
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t bg-background">
                    <nav className="px-4 py-3 space-y-2">
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={`/category/${category.slug}`}
                                className="block py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {category.name}
                            </Link>
                        ))}
                        <Link
                            href="/admin/login"
                            className="block py-2 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Admin
                        </Link>

                        {/* Auth section for mobile */}
                        <div className="pt-2 border-t">
                            {isHydrated && user ? (
                                <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground">Hola, {user.name}</p>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            handleLogout()
                                            setIsMobileMenuOpen(false)
                                        }}
                                        className="w-full justify-start"
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Cerrar sesión
                                    </Button>
                                </div>
                            ) : isHydrated ? (
                                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button variant="ghost" size="sm" className="w-full justify-start">
                                        <LogIn className="w-4 h-4 mr-2" />
                                        Iniciar sesión
                                    </Button>
                                </Link>
                            ) : null}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    )
}
