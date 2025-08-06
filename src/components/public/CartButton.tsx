"use client"

import { useState, useEffect } from "react"
import { ShoppingCart } from "lucide-react"
import { useCartStore } from "@/store/cart-store"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CartSheet } from "./CartSheet"

export function CartButton() {
    const totalItems = useCartStore((state) => state.getTotalItems())
    const isHydrated = useCartStore((state) => state.isHydrated)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        useCartStore.getState().setHydrated()
    }, [])

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(true)}
                className="relative text-gray-700 hover:text-black"
                aria-label="Abrir carrito"
            >
                <ShoppingCart className="w-5 h-5" />
                {isHydrated && totalItems > 0 && (
                    <Badge
                        className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500 text-white flex items-center justify-center rounded-full"
                        aria-label={`${totalItems} artículos en el carrito`}
                    >
                        {totalItems}
                    </Badge>
                )}
            </Button>

            <CartSheet open={open} onOpenChange={setOpen} />
        </>
    )
}
