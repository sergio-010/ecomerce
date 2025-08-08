"use client"

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useCategoryStore } from '@/store/category-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { CustomModal } from '@/components/ui/custom-modal'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FolderOpen, Tag } from 'lucide-react'
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

    const { categories, addCategory, updateCategory, fetchCategories } = useCategoryStore()

    useEffect(() => {
        if (isOpen && categories.length === 0) {
            fetchCategories()
        }
    }, [isOpen, categories.length, fetchCategories])

    // Filtrar categorías principales (sin parentId) para el selector
    const parentCategories = categories.filter(cat => !cat.parentId && cat.id !== category?.id)

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
            isActive: category?.isActive ?? true,
            parentId: category?.parentId || null
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
                isActive: data.isActive ?? true,
                parentId: data.parentId || null
            }

            if (category) {
                await updateCategory(category.id, categoryData)
            } else {
                await addCategory(categoryData)
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
                                <Label htmlFor="parentId">Tipo de Categoría</Label>
                                <Select
                                    value={watch('parentId') || 'none'}
                                    onValueChange={(value) => {
                                        setValue('parentId', value === 'none' ? null : value)
                                        // Limpiar imagen si es subcategoría
                                        if (value !== 'none') {
                                            setValue('image', null)
                                        }
                                    }}
                                >
                                    <SelectTrigger className="h-11">
                                        <SelectValue placeholder="Selecciona el tipo de categoría" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">
                                            <div className="flex items-center gap-2">
                                                <FolderOpen className="h-4 w-4 text-blue-600" />
                                                <div>
                                                    <div className="font-medium">Categoría Principal</div>
                                                    <div className="text-xs text-muted-foreground">Aparece en navbar y página principal</div>
                                                </div>
                                            </div>
                                        </SelectItem>
                                        {parentCategories.map((parentCat) => (
                                            <SelectItem key={parentCat.id} value={parentCat.id}>
                                                <div className="flex items-center gap-2">
                                                    <Tag className="h-4 w-4 text-green-600" />
                                                    <div>
                                                        <div className="font-medium">Subcategoría de: {parentCat.name}</div>
                                                        <div className="text-xs text-muted-foreground">Funciona como filtro</div>
                                                    </div>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {!watch('parentId') ? (
                                    <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded border">
                                        <div className="flex items-center gap-1 font-medium mb-1">
                                            <FolderOpen className="h-3 w-3" />
                                            Categoría Principal
                                        </div>
                                        <div>• Aparece en el navbar de tu tienda</div>
                                        <div>• Se muestra en la página principal</div>
                                        <div>• Organiza tus productos por tema general</div>
                                    </div>
                                ) : (
                                    <div className="text-xs text-green-600 bg-green-50 p-2 rounded border">
                                        <div className="flex items-center gap-1 font-medium mb-1">
                                            <Tag className="h-3 w-3" />
                                            Subcategoría / Filtro
                                        </div>
                                        <div>• Funciona como filtro dentro de la categoría principal</div>
                                        <div>• Ayuda a organizar productos específicos</div>
                                        <div>• Mejora la experiencia de búsqueda</div>
                                    </div>
                                )}
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

                            {/* Campo de imagen solo para categorías principales */}
                            {!watch('parentId') && (
                                <div className="space-y-2">
                                    <Label htmlFor="image">URL de Imagen</Label>
                                    <Input
                                        id="image"
                                        {...register('image')}
                                        placeholder="https://ejemplo.com/imagen.jpg"
                                        className="h-11"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Las categorías principales necesitan imagen para mostrarse en el navbar
                                    </p>
                                </div>
                            )}

                            {watch('parentId') && (
                                <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                                    <div className="flex items-center gap-2 text-green-700 text-sm font-medium mb-1">
                                        <Tag className="h-4 w-4" />
                                        Subcategoría (Filtro)
                                    </div>
                                    <p className="text-xs text-green-600">
                                        Las subcategorías no necesitan imagen ya que funcionan como filtros
                                    </p>
                                </div>
                            )}

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
                                {!watch('parentId') ? (
                                    // Vista previa para categoría principal
                                    <>
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
                                            <div className="aspect-video bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                                                <div className="text-center text-blue-500">
                                                    <FolderOpen className="h-12 w-12 mx-auto mb-2" />
                                                    <p className="text-sm font-medium">Categoría Principal</p>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    // Vista previa para subcategoría (filtro)
                                    <div className="aspect-video bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                                        <div className="text-center text-green-600">
                                            <Tag className="h-12 w-12 mx-auto mb-2" />
                                            <p className="text-sm font-medium">Filtro</p>
                                            <p className="text-xs">No necesita imagen</p>
                                        </div>
                                    </div>
                                )}

                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-semibold text-lg">
                                            {watch('name') || 'Nombre de la categoría'}
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <Badge variant={watch('isActive') ? 'default' : 'secondary'}>
                                                {watch('isActive') ? 'Activa' : 'Inactiva'}
                                            </Badge>
                                            {watch('parentId') && (
                                                <Badge variant="outline" className="text-green-600 border-green-300">
                                                    Filtro
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    {watch('description') && (
                                        <p className="text-sm text-muted-foreground mb-2">
                                            {watch('description')}
                                        </p>
                                    )}

                                    <div className="text-xs text-muted-foreground space-y-1">
                                        <div>
                                            <span className="font-medium">Slug:</span> {watch('slug') || 'sin-slug'}
                                        </div>
                                        <div>
                                            <span className="font-medium">Orden:</span> {watch('sortOrder') || 0}
                                        </div>
                                        {watch('parentId') && (
                                            <div className="text-green-600">
                                                <span className="font-medium">Tipo:</span> Subcategoría (Filtro)
                                            </div>
                                        )}
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
