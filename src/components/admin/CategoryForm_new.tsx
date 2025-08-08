"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useCategoryStore } from '@/store/category-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { CustomModal } from '@/components/ui/custom-modal'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import type { Category, CreateCategoryData } from '@/types'

interface CategoryFormProps {
    category?: Category
    onSuccess?: () => void
    trigger?: React.ReactNode
}

export function CategoryForm({ category, onSuccess, trigger }: CategoryFormProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const addCategory = useCategoryStore((state) => state.addCategory)
    const updateCategory = useCategoryStore((state) => state.updateCategory)

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors }
    } = useForm<CreateCategoryData>({
        defaultValues: {
            name: category?.name || '',
            slug: category?.slug || '',
            description: category?.description || null,
            image: category?.image || null,
            sortOrder: category?.sortOrder || 0,
            isActive: category?.isActive ?? true
        }
    })

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remover acentos
            .replace(/[^a-z0-9\s-]/g, '') // Solo letras, números, espacios y guiones
            .replace(/\s+/g, '-') // Espacios a guiones
            .replace(/-+/g, '-') // Múltiples guiones a uno solo
            .trim()
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value
        if (!category) { // Solo generar slug automáticamente para nuevas categorías
            const slug = generateSlug(name)
            setValue('slug', slug)
        }
    }

    const onSubmit = async (data: CreateCategoryData) => {
        try {
            setIsSubmitting(true)

            // Convertir undefined a null para campos opcionales
            const categoryData = {
                ...data,
                description: data.description || null,
                image: data.image || null,
                sortOrder: data.sortOrder ?? 0,
                slug: data.slug || generateSlug(data.name),
                isActive: data.isActive ?? true
            }

            if (category) {
                updateCategory(category.id, categoryData)
            } else {
                addCategory(categoryData)
            }

            reset()
            setIsOpen(false)
            onSuccess?.()
        } catch (error) {
            console.error('Error saving category:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleClose = () => {
        reset()
        setIsOpen(false)
    }

    return (
        <>
            {trigger && (
                <div onClick={() => setIsOpen(true)}>
                    {trigger}
                </div>
            )}

            {!trigger && (
                <Button onClick={() => setIsOpen(true)}>
                    {category ? 'Editar Categoría' : 'Nueva Categoría'}
                </Button>
            )}

            <CustomModal
                isOpen={isOpen}
                onClose={handleClose}
                title={category ? 'Editar Categoría' : 'Crear Nueva Categoría'}
                subtitle={category ? 'Modifica la información de la categoría' : 'Completa los datos para crear una nueva categoría'}
                size="lg"
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
                            form="category-form"
                            disabled={isSubmitting}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Guardando...
                                </div>
                            ) : (
                                category ? 'Actualizar Categoría' : 'Crear Categoría'
                            )}
                        </Button>
                    </div>
                }
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Formulario */}
                    <div className="space-y-6">
                        <form onSubmit={handleSubmit(onSubmit)} id="category-form" className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nombre *</Label>
                                <Input
                                    id="name"
                                    {...register('name', {
                                        required: 'El nombre es requerido',
                                        onChange: handleNameChange
                                    })}
                                    placeholder="Nombre de la categoría"
                                    className="h-11"
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500">{errors.name.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug</Label>
                                <Input
                                    id="slug"
                                    {...register('slug')}
                                    placeholder="slug-de-la-categoria"
                                    className="h-11"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Se genera automáticamente basado en el nombre. Usado en las URLs.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Descripción</Label>
                                <Textarea
                                    id="description"
                                    {...register('description')}
                                    placeholder="Descripción de la categoría"
                                    rows={3}
                                    className="resize-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image">URL de Imagen</Label>
                                <Input
                                    id="image"
                                    {...register('image')}
                                    placeholder="https://ejemplo.com/imagen.jpg"
                                    className="h-11"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="sortOrder">Orden</Label>
                                    <Input
                                        id="sortOrder"
                                        type="number"
                                        {...register('sortOrder', { valueAsNumber: true })}
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
                                        Categoría activa
                                    </Label>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Vista Previa */}
                    <div className="space-y-4">
                        <Label className="text-lg font-semibold">Vista Previa</Label>

                        <Card className="overflow-hidden">
                            <CardContent className="p-0">
                                {watch('image') ? (
                                    <div className="relative aspect-video bg-gray-100">
                                        <Image
                                            src={watch('image') || ''}
                                            alt={watch('name') || 'Categoría'}
                                            fill
                                            className="object-cover"
                                            sizes="50vw"
                                        />
                                    </div>
                                ) : (
                                    <div className="aspect-video bg-gray-100 flex items-center justify-center">
                                        <div className="text-center text-gray-500">
                                            <div className="text-4xl mb-2">📁</div>
                                            <p>Sin imagen</p>
                                        </div>
                                    </div>
                                )}

                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-semibold text-lg">
                                            {watch('name') || 'Nombre de la categoría'}
                                        </h3>
                                        <Badge variant={watch('isActive') ? 'default' : 'secondary'}>
                                            {watch('isActive') ? 'Activa' : 'Inactiva'}
                                        </Badge>
                                    </div>

                                    {watch('description') && (
                                        <p className="text-sm text-muted-foreground mb-2">
                                            {watch('description')}
                                        </p>
                                    )}

                                    <div className="text-xs text-muted-foreground">
                                        <span className="font-medium">Slug:</span> {watch('slug') || 'sin-slug'}
                                    </div>

                                    <div className="text-xs text-muted-foreground">
                                        <span className="font-medium">Orden:</span> {watch('sortOrder') || 0}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </CustomModal>
        </>
    )
}
