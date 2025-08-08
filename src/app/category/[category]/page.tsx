"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useCategoryStore } from "@/store/category-store"
import { useProductStore } from "@/store/product-store"
import { Navbar } from "@/components/public/Navbar"
import { Footer } from "@/components/public/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, Grid, List, ArrowUpDown } from "lucide-react"
import Image from "next/image"
import type { Product, Category } from "@/types"

export default function CategoryPage() {
    const params = useParams()
    const categorySlug = params.category as string

    const [currentCategory, setCurrentCategory] = useState<Category | null>(null)
    const [subcategories, setSubcategories] = useState<Category[]>([])
    const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
    const [priceRange, setPriceRange] = useState([0, 2000])
    const [sortBy, setSortBy] = useState<string>("name")
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [showFilters, setShowFilters] = useState(false)

    // Store data
    const categories = useCategoryStore((state) => state.categories)
    const products = useProductStore((state) => state.products)

    // Helper function to get category by slug
    const getCategoryBySlug = (slug: string) => {
        return categories.find(cat => cat.slug === slug && cat.isActive && !cat.parentId) || null // Solo categorías principales
    }

    // Cargar categoría actual y sus subcategorías
    useEffect(() => {
        const category = getCategoryBySlug(categorySlug)
        setCurrentCategory(category)

        if (category) {
            // Obtener subcategorías (filtros) de esta categoría
            const categorySubcategories = categories.filter(cat =>
                cat.parentId === category.id && cat.isActive
            ).sort((a, b) => a.sortOrder - b.sortOrder)
            setSubcategories(categorySubcategories)
        } else {
            setSubcategories([])
        }

        // Reset subcategoría seleccionada
        setSelectedSubcategory(null)
    }, [categorySlug, categories])

    // Filtrar productos por categoría y subcategoría
    useEffect(() => {
        if (currentCategory) {
            let categoryProducts = products.filter(product =>
                product.categoryId === currentCategory.id && product.isActive
            )

            // Si hay una subcategoría seleccionada, filtrar por tags
            if (selectedSubcategory) {
                const selectedSubcategoryName = subcategories.find(sub => sub.id === selectedSubcategory)?.name
                if (selectedSubcategoryName) {
                    categoryProducts = categoryProducts.filter(product =>
                        product.tags?.toLowerCase().includes(selectedSubcategoryName.toLowerCase())
                    )
                }
            }

            setFilteredProducts(categoryProducts)
        } else {
            setFilteredProducts([])
        }
    }, [currentCategory, selectedSubcategory, products, subcategories])

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

                {/* Filtros por subcategorías (si existen) */}
                {subcategories.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <Filter className="h-5 w-5 text-gray-600" />
                            Filtros
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                variant={selectedSubcategory === null ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedSubcategory(null)}
                                className="rounded-full"
                            >
                                Todos los productos
                            </Button>
                            {subcategories.map((subcategory) => (
                                <Button
                                    key={subcategory.id}
                                    variant={selectedSubcategory === subcategory.id ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setSelectedSubcategory(subcategory.id)}
                                    className="rounded-full"
                                >
                                    {subcategory.name}
                                </Button>
                            ))}
                        </div>
                        {selectedSubcategory && (
                            <div className="mt-2">
                                <span className="text-sm text-muted-foreground">
                                    Filtrado por: {subcategories.find(sub => sub.id === selectedSubcategory)?.name}
                                </span>
                            </div>
                        )}
                    </div>
                )}

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
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            value={priceRange[0]}
                                            onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                                            className="w-20 px-2 py-1 border rounded"
                                            placeholder="Min"
                                        />
                                        <input
                                            type="number"
                                            value={priceRange[1]}
                                            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                            className="w-20 px-2 py-1 border rounded"
                                            placeholder="Max"
                                        />
                                    </div>
                                </div>

                                {subcategories.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold mb-3">Filtros disponibles</h3>
                                        <div className="space-y-2">
                                            {subcategories.map((subcategory) => (
                                                <label key={subcategory.id} className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="subcategory"
                                                        checked={selectedSubcategory === subcategory.id}
                                                        onChange={() => setSelectedSubcategory(subcategory.id)}
                                                        className="mr-2"
                                                    />
                                                    <span className="text-sm">{subcategory.name}</span>
                                                    {subcategory.description && (
                                                        <span className="text-xs text-gray-500 ml-2">
                                                            ({subcategory.description})
                                                        </span>
                                                    )}
                                                </label>
                                            ))}
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="subcategory"
                                                    checked={selectedSubcategory === null}
                                                    onChange={() => setSelectedSubcategory(null)}
                                                    className="mr-2"
                                                />
                                                <span className="text-sm">Mostrar todos</span>
                                            </label>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Lista de productos (simplificada) */}
                {finalProducts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {finalProducts.map((product) => (
                            <div key={product.id} className="bg-white rounded-lg shadow-sm p-4">
                                <h3 className="font-semibold">{product.name}</h3>
                                <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
                                <div className="mt-2">
                                    <span className="font-bold">${product.price}</span>
                                    {product.comparePrice && (
                                        <span className="ml-2 text-sm text-gray-500 line-through">
                                            ${product.comparePrice}
                                        </span>
                                    )}
                                </div>
                                <div className="mt-2">
                                    <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                                        {product.stock > 0 ? "Disponible" : "Agotado"}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
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
                                    setSelectedSubcategory(null)
                                }}
                            >
                                Limpiar filtros
                            </Button>
                        )}
                    </div>
                )}

                {/* Categorías relacionadas */}
                {categories.filter(cat => !cat.parentId && cat.isActive).length > 1 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold mb-6">Otras Categorías</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {categories.filter(cat =>
                                cat.id !== currentCategory.id && cat.isActive && !cat.parentId // Solo categorías principales
                            ).slice(0, 6).map((category) => (
                                <a
                                    key={category.id}
                                    href={`/category/${category.slug}`}
                                    className="bg-white rounded-lg shadow-sm p-4 text-center hover:shadow-md transition-shadow"
                                >
                                    {category.image && (
                                        <div className="relative w-full h-20 mb-2 rounded overflow-hidden">
                                            <Image
                                                src={category.image}
                                                alt={category.name}
                                                fill
                                                className="object-cover"
                                                sizes="120px"
                                            />
                                        </div>
                                    )}
                                    <h3 className="font-semibold text-sm">{category.name}</h3>
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    )
}
