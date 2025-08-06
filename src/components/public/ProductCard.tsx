import { Product } from "@/types"
import Image from "next/image"
import { Button } from "../ui/button"
import { Heart, Star } from "lucide-react"
import { useRouter } from "next/navigation"

interface ProductCardProps {
    product: Product
}

export function ProductCard({ product }: ProductCardProps) {
    const router = useRouter()
    const hasDiscount = product.originalPrice && product.originalPrice > product.price
    const discountPercentage = hasDiscount ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100) : 0

    const handleViewProduct = () => {
        router.push(`/product/${product.id}`)
    }

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation()
        console.log('Producto agregado al carrito:', product)
    }

    return (
        <div
            className="group bg-white rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200 overflow-hidden cursor-pointer h-full flex flex-col"
            onClick={handleViewProduct}
        >
            <div className="relative overflow-hidden aspect-square">
                <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />

                {/* Badge minimalista */}
                {hasDiscount && (
                    <div className="absolute top-2 left-2">
                        <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
                            -{discountPercentage}%
                        </span>
                    </div>
                )}

                {/* Botón de favoritos minimalista */}
                <button
                    className="absolute top-2 right-2 p-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:shadow-md"
                    onClick={(e) => {
                        e.stopPropagation()
                    }}
                >
                    <Heart className="w-4 h-4 text-gray-600" />
                </button>
            </div>

            <div className="p-4 flex-1 flex flex-col">
                {/* Rating simple */}
                <div className="flex items-center gap-1 mb-2">
                    <div className="flex">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                    </div>
                    <span className="text-xs text-gray-500">(4.8)</span>
                </div>

                <h3 className="font-medium text-gray-900 line-clamp-2 mb-2 leading-tight">
                    {product.name}
                </h3>

                {product.description && (
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3 leading-relaxed">
                        {product.description}
                    </p>
                )}

                <div className="mt-auto">
                    <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-lg font-semibold text-gray-900">
                            ${product.price}
                        </span>
                        {hasDiscount && (
                            <span className="text-sm text-gray-400 line-through">
                                ${product.originalPrice}
                            </span>
                        )}
                    </div>

                    <Button
                        onClick={handleAddToCart}
                        disabled={!product.inStock || product.quantity === 0}
                        className="w-full bg-gray-900 hover:bg-gray-800 text-white h-9 font-normal text-sm"
                    >
                        {!product.inStock || product.quantity === 0 ? "Agotado" : "Agregar al carrito"}
                    </Button>
                </div>
            </div>
        </div>
    )
}
