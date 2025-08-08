'use client'

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image"
import { Product } from "@/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Footer } from "@/components/public/Footer"
import { Navbar } from "@/components/public/Navbar"
import { useProductStore } from "@/store/product-store"
import { useCartStore } from "@/store/cart-store"
import { useFavoritesStore } from "@/store/favorites-store"
import { ArrowLeft, Heart, ShoppingCart, Star, Truck, Shield, RotateCcw, Plus, Minus } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { toast } from "sonner"

export default function ProductPage() {
    const params = useParams()
    const router = useRouter()
    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)
    const [selectedImage, setSelectedImage] = useState(0)
    const [quantity, setQuantity] = useState(1)

    // Stores
    // Optimizar selectores para evitar bucles infinitos
    const getProductById = useProductStore((state) => state.getProductById)
    const addItem = useCartStore((state) => state.addItem)
    const addToFavorites = useFavoritesStore((state) => state.addToFavorites)
    const removeFromFavorites = useFavoritesStore((state) => state.removeFromFavorites)
    const isFavorite = useFavoritesStore((state) => state.isFavorite)
    const isProductFavorite = product ? isFavorite(product.id) : false

    useEffect(() => {
        // Obtener el producto real del store usando el ID
        const fetchProduct = async () => {
            try {
                const foundProduct = getProductById(params.id as string)

                if (foundProduct) {
                    setProduct(foundProduct)
                    // Reset selectedImage si el producto cambia
                    setSelectedImage(0)
                } else {
                    // Si no se encuentra en el store, crear un mock para desarrollo
                    const mockProduct: Product = {
                        id: params.id as string,
                        name: "Producto de Ejemplo",
                        description: "Esta es una descripción detallada del producto que muestra todas sus características y beneficios. Un producto de alta calidad diseñado para satisfacer tus necesidades.",
                        price: 299.99,
                        originalPrice: 399.99,
                        image: "/placeholder.svg",
                        images: ["/placeholder.svg", "/placeholder.svg"],
                        category: "Categoría",
                        quantity: 10,
                        inStock: true,
                        rating: 4.8,
                        reviews: 124,
                        freeShipping: true
                    }
                    setProduct(mockProduct)
                    setSelectedImage(0)
                }
            } catch (error) {
                console.error('Error fetching product:', error)
            } finally {
                setLoading(false)
            }
        }

        if (params.id) {
            fetchProduct()
        }
    }, [params.id, getProductById])

    // Validar que selectedImage esté en rango
    useEffect(() => {
        if (product) {
            const productImages = [
                product.image || "/placeholder.svg",
                ...(product.images || [])
            ].filter(Boolean)

            if (selectedImage >= productImages.length) {
                setSelectedImage(0)
            }
        }
    }, [product, selectedImage])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Producto no encontrado</h1>
                <Button onClick={() => router.back()}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver
                </Button>
            </div>
        )
    }

    const hasDiscount = product.originalPrice && product.originalPrice > product.price
    const discountPercentage = hasDiscount ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100) : 0

    const handleAddToCart = () => {
        if (product && product.quantity >= quantity && product.inStock) {
            // Añadir al carrito la cantidad seleccionada
            for (let i = 0; i < quantity; i++) {
                addItem(product)
            }
            // El toast ya se muestra automáticamente desde el store
        } else {
            toast.error("Producto no disponible", {
                description: "No hay suficiente stock disponible"
            })
        }
    }

    const handleToggleFavorite = () => {
        if (product) {
            if (isProductFavorite) {
                removeFromFavorites(product.id)
            } else {
                addToFavorites(product)
            }
        }
    }

    const handleQuantityChange = (newQuantity: number) => {
        if (product && newQuantity > 0 && newQuantity <= product.quantity) {
            setQuantity(newQuantity)
        }
    }

    // Construir array de imágenes del producto
    const productImages = [
        product.image || "/placeholder.svg",
        ...(product.images || [])
    ].filter(Boolean) // Filtrar valores vacíos o null

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            {/* Header minimalista */}
            <div className="border-b border-gray-200 sticky top-0 z-40 bg-white">
                <div className="max-w-6xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <Button
                            variant="ghost"
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Volver
                        </Button>
                        <h1 className="font-medium text-gray-900 truncate max-w-md text-sm">
                            {product.name}
                        </h1>
                        <div className="w-16"></div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Galería de imágenes minimalista */}
                    <div className="space-y-3">
                        <div className="relative aspect-square bg-gray-50 border border-gray-200 overflow-hidden">
                            <Image
                                src={productImages[selectedImage]}
                                alt={product.name}
                                fill
                                className="object-cover"
                                priority
                            />
                            {hasDiscount && (
                                <Badge className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1">
                                    -{discountPercentage}% OFF
                                </Badge>
                            )}
                        </div>

                        {/* Miniaturas minimalistas */}
                        {productImages.length > 1 && (
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-gray-500">
                                        {productImages.length} imágenes
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {selectedImage + 1} de {productImages.length}
                                    </span>
                                </div>
                                <div className="grid grid-cols-4 gap-2">
                                    {productImages.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`relative aspect-square border overflow-hidden transition-all ${selectedImage === index
                                                ? 'border-black'
                                                : 'border-gray-200 hover:border-gray-400'
                                                }`}
                                        >
                                            <Image
                                                src={image}
                                                alt={`${product.name} ${index + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Información del producto - Minimalista */}
                    <div className="space-y-4">
                        <div>
                            {/* Categoría y rating */}
                            <div className="flex items-center gap-3 mb-3">
                                <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                                    {product.category}
                                </Badge>
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`w-3 h-3 ${star <= Math.floor(product.rating || 0)
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-gray-300'
                                                }`}
                                        />
                                    ))}
                                    <span className="text-xs text-gray-500 ml-1">
                                        ({product.reviews || 0})
                                    </span>
                                </div>
                            </div>

                            {/* Título */}
                            <h1 className="text-2xl font-medium text-gray-900 mb-3">
                                {product.name}
                            </h1>

                            {/* Precio */}
                            <div className="flex items-center gap-3 mb-4">
                                {hasDiscount && (
                                    <span className="text-lg text-gray-400 line-through">
                                        {formatPrice(product.originalPrice!)}
                                    </span>
                                )}
                                <span className={`text-2xl font-semibold ${hasDiscount ? 'text-red-600' : 'text-gray-900'}`}>
                                    {formatPrice(product.price)}
                                </span>
                                {hasDiscount && (
                                    <Badge className="bg-green-50 text-green-700 text-xs px-2 py-1">
                                        Ahorra {formatPrice(product.originalPrice! - product.price)}
                                    </Badge>
                                )}
                            </div>

                            {/* Stock status */}
                            <div className="mb-4">
                                {product.inStock && product.quantity > 0 ? (
                                    <div className="flex items-center gap-2 text-sm">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="text-green-700">
                                            En stock ({product.quantity} disponibles)
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-sm">
                                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                        <span className="text-red-700">Sin stock</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Descripción */}
                        <p className="text-gray-600 text-sm leading-relaxed border-t pt-4">
                            {product.description}
                        </p>

                        {/* Controles de cantidad */}
                        <div className="border-t pt-4">
                            <div className="flex items-center gap-4 mb-4">
                                <span className="text-sm text-gray-700">Cantidad:</span>
                                <div className="flex items-center border border-gray-200">
                                    <button
                                        onClick={() => handleQuantityChange(quantity - 1)}
                                        disabled={quantity <= 1}
                                        className="px-3 py-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="px-4 py-2 border-x border-gray-200 bg-gray-50 text-sm">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => handleQuantityChange(quantity + 1)}
                                        disabled={!product.inStock || quantity >= product.quantity}
                                        className="px-3 py-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Plus className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>

                            {/* Botones de acción minimalistas */}
                            <div className="space-y-3">
                                <Button
                                    onClick={handleAddToCart}
                                    disabled={!product.inStock || product.quantity === 0}
                                    className="w-full bg-black hover:bg-gray-800 text-white py-3 disabled:bg-gray-300"
                                >
                                    <ShoppingCart className="w-4 h-4 mr-2" />
                                    Añadir al carrito
                                </Button>

                                <div className="grid grid-cols-2 gap-3">
                                    <Button
                                        onClick={handleToggleFavorite}
                                        variant="outline"
                                        className="border-gray-200 hover:bg-gray-50"
                                    >
                                        <Heart className={`w-4 h-4 mr-2 ${isProductFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                                        {isProductFavorite ? 'Favorito' : 'Favoritos'}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="border-gray-200 hover:bg-gray-50"
                                        onClick={() => router.push('/favorites')}
                                    >
                                        Ver favoritos
                                    </Button>
                                </div>
                            </div>

                            {/* Información adicional minimalista */}
                            <div className="border-t pt-4 space-y-2 text-sm text-gray-600">
                                {product.freeShipping && (
                                    <div className="flex items-center gap-2">
                                        <Truck className="w-4 h-4 text-green-600" />
                                        <span>Envío gratis</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-blue-600" />
                                    <span>Garantía incluida</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <RotateCcw className="w-4 h-4 text-gray-600" />
                                    <span>Devoluciones gratuitas</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}
