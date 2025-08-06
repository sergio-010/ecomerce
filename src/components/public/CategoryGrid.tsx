"use client"

import { useCategoryStore } from '@/store/category-store'
import { Category } from '@/types'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useEffect, useState, useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function CategoryGrid() {
    const { getParentCategories } = useCategoryStore()
    const [isHydrated, setIsHydrated] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: 'start',
        slidesToScroll: 1,
        containScroll: 'trimSnaps',
        breakpoints: {
            '(min-width: 768px)': { slidesToScroll: 2 },
            '(min-width: 1024px)': { slidesToScroll: 3 }
        }
    })

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev()
    }, [emblaApi])

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext()
    }, [emblaApi])

    const scrollTo = useCallback((index: number) => {
        if (emblaApi) emblaApi.scrollTo(index)
    }, [emblaApi])

    const onSelect = useCallback(() => {
        if (!emblaApi) return
        setSelectedIndex(emblaApi.selectedScrollSnap())
    }, [emblaApi])

    useEffect(() => {
        if (!emblaApi) return
        onSelect()
        emblaApi.on('select', onSelect)
        emblaApi.on('reInit', onSelect)
    }, [emblaApi, onSelect])

    // Ensure hydration consistency
    useEffect(() => {
        setIsHydrated(true)
    }, [])

    const categories = getParentCategories()
    const shouldUseCarousel = categories.length > 4

    // Navegación por teclado
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'ArrowLeft') {
                event.preventDefault()
                scrollPrev()
            } else if (event.key === 'ArrowRight') {
                event.preventDefault()
                scrollNext()
            }
        }

        if (shouldUseCarousel) {
            document.addEventListener('keydown', handleKeyDown)
            return () => document.removeEventListener('keydown', handleKeyDown)
        }
    }, [scrollPrev, scrollNext, shouldUseCarousel])

    // Componente reutilizable para las tarjetas de categoría
    const CategoryCard = ({ category }: { category: Category }) => (
        <Link
            href={`/category/${category.slug}`}
            className="group block flex-shrink-0"
        >
            <Card className="h-full transition-all duration-200 hover:scale-[1.02] border border-gray-200 rounded-lg overflow-hidden bg-white shadow-none">
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
                            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                <span className="text-gray-600 text-3xl font-semibold">
                                    {category.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="p-4 border-t border-gray-100">
                        <h3 className="font-semibold text-lg mb-1 text-gray-900 group-hover:text-blue-600 transition-colors">
                            {category.name}
                        </h3>

                        {category.description && (
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                {category.description}
                            </p>
                        )}

                        {category.productCount !== undefined && (
                            <p className="text-xs text-gray-500">
                                {category.productCount} productos
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </Link>
    )

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
    }

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

            {shouldUseCarousel ? (
                // Carrusel para más de 4 categorías
                <div className="relative">
                    {/* Navegación */}
                    <div className="flex justify-between items-center mb-4">
                        <div className="text-sm text-muted-foreground">
                            {categories.length} categorías disponibles
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={scrollPrev}
                                className="h-8 w-8 p-0"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={scrollNext}
                                className="h-8 w-8 p-0"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Carrusel */}
                    <div className="overflow-hidden" ref={emblaRef}>
                        <div className="flex gap-4 md:gap-6 touch-pan-x">
                            {categories.map((category) => (
                                <div
                                    key={category.id}
                                    className="flex-shrink-0 w-64 sm:w-72 md:w-80"
                                >
                                    <CategoryCard category={category} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Indicadores de progreso interactivos */}
                    <div className="flex justify-center mt-6 gap-2">
                        {Array.from({ length: Math.ceil(categories.length / 3) }).map((_, index) => (
                            <button
                                key={index}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${index === selectedIndex
                                    ? 'bg-primary w-8'
                                    : 'bg-muted hover:bg-muted-foreground/30'
                                    }`}
                                onClick={() => scrollTo(index)}
                                aria-label={`Ir a la página ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                // Grid tradicional para 4 o menos categorías
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {categories.map((category) => (
                        <CategoryCard key={category.id} category={category} />
                    ))}
                </div>
            )}
        </div>
    )
}
