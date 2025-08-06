"use client"

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useCategoryStore } from '@/store/category-store'
import { useProductStore } from '@/store/product-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
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
    const [selectedCategory, setSelectedCategory] = useState<string>(product?.categoryId || '')
    const [hasPromotion, setHasPromotion] = useState(product?.hasPromotion || false)
    const { getActiveCategories } = useCategoryStore()
    const { addProduct, updateProduct } = useProductStore()
    const activeCategories = getActiveCategories()

    // Use external open state if provided, otherwise use internal state
    const dialogOpen = open !== undefined ? open : isOpen
    const setDialogOpen = onOpenChange || setIsOpen

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isSubmitting }
    } = useForm<CreateProductData>({
        defaultValues: product ? {
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.image,
            description: product.description,
            categoryId: product.categoryId || '',
            inStock: product.inStock ?? true,
            quantity: product.quantity,
            freeShipping: product.freeShipping || false,
            hasPromotion: product.hasPromotion || false,
            promotionPercentage: product.promotionPercentage || 0,
            promotionStartDate: product.promotionStartDate,
            promotionEndDate: product.promotionEndDate
        } : {
            name: '',
            price: 0,
            originalPrice: 0,
            image: '',
            description: '',
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

    // Update form values when product changes
    useEffect(() => {
        if (product) {
            setSelectedCategory(product.categoryId || '')
            setHasPromotion(product.hasPromotion || false)
            reset({
                name: product.name,
                price: product.originalPrice || product.price, // Use original price if available
                originalPrice: product.originalPrice,
                image: product.image,
                description: product.description,
                categoryId: product.categoryId || '',
                inStock: product.inStock ?? true,
                quantity: product.quantity,
                freeShipping: product.freeShipping || false,
                hasPromotion: product.hasPromotion || false,
                promotionPercentage: product.promotionPercentage || 0,
                promotionStartDate: product.promotionStartDate,
                promotionEndDate: product.promotionEndDate
            })
        } else {
            // Reset form for new product
            setSelectedCategory('')
            setHasPromotion(false)
            reset({
                name: '',
                price: 0,
                originalPrice: 0,
                image: '',
                description: '',
                categoryId: '',
                inStock: true,
                quantity: 0,
                freeShipping: false,
                hasPromotion: false,
                promotionPercentage: 0
            })
        }
    }, [product, reset])

    // Calculate discounted price
    const calculateDiscountedPrice = () => {
        if (hasPromotion && promotionPercentage && promotionPercentage > 0) {
            return price - (price * promotionPercentage / 100)
        }
        return price
    }

    const onSubmit = (data: CreateProductData) => {
        try {
            const productData = {
                ...data,
                categoryId: selectedCategory,
                hasPromotion,
                // Calculate originalPrice if there's a promotion
                originalPrice: hasPromotion && data.promotionPercentage ? data.price : undefined,
                // Adjust price if there's a promotion
                price: hasPromotion && data.promotionPercentage
                    ? data.price - (data.price * data.promotionPercentage / 100)
                    : data.price
            }

            if (product) {
                updateProduct(product.id, productData)
            } else {
                addProduct(productData)
            }

            reset()
            setSelectedCategory('')
            setHasPromotion(false)
            setDialogOpen(false)
            onSuccess?.()
        } catch (error) {
            console.error('Error saving product:', error)
        }
    }

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button>
                        {product ? 'Editar Producto' : 'Nuevo Producto'}
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className="max-w-4xl w-[95vw] max-h-[95vh] overflow-hidden p-0">
                <div className="flex flex-col h-full">
                    <DialogHeader className="px-6 py-4 border-b">
                        <DialogTitle className="text-xl font-semibold">
                            {product ? 'Editar Producto' : 'Crear Nuevo Producto'}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto px-6 py-4">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" id="product-form">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Información básica */}
                                <div className="space-y-6">
                                    <h3 className="text-lg font-medium text-foreground border-b pb-2">
                                        Información Básica
                                    </h3>

                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="name">Nombre del Producto *</Label>
                                            <Input
                                                id="name"
                                                {...register('name', {
                                                    required: 'El nombre es obligatorio',
                                                    minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                                                })}
                                                placeholder="Ej: iPhone 15 Pro"
                                            />
                                            {errors.name && (
                                                <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="description">Descripción *</Label>
                                            <Textarea
                                                id="description"
                                                {...register('description', {
                                                    required: 'La descripción es obligatoria',
                                                    minLength: { value: 10, message: 'Mínimo 10 caracteres' }
                                                })}
                                                placeholder="Describe las características del producto..."
                                                rows={4}
                                            />
                                            {errors.description && (
                                                <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="categoryId">Categoría *</Label>
                                            <Select
                                                value={selectedCategory}
                                                onValueChange={(value) => {
                                                    setSelectedCategory(value)
                                                    setValue('categoryId', value)
                                                }}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecciona una categoría" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {activeCategories.map((category) => (
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
                                                <p className="text-sm text-red-500 mt-1">{errors.categoryId.message}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="image">Imagen del Producto *</Label>
                                            <Input
                                                id="image"
                                                {...register('image', {
                                                    required: 'La imagen es obligatoria'
                                                })}
                                                placeholder="URL de la imagen"
                                            />
                                            {errors.image && (
                                                <p className="text-sm text-red-500 mt-1">{errors.image.message}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Precios y stock */}
                                <div className="space-y-6">
                                    <h3 className="text-lg font-medium text-foreground border-b pb-2">
                                        Precios y Stock
                                    </h3>

                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="price">Precio Base *</Label>
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
                                            />
                                            {errors.price && (
                                                <p className="text-sm text-red-500 mt-1">{errors.price.message}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="quantity">Cantidad en Stock *</Label>
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
                                            />
                                            {errors.quantity && (
                                                <p className="text-sm text-red-500 mt-1">{errors.quantity.message}</p>
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
                            <div className="border-t pt-8">
                                <h3 className="text-lg font-medium mb-6">Promociones</h3>

                                <div className="flex items-center space-x-2 mb-6">
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
                                        className="h-4 w-4"
                                    />
                                    <Label htmlFor="hasPromotion">Este producto tiene promoción</Label>
                                </div>

                                {hasPromotion && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-gray-50 rounded-lg">
                                        <div>
                                            <Label htmlFor="promotionPercentage">Porcentaje de Descuento (%)</Label>
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
                                            />
                                            {errors.promotionPercentage && (
                                                <p className="text-sm text-red-500 mt-1">{errors.promotionPercentage.message}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="promotionStartDate">Fecha de Inicio</Label>
                                            <Input
                                                id="promotionStartDate"
                                                type="date"
                                                {...register('promotionStartDate', {
                                                    valueAsDate: true
                                                })}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="promotionEndDate">Fecha de Fin</Label>
                                            <Input
                                                id="promotionEndDate"
                                                type="date"
                                                {...register('promotionEndDate', {
                                                    valueAsDate: true
                                                })}
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
                    </div>

                    {/* Botones de acción - Fixed footer */}
                    <div className="border-t px-6 py-4 bg-gray-50">
                        <div className="flex justify-end space-x-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    reset()
                                    setSelectedCategory('')
                                    setHasPromotion(false)
                                    setDialogOpen(false)
                                }}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                form="product-form"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Guardando...' : (product ? 'Actualizar' : 'Crear')} Producto
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}