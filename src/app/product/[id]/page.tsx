"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useProductStore } from "@/store/product-store"
import { Navbar } from "@/components/public/Navbar"
import { Footer } from "@/components/public/Footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Truck, Shield, RefreshCw } from "lucide-react"
import Image from "next/image"
import type { ProductWithRelations } from "@/types"

export default function ProductPage() {
    const params = useParams()
    const productId = params.id as string
    const [product, setProduct] = useState<ProductWithRelations | null>(null)
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)
    const [quantity, setQuantity] = useState(1)

    // Store data
    const products = useProductStore((state) => state.products)

    useEffect(() => {
        // Buscar el producto en el store
        const foundProduct = products.find(p => p.id === productId)

        if (foundProduct) {
            // Convertir el producto del store a ProductWithRelations
            const productWithRelations: ProductWithRelations = {
                ...foundProduct,
                category: {
                    id: foundProduct.categoryId,
                    name: "Electrónicos", // Valor por defecto
                    slug: "electronicos",
                    description: null,
                    isActive: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    image: null,
                    sortOrder: 0,
                    parentId: null
                },
                images: [],
                variants: [],
                reviews: []
            }
            setProduct(productWithRelations)
        } else {
            // Mock product para desarrollo
            const mockProduct: ProductWithRelations = {
                id: productId,
                name: "iPhone 14 Pro",
                slug: "iphone-14-pro",
                description: "El iPhone más avanzado con chip A16 Bionic, cámara de 48MP y pantalla Super Retina XDR de 6.1 pulgadas. Diseñado para profesionales y entusiastas de la tecnología.",
                price: 999,
                comparePrice: 1199,
                sku: "IPH14PRO128",
                stock: 15,
                isActive: true,
                isFeatured: true,
                isPromotion: true,
                weight: 0.206,
                dimensions: "147.5 × 71.5 × 7.85 mm",
                tags: "smartphone,apple,5g,pro",
                seoTitle: "iPhone 14 Pro - Smartphone Apple",
                seoDescription: "Compra el iPhone 14 Pro con la mejor tecnología Apple",
                categoryId: "1",
                createdAt: new Date(),
                updatedAt: new Date(),
                category: {
                    id: "1",
                    name: "Electrónicos",
                    slug: "electronicos",
                    description: null,
                    isActive: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    image: null,
                    sortOrder: 0,
                    parentId: null
                },
                images: [
                    {
                        id: "1",
                        url: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=800&fit=crop&q=80",
                        alt: "iPhone 14 Pro",
                        sortOrder: 0,
                        productId: productId,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        id: "2",
                        url: "https://images.unsplash.com/photo-1567581935884-3349723552ca?w=800&h=800&fit=crop&q=80",
                        alt: "iPhone 14 Pro Vista Lateral",
                        sortOrder: 1,
                        productId: productId,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                ],
                variants: [],
                reviews: []
            }
            setProduct(mockProduct)
        }
    }, [productId, products])

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <main className="container mx-auto px-4 py-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            Producto no encontrado
                        </h1>
                        <p className="text-gray-600 mb-8">
                            El producto que buscas no existe o ha sido eliminado.
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

    const currentImage = product.images?.[selectedImageIndex]
    const inStock = product.stock > 0
    const hasPromotion = product.isPromotion && product.comparePrice

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Galería de imágenes */}
                    <div className="space-y-4">
                        <div className="aspect-square bg-white rounded-xl overflow-hidden">
                            {currentImage ? (
                                <Image
                                    src={currentImage.url}
                                    alt={currentImage.alt || product.name}
                                    width={600}
                                    height={600}
                                    className="w-full h-full object-cover"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-500 text-4xl">📦</span>
                                </div>
                            )}
                        </div>

                        {product.images && product.images.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto">
                                {product.images.map((image, index) => (
                                    <button
                                        key={image.id}
                                        onClick={() => setSelectedImageIndex(index)}
                                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${index === selectedImageIndex
                                                ? "border-blue-500"
                                                : "border-gray-200"
                                            }`}
                                    >
                                        <Image
                                            src={image.url}
                                            alt={image.alt || `${product.name} ${index + 1}`}
                                            width={80}
                                            height={80}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Información del producto */}
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                {product.category && (
                                    <Badge variant="outline">{product.category.name}</Badge>
                                )}
                                {product.isFeatured && (
                                    <Badge variant="default">Destacado</Badge>
                                )}
                                {hasPromotion && (
                                    <Badge variant="destructive">Oferta</Badge>
                                )}
                            </div>

                            <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                {product.name}
                            </h1>

                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-5 h-5 ${i < 4
                                                    ? "text-yellow-400 fill-current"
                                                    : "text-gray-300"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-600">(25 reseñas)</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <span className="text-3xl font-bold text-gray-900">
                                    ${product.price}
                                </span>
                                {hasPromotion && (
                                    <span className="text-xl text-gray-500 line-through">
                                        ${product.comparePrice}
                                    </span>
                                )}
                            </div>

                            {hasPromotion && product.comparePrice && (
                                <div className="text-green-600 font-medium">
                                    Ahorras ${(product.comparePrice - product.price).toFixed(2)}
                                </div>
                            )}
                        </div>

                        <div className="prose max-w-none">
                            <p className="text-gray-600">
                                {product.description}
                            </p>
                        </div>

                        {/* Información adicional */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium">SKU:</span> {product.sku || "N/A"}
                            </div>
                            <div>
                                <span className="font-medium">Stock:</span> {product.stock} disponibles
                            </div>
                            {product.weight && (
                                <div>
                                    <span className="font-medium">Peso:</span> {product.weight}kg
                                </div>
                            )}
                            {product.dimensions && (
                                <div>
                                    <span className="font-medium">Dimensiones:</span> {product.dimensions}
                                </div>
                            )}
                        </div>

                        {/* Selector de cantidad y botones */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <span className="font-medium">Cantidad:</span>
                                <div className="flex items-center border rounded-lg">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-3 py-2 hover:bg-gray-100"
                                        disabled={!inStock}
                                    >
                                        -
                                    </button>
                                    <span className="px-4 py-2 border-x">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                        className="px-3 py-2 hover:bg-gray-100"
                                        disabled={!inStock}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button
                                    className="flex-1"
                                    disabled={!inStock}
                                >
                                    {inStock ? "Agregar al carrito" : "Agotado"}
                                </Button>
                                <Button variant="outline">
                                    ♡ Favoritos
                                </Button>
                            </div>
                        </div>

                        {/* Beneficios */}
                        <Card>
                            <CardContent className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Truck className="w-4 h-4 text-green-600" />
                                        <span>Envío gratis</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Shield className="w-4 h-4 text-blue-600" />
                                        <span>Garantía 1 año</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <RefreshCw className="w-4 h-4 text-purple-600" />
                                        <span>Devolución fácil</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
