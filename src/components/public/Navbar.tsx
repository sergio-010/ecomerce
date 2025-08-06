"use client"

import Link from "next/link"
import { LogIn, LogOut, Menu, ShoppingBag } from "lucide-react"
import { Button } from "../ui/button"
import { CartButton } from "./CartButton"
import { useCategoryStore } from "@/store/category-store"
import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"

export function Navbar() {
    const { data: session } = useSession()
    const { getParentCategories } = useCategoryStore()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isHydrated, setIsHydrated] = useState(false)

    // Ensure hydration consistency
    useEffect(() => {
        setIsHydrated(true)
    }, [])

    const categories = isHydrated ? getParentCategories().slice(0, 4) : [] // Mostrar máximo 4 categorías

    const handleLogout = async () => {
        await signOut({ redirect: false })
    }

    return (
        <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                {/* Logo + nombre de tienda */}
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-bold rounded-lg text-sm shadow-sm">
                        <ShoppingBag className="w-4 h-4" />
                    </div>
                    <span className="text-lg font-semibold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">Mi Tienda</span>
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

                    {isHydrated && session ? (
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium">Hola, {session.user?.name}</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleLogout}
                                className="flex items-center gap-1 hover:bg-destructive/10 hover:text-destructive"
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
                                className="flex items-center gap-1 hover:bg-primary/10 hover:text-primary"
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

                        {/* Auth section for mobile */}
                        <div className="pt-2 border-t">
                            {isHydrated && session ? (
                                <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground">Hola, {session.user?.name}</p>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            handleLogout()
                                            setIsMobileMenuOpen(false)
                                        }}
                                        className="w-full justify-start hover:bg-destructive/10 hover:text-destructive"
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Cerrar sesión
                                    </Button>
                                </div>
                            ) : isHydrated ? (
                                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button variant="ghost" size="sm" className="w-full justify-start hover:bg-primary/10 hover:text-primary">
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
