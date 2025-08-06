"use client"

import Link from "next/link"
import { Menu, ShoppingBag, Heart } from "lucide-react"
import { Button } from "../ui/button"
import { CartButton } from "./CartButton"
import { useCategoryStore } from "@/store/category-store"
import { useFavoritesStore } from "@/store/favorites-store"
import { useState, useEffect } from "react"

export function Navbar() {
    const { getParentCategories } = useCategoryStore()
    const { favorites } = useFavoritesStore()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isHydrated, setIsHydrated] = useState(false)

    const favoritesCount = favorites.length

    // Ensure hydration consistency
    useEffect(() => {
        setIsHydrated(true)
    }, [])

    const categories = isHydrated ? getParentCategories().slice(0, 6) : [] // Mostrar máximo 6 categorías

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
                <nav className="hidden md:flex gap-1 text-sm">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/category/${category.slug}`}
                            className="px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-all duration-200"
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

                {/* Carrito + Favoritos - Desktop */}
                <div className="hidden md:flex items-center gap-2">
                    <Link href="/favorites" className="relative p-2 hover:bg-muted rounded-md transition-colors">
                        <Heart className="h-5 w-5" />
                        {favoritesCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {favoritesCount}
                            </span>
                        )}
                    </Link>
                    <CartButton />
                </div>

                {/* Carrito + Favoritos - Mobile */}
                <div className="md:hidden flex items-center gap-1">
                    <Link href="/favorites" className="relative p-2 hover:bg-muted rounded-md transition-colors">
                        <Heart className="h-5 w-5" />
                        {favoritesCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                {favoritesCount > 9 ? '9+' : favoritesCount}
                            </span>
                        )}
                    </Link>
                    <CartButton />
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t bg-background">
                    <nav className="px-4 py-3 space-y-1 max-h-96 overflow-y-auto">
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={`/category/${category.slug}`}
                                className="block py-2 px-2 text-sm font-medium text-foreground hover:bg-muted rounded-md transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {category.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    )
}
