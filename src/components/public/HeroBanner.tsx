"use client"

import { useBannerStore } from '@/store/banner-store'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export function HeroBanner() {
    const { getActiveBanners } = useBannerStore()
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isHydrated, setIsHydrated] = useState(false)

    // Ensure hydration consistency
    useEffect(() => {
        setIsHydrated(true)
    }, [])

    const banners = getActiveBanners()

    useEffect(() => {
        if (banners.length <= 1) return

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % banners.length)
        }, 5000)

        return () => clearInterval(interval)
    }, [banners.length])

    // Don't render anything until hydrated to prevent hydration mismatch
    if (!isHydrated) {
        return (
            <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-lg shadow-soft bg-primary flex items-center justify-center">
                <div className="text-primary-foreground text-center">
                    <div className="animate-pulse">
                        <div className="h-8 bg-white/20 rounded mb-4 w-64 mx-auto"></div>
                        <div className="h-4 bg-white/20 rounded w-48 mx-auto"></div>
                    </div>
                </div>
            </div>
        )
    }

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
        <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-lg shadow-soft">
            <div
                className="w-full h-full flex items-center justify-center text-center relative"
                style={{
                    backgroundColor: currentBanner.backgroundColor || '#3b82f6',
                    color: currentBanner.textColor || '#ffffff'
                }}
            >
                {/* Background Image */}
                {currentBanner.imageUrl && (
                    <div className="absolute inset-0">
                        <Image
                            src={currentBanner.imageUrl}
                            alt={currentBanner.title}
                            fill
                            className="object-cover"
                            priority={currentIndex === 0}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                        />
                        {/* Overlay para mejorar legibilidad del texto */}
                        <div className="absolute inset-0 bg-black/30" />
                    </div>
                )}

                {/* Content */}
                <div className="relative z-10 px-4 max-w-4xl mx-auto">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">
                        {currentBanner.title}
                    </h1>

                    {currentBanner.subtitle && (
                        <p className="text-lg md:text-xl mb-8 opacity-90 drop-shadow-md">
                            {currentBanner.subtitle}
                        </p>
                    )}

                    {currentBanner.link && (
                        <Link href={currentBanner.link}>
                            <Button
                                size="lg"
                                className="bg-white text-black hover:bg-gray-100 shadow-lg"
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
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 bg-black/20 backdrop-blur-sm"
                            onClick={goToPrevious}
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 bg-black/20 backdrop-blur-sm"
                            onClick={goToNext}
                        >
                            <ChevronRight className="h-6 w-6" />
                        </Button>
                    </>
                )}

                {/* Dots Indicator */}
                {banners.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                        {banners.map((_, index) => (
                            <button
                                key={index}
                                className={`w-3 h-3 rounded-full transition-all ${index === currentIndex ? 'bg-white scale-110' : 'bg-white/50'
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
