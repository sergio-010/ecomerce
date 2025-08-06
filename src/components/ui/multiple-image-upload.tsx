"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X, Plus, Image as ImageIcon } from 'lucide-react'

interface MultipleImageUploadProps {
    mainImage: string
    additionalImages: string[]
    onMainImageChange: (url: string) => void
    onAdditionalImagesChange: (urls: string[]) => void
    maxImages?: number
}

export function MultipleImageUpload({
    mainImage,
    additionalImages,
    onMainImageChange,
    onAdditionalImagesChange,
    maxImages = 4
}: MultipleImageUploadProps) {
    const [newImageUrl, setNewImageUrl] = useState('')

    const addImage = () => {
        if (newImageUrl.trim() && additionalImages.length < maxImages - 1) {
            onAdditionalImagesChange([...additionalImages, newImageUrl.trim()])
            setNewImageUrl('')
        }
    }

    const removeImage = (index: number) => {
        const updatedImages = additionalImages.filter((_, i) => i !== index)
        onAdditionalImagesChange(updatedImages)
    }

    const totalImages = (mainImage ? 1 : 0) + additionalImages.length

    return (
        <div className="space-y-3">
            {/* Imagen principal */}
            <div>
                <Label htmlFor="mainImage">Imagen Principal *</Label>
                <Input
                    id="mainImage"
                    value={mainImage}
                    onChange={(e) => onMainImageChange(e.target.value)}
                    placeholder="URL de la imagen principal"
                    className="mb-2"
                />
                {mainImage && (
                    <div className="relative w-16 h-16 border border-gray-200 overflow-hidden">
                        <Image
                            src={mainImage}
                            alt="Imagen principal"
                            fill
                            className="object-cover"
                        />
                    </div>
                )}
            </div>

            {/* Contador de imágenes */}
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 border border-gray-200">
                <ImageIcon className="w-4 h-4" />
                <span>
                    {totalImages} de {maxImages} imágenes
                    {totalImages > 0 && (
                        <span className="text-green-600 ml-1">
                            ✓ {totalImages === 1 ? '1 imagen' : `${totalImages} imágenes`}
                        </span>
                    )}
                </span>
            </div>

            {/* Imágenes adicionales */}
            {additionalImages.length > 0 && (
                <div>
                    <Label>Imágenes Adicionales</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                        {additionalImages.map((imageUrl, index) => (
                            <div
                                key={index}
                                className="relative group border border-gray-200 overflow-hidden aspect-square"
                            >
                                <Image
                                    src={imageUrl}
                                    alt={`Imagen ${index + 2}`}
                                    fill
                                    className="object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-1 right-1 bg-red-500 text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Agregar nueva imagen */}
            {additionalImages.length < maxImages - 1 && (
                <div>
                    <Label>Agregar Imagen</Label>
                    <div className="flex gap-2 mt-1">
                        <Input
                            value={newImageUrl}
                            onChange={(e) => setNewImageUrl(e.target.value)}
                            placeholder="URL de la imagen"
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault()
                                    addImage()
                                }
                            }}
                        />
                        <Button
                            type="button"
                            onClick={addImage}
                            disabled={!newImageUrl.trim()}
                            variant="outline"
                            size="sm"
                        >
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Mensaje de límite */}
            {additionalImages.length >= maxImages - 1 && (
                <p className="text-xs text-gray-500 bg-gray-50 p-2 border border-gray-200">
                    Límite de {maxImages} imágenes alcanzado
                </p>
            )}
        </div>
    )
}
