"use client"

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useCategoryStore } from '@/store/category-store'
import { useProductStore } from '@/store/product-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CustomModal } from '@/components/ui/custom-modal'
import { MultipleImageUpload } from '@/components/ui/multiple-image-upload'
import type { Product, CreateProductData } from '@/types'

interface ProductFormProps {
    product?: Product
    onSuccess?: () => void
    trigger?: React.ReactNode
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export function ProductForm({ product, onSuccess, trigger, open, onOpenChange }: ProductFormProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState('')
    const [hasPromotion, setHasPromotion] = useState(false)
    const [additionalImages, setAdditionalImages] = useState<string[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    const dialogOpen = open !== undefined ? open : isOpen
    const setDialogOpen = onOpenChange || setIsOpen

    const { categories } = useCategoryStore()
    const { addProduct, updateProduct } = useProductStore()

    // Solo categorías activas para el formulario
    const activeCategories = categories.filter(cat => cat.isActive)

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch
    } = useForm<CreateProductData>({
        defaultValues: {
            name: '',
            description: '',
            price: 0,
            image: '',
            categoryId: '',
            inStock: true,
            quantity: 0,
            freeShipping: false,
            hasPromotion: false,
            promotionPercentage: 0
        }
    })

    const price = watch('price')
    const promotionPercentage = watch('promotionPercentage')
    const mainImage = watch('image')

    // Update form values when product changes
    useEffect(() => {
        if (product) {
            setSelectedCategory(product.categoryId || '')
            setHasPromotion(product.hasPromotion || false)
            setAdditionalImages(product.images || [])
            reset({
                name: product.name,
                description: product.description,
                price: product.price,
                image: product.image,
                categoryId: product.categoryId || '',
                inStock: product.inStock,
                quantity: product.quantity || 0,
                freeShipping: product.freeShipping || false,
                hasPromotion: product.hasPromotion || false,
                promotionPercentage: product.promotionPercentage || 0,
                promotionStartDate: product.promotionStartDate ? new Date(product.promotionStartDate) : undefined,
                promotionEndDate: product.promotionEndDate ? new Date(product.promotionEndDate) : undefined
            })
        } else {
            reset({
                name: '',
                description: '',
                price: 0,
                image: '',
                categoryId: '',
                inStock: true,
                quantity: 0,
                freeShipping: false,
                hasPromotion: false,
                promotionPercentage: 0
            })
            setSelectedCategory('')
            setHasPromotion(false)
            setAdditionalImages([])
        }
    }, [product, reset])

    const getCategoryDisplayName = (categoryId: string) => {
        const category = categories.find(cat => cat.id === categoryId)
        if (!category) return ''

        if (category.parentId) {
            const parentCategory = categories.find(cat => cat.id === category.parentId)
            return parentCategory ? `${parentCategory.name} > ${category.name}` : category.name
        }

        return category.name
    }

    const calculateDiscountedPrice = () => {
        if (!price || !promotionPercentage) return price || 0
        return price - (price * promotionPercentage / 100)
    }

    const onSubmit = async (data: CreateProductData) => {
        try {
            setIsSubmitting(true)

            const productData = {
                ...data,
                images: additionalImages,
                categoryId: selectedCategory
            }

            if (product) {
                updateProduct(product.id, productData)
            } else {
                addProduct(productData)
            }

            reset()
            setSelectedCategory('')
            setHasPromotion(false)
            setAdditionalImages([])
            setDialogOpen(false)
            onSuccess?.()
        } catch (error) {
            console.error('Error saving product:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleClose = () => {
        reset()
        setSelectedCategory('')
        setHasPromotion(false)
        setAdditionalImages([])
        setDialogOpen(false)
    }

    return (
        <>
            {trigger && (
                <div onClick={() => setDialogOpen(true)}>
                    {trigger}
                </div>
            )}

            {!trigger && (
                <Button onClick={() => setDialogOpen(true)}>
                    {product ? 'Editar Producto' : 'Nuevo Producto'}
                </Button>
            )}

            <CustomModal
                isOpen={dialogOpen}
                onClose={handleClose}
                title={product ? 'Editar Producto' : 'Crear Nuevo Producto'}
                subtitle={product ? 'Modifica la información del producto' : 'Completa los datos para agregar un nuevo producto'}
                size="full"
                footer={
                    <div className="flex justify-end space-x-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="px-8 h-12 text-base"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="button"
                            onClick={handleSubmit(onSubmit)}
                            disabled={isSubmitting}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-12 h-12 text-base font-semibold"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Guardando...
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    {product ? 'Guardar Cambios' : 'Crear Producto'}
                                </div>
                            )}
                        </Button>
                    </div>
                }
            >
                <form onSubmit={handleSubmit(onSubmit)} id="product-form">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                        {/* Información básica */}
                        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                                <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
                                Información Básica
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <Label htmlFor="name" className="text-base font-medium text-gray-700 mb-3 block">
                                        Nombre del Producto *
                                    </Label>
                                    <Input
                                        id="name"
                                        {...register('name', {
                                            required: 'El nombre es obligatorio',
                                            minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                                        })}
                                        placeholder="Ej: iPhone 15 Pro"
                                        className="w-full h-12 text-base"
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-600 mt-2">{errors.name.message}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="description" className="text-base font-medium text-gray-700 mb-3 block">
                                        Descripción *
                                    </Label>
                                    <Textarea
                                        id="description"
                                        {...register('description', {
                                            required: 'La descripción es obligatoria',
                                            minLength: { value: 10, message: 'Mínimo 10 caracteres' }
                                        })}
                                        placeholder="Describe las características del producto..."
                                        rows={5}
                                        className="w-full text-base resize-none"
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-red-600 mt-2">{errors.description.message}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="categoryId" className="text-base font-medium text-gray-700 mb-3 block">
                                        Categoría *
                                    </Label>
                                    <Select
                                        value={selectedCategory}
                                        onValueChange={(value) => {
                                            setSelectedCategory(value)
                                            setValue('categoryId', value)
                                        }}
                                    >
                                        <SelectTrigger className="w-full h-12 text-base">
                                            <SelectValue placeholder="Selecciona una categoría" />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-64">
                                            {activeCategories.map((category) => {
                                                // Si es una categoría padre (no tiene parentId)
                                                if (!category.parentId) {
                                                    // Obtener subcategorías de esta categoría padre
                                                    const subcategories = activeCategories.filter(
                                                        sub => sub.parentId === category.id
                                                    )

                                                    return (
                                                        <React.Fragment key={category.id}>
                                                            {/* Categoría padre */}
                                                            <SelectItem value={category.id} className="font-semibold text-blue-600">
                                                                📁 {category.name}
                                                            </SelectItem>

                                                            {/* Subcategorías */}
                                                            {subcategories.map((subcategory) => (
                                                                <SelectItem
                                                                    key={subcategory.id}
                                                                    value={subcategory.id}
                                                                    className="pl-6 text-gray-700"
                                                                >
                                                                    ↳ {subcategory.name}
                                                                </SelectItem>
                                                            ))}
                                                        </React.Fragment>
                                                    )
                                                }
                                                return null
                                            })}

                                            {/* Mostrar categorías huérfanas (sin padre definido) */}
                                            {activeCategories
                                                .filter(cat => cat.parentId && !activeCategories.find(parent => parent.id === cat.parentId))
                                                .map((category) => (
                                                    <SelectItem key={category.id} value={category.id}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                    <Input
                                        type="hidden"
                                        {...register('categoryId', {
                                            required: 'La categoría es obligatoria'
                                        })}
                                        value={selectedCategory}
                                    />
                                    {errors.categoryId && (
                                        <p className="text-sm text-red-600 mt-1 flex items-center">
                                            <span className="mr-1">⚠️</span>
                                            {errors.categoryId.message}
                                        </p>
                                    )}

                                    {/* Ayuda visual */}
                                    <p className="text-xs text-gray-500 mt-1">
                                        📁 = Categoría principal • ↳ = Subcategoría
                                    </p>

                                    {/* Mostrar categoría seleccionada */}
                                    {selectedCategory && (
                                        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                                            <p className="text-sm text-blue-700">
                                                <strong>Seleccionado:</strong> {getCategoryDisplayName(selectedCategory)}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <MultipleImageUpload
                                        mainImage={mainImage}
                                        additionalImages={additionalImages}
                                        onMainImageChange={(url) => {
                                            setValue('image', url, { shouldValidate: true })
                                        }}
                                        onAdditionalImagesChange={setAdditionalImages}
                                        maxImages={4}
                                    />
                                    {/* Campo oculto para validación */}
                                    <input
                                        type="hidden"
                                        {...register('image', {
                                            required: 'La imagen principal es obligatoria'
                                        })}
                                    />
                                    {errors.image && (
                                        <p className="text-sm text-red-600 mt-1 flex items-center">
                                            <span className="mr-1">⚠️</span>
                                            {errors.image.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Precios y stock */}
                        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                                <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                                Precios y Stock
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <Label htmlFor="price" className="text-sm font-medium text-gray-700 mb-2 block">
                                        Precio Base *
                                    </Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                        <Input
                                            id="price"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            {...register('price', {
                                                required: 'El precio es obligatorio',
                                                min: { value: 0.01, message: 'El precio debe ser mayor a 0' },
                                                valueAsNumber: true
                                            })}
                                            placeholder="0.00"
                                            className="pl-8 w-full"
                                        />
                                    </div>
                                    {errors.price && (
                                        <p className="text-sm text-red-600 mt-1">{errors.price.message}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="quantity" className="text-sm font-medium text-gray-700 mb-2 block">
                                        Cantidad en Stock *
                                    </Label>
                                    <Input
                                        id="quantity"
                                        type="number"
                                        min="0"
                                        {...register('quantity', {
                                            required: 'La cantidad es obligatoria',
                                            min: { value: 0, message: 'La cantidad no puede ser negativa' },
                                            valueAsNumber: true
                                        })}
                                        placeholder="0"
                                        className="w-full"
                                    />
                                    {errors.quantity && (
                                        <p className="text-sm text-red-600 mt-1">{errors.quantity.message}</p>
                                    )}
                                </div>

                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="inStock"
                                        {...register('inStock')}
                                        className="h-4 w-4"
                                    />
                                    <Label htmlFor="inStock">Producto disponible</Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="freeShipping"
                                        {...register('freeShipping')}
                                        className="h-4 w-4"
                                    />
                                    <Label htmlFor="freeShipping">Envío gratis</Label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sección de promociones */}
                    <div className="mt-10 bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                            <span className="w-3 h-3 bg-purple-500 rounded-full mr-3"></span>
                            Promociones
                        </h3>

                        <div className="flex items-center space-x-3 mb-8">
                            <input
                                type="checkbox"
                                id="hasPromotion"
                                checked={hasPromotion}
                                onChange={(e) => {
                                    setHasPromotion(e.target.checked)
                                    setValue('hasPromotion', e.target.checked)
                                    if (!e.target.checked) {
                                        setValue('promotionPercentage', 0)
                                        setValue('promotionStartDate', undefined)
                                        setValue('promotionEndDate', undefined)
                                    }
                                }}
                                className="h-5 w-5 text-purple-600"
                            />
                            <Label htmlFor="hasPromotion" className="text-base font-medium text-gray-700">
                                Este producto tiene promoción
                            </Label>
                        </div>

                        {hasPromotion && (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8 bg-purple-50 rounded-xl border border-purple-200">
                                <div>
                                    <Label htmlFor="promotionPercentage" className="text-base font-medium text-gray-700 mb-3 block">
                                        Porcentaje de Descuento (%)
                                    </Label>
                                    <Input
                                        id="promotionPercentage"
                                        type="number"
                                        min="1"
                                        max="99"
                                        {...register('promotionPercentage', {
                                            min: { value: 1, message: 'Mínimo 1%' },
                                            max: { value: 99, message: 'Máximo 99%' },
                                            valueAsNumber: true
                                        })}
                                        placeholder="0"
                                        className="h-12 text-base w-full"
                                    />
                                    {errors.promotionPercentage && (
                                        <p className="text-sm text-red-600 mt-2">{errors.promotionPercentage.message}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="promotionStartDate" className="text-base font-medium text-gray-700 mb-3 block">
                                        Fecha de Inicio
                                    </Label>
                                    <Input
                                        id="promotionStartDate"
                                        type="date"
                                        {...register('promotionStartDate', {
                                            valueAsDate: true
                                        })}
                                        className="h-12 text-base w-full"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="promotionEndDate" className="text-base font-medium text-gray-700 mb-3 block">
                                        Fecha de Fin
                                    </Label>
                                    <Input
                                        id="promotionEndDate"
                                        type="date"
                                        {...register('promotionEndDate', {
                                            valueAsDate: true
                                        })}
                                        className="h-12 text-base w-full"
                                    />
                                </div>

                                {hasPromotion && promotionPercentage && promotionPercentage > 0 && (
                                    <div className="md:col-span-3 p-4 bg-blue-50 rounded border border-blue-200">
                                        <p className="text-sm text-blue-700">
                                            <span className="font-semibold">Precio con descuento: </span>
                                            ${calculateDiscountedPrice().toFixed(2)}
                                            <span className="text-gray-500 ml-2">(Precio original: ${price?.toFixed(2)})</span>
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </form>
            </CustomModal>
        </>
    )
}
