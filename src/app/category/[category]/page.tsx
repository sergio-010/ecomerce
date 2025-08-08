'use client'

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { ProductGrid } from "@/components/public/ProductGrid"
import { Navbar } from "@/components/public/Navbar"
import { Footer } from "@/components/public/Footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCategoryStore } from "@/store/category-store"
import { useProductStore } from "@/store/product-store"
import { Product, Category } from "@/types"
import Link from "next/link"
import { X, Grid, List, SlidersHorizontal, Package } from "lucide-react"

export default function CategoryPage() {
    const params = useParams()
    const categorySlug = params.category as string

    // Optimizar selectores para evitar bucles infinitos - calcular directamente
    const categories = useCategoryStore((state) => state.categories)
    const products = useProductStore((state) => state.products)

    // Funciones helper calculadas directamente
    const getAllCategories = () => categories
    const getCategoryBySlug = (slug: string) => categories.find(cat => cat.slug === slug)
    const getProducts = () => products

    const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
    const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([])
    const [priceRange, setPriceRange] = useState<{ min: number, max: number }>({ min: 0, max: 1000 })
    const [sortBy, setSortBy] = useState<string>('name')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [showFilters, setShowFilters] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [currentCategory, setCurrentCategory] = useState<Category | undefined>(undefined)
    const [subcategories, setSubcategories] = useState<Category[]>([])

    // Efecto para cargar la categoría inicial
    useEffect(() => {
        // Función para contar productos por subcategoría
        const getProductCountForSubcategory = (subcategoryId: string) => {
            const allProducts = getProducts()
            return allProducts.filter(product => product.categoryId === subcategoryId).length
        }

        const category = getCategoryBySlug(categorySlug)
        setCurrentCategory(category)

        if (category) {
            const categories = getAllCategories()
            const subs = categories.filter(cat => cat.parentId === category.id && cat.isActive)
            // Agregar contador de productos a cada subcategoría
            const subsWithCount = subs.map(sub => ({
                ...sub,
                productCount: getProductCountForSubcategory(sub.id)
            }))
            setSubcategories(subsWithCount)
        } else {
            setSubcategories([])
        }

        setIsLoading(false)
    }, [categorySlug, categories, products])

    // Efecto para filtrar productos
    useEffect(() => {
        if (!currentCategory) {
            setFilteredProducts([])
            return
        }

        const allProducts = getProducts()
        const allCategories = getAllCategories()
        let products: Product[] = []

        // Determinar si la categoría actual es padre o hija
        const isParentCategory = !currentCategory.parentId

        if (isParentCategory) {
            // Si es categoría padre, incluir productos de ella y todas sus subcategorías
            const subcategoryIds = allCategories
                .filter(cat => cat.parentId === currentCategory.id)
                .map(cat => cat.id)

            const categoryIds = [currentCategory.id, ...subcategoryIds]
            products = allProducts.filter(product =>
                product.categoryId && categoryIds.includes(product.categoryId)
            )
        } else {
            // Si es subcategoría, mostrar solo productos de esta subcategoría
            // PERO también asegurar que aparezcan cuando se vea la categoría padre
            products = allProducts.filter(product =>
                product.categoryId === currentCategory.id
            )
        }

        // Aplicar filtros adicionales
        let filtered = products

        // Filtro por subcategorías seleccionadas (solo si hay subcategorías)
        if (selectedSubcategories.length > 0 && subcategories.length > 0) {
            filtered = filtered.filter(product =>
                selectedSubcategories.includes(product.categoryId || '')
            )
        }

        // Filtro por rango de precio
        filtered = filtered.filter(product =>
            product.price >= priceRange.min && product.price <= priceRange.max
        )

        // Ordenamiento
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'price-asc':
                    return a.price - b.price
                case 'price-desc':
                    return b.price - a.price
                case 'name':
                default:
                    return a.name.localeCompare(b.name)
            }
        })

        setFilteredProducts(filtered)
    }, [currentCategory, subcategories, selectedSubcategories, priceRange, sortBy, categorySlug, products])

    const toggleSubcategoryFilter = (subcategoryId: string) => {
        setSelectedSubcategories(prev =>
            prev.includes(subcategoryId)
                ? prev.filter(id => id !== subcategoryId)
                : [...prev, subcategoryId]
        )
    }

    const clearAllFilters = () => {
        setSelectedSubcategories([])
        setPriceRange({ min: 0, max: 1000 })
        setSortBy('name')
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="flex items-center justify-center py-16">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
                    </div>
                </main>
            </div>
        )
    }

    if (!currentCategory) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="text-center py-16">
                        <h1 className="text-2xl font-bold mb-4">Categoría no encontrada</h1>
                        <Link
                            href="/"
                            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                        >
                            Volver al inicio
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header minimalista */}
                <div className="mb-8">
                    <nav className="text-sm text-gray-500 mb-4">
                        <Link href="/" className="hover:text-gray-900 transition-colors">Inicio</Link>
                        <span className="mx-2">/</span>
                        <span className="text-gray-900">{currentCategory.name}</span>
                    </nav>

                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {currentCategory.name}
                    </h1>
                    {currentCategory.description && (
                        <p className="text-gray-600 mb-4">
                            {currentCategory.description}
                        </p>
                    )}

                    <p className="text-sm text-gray-500">
                        {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar de filtros minimalista */}
                    <aside className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                        <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-24">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="font-semibold text-lg text-gray-900">
                                    Filtros
                                </h2>
                                {(selectedSubcategories.length > 0 || priceRange.min > 0 || priceRange.max < 1000) && (
                                    <button
                                        onClick={clearAllFilters}
                                        className="text-sm text-gray-500 hover:text-gray-700"
                                    >
                                        Limpiar
                                    </button>
                                )}
                            </div>

                            {/* Filtros por subcategorías */}
                            {subcategories.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="font-medium text-gray-900 mb-3">Subcategorías</h3>
                                    <div className="space-y-2">
                                        {subcategories.map((subcategory) => (
                                            <label
                                                key={subcategory.id}
                                                className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-gray-50 transition-colors"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedSubcategories.includes(subcategory.id)}
                                                    onChange={() => toggleSubcategoryFilter(subcategory.id)}
                                                    className="rounded border-gray-300 text-gray-900 focus:ring-gray-500 w-4 h-4"
                                                />
                                                <div className="flex-1">
                                                    <span className="text-sm text-gray-700">
                                                        {subcategory.name}
                                                    </span>
                                                    {subcategory.productCount && (
                                                        <span className="text-xs text-gray-400 ml-2">
                                                            ({subcategory.productCount})
                                                        </span>
                                                    )}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Filtro por rango de precio */}
                            <div className="mb-6">
                                <h3 className="font-medium text-gray-900 mb-3">Rango de Precio</h3>
                                <div className="space-y-3">
                                    <div className="flex gap-3">
                                        <div className="flex-1">
                                            <label className="text-xs text-gray-500">Mínimo</label>
                                            <input
                                                type="number"
                                                value={priceRange.min}
                                                onChange={(e) => setPriceRange(prev => ({
                                                    ...prev,
                                                    min: Number(e.target.value)
                                                }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                                                placeholder="0"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-xs text-gray-500">Máximo</label>
                                            <input
                                                type="number"
                                                value={priceRange.max}
                                                onChange={(e) => setPriceRange(prev => ({
                                                    ...prev,
                                                    max: Number(e.target.value)
                                                }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                                                placeholder="1000"
                                            />
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-500 text-center">
                                        ${priceRange.min} - ${priceRange.max}
                                    </div>
                                </div>
                            </div>

                            {/* Filtros activos */}
                            {selectedSubcategories.length > 0 && (
                                <div className="border-t pt-4">
                                    <h3 className="font-medium mb-3">Filtros Activos</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedSubcategories.map((subcategoryId) => {
                                            const subcategory = subcategories.find(sub => sub.id === subcategoryId)
                                            return subcategory ? (
                                                <Badge
                                                    key={subcategoryId}
                                                    variant="secondary"
                                                    className="flex items-center gap-1 cursor-pointer hover:bg-red-100 hover:text-red-700"
                                                    onClick={() => toggleSubcategoryFilter(subcategoryId)}
                                                >
                                                    {subcategory.name}
                                                    <X className="w-3 h-3" />
                                                </Badge>
                                            ) : null
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </aside>

                    {/* Contenido principal */}
                    <div className="flex-1">
                        {/* Barra de herramientas simple */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-gray-200">
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="lg:hidden"
                                >
                                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                                    Filtros
                                </Button>

                                <div className="hidden sm:flex items-center gap-1 border border-gray-200 rounded p-1">
                                    <Button
                                        variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                        size="sm"
                                        onClick={() => setViewMode('grid')}
                                        className="h-8 px-2"
                                    >
                                        <Grid className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant={viewMode === 'list' ? 'default' : 'ghost'}
                                        size="sm"
                                        onClick={() => setViewMode('list')}
                                        className="h-8 px-2"
                                    >
                                        <List className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Ordenar:</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
                                >
                                    <option value="name">Nombre</option>
                                    <option value="price-asc">Precio: Menor a Mayor</option>
                                    <option value="price-desc">Precio: Mayor a Menor</option>
                                </select>
                            </div>
                        </div>

                        {/* Productos */}
                        {filteredProducts.length > 0 ? (
                            <div className="bg-white border border-gray-100 p-4">
                                <ProductGrid products={filteredProducts} />
                            </div>
                        ) : (
                            <div className="bg-white border border-gray-100 p-8 text-center">
                                <div className="max-w-md mx-auto">
                                    <div className="w-16 h-16 bg-gray-50 flex items-center justify-center mx-auto mb-4">
                                        <Package className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        No hay productos disponibles
                                    </h3>
                                    <p className="text-gray-500 mb-6 text-sm">
                                        No se encontraron productos en esta categoría.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                        <Button
                                            onClick={clearAllFilters}
                                            className="bg-black hover:bg-gray-800 text-white px-6 py-2 text-sm"
                                        >
                                            Limpiar filtros
                                        </Button>
                                        <Link href="/">
                                            <Button
                                                variant="outline"
                                                className="border border-gray-200 hover:bg-gray-50 px-6 py-2 text-sm"
                                            >
                                                Ver todos los productos
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
