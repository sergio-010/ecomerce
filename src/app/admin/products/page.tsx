"use client"

import { useEffect } from "react"
import { AdminLayout } from "@/components/admin/AdminLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Eye, EyeOff, Plus } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { useProductStore } from "@/store/product-store"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function ProductsPage() {
    const router = useRouter()
    const { products, loading, error, fetchProducts, deleteProduct, toggleProductStatus } = useProductStore()

    useEffect(() => {
        fetchProducts()
    }, [fetchProducts])

    const handleDelete = async (id: string) => {
        const product = products.find(p => p.id === id)
        if (!product) return

        toast(`¿Eliminar "${product.name}"?`, {
            description: "Esta acción no se puede deshacer.",
            action: {
                label: "Eliminar",
                onClick: async () => {
                    try {
                        await deleteProduct(id)
                    } catch (error) {
                        console.error("Error deleting product:", error)
                    }
                },
            },
        })
    }

    const handleToggleStatus = async (id: string) => {
        try {
            await toggleProductStatus(id)
        } catch (error) {
            console.error("Error toggling product status:", error)
        }
    }

    const handleCreateProduct = () => {
        router.push("/admin/products/new")
    }

    const handleEditProduct = (id: string) => {
        router.push(`/admin/products/${id}/edit`)
    }

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                        <p className="mt-4 text-muted-foreground">Cargando productos...</p>
                    </div>
                </div>
            </AdminLayout>
        )
    }

    if (error) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center min-h-[400px]">
                    <div className="text-center">
                        <p className="text-red-600 mb-4">Error: {error}</p>
                        <Button onClick={fetchProducts}>Reintentar</Button>
                    </div>
                </div>
            </AdminLayout>
        )
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Gestión de Productos</h1>
                        <p className="text-muted-foreground">
                            Administra el inventario de productos de tu tienda
                        </p>
                    </div>
                    <Button onClick={handleCreateProduct}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Producto
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="text-2xl font-bold">{products.length}</div>
                                <div className="ml-auto text-muted-foreground">Total</div>
                            </div>
                            <p className="text-xs text-muted-foreground">Productos registrados</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {products.filter(p => p.stock > 0).length}
                                </div>
                                <div className="ml-auto text-green-600">En Stock</div>
                            </div>
                            <p className="text-xs text-muted-foreground">Productos disponibles</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="text-2xl font-bold text-orange-600">
                                    {products.filter(p => p.stock === 0).length}
                                </div>
                                <div className="ml-auto text-orange-600">Agotados</div>
                            </div>
                            <p className="text-xs text-muted-foreground">Sin inventario</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="text-2xl font-bold text-blue-600">
                                    {products.filter(p => p.isFeatured).length}
                                </div>
                                <div className="ml-auto text-blue-600">Destacados</div>
                            </div>
                            <p className="text-xs text-muted-foreground">Productos destacados</p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Productos ({products.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {products.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground mb-4">
                                    No hay productos registrados todavía
                                </p>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Crear primer producto
                                </Button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Producto</TableHead>
                                            <TableHead>Categoría</TableHead>
                                            <TableHead>Precio</TableHead>
                                            <TableHead>Stock</TableHead>
                                            <TableHead>Estado</TableHead>
                                            <TableHead>SKU</TableHead>
                                            <TableHead className="text-right">Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {products.map((product) => (
                                            <TableRow key={product.id}>
                                                <TableCell>
                                                    <div className="flex items-center space-x-3">
                                                        <div className="h-10 w-10 rounded-md overflow-hidden bg-muted">
                                                            <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                                                                <span className="text-xs text-gray-500">📦</span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="font-medium">{product.name}</div>
                                                            {product.description && (
                                                                <div className="text-sm text-muted-foreground line-clamp-1">
                                                                    {product.description}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">
                                                        Categoría {product.categoryId}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <div className="font-medium">
                                                            {formatPrice(Number(product.price))}
                                                        </div>
                                                        {product.comparePrice && product.isPromotion && (
                                                            <div className="text-sm text-muted-foreground line-through">
                                                                {formatPrice(Number(product.comparePrice))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <div className="font-medium">{product.stock}</div>
                                                        <Badge
                                                            variant={product.stock > 0 ? "default" : "destructive"}
                                                            className="text-xs"
                                                        >
                                                            {product.stock > 0 ? "En stock" : "Agotado"}
                                                        </Badge>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <Badge variant={product.isActive ? "default" : "secondary"}>
                                                            {product.isActive ? "Activo" : "Inactivo"}
                                                        </Badge>
                                                        {product.isFeatured && (
                                                            <Badge variant="outline" className="text-xs">
                                                                Destacado
                                                            </Badge>
                                                        )}
                                                        {product.isPromotion && (
                                                            <Badge variant="outline" className="text-xs bg-orange-50 text-orange-600">
                                                                Promoción
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                                        {product.sku || 'Sin SKU'}
                                                    </code>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end space-x-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleToggleStatus(product.id)}
                                                        >
                                                            {product.isActive ? (
                                                                <EyeOff className="h-4 w-4" />
                                                            ) : (
                                                                <Eye className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleEditProduct(product.id)}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDelete(product.id)}
                                                            className="text-red-600 hover:text-red-700"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    )
}
