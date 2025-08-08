"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MultipleImageUpload } from "@/components/ui/multiple-image-upload"
import { useProductStore } from "@/store/product-store"
import { useCategoryStore } from "@/store/category-store"
import { useRouter } from "next/navigation"
import type { CreateProductData, Product, ProductImage } from "@/types"

interface ProductFormProps {
    productId?: string
    onClose?: () => void
}

export function ProductForm({ productId, onClose }: ProductFormProps) {
    const router = useRouter()
    const { addProduct, updateProduct, products } = useProductStore()
    const { categories, fetchCategories } = useCategoryStore()
    const [isLoading, setIsLoading] = useState(false)

    // Estado para las imágenes
    const [mainImage, setMainImage] = useState('')
    const [additionalImages, setAdditionalImages] = useState<string[]>([])

    const isEditing = !!productId
    const product = products.find(p => p.id === productId)

    const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<CreateProductData>({
        defaultValues: {
            name: '',
            description: '',
            price: 0,
            comparePrice: null,
            sku: '',
            categoryId: '',
            stock: 0,
            isActive: true,
            isFeatured: false,
            isPromotion: false,
            weight: null,
            dimensions: null,
            tags: null,
            seoTitle: null,
            seoDescription: null
        }
    })

    const price = watch('price')
    const comparePrice = watch('comparePrice')

    useEffect(() => {
        // Cargar categorías al inicializar el componente
        fetchCategories()
    }, [fetchCategories])

    useEffect(() => {
        if (product && isEditing) {
            // Cargar datos del formulario
            reset({
                name: product.name,
                description: product.description || '',
                price: product.price,
                comparePrice: product.comparePrice,
                sku: product.sku || '',
                categoryId: product.categoryId,
                stock: product.stock,
                isActive: product.isActive,
                isFeatured: product.isFeatured,
                isPromotion: product.isPromotion,
                weight: product.weight,
                dimensions: product.dimensions,
                tags: product.tags,
                seoTitle: product.seoTitle,
                seoDescription: product.seoDescription
            })

            // Cargar imágenes si están disponibles
            const productWithImages = product as Product & { images?: ProductImage[] }
            if (productWithImages.images && productWithImages.images.length > 0) {
                const sortedImages = productWithImages.images.sort((a, b) => a.sortOrder - b.sortOrder)
                setMainImage(sortedImages[0]?.url || '')
                setAdditionalImages(sortedImages.slice(1).map(img => img.url))
            }
        }
    }, [product, isEditing, reset])

    const onSubmit = async (data: CreateProductData) => {
        setIsLoading(true)

        try {
            // Combinar imagen principal con imágenes adicionales
            const allImageUrls = mainImage ? [mainImage, ...additionalImages] : additionalImages

            // Convertir URLs a formato esperado por la API
            const images = allImageUrls.map((url, index) => ({
                url,
                alt: data.name || 'Imagen del producto'
            }))

            const productData = {
                ...data,
                images
            }

            if (isEditing && productId) {
                await updateProduct(productId, productData)
            } else {
                await addProduct(productData)
            }

            if (onClose) {
                onClose()
            } else {
                router.push('/admin/products')
            }
        } catch (error) {
            console.error('Error saving product:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const discountPercentage = comparePrice && price ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">
                    {isEditing ? 'Editar Producto' : 'Crear Producto'}
                </h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Información básica */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Información Básica</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Nombre del Producto *</Label>
                                    <Input
                                        id="name"
                                        {...register('name', { required: 'El nombre es requerido' })}
                                        placeholder="Ej: iPhone 14 Pro"
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="description">Descripción</Label>
                                    <Textarea
                                        id="description"
                                        {...register('description')}
                                        placeholder="Descripción detallada del producto..."
                                        rows={4}
                                    />
                                </div>

                                {/* Imágenes del producto */}
                                <div>
                                    <MultipleImageUpload
                                        mainImage={mainImage}
                                        additionalImages={additionalImages}
                                        onMainImageChange={setMainImage}
                                        onAdditionalImagesChange={setAdditionalImages}
                                        maxImages={5}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="sku">SKU</Label>
                                        <Input
                                            id="sku"
                                            {...register('sku')}
                                            placeholder="Ej: IPH14-128-BLK"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="stock">Stock</Label>
                                        <Input
                                            id="stock"
                                            type="number"
                                            {...register('stock', {
                                                required: 'El stock es requerido',
                                                min: { value: 0, message: 'El stock no puede ser negativo' }
                                            })}
                                            placeholder="0"
                                        />
                                        {errors.stock && (
                                            <p className="text-sm text-red-600 mt-1">{errors.stock.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="categoryId">Categoría *</Label>
                                    <Select onValueChange={(value) => setValue('categoryId', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona una categoría" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.categoryId && (
                                        <p className="text-sm text-red-600 mt-1">La categoría es requerida</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Precios */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Precios</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="price">Precio de Venta *</Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            step="0.01"
                                            {...register('price', {
                                                required: 'El precio es requerido',
                                                min: { value: 0.01, message: 'El precio debe ser mayor a 0' }
                                            })}
                                            placeholder="0.00"
                                        />
                                        {errors.price && (
                                            <p className="text-sm text-red-600 mt-1">{errors.price.message}</p>
                                        )}
                                    </div>
                                    <div>
                                        <Label htmlFor="comparePrice">Precio de Comparación</Label>
                                        <Input
                                            id="comparePrice"
                                            type="number"
                                            step="0.01"
                                            {...register('comparePrice')}
                                            placeholder="0.00"
                                        />
                                        <p className="text-xs text-gray-600 mt-1">
                                            Precio original (antes del descuento)
                                        </p>
                                    </div>
                                </div>

                                {comparePrice && price && comparePrice > price && (
                                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                        <p className="text-sm text-green-700">
                                            <strong>Descuento:</strong> {discountPercentage}%
                                            (Ahorras ${(comparePrice - price).toFixed(2)})
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Detalles físicos */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Detalles Físicos</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="weight">Peso (kg)</Label>
                                        <Input
                                            id="weight"
                                            type="number"
                                            step="0.001"
                                            {...register('weight')}
                                            placeholder="0.500"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="dimensions">Dimensiones</Label>
                                        <Input
                                            id="dimensions"
                                            {...register('dimensions')}
                                            placeholder="Ej: 20x15x5 cm"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* SEO */}
                        <Card>
                            <CardHeader>
                                <CardTitle>SEO</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="seoTitle">Título SEO</Label>
                                    <Input
                                        id="seoTitle"
                                        {...register('seoTitle')}
                                        placeholder="Título optimizado para buscadores"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="seoDescription">Descripción SEO</Label>
                                    <Textarea
                                        id="seoDescription"
                                        {...register('seoDescription')}
                                        placeholder="Descripción meta para buscadores..."
                                        rows={3}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="tags">Etiquetas</Label>
                                    <Input
                                        id="tags"
                                        {...register('tags')}
                                        placeholder="tecnología,smartphone,apple"
                                    />
                                    <p className="text-xs text-gray-600 mt-1">
                                        Separadas por comas
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Configuración */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Configuración</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="isActive"
                                        {...register('isActive')}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <Label htmlFor="isActive">Producto activo</Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="isFeatured"
                                        {...register('isFeatured')}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <Label htmlFor="isFeatured">Producto destacado</Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="isPromotion"
                                        {...register('isPromotion')}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <Label htmlFor="isPromotion">En promoción</Label>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Acciones */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="space-y-3">
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Guardando...' : isEditing ? 'Actualizar Producto' : 'Crear Producto'}
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full"
                                        onClick={onClose || (() => router.push('/admin/products'))}
                                    >
                                        Cancelar
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </div>
    )
}
