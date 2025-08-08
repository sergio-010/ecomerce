"use client"

import { AdminLayout } from "@/components/admin/AdminLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Eye, EyeOff, Plus } from "lucide-react"
import { formatPrice } from "@/lib/utils"

// Mock data temporal hasta que el store sea compatible
const mockProducts = [
    {
        id: "1",
        name: "iPhone 14 Pro",
        slug: "iphone-14-pro",
        description: "El iPhone más avanzado con chip A16 Bionic",
        price: 999,
        comparePrice: 1199,
        sku: "IPH14PRO",
        stock: 25,
        isActive: true,
        isFeatured: true,
        isPromotion: false,
        categoryId: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
        images: [
            {
                id: "1",
                url: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop&q=80",
                alt: "iPhone 14 Pro",
                sortOrder: 0,
                productId: "1",
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ],
        category: {
            id: "1",
            name: "Electrónicos",
            slug: "electronicos"
        }
    },
    {
        id: "2",
        name: "Samsung Galaxy S23",
        slug: "samsung-galaxy-s23",
        description: "Smartphone Android de última generación",
        price: 799,
        comparePrice: null,
        sku: "SAMS23",
        stock: 0,
        isActive: true,
        isFeatured: false,
        isPromotion: true,
        categoryId: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
        images: [],
        category: {
            id: "1",
            name: "Electrónicos",
            slug: "electronicos"
        }
    }
]

export default function ProductsPage() {
    const products = mockProducts

    const handleDelete = (id: string) => {
        console.log("Delete product:", id)
    }

    const handleToggleStatus = (id: string) => {
        console.log("Toggle product status:", id)
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
                    <Button>
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
                                                            {product.images && product.images.length > 0 ? (
                                                                <img
                                                                    className="h-full w-full object-cover"
                                                                    src={product.images[0].url}
                                                                    alt={product.images[0].alt || product.name}
                                                                />
                                                            ) : (
                                                                <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                                                                    <span className="text-xs text-gray-500">📦</span>
                                                                </div>
                                                            )}
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
                                                        {product.category?.name || 'Sin categoría'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <div className="font-medium">
                                                            {formatPrice(product.price)}
                                                        </div>
                                                        {product.comparePrice && product.isPromotion && (
                                                            <div className="text-sm text-muted-foreground line-through">
                                                                {formatPrice(product.comparePrice)}
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
                                                        <Button variant="ghost" size="sm">
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
