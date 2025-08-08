'use client'

import { useFavoritesStore } from "@/store/favorites-store"
import { Navbar } from "@/components/public/Navbar"
import { Footer } from "@/components/public/Footer"
import { ProductCard } from "@/components/public/ProductCard"
import { Button } from "@/components/ui/button"
import { Heart, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function FavoritesPage() {
    const router = useRouter()
    // Optimizar selectores para evitar bucles infinitos
    const favorites = useFavoritesStore((state) => state.favorites)
    const clearFavorites = useFavoritesStore((state) => state.clearFavorites)

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="border-b border-gray-200 pb-4 mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                onClick={() => router.back()}
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Volver
                            </Button>
                            <div>
                                <h1 className="text-2xl font-medium text-gray-900 flex items-center gap-2">
                                    <Heart className="w-6 h-6 text-red-500" />
                                    Mis Favoritos
                                </h1>
                                <p className="text-sm text-gray-500 mt-1">
                                    {favorites.length} {favorites.length === 1 ? 'producto' : 'productos'}
                                </p>
                            </div>
                        </div>

                        {favorites.length > 0 && (
                            <Button
                                onClick={clearFavorites}
                                variant="outline"
                                className="border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                            >
                                Limpiar favoritos
                            </Button>
                        )}
                    </div>
                </div>

                {/* Contenido */}
                {favorites.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart className="w-12 h-12 text-gray-400" />
                        </div>
                        <h2 className="text-xl font-medium text-gray-900 mb-3">
                            No tienes favoritos aún
                        </h2>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">
                            Explora nuestros productos y añade tus favoritos para encontrarlos fácilmente aquí.
                        </p>
                        <Link href="/">
                            <Button className="bg-black hover:bg-gray-800 text-white">
                                Explorar productos
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {favorites.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    )
}
