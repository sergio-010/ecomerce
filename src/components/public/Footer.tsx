"use client"

import Link from "next/link"
import {
    Mail,
    Phone,
    ArrowUp
} from "lucide-react"
import { useState, useEffect } from "react"

export function Footer() {
    const [showScrollTop, setShowScrollTop] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <footer className="bg-gray-50 border-t border-gray-200 text-gray-600">
            {/* Botón de scroll to top */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 z-50 p-2 bg-black hover:bg-gray-800 text-white rounded-full shadow-sm transition-all"
                    aria-label="Volver arriba"
                >
                    <ArrowUp className="w-4 h-4" />
                </button>
            )}

            {/* Contenido principal del footer */}
            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                        {/* Información de la tienda */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-3">Mi Tienda</h3>
                            <p className="text-sm text-gray-500 mb-2">Tu tienda de confianza</p>
                            <p className="text-sm text-gray-500">para productos de calidad</p>
                        </div>

                        {/* Enlaces útiles */}
                        <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-3">Enlaces</h4>
                            <div className="space-y-2">
                                <Link href="/" className="block text-sm text-gray-500 hover:text-gray-900">
                                    Inicio
                                </Link>
                                <Link href="#" className="block text-sm text-gray-500 hover:text-gray-900">
                                    Productos
                                </Link>
                                <Link href="#" className="block text-sm text-gray-500 hover:text-gray-900">
                                    Contacto
                                </Link>
                                <Link href="/admin" className="block text-sm text-gray-500 hover:text-gray-900">
                                    Admin
                                </Link>
                            </div>
                        </div>

                        {/* Contacto */}
                        <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-3">Contacto</h4>
                            <div className="space-y-2">
                                <p className="text-sm text-gray-500 flex items-center justify-center md:justify-start gap-2">
                                    <Mail className="w-4 h-4" />
                                    contacto@mitienda.com
                                </p>
                                <p className="text-sm text-gray-500 flex items-center justify-center md:justify-start gap-2">
                                    <Phone className="w-4 h-4" />
                                    +1 (555) 123-4567
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Línea divisoria y copyright */}
                    <div className="border-t border-gray-200 mt-8 pt-6 text-center">
                        <p className="text-sm text-gray-400">
                            © 2024 Mi Tienda. Todos los derechos reservados.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
