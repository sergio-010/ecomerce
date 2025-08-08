"use client"

import { useCartStore } from "@/store/cart-store"
import { useFavoritesStore } from "@/store/favorites-store"
import { Badge } from "@/components/ui/badge"

interface StoreCountersProps {
    cartButton: React.ReactNode
    favoritesButton: React.ReactNode
    children: (favoritesCount: number, totalItems: number) => React.ReactNode
}

export function StoreCounters({ cartButton, favoritesButton, children }: StoreCountersProps) {
    // Optimizar selectores para evitar bucles infinitos - calcular directamente
    const items = useCartStore((state) => state.items)
    const favorites = useFavoritesStore((state) => state.favorites)

    const totalItems = items.reduce((total, item) => total + item.quantity, 0)
    const favoritesCount = favorites.length

    return <>{children(favoritesCount, totalItems)}</>
}
