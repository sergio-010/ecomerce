"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useCategoryStore } from "@/store/category-store"
import { useProductStore } from "@/store/product-store"
import { CategoryGrid } from "@/components/public/CategoryGrid"
import { ProductGrid } from "@/components/public/ProductGrid"
import { Navbar } from "@/components/public/Navbar"
import { Footer } from "@/components/public/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Filter, Grid, List, ArrowUpDown } from "lucide-react"
import Image from "next/image"
import type { Product, Category } from "@/types"

interface PageProps {
    params: Promise<{
        category: string
    }>
}

export default function CategoryPage({ params }: PageProps) {
    const resolvedParams = use(params)
    const { category: categorySlug } = resolvedParams

    const [currentCategory, setCurrentCategory] = useState<Category | null>(null)
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
    const [priceRange, setPriceRange] = useState([0, 2000])
    const [sortBy, setSortBy] = useState<string>("name")
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [showFilters, setShowFilters] = useState(false)

    // Store actions
    const getCategoryBySlug = useCategoryStore((state) => state.getCategoryBySlug)
    const getAllCategories = useCategoryStore((state) => state.categories)
    const getProducts = useProductStore((state) => state.products)

    // Cargar categoría actual
    useEffect(() => {
        const category = getCategoryBySlug(categorySlug)
        setCurrentCategory(category || null)
    }, [categorySlug, getCategoryBySlug])

    // Filtrar productos por categoría
    useEffect(() => {
        if (currentCategory) {
            const categoryProducts = getProducts.filter(product =>
                product.categoryId === currentCategory.id && product.isActive
            )
            setFilteredProducts(categoryProducts)
        } else {
            setFilteredProducts([])
        }
    }, [currentCategory, getProducts])

    // Aplicar filtros y ordenamiento
    const applyFiltersAndSort = () => {
        let filtered = [...filteredProducts]

        // Filtro por precio
        filtered = filtered.filter(
            product => product.price >= priceRange[0] && product.price <= priceRange[1]
        )

        // Ordenamiento
        switch (sortBy) {
            case "price-asc":
                filtered.sort((a, b) => a.price - b.price)
                break
            case "price-desc":
                filtered.sort((a, b) => b.price - a.price)
                break
            case "name":
                filtered.sort((a, b) => a.name.localeCompare(b.name))
                break
            case "newest":
                filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                break
        }

        return filtered
    }

    const finalProducts = applyFiltersAndSort()

    if (!currentCategory) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <main className="container mx-auto px-4 py-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            Categoría no encontrada
                        </h1>
                        <p className="text-gray-600 mb-8">
                            La categoría que buscas no existe o ha sido eliminada.
                        </p>
                        <Button onClick={() => window.history.back()}>
                            Volver atrás
                        </Button>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="container mx-auto px-4 py-8">
                {/* Header de categoría */}
                <div className="mb-8">
                    <div className="relative h-48 rounded-xl overflow-hidden mb-6">
                        {currentCategory.image ? (
                            <Image
                                src={currentCategory.image}
                                alt={currentCategory.name}
                                fill
                                className="object-cover"
                                sizes="100vw"
                            />
                        ) : (
                            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600" />
                        )}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="text-center text-white">
                                <h1 className="text-4xl font-bold mb-2">{currentCategory.name}</h1>
                                {currentCategory.description && (
                                    <p className="text-lg opacity-90">{currentCategory.description}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filtros y controles */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <Filter className="mr-2 h-4 w-4" />
                            Filtros
                        </Button>

                        <div className="flex items-center gap-2">
                            <Button
                                variant={viewMode === "grid" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setViewMode("grid")}
                            >
                                <Grid className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={viewMode === "list" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setViewMode("list")}
                            >
                                <List className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <ArrowUpDown className="h-4 w-4 text-gray-500" />
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-40">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="name">Nombre A-Z</SelectItem>
                                    <SelectItem value="price-asc">Precio: Menor a Mayor</SelectItem>
                                    <SelectItem value="price-desc">Precio: Mayor a Menor</SelectItem>
                                    <SelectItem value="newest">Más Recientes</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Badge variant="outline">
                            {finalProducts.length} producto{finalProducts.length !== 1 ? 's' : ''}
                        </Badge>
                    </div>
                </div>

                {/* Panel de filtros */}
                {showFilters && (
                    <Card className="mb-6">
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <h3 className="font-semibold mb-3">Rango de Precio</h3>
                                    <Slider
                                        value={priceRange}
                                        onValueChange={setPriceRange}
                                        max={2000}
                                        min={0}
                                        step={10}
                                        className="mb-2"
                                    />
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>${priceRange[0]}</span>
                                        <span>${priceRange[1]}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Lista/Grid de productos */}
                {finalProducts.length > 0 ? (
                    <ProductGrid products={finalProducts} viewMode={viewMode} />
                ) : (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">📦</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No hay productos disponibles
                        </h3>
                        <p className="text-gray-600">
                            No se encontraron productos en esta categoría con los filtros aplicados.
                        </p>
                        {showFilters && (
                            <Button
                                variant="outline"
                                className="mt-4"
                                onClick={() => {
                                    setPriceRange([0, 2000])
                                    setSortBy("name")
                                }}
                            >
                                Limpiar filtros
                            </Button>
                        )}
                    </div>
                )}

                {/* Categorías relacionadas */}
                {getAllCategories.length > 1 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold mb-6">Otras Categorías</h2>
                        <CategoryGrid
                            categories={getAllCategories.filter(cat =>
                                cat.id !== currentCategory.id && cat.isActive
                            ).slice(0, 6)}
                        />
                    </div>
                )}
            </main>

            <Footer />
        </div>
    )
}

// Placeholder para el hook `use` hasta que esté disponible en React
function use<T>(promise: Promise<T>): T {
    // Esta es una implementación temporal
    // En el futuro, React proporcionará este hook oficialmente
    throw promise
}
