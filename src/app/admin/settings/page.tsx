"use client"

import { AdminLayout } from "@/components/admin/AdminLayout"
import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState({
        storeName: "Mi Tienda",
        storeDescription: "La mejor tienda online",
        currency: "COP",
        tax: "19",
        shippingFee: "15000",
        freeShippingThreshold: "150000"
    })

    const handleSave = () => {
        console.log("Guardando configuración:", settings)
        // Aquí guardarías en tu backend
        toast.success("Configuración guardada", {
            description: "Los cambios se han aplicado correctamente"
        })
    }

    const handleChange = (field: string, value: string) => {
        setSettings(prev => ({
            ...prev,
            [field]: value
        }))
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Configuración de la Tienda
                    </h1>
                    <p className="text-gray-600">
                        Personaliza los ajustes generales de tu tienda
                    </p>
                </div>

                <div className="bg-white shadow rounded-lg border">
                    <div className="p-6 space-y-6">
                        {/* Información general */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Información General
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nombre de la tienda
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.storeName}
                                        onChange={(e) => handleChange("storeName", e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Moneda
                                    </label>
                                    <select
                                        value={settings.currency}
                                        onChange={(e) => handleChange("currency", e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    >
                                        <option value="COP">COP ($)</option>
                                        <option value="USD">USD ($)</option>
                                        <option value="EUR">EUR (€)</option>
                                        <option value="MXN">MXN ($)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Descripción de la tienda
                                </label>
                                <textarea
                                    value={settings.storeDescription}
                                    onChange={(e) => handleChange("storeDescription", e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <hr />

                        {/* Configuración de precios */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Precios y Envíos
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Impuestos (%)
                                    </label>
                                    <input
                                        type="number"
                                        value={settings.tax}
                                        onChange={(e) => handleChange("tax", e.target.value)}
                                        min="0"
                                        max="100"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Costo de envío (COP)
                                    </label>
                                    <input
                                        type="number"
                                        value={settings.shippingFee}
                                        onChange={(e) => handleChange("shippingFee", e.target.value)}
                                        min="0"
                                        step="0.01"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Envío gratis desde (COP)
                                    </label>
                                    <input
                                        type="number"
                                        value={settings.freeShippingThreshold}
                                        onChange={(e) => handleChange("freeShippingThreshold", e.target.value)}
                                        min="0"
                                        step="0.01"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        <hr />

                        {/* Botón de guardar */}
                        <div className="flex justify-end">
                            <Button
                                onClick={handleSave}
                                className="flex items-center gap-2 bg-indigo-600 text-white hover:bg-indigo-700"
                            >
                                <Save className="w-4 h-4" />
                                Guardar Configuración
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
