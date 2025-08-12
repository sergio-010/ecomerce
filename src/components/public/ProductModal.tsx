"use client"

import Image from "next/image"
import { CustomModal } from "../ui/custom-modal"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Product } from "@/types"
import { useCartStore } from "@/store/cart-store"
import { useRouter } from "next/navigation"

interface Props {
    product: Product | null
    isOpen: boolean
    onClose: () => void
}

export function ProductModal({ product, isOpen, onClose }: Props) {
    const addItem = useCartStore((state) => state.addItem)
    const router = useRouter()

    if (!product) return null

    const hasDiscount = product.comparePrice && product.comparePrice > product.price

    const handleAddToCart = () => {
        addItem(product) // ✅ Solo pasa el producto, zustand ya maneja el quantity internamente
        onClose()
    }

    const handleBuyNow = () => {
        addItem(product)
        onClose()
        router.push("/cart") // o /checkout si tienes esa ruta
    }

    return (
        <CustomModal
            isOpen={isOpen}
            onClose={onClose}
            title={product.name}
            size="lg"
            footer={
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                    <Button
                        onClick={handleAddToCart}
                        className="w-full sm:w-1/2 bg-black text-white hover:bg-gray-900"
                    >
                        Agregar al carrito
                    </Button>
                    <Button
                        onClick={handleBuyNow}
                        variant="outline"
                        className="w-full sm:w-1/2"
                    >
                        Comprar ahora
                    </Button>
                </div>
            }
        >
            <div className="grid md:grid-cols-2 gap-6">
                {/* Imagen del producto */}
                <div className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden rounded-xl bg-gray-100">
                    <Image
                        src="/placeholder.svg"
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    {hasDiscount && (
                        <Badge className="absolute top-2 left-2 bg-red-500 text-white">Oferta</Badge>
                    )}
                </div>

                {/* Información del producto */}
                <div className="flex flex-col justify-between py-2">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl font-bold text-red-600">${Number(product.price)}</span>
                            {hasDiscount && (
                                <span className="text-lg text-gray-400 line-through">${Number(product.comparePrice)}</span>
                            )}
                        </div>

                        {product.description && (
                            <p className="text-gray-700 leading-relaxed">{product.description}</p>
                        )}
                    </div>
                </div>
            </div>
        </CustomModal>
    )
}
