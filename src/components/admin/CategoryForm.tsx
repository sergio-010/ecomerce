"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useCategoryStore } from '@/store/category-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import type { Category, CreateCategoryData } from '@/types'

interface CategoryFormProps {
    category?: Category
    onSuccess?: () => void
    trigger?: React.ReactNode
}

export function CategoryForm({ category, onSuccess, trigger }: CategoryFormProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedParent, setSelectedParent] = useState<string>(category?.parentId || '')
    const { addCategory, updateCategory, getParentCategories } = useCategoryStore()
    const parentCategories = getParentCategories()

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<CreateCategoryData>({
        defaultValues: category ? {
            name: category.name,
            slug: category.slug,
            description: category.description || '',
            imageUrl: category.imageUrl || '',
            isActive: category.isActive,
            order: category.order,
            parentId: category.parentId || ''
        } : {
            name: '',
            slug: '',
            description: '',
            imageUrl: '',
            isActive: true,
            order: 1,
            parentId: ''
        }
    })

    // Auto-generate slug when name changes
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value
        if (!category) { // Only auto-generate for new categories
            const slug = name
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim()
            setValue('slug', slug)
        }
    }

    const onSubmit = (data: CreateCategoryData) => {
        try {
            const categoryData = {
                ...data,
                parentId: selectedParent || undefined
            }

            if (category) {
                updateCategory(category.id, categoryData)
            } else {
                addCategory(categoryData)
            }

            reset()
            setSelectedParent('')
            setIsOpen(false)
            onSuccess?.()
        } catch (error) {
            console.error('Error saving category:', error)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button>
                        {category ? 'Editar Categoría' : 'Nueva Categoría'}
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {category ? 'Editar Categoría' : 'Crear Nueva Categoría'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre *</Label>
                            <Input
                                id="name"
                                {...register('name', {
                                    required: 'El nombre es requerido',
                                    onChange: handleNameChange
                                })}
                                placeholder="Nombre de la categoría"
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500">{errors.name.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug *</Label>
                            <Input
                                id="slug"
                                {...register('slug', { required: 'El slug es requerido' })}
                                placeholder="slug-de-categoria"
                            />
                            {errors.slug && (
                                <p className="text-sm text-red-500">{errors.slug.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Descripción</Label>
                        <Textarea
                            id="description"
                            {...register('description')}
                            placeholder="Descripción de la categoría"
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="imageUrl">URL de Imagen</Label>
                        <Input
                            id="imageUrl"
                            {...register('imageUrl')}
                            placeholder="https://ejemplo.com/imagen.jpg"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="parentId">Categoría Padre</Label>
                            <Select value={selectedParent} onValueChange={setSelectedParent}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar categoría padre (opcional)" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">Sin categoría padre</SelectItem>
                                    {parentCategories.map((parent) => (
                                        <SelectItem key={parent.id} value={parent.id}>
                                            {parent.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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

                    <div className="flex items-center space-x-2">
                        <input
                            id="isActive"
                            type="checkbox"
                            {...register('isActive')}
                            className="h-4 w-4 rounded border-gray-300"
                        />
                        <Label htmlFor="isActive">Categoría activa</Label>
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
                            {isSubmitting ? 'Guardando...' : (category ? 'Actualizar' : 'Crear')}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
