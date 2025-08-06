"use client"

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, X, Link as LinkIcon } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
    value?: string
    onChange: (url: string) => void
    onClear?: () => void
    className?: string
    label?: string
    placeholder?: string
    suggestedImages?: Array<{ url: string; label: string }>
}

export function ImageUpload({
    value = '',
    onChange,
    onClear,
    className = '',
    label = 'Imagen',
    placeholder = 'https://ejemplo.com/imagen.jpg',
    suggestedImages = []
}: ImageUploadProps) {
    const [imageUrl, setImageUrl] = useState(value)
    const [isValidImage, setIsValidImage] = useState(!!value)
    const [isLoading, setIsLoading] = useState(false)

    const handleUrlChange = useCallback((url: string) => {
        setImageUrl(url)
        setIsLoading(true)

        if (!url) {
            setIsValidImage(false)
            setIsLoading(false)
            onChange('')
            return
        }

        // Validate image URL
        const img = new window.Image()
        img.onload = () => {
            setIsValidImage(true)
            setIsLoading(false)
            onChange(url)
        }
        img.onerror = () => {
            setIsValidImage(false)
            setIsLoading(false)
        }
        img.src = url
    }, [onChange])

    const handleClear = useCallback(() => {
        setImageUrl('')
        setIsValidImage(false)
        onChange('')
        onClear?.()
    }, [onChange, onClear])

    const handleSuggestedImage = useCallback((url: string) => {
        handleUrlChange(url)
    }, [handleUrlChange])

    return (
        <div className={`space-y-4 ${className}`}>
            <div className="space-y-2">
                <Label htmlFor="imageUrl">{label}</Label>

                <div className="space-y-3">
                    {/* URL Input */}
                    <div className="flex space-x-2">
                        <Input
                            id="imageUrl"
                            value={imageUrl}
                            onChange={(e) => handleUrlChange(e.target.value)}
                            placeholder={placeholder}
                            className="flex-1"
                        />
                        {imageUrl && (
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={handleClear}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>

                    {/* Suggested Images */}
                    {suggestedImages.length > 0 && (
                        <div className="space-y-2">
                            <Label className="text-sm text-muted-foreground">
                                Imágenes sugeridas:
                            </Label>
                            <div className="flex flex-wrap gap-2">
                                {suggestedImages.map((img, index) => (
                                    <Button
                                        key={index}
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleSuggestedImage(img.url)}
                                        className="text-xs"
                                    >
                                        <LinkIcon className="h-3 w-3 mr-1" />
                                        {img.label}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Image Preview */}
                    {imageUrl && (
                        <Card className="overflow-hidden">
                            <CardContent className="p-4">
                                {isLoading ? (
                                    <div className="flex items-center justify-center h-32 bg-muted rounded-md">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                            <span className="text-sm text-muted-foreground">
                                                Verificando imagen...
                                            </span>
                                        </div>
                                    </div>
                                ) : isValidImage ? (
                                    <div className="space-y-3">
                                        <div className="relative w-full h-32 rounded-md overflow-hidden bg-muted">
                                            <Image
                                                src={imageUrl}
                                                alt="Preview"
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        </div>
                                        <div className="text-xs text-muted-foreground space-y-1">
                                            <p>✅ Imagen válida</p>
                                            <p className="break-all">{imageUrl}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-32 bg-destructive/10 rounded-md border border-destructive/20">
                                        <div className="text-center space-y-2">
                                            <X className="h-6 w-6 text-destructive mx-auto" />
                                            <div className="text-sm text-destructive">
                                                No se pudo cargar la imagen
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                Verifica que la URL sea correcta y accesible
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Upload hint */}
                    {!imageUrl && (
                        <Card className="border-dashed">
                            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                <div className="text-sm text-muted-foreground space-y-1">
                                    <p>Pega la URL de una imagen</p>
                                    <p className="text-xs">
                                        Soporta JPG, PNG, WebP y otros formatos
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}
