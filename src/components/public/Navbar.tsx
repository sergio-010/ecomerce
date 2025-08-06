"use client"

import Link from "next/link"
import Image from "next/image"
import { LogIn, LogOut } from "lucide-react"
import { Button } from "../ui/button"
import { StoreConfig } from "@/types"
import { CartButton } from "./CartButton"
import { getCurrentUser } from "@/lib"


interface NavbarProps {
    config: StoreConfig
    storeSlug: string
}

export function Navbar({ config, storeSlug }: NavbarProps) {
    const user = getCurrentUser() // Cambiar por tu lógica de autenticación real

    const handleLogout = () => {
        // Aquí iría tu lógica para cerrar sesión
        console.log("Cerrar sesión")
    }

    return (
        <header className="w-full border-b bg-white">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                {/* Logo + nombre de tienda */}
                <Link href={`/${storeSlug}`} className="flex items-center gap-2">
                    {config.logo ? (
                        <Image
                            src={config.logo}
                            alt={`${config.name} logo`}
                            width={36}
                            height={36}
                            className="rounded-md object-cover"
                        />
                    ) : (
                        <span className="w-9 h-9 flex items-center justify-center bg-gray-200 text-gray-500 font-bold rounded-md text-sm">
                            {config.name.charAt(0).toUpperCase()}
                        </span>
                    )}
                    <span className="text-lg font-bold text-gray-900">{config.name}</span>
                </Link>

                {/* Categorías */}
                <nav className="hidden md:flex gap-6 text-sm text-gray-600">
                    <Link href={`/${storeSlug}/category/ropa`} className="hover:text-black transition">Ropa</Link>
                    <Link href={`/${storeSlug}/category/accesorios`} className="hover:text-black transition">Accesorios</Link>
                    <Link href={`/${storeSlug}/category/electronica`} className="hover:text-black transition">Electrónica</Link>
                </nav>

                {/* Carrito + login o usuario */}
                <div className="flex items-center gap-4">
                    <CartButton />

                    {user ? (
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-800">Hola, {user.name}</span>

                            <Button
                                variant="ghost"
                                onClick={handleLogout}
                                className="flex items-center gap-1 text-sm text-gray-700 hover:text-black"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Salir</span>
                            </Button>
                        </div>
                    ) : (
                        <Link href="/login">
                            <Button
                                variant="ghost"
                                className="flex items-center gap-1 text-sm text-gray-700 hover:text-black"
                            >
                                <LogIn className="w-4 h-4" />
                                <span>Iniciar sesión</span>
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    )
}
