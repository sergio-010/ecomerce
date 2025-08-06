"use client"

import { useCartStore } from "@/store/cart-store"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function CartSheet({ open, onOpenChange }: Props) {
    const items = useCartStore((state) => state.items)
    const total = useCartStore((state) => state.getTotalPrice())
    const clearCart = useCartStore((state) => state.clearCart)

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

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:w-[400px]">
                <SheetHeader>
                    <SheetTitle className="text-xl font-bold">Carrito</SheetTitle>
                </SheetHeader>

                <div className="mt-4 space-y-4">
                    {items.length === 0 ? (
                        <p className="text-gray-500">Tu carrito está vacío.</p>
                    ) : (
                        <>
                            {items.map((item) => (
                                <div key={item.product.id} className="flex justify-between items-center border-b pb-2">
                                    <div>
                                        <p className="font-semibold">{item.product.name}</p>
                                        <p className="text-sm text-gray-500">
                                            {item.quantity} x ${item.product.price.toFixed(2)}
                                        </p>
                                    </div>
                                    <span className="font-bold">
                                        ${(item.quantity * item.product.price).toFixed(2)}
                                    </span>
                                </div>
                            ))}

                            <div className="flex justify-between border-t pt-4 font-semibold text-lg">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>

                            <div className="flex flex-col gap-2 mt-4">
                                <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
                                    <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer">
                                        Enviar pedido por WhatsApp
                                    </a>
                                </Button>
                                <Button variant="outline" onClick={clearCart}>Vaciar carrito</Button>
                            </div>
                        </>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    )
}
