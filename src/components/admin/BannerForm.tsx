"use client"

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useBannerStore } from '@/store/banner-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { CustomModal } from '@/components/ui/custom-modal'
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
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { addBanner, updateBanner } = useBannerStore()

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors }
    } = useForm<CreateBannerData>({
        defaultValues: {
            title: banner?.title || '',
            subtitle: banner?.subtitle || '',
            description: banner?.description || '',
            imageUrl: banner?.imageUrl || '',
            linkUrl: banner?.linkUrl || '',
            buttonText: banner?.buttonText || '',
            isActive: banner?.isActive ?? true,
            order: banner?.order || 0
        }
    })

    const imageUrl = watch('imageUrl')

    useEffect(() => {
        if (imageUrl) {
            setImagePreview(imageUrl)
        }
    }, [imageUrl])

    useEffect(() => {
        if (banner) {
            reset({
                title: banner.title,
                subtitle: banner.subtitle || '',
                description: banner.description || '',
                imageUrl: banner.imageUrl,
                linkUrl: banner.linkUrl || '',
                buttonText: banner.buttonText || '',
                isActive: banner.isActive,
                order: banner.order || 0
            })
            setImagePreview(banner.imageUrl)
        }
    }, [banner, reset])

    const onSubmit = async (data: CreateBannerData) => {
        try {
            setIsSubmitting(true)

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
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleClose = () => {
        reset()
        setImagePreview('')
        setIsOpen(false)
    }

    const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value
        setValue('imageUrl', url)
        setImagePreview(url)
    }

    const removeImage = () => {
        setValue('imageUrl', '')
        setImagePreview('')
    }

    const presetImages = [
        {
            url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop',
            title: 'Tienda Moderna'
        },
        {
            url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop',
            title: 'Productos Electrónicos'
        },
        {
            url: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=400&fit=crop',
            title: 'Ropa y Moda'
        }
    ]

    return (
        <>
            {trigger && (
                <div onClick={() => setIsOpen(true)}>
                    {trigger}
                </div>
            )}

            {!trigger && (
                <Button onClick={() => setIsOpen(true)}>
                    {banner ? 'Editar Banner' : 'Nuevo Banner'}
                </Button>
            )}

            <CustomModal
                isOpen={isOpen}
                onClose={handleClose}
                title={banner ? 'Editar Banner' : 'Crear Nuevo Banner'}
                subtitle={banner ? 'Modifica la información del banner' : 'Completa los datos para crear un nuevo banner'}
                size="xl"
                footer={
                    <div className="flex justify-end space-x-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            form="banner-form"
                            disabled={isSubmitting}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Guardando...
                                </div>
                            ) : (
                                banner ? 'Actualizar Banner' : 'Crear Banner'
                            )}
                        </Button>
                    </div>
                }
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Formulario */}
                    <div className="space-y-6">
                        <form onSubmit={handleSubmit(onSubmit)} id="banner-form" className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Título *</Label>
                                    <Input
                                        id="title"
                                        {...register('title', { required: 'El título es requerido' })}
                                        placeholder="Título del banner"
                                        className="h-11"
                                    />
                                    {errors.title && (
                                        <p className="text-sm text-red-500">{errors.title.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="subtitle">Subtítulo</Label>
                                    <Input
                                        id="subtitle"
                                        {...register('subtitle')}
                                        placeholder="Subtítulo opcional"
                                        className="h-11"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Descripción</Label>
                                <Textarea
                                    id="description"
                                    {...register('description')}
                                    placeholder="Descripción del banner"
                                    rows={3}
                                    className="resize-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="imageUrl">URL de Imagen *</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="imageUrl"
                                        {...register('imageUrl', {
                                            required: 'La imagen es requerida',
                                            onChange: handleImageUrlChange
                                        })}
                                        placeholder="https://ejemplo.com/imagen.jpg"
                                        className="h-11"
                                    />
                                    {imagePreview && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={removeImage}
                                            className="h-11 px-3"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                                {errors.imageUrl && (
                                    <p className="text-sm text-red-500">{errors.imageUrl.message}</p>
                                )}

                                {/* Imágenes predefinidas */}
                                <div className="space-y-2">
                                    <Label className="text-xs text-gray-600">Imágenes sugeridas:</Label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {presetImages.map((preset, index) => (
                                            <div
                                                key={index}
                                                className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                                                onClick={() => {
                                                    setValue('imageUrl', preset.url)
                                                    setImagePreview(preset.url)
                                                }}
                                            >
                                                <Image
                                                    src={preset.url}
                                                    alt={preset.title}
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 768px) 33vw, 25vw"
                                                />
                                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                                    <p className="text-white text-xs font-medium text-center">
                                                        {preset.title}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="linkUrl">URL de Enlace</Label>
                                    <Input
                                        id="linkUrl"
                                        {...register('linkUrl')}
                                        placeholder="https://ejemplo.com"
                                        className="h-11"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="buttonText">Texto del Botón</Label>
                                    <Input
                                        id="buttonText"
                                        {...register('buttonText')}
                                        placeholder="Ver más"
                                        className="h-11"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="order">Orden</Label>
                                    <Input
                                        id="order"
                                        type="number"
                                        {...register('order', { valueAsNumber: true })}
                                        placeholder="0"
                                        className="h-11"
                                    />
                                </div>

                                <div className="flex items-center space-x-2 pt-8">
                                    <input
                                        id="isActive"
                                        type="checkbox"
                                        {...register('isActive')}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <Label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                                        Banner activo
                                    </Label>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Vista Previa */}
                    <div className="space-y-4">
                        <Label className="text-lg font-semibold">Vista Previa</Label>

                        {imagePreview ? (
                            <Card className="overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="relative aspect-[2/1] bg-gray-100">
                                        <Image
                                            src={imagePreview}
                                            alt="Preview"
                                            fill
                                            className="object-cover"
                                            sizes="50vw"
                                        />

                                        {/* Overlay del contenido */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
                                            <div className="p-8 text-white max-w-lg">
                                                {watch('title') && (
                                                    <h2 className="text-3xl font-bold mb-2">
                                                        {watch('title')}
                                                    </h2>
                                                )}

                                                {watch('subtitle') && (
                                                    <h3 className="text-xl mb-4 opacity-90">
                                                        {watch('subtitle')}
                                                    </h3>
                                                )}

                                                {watch('description') && (
                                                    <p className="text-sm mb-6 opacity-80 line-clamp-3">
                                                        {watch('description')}
                                                    </p>
                                                )}

                                                {watch('buttonText') && (
                                                    <Button variant="secondary" size="lg">
                                                        {watch('buttonText')}
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Badge de estado */}
                                        <div className="absolute top-4 right-4">
                                            <Badge variant={watch('isActive') ? 'default' : 'secondary'}>
                                                {watch('isActive') ? 'Activo' : 'Inactivo'}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-gray-50">
                                        <div className="text-xs text-muted-foreground">
                                            💡 La imagen se optimizará automáticamente para diferentes tamaños de pantalla
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="border-dashed">
                                <CardContent className="flex items-center justify-center h-64">
                                    <div className="text-center text-gray-500">
                                        <div className="text-4xl mb-2">🖼️</div>
                                        <p>Agrega una URL de imagen para ver la vista previa</p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </CustomModal>
        </>
    )
}
