"use client"

import { AdminLayout, ProductForm } from "@/components/admin"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Edit, Trash2, Eye, Package } from "lucide-react"
import { useProductStore } from "@/store/product-store"
import { useCategoryStore } from "@/store/category-store"
import { useState } from "react"
import { Product } from "@/types"
import Image from "next/image"
import { formatPrice } from "@/lib/utils"

export default function AdminProductsPage() {
    const [selectedProduct, setSelectedProduct] = useState<Product | undefined>()
    const [showForm, setShowForm] = useState(false)

    // Optimizar selectores para evitar bucles infinitos
    const products = useProductStore((state) => state.products)
    const deleteProduct = useProductStore((state) => state.deleteProduct)
    const getCategoryById = useCategoryStore((state) => state.getCategoryById)

    const handleEdit = (id: string) => {
        const product = products.find(p => p.id === id)
        setSelectedProduct(product)
        setShowForm(true)
    }

    const handleDelete = (id: string) => {
        if (confirm("¿Estás seguro de que quieres eliminar este producto?")) {
            deleteProduct(id)
        }
    }

    const handleView = (id: string) => {
        console.log("Ver producto:", id)
        // Aquí navegarías a la vista del producto
    }

    const handleFormSuccess = () => {
        setSelectedProduct(undefined)
        setShowForm(false)
    }

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-semibold tracking-tight">
                            Productos
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Gestiona el catálogo de productos de tu tienda
                        </p>
                    </div>
                    <ProductForm
                        product={selectedProduct}
                        open={showForm}
                        onOpenChange={setShowForm}
                        onSuccess={handleFormSuccess}
                        trigger={
                            <Button className="gap-2" onClick={() => {
                                setSelectedProduct(undefined)
                                setShowForm(true)
                            }}>
                                <PlusCircle className="h-4 w-4" />
                                Nuevo producto
                            </Button>
                        }
                    />
                </div>

                {/* Table Card */}
                <div className="rounded-lg border bg-card">
                    {products.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 text-center">
                            <Package className="h-12 w-12 text-muted-foreground/50 mb-4" />
                            <h3 className="text-lg font-medium text-foreground mb-2">
                                No hay productos
                            </h3>
                            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                                Comienza agregando tu primer producto al catálogo
                            </p>
                            <Button variant="outline" className="gap-2">
                                <PlusCircle className="h-4 w-4" />
                                Agregar producto
                            </Button>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Producto</TableHead>
                                    <TableHead>Categoría</TableHead>
                                    <TableHead>Precio</TableHead>
                                    <TableHead>Stock</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-md overflow-hidden bg-muted">
                                                    <Image
                                                        className="h-full w-full object-cover"
                                                        src={product.image}
                                                        alt={product.name}
                                                        width={40}
                                                        height={40}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="font-medium leading-none">
                                                        {product.name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        ID: {product.id}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="font-normal">
                                                {getCategoryById(product.categoryId || '')?.name || 'Sin categoría'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-medium">
                                                        {formatPrice(product.price)}
                                                    </p>
                                                    {product.hasPromotion && product.promotionPercentage && (
                                                        <Badge variant="destructive" className="text-xs">
                                                            -{product.promotionPercentage}%
                                                        </Badge>
                                                    )}
                                                </div>
                                                {product.originalPrice && product.hasPromotion && (
                                                    <p className="text-xs text-muted-foreground line-through">
                                                        {formatPrice(product.originalPrice)}
                                                    </p>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-medium">
                                                {product.quantity}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={product.inStock ? "default" : "destructive"}
                                                className="font-normal"
                                            >
                                                {product.inStock ? "En stock" : "Agotado"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleView(product.id)}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleEdit(product.id)}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(product.id)}
                                                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </div>
        </AdminLayout>
    )
}
