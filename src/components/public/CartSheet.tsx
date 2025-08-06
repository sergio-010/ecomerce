"use client"

import { useCartStore } from "@/store/cart-store"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import Image from "next/image"

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function CartSheet({ open, onOpenChange }: Props) {
    const items = useCartStore((state) => state.items)
    const total = useCartStore((state) => state.getTotalPrice())
    const totalItems = useCartStore((state) => state.getTotalItems())
    const isHydrated = useCartStore((state) => state.isHydrated)
    const clearCart = useCartStore((state) => state.clearCart)
    const removeItem = useCartStore((state) => state.removeItem)
    const updateQuantity = useCartStore((state) => state.updateQuantity)

    const getWhatsAppUrl = () => {
        const lines = items.map(
            (item) =>
                `- ${item.quantity}x ${item.product.name} ($${item.product.price.toFixed(2)})`
        )
        const totalLine = `Total: $${total.toFixed(2)}`
        const message = `Hola, quiero comprar:\n${lines.join("\n")}\n${totalLine}`
        const encoded = encodeURIComponent(message)
        return `https://wa.me/573203439111?text=${encoded}`
    }

    const handleIncreaseQuantity = (productId: string) => {
        const item = items.find(item => item.product.id === productId)
        if (item) {
            updateQuantity(productId, item.quantity + 1)
        }
    }

    const handleDecreaseQuantity = (productId: string) => {
        const item = items.find(item => item.product.id === productId)
        if (item) {
            if (item.quantity === 1) {
                removeItem(productId)
            } else {
                updateQuantity(productId, item.quantity - 1)
            }
        }
    }

    // Evitar problemas de hidratación
    if (!isHydrated) {
        return (
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent className="w-full sm:w-[480px] flex flex-col p-0">
                    <SheetHeader className="px-6 py-6 border-b">
                        <SheetTitle className="text-xl font-bold flex items-center gap-2">
                            <ShoppingBag className="w-5 h-5" />
                            Carrito
                        </SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 flex items-center justify-center px-6">
                        <div className="animate-pulse text-gray-500">Cargando...</div>
                    </div>
                </SheetContent>
            </Sheet>
        )
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:w-[480px] flex flex-col p-0">
                <SheetHeader className="px-6 py-6 border-b">
                    <SheetTitle className="text-xl font-bold flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5" />
                        Carrito ({totalItems})
                    </SheetTitle>
                </SheetHeader>

                {items.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 px-6">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                            <ShoppingBag className="w-12 h-12 text-gray-400" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-medium text-gray-900">Tu carrito está vacío</h3>
                            <p className="text-sm text-gray-500">Agrega algunos productos para comenzar</p>
                        </div>
                        <Button onClick={() => onOpenChange(false)} variant="outline" className="mt-4">
                            Continuar comprando
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 overflow-y-auto px-6 py-4">
                            <div className="space-y-6">
                                {items.map((item) => (
                                    <div key={item.product.id} className="bg-gray-50 rounded-xl p-4 space-y-4">
                                        <div className="flex gap-4">
                                            <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                {item.product.image ? (
                                                    <Image
                                                        src={item.product.image}
                                                        alt={item.product.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                        <ShoppingBag className="w-8 h-8 text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0 space-y-2">
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 text-base leading-tight">
                                                        {item.product.name}
                                                    </h4>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        ${item.product.price.toFixed(2)} c/u
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right flex flex-col justify-between">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeItem(item.product.id)}
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0 self-end"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                                <p className="font-bold text-gray-900 text-lg">
                                                    ${(item.quantity * item.product.price).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                                            <span className="text-sm font-medium text-gray-700">Cantidad:</span>
                                            <div className="flex items-center space-x-3">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDecreaseQuantity(item.product.id)}
                                                    className="h-8 w-8 p-0 rounded-full"
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </Button>
                                                <span className="text-base font-semibold w-8 text-center">
                                                    {item.quantity}
                                                </span>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleIncreaseQuantity(item.product.id)}
                                                    className="h-8 w-8 p-0 rounded-full"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="border-t bg-white px-6 py-6 space-y-6">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold text-gray-900">Total</span>
                                <span className="text-2xl font-bold text-gray-900">${total.toFixed(2)}</span>
                            </div>

                            <div className="space-y-3">
                                <Button
                                    asChild
                                    className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-base font-semibold rounded-xl"
                                >
                                    <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer">
                                        Enviar pedido por WhatsApp
                                    </a>
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={clearCart}
                                    className="w-full h-10 rounded-xl"
                                >
                                    Vaciar carrito
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    )
}
