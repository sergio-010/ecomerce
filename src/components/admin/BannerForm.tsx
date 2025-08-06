"use client"

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useBannerStore } from '@/store/banner-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { X } from 'lucide-react'
import type { Banner, CreateBannerData } from '@/types'

interface BannerFormProps {
    banner?: Banner
    onSuccess?: () => void
    trigger?: React.ReactNode
}

export function BannerForm({ banner, onSuccess, trigger }: BannerFormProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [imagePreview, setImagePreview] = useState(banner?.imageUrl || '')
    const { addBanner, updateBanner } = useBannerStore()

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<CreateBannerData>({
        defaultValues: banner ? {
            title: banner.title,
            subtitle: banner.subtitle || '',
            imageUrl: banner.imageUrl,
            link: banner.link || '',
            backgroundColor: banner.backgroundColor || '#3b82f6',
            textColor: banner.textColor || '#ffffff',
            isActive: banner.isActive,
            order: banner.order
        } : {
            title: '',
            subtitle: '',
            imageUrl: '',
            link: '',
            backgroundColor: '#3b82f6',
            textColor: '#ffffff',
            isActive: true,
            order: 1
        }
    })

    const watchImageUrl = watch('imageUrl')
    const watchTitle = watch('title')
    const watchSubtitle = watch('subtitle')
    const watchBackgroundColor = watch('backgroundColor')
    const watchTextColor = watch('textColor')

    // Update preview when imageUrl changes
    useEffect(() => {
        setImagePreview(watchImageUrl || '')
    }, [watchImageUrl])

    const onSubmit = (data: CreateBannerData) => {
        try {
            if (banner) {
                updateBanner(banner.id, data)
            } else {
                addBanner(data)
            }

            reset()
            setImagePreview('')
            setIsOpen(false)
            onSuccess?.()
        } catch (error) {
            console.error('Error saving banner:', error)
        }
    }

    const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value
        setValue('imageUrl', url)
        setImagePreview(url)
    }

    const clearImage = () => {
        setValue('imageUrl', '')
        setImagePreview('')
    }

    // Suggested image URLs for demo
    const suggestedImages = [
        {
            url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=500&fit=crop',
            label: 'Tienda moderna'
        },
        {
            url: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&h=500&fit=crop',
            label: 'Productos fashion'
        },
        {
            url: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&h=500&fit=crop',
            label: 'Electrónicos'
        }
    ]

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button>
                        {banner ? 'Editar Banner' : 'Nuevo Banner'}
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {banner ? 'Editar Banner' : 'Crear Nuevo Banner'}
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Título *</Label>
                                <Input
                                    id="title"
                                    {...register('title', { required: 'El título es requerido' })}
                                    placeholder="Título del banner"
                                />
                                {errors.title && (
                                    <p className="text-sm text-red-500">{errors.title.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="order">Orden</Label>
                                <Input
                                    id="order"
                                    type="number"
                                    {...register('order', { valueAsNumber: true })}
                                    placeholder="1"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="subtitle">Subtítulo</Label>
                            <Textarea
                                id="subtitle"
                                {...register('subtitle')}
                                placeholder="Subtítulo opcional del banner"
                                rows={2}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="imageUrl">URL de Imagen</Label>
                            <div className="space-y-2">
                                <div className="flex space-x-2">
                                    <Input
                                        id="imageUrl"
                                        {...register('imageUrl')}
                                        onChange={handleImageUrlChange}
                                        placeholder="https://ejemplo.com/imagen.jpg"
                                        className="flex-1"
                                    />
                                    {imagePreview && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={clearImage}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>

                                {/* Suggested Images */}
                                <div className="space-y-2">
                                    <Label className="text-sm text-muted-foreground">Imágenes sugeridas:</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {suggestedImages.map((img, index) => (
                                            <Button
                                                key={index}
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setValue('imageUrl', img.url)
                                                    setImagePreview(img.url)
                                                }}
                                                className="text-xs"
                                            >
                                                {img.label}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="link">Enlace (opcional)</Label>
                            <Input
                                id="link"
                                {...register('link')}
                                placeholder="/categoria/ofertas"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="backgroundColor">Color de Fondo</Label>
                                <div className="flex space-x-2">
                                    <Input
                                        id="backgroundColor"
                                        type="color"
                                        {...register('backgroundColor')}
                                        className="w-16 h-10 p-1 border rounded"
                                    />
                                    <Input
                                        {...register('backgroundColor')}
                                        placeholder="#3b82f6"
                                        className="flex-1"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="textColor">Color de Texto</Label>
                                <div className="flex space-x-2">
                                    <Input
                                        id="textColor"
                                        type="color"
                                        {...register('textColor')}
                                        className="w-16 h-10 p-1 border rounded"
                                    />
                                    <Input
                                        {...register('textColor')}
                                        placeholder="#ffffff"
                                        className="flex-1"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                id="isActive"
                                type="checkbox"
                                {...register('isActive')}
                                className="h-4 w-4 rounded border-gray-300"
                            />
                            <Label htmlFor="isActive">Banner activo</Label>
                        </div>

                        <div className="flex justify-end space-x-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsOpen(false)}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Guardando...' : (banner ? 'Actualizar' : 'Crear')}
                            </Button>
                        </div>
                    </form>

                    {/* Preview */}
                    <div className="space-y-4">
                        <div>
                            <Label className="text-sm font-medium">Vista Previa</Label>
                            <p className="text-sm text-muted-foreground">
                                Así se verá tu banner en la página principal
                            </p>
                        </div>

                        <Card className="overflow-hidden">
                            <div
                                className="relative h-48 flex items-center justify-center text-center"
                                style={{
                                    backgroundColor: watchBackgroundColor || '#3b82f6',
                                    color: watchTextColor || '#ffffff'
                                }}
                            >
                                {/* Background Image Preview */}
                                {imagePreview && (
                                    <div className="absolute inset-0">
                                        <Image
                                            src={imagePreview}
                                            alt="Preview"
                                            fill
                                            className="object-cover"
                                            onError={() => setImagePreview('')}
                                        />
                                        <div className="absolute inset-0 bg-black/30" />
                                    </div>
                                )}

                                {/* Content Preview */}
                                <div className="relative z-10 px-4">
                                    <h3 className="text-lg font-bold mb-2 drop-shadow-lg">
                                        {watchTitle || 'Título del banner'}
                                    </h3>
                                    {watchSubtitle && (
                                        <p className="text-sm opacity-90 drop-shadow-md mb-3">
                                            {watchSubtitle}
                                        </p>
                                    )}
                                    <Badge variant="secondary" className="text-xs">
                                        Vista previa
                                    </Badge>
                                </div>
                            </div>
                        </Card>

                        {/* Image info */}
                        {imagePreview && (
                            <Card>
                                <CardContent className="p-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Información de imagen</Label>
                                        <p className="text-xs text-muted-foreground break-all">
                                            {imagePreview}
                                        </p>
                                        <div className="text-xs text-muted-foreground">
                                            💡 La imagen se optimizará automáticamente para diferentes tamaños de pantalla
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
