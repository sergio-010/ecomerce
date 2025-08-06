"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export default function AdminProductsPage() {
    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Gestión de Productos
                </h1>
                <Button className="flex items-center gap-2 bg-indigo-600 text-white hover:bg-indigo-700">
                    <PlusCircle className="w-5 h-5" />
                    Agregar producto
                </Button>
            </div>

            <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-6 border dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400">
                    Aquí podrás gestionar todos los productos de tu tienda.
                </p>

                {/* Aquí iría tu tabla o grid de productos */}
                <div className="mt-6 text-center text-gray-500 dark:text-gray-500">
                    <p>Aún no hay productos. Usa el botón para agregar uno.</p>
                </div>
            </div>
        </div>
    )
}
