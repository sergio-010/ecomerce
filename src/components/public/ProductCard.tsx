import { Product, ProductImage } from "@/types"
import Image from "next/image"
import { Button } from "../ui/button"
import { Heart, Star } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCartStore } from "@/store/cart-store"
import { useFavoritesStore } from "@/store/favorites-store"
import { formatPrice } from "@/lib/utils"

interface ProductCardProps {
    product: Product & { images?: ProductImage[] }
}

export function ProductCard({ product }: ProductCardProps) {
    const router = useRouter()
    const addItem = useCartStore((state) => state.addItem)
    const addToFavorites = useFavoritesStore((state) => state.addToFavorites)
    const removeFromFavorites = useFavoritesStore((state) => state.removeFromFavorites)
    const isFavorite = useFavoritesStore((state) => state.isFavorite)
    const isProductFavorite = isFavorite(product.id)
    const hasDiscount = product.comparePrice && Number(product.comparePrice) > Number(product.price)
    const discountPercentage = hasDiscount ? Math.round(((Number(product.comparePrice!) - Number(product.price)) / Number(product.comparePrice!)) * 100) : 0

    const handleViewProduct = () => {
        router.push(`/product/${product.id}`)
    }

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation()
        addItem(product)
    }

    const handleToggleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (isProductFavorite) {
            removeFromFavorites(product.id)
        } else {
            addToFavorites(product)
        }
    }

    return (
        <div
            className="group bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer h-full flex flex-col"
            onClick={handleViewProduct}
        >
            <div className="relative overflow-hidden aspect-square">
                <Image
                    src={
                        product.images && product.images.length > 0
                            ? product.images[0].url
                            : "/placeholder.svg"
                    }
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={product.isFeatured}
                />

                {/* Badge minimalista */}
                {hasDiscount && (
                    <div className="absolute top-3 left-3">
                        <span className="bg-red-500 text-white text-sm font-medium px-3 py-1.5 rounded-lg shadow-sm">
                            -{discountPercentage}%
                        </span>
                    </div>
                )}

                {/* Botón de favoritos minimalista */}
                <button
                    className="absolute top-3 right-3 p-2.5 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:shadow-lg"
                    onClick={handleToggleFavorite}
                >
                    <Heart className={`w-5 h-5 ${isProductFavorite ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
                </button>
            </div>

            <div className="p-6 flex-1 flex flex-col">
                {/* Rating simple */}
                <div className="flex items-center gap-1 mb-3">
                    <div className="flex">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                    </div>
                    <span className="text-sm text-gray-500 ml-1">(4.8)</span>
                </div>

                <h3 className="font-semibold text-gray-900 line-clamp-2 mb-3 leading-tight text-lg">
                    {product.name}
                </h3>

                {product.description && (
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                        {product.description}
                    </p>
                )}

                <div className="mt-auto">
                    <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-xl font-bold text-gray-900">
                            {formatPrice(Number(product.price))}
                        </span>
                        {hasDiscount && (
                            <span className="text-sm text-gray-400 line-through">
                                {formatPrice(Number(product.comparePrice!))}
                            </span>
                        )}
                    </div>

                    <Button
                        onClick={handleAddToCart}
                        disabled={!product.isActive || product.stock === 0}
                        className="w-full bg-gray-900 hover:bg-gray-800 text-white h-11 font-medium text-sm rounded-lg"
                    >
                        {!product.isActive || product.stock === 0 ? "Agotado" : "Agregar al carrito"}
                    </Button>
                </div>
            </div>
        </div>
    )
}
