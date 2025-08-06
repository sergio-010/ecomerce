"use client"

import { useCategoryStore } from '@/store/category-store'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { useEffect, useState } from 'react'

export function CategoryGrid() {
    const { getParentCategories } = useCategoryStore()
    const [isHydrated, setIsHydrated] = useState(false)

    // Ensure hydration consistency
    useEffect(() => {
        setIsHydrated(true)
    }, [])

    const categories = getParentCategories()

    // Don't render anything until hydrated to prevent hydration mismatch
    if (!isHydrated) {
        return (
            <div className="w-full">
                <div className="mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">
                        Explora por Categorías
                    </h2>
                    <p className="text-muted-foreground text-center">
                        Encuentra exactamente lo que buscas
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <Card key={i} className="h-full animate-pulse">
                            <CardContent className="p-0">
                                <div className="aspect-square bg-muted"></div>
                                <div className="p-4">
                                    <div className="h-6 bg-muted rounded mb-2"></div>
                                    <div className="h-4 bg-muted rounded w-3/4"></div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    if (categories.length === 0) {
        return null
    } return (
        <div className="w-full">
            <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">
                    Explora por Categorías
                </h2>
                <p className="text-muted-foreground text-center">
                    Encuentra exactamente lo que buscas
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {categories.map((category) => (
                    <Link
                        key={category.id}
                        href={`/category/${category.slug}`}
                        className="group"
                    >
                        <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-0 shadow-soft overflow-hidden">
                            <CardContent className="p-0">
                                <div className="aspect-square relative overflow-hidden">
                                    {category.imageUrl ? (
                                        <Image
                                            src={category.imageUrl}
                                            alt={category.name}
                                            fill
                                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center">
                                            <span className="text-primary-foreground text-4xl font-bold">
                                                {category.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                    {/* Overlay on hover */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                                </div>

                                <div className="p-4">
                                    <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                                        {category.name}
                                    </h3>

                                    {category.description && (
                                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                            {category.description}
                                        </p>
                                    )}

                                    {category.productCount !== undefined && (
                                        <p className="text-xs text-muted-foreground">
                                            {category.productCount} productos
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}
