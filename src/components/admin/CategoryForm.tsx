"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useCategoryStore } from '@/store/category-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CustomModal } from '@/components/ui/custom-modal'
import type { Category, CreateCategoryData } from '@/types'

interface CategoryFormProps {
    category?: Category
    onSuccess?: () => void
    trigger?: React.ReactNode
}

export function CategoryForm({ category, onSuccess, trigger }: CategoryFormProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedParent, setSelectedParent] = useState<string>(category?.parentId || 'none')
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Optimizar selectores para evitar bucles infinitos
    const categories = useCategoryStore((state) => state.categories)
    const addCategory = useCategoryStore((state) => state.addCategory)
    const updateCategory = useCategoryStore((state) => state.updateCategory)

    // Calcular categorías padre en el componente en lugar de usar getter del store
    const parentCategories = categories.filter(cat => !cat.parentId)

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors }
    } = useForm<CreateCategoryData>({
        defaultValues: {
            name: category?.name || '',
            slug: category?.slug || '',
            description: category?.description || '',
            imageUrl: category?.imageUrl || '',
            parentId: category?.parentId || undefined,
            order: category?.order || 0,
            isActive: category?.isActive ?? true
        }
    })

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
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

            const categoryData = {
                ...data,
                parentId: selectedParent === 'none' ? undefined : selectedParent
            }

            if (category) {
                updateCategory(category.id, categoryData)
            } else {
                addCategory(categoryData)
            }

            reset()
            setSelectedParent('none')
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
        setSelectedParent('none')
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
                                category ? 'Actualizar' : 'Crear'
                            )}
                        </Button>
                    </div>
                }
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" id="category-form">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                                Nombre *
                            </Label>
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

                        <div className="space-y-3">
                            <Label htmlFor="slug" className="text-sm font-medium text-gray-700">
                                Slug *
                            </Label>
                            <Input
                                id="slug"
                                {...register('slug', { required: 'El slug es requerido' })}
                                placeholder="slug-de-categoria"
                                className="h-11"
                            />
                            {errors.slug && (
                                <p className="text-sm text-red-500">{errors.slug.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                            Descripción
                        </Label>
                        <Textarea
                            id="description"
                            {...register('description')}
                            placeholder="Descripción de la categoría"
                            rows={4}
                            className="resize-none"
                        />
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="imageUrl" className="text-sm font-medium text-gray-700">
                            URL de Imagen
                        </Label>
                        <Input
                            id="imageUrl"
                            {...register('imageUrl')}
                            placeholder="https://ejemplo.com/imagen.jpg"
                            className="h-11"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <Label htmlFor="parentId" className="text-sm font-medium text-gray-700">
                                Categoría Padre
                            </Label>
                            <Select value={selectedParent} onValueChange={setSelectedParent}>
                                <SelectTrigger className="h-11">
                                    <SelectValue placeholder="Seleccionar categoría padre (opcional)" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Sin categoría padre</SelectItem>
                                    {parentCategories.map((parent) => (
                                        <SelectItem key={parent.id} value={parent.id}>
                                            {parent.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="order" className="text-sm font-medium text-gray-700">
                                Orden
                            </Label>
                            <Input
                                id="order"
                                type="number"
                                {...register('order', { valueAsNumber: true })}
                                placeholder="1"
                                className="h-11"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
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
                </form>
            </CustomModal>
        </>
    )
}
