"use client"

import { useEffect, useState } from 'react'
import { useCategoryStore } from '@/store/category-store'
import { useProductStore } from '@/store/product-store'

interface StoreProviderProps {
    children: React.ReactNode
}

export function StoreProvider({ children }: StoreProviderProps) {
    const [isHydrated, setIsHydrated] = useState(false)
    const [isInitialized, setIsInitialized] = useState(false)

    const { fetchCategories } = useCategoryStore()
    const { fetchProducts } = useProductStore()

    useEffect(() => {
        setIsHydrated(true)
    }, [])

    useEffect(() => {
        if (isHydrated && !isInitialized) {
            const initializeStores = async () => {
                try {
                    // Inicializar stores en paralelo
                    await Promise.all([
                        fetchCategories(),
                        fetchProducts()
                    ])
                } catch (error) {
                    console.error('Error inicializando stores:', error)
                } finally {
                    setIsInitialized(true)
                }
            }

            initializeStores()
        }
    }, [isHydrated, isInitialized, fetchCategories, fetchProducts])

    if (!isHydrated || !isInitialized) {
        return (
            <div className="min-h-screen bg-background">
                {/* Skeleton mientras hidrata */}
                <div className="animate-pulse">
                    <div className="h-16 bg-gray-200"></div>
                    <div className="max-w-7xl mx-auto px-4 py-8">
                        <div className="h-8 bg-gray-200 rounded mb-4"></div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="h-64 bg-gray-200 rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return <>{children}</>
}
