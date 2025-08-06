"use client"

import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"

export default function AdminSettingsPage() {
    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Settings className="w-6 h-6" />
                    Configuración de la Tienda
                </h1>
            </div>

            <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-6 border dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Aquí podrás configurar los ajustes generales de tu tienda como nombre, logo, descripción, colores y más.
                </p>

                {/* Placeholder para el futuro formulario */}
                <div className="border rounded-md p-6 border-dashed text-center text-sm text-gray-400 dark:text-gray-500">
                    Configuraciones no implementadas aún.
                </div>

                <div className="mt-6 flex justify-end">
                    <Button disabled>Guardar cambios</Button>
                </div>
            </div>
        </div>
    )
}
