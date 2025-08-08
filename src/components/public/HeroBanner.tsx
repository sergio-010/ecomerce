"use client"

import { useBannerStore } from '@/store/banner-store'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export function HeroBanner() {
    // Optimizar selectores para evitar bucles infinitos - usar useMemo para cálculos
    const allBanners = useBannerStore((state) => state.banners)
    const banners = useMemo(() => allBanners.filter(banner => banner.isActive), [allBanners])
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        if (banners.length <= 1) return

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % banners.length)
        }, 5000)

        return () => clearInterval(interval)
    }, [banners.length])

    if (banners.length === 0) {
        return null
    }

    const currentBanner = banners[currentIndex]

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)
    }

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % banners.length)
    }

    return (
        <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden border border-gray-200">
            <div
                className="w-full h-full flex items-center justify-center text-center relative"
                style={{
                    backgroundColor: '#f8f9fa',
                    color: '#000000'
                }}
            >
                {/* Background Image */}
                {currentBanner.image && (
                    <div className="absolute inset-0">
                        <Image
                            src={currentBanner.image}
                            alt={currentBanner.title}
                            fill
                            className="object-cover"
                            priority={currentIndex === 0}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                        />
                        {/* Overlay ligero para legibilidad */}
                        <div className="absolute inset-0 bg-black/10" />
                    </div>
                )}

                {/* Content */}
                <div className="relative z-10 px-4 max-w-4xl mx-auto">
                    <h1 className="text-2xl md:text-4xl font-medium mb-3">
                        {currentBanner.title}
                    </h1>

                    {currentBanner.description && (
                        <p className="text-base md:text-lg mb-6 opacity-80">
                            {currentBanner.description}
                        </p>
                    )}

                    {currentBanner.link && (
                        <Link href={currentBanner.link}>
                            <Button
                                className="bg-black text-white hover:bg-gray-800 px-6 py-2"
                            >
                                Ver Productos
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Navigation Arrows */}
                {banners.length > 1 && (
                    <>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 hover:bg-gray-100 bg-white/80"
                            onClick={goToPrevious}
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:bg-gray-100 bg-white/80"
                            onClick={goToNext}
                        >
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </>
                )}

                {/* Dots Indicator */}
                {banners.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                        {banners.map((_, index) => (
                            <button
                                key={index}
                                className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? 'bg-gray-800' : 'bg-gray-400'
                                    }`}
                                onClick={() => setCurrentIndex(index)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
