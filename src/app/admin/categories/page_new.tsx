"use client"

import { AdminLayout } from "@/components/admin/AdminLayout"
import { useCategoryStore } from "@/store/category-store"
import { CategoryForm } from "@/components/admin/CategoryForm"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, Edit, Trash2 } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

export default function CategoriesPage() {
    const categories = useCategoryStore((state) => state.categories)
    const deleteCategory = useCategoryStore((state) => state.deleteCategory)
    const toggleCategoryStatus = useCategoryStore((state) => state.toggleCategoryStatus)

    const handleDelete = (id: string) => {
        const category = categories.find(c => c.id === id)
        toast.error(`¿Eliminar ${category?.name}?`, {
            description: "Esta acción no se puede deshacer",
            action: {
                label: "Eliminar",
                onClick: () => deleteCategory(id)
            }
        })
    }

    const sortedCategories = categories.sort((a, b) => a.sortOrder - b.sortOrder)
    const inactiveCount = categories.filter(cat => !cat.isActive).length

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Gestión de Categorías</h1>
                        <p className="text-muted-foreground">
                            Administra las categorías de productos de tu tienda
                        </p>
                    </div>
                    <CategoryForm />
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="text-2xl font-bold">{categories.length}</div>
                                <div className="ml-auto text-muted-foreground">Total</div>
                            </div>
                            <p className="text-xs text-muted-foreground">Categorías registradas</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="text-2xl font-bold text-green-600">{categories.length - inactiveCount}</div>
                                <div className="ml-auto text-green-600">Activas</div>
                            </div>
                            <p className="text-xs text-muted-foreground">Categorías activas</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="text-2xl font-bold text-orange-600">{inactiveCount}</div>
                                <div className="ml-auto text-orange-600">Inactivas</div>
                            </div>
                            <p className="text-xs text-muted-foreground">Categorías inactivas</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="text-2xl font-bold text-blue-600">0</div>
                                <div className="ml-auto text-blue-600">Productos</div>
                            </div>
                            <p className="text-xs text-muted-foreground">Total de productos</p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Categorías ({categories.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {categories.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground mb-4">
                                    No hay categorías creadas todavía
                                </p>
                                <CategoryForm trigger={<Button>Crear primera categoría</Button>} />
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Categoría</TableHead>
                                            <TableHead>Estado</TableHead>
                                            <TableHead>Orden</TableHead>
                                            <TableHead>Slug</TableHead>
                                            <TableHead>Fecha de creación</TableHead>
                                            <TableHead className="text-right">Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {sortedCategories.map((category) => (
                                            <TableRow key={category.id}>
                                                <TableCell>
                                                    <div className="flex items-center space-x-3">
                                                        {category.image ? (
                                                            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100">
                                                                <Image
                                                                    src={category.image}
                                                                    alt={category.name}
                                                                    fill
                                                                    className="object-cover"
                                                                    sizes="40px"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
                                                                <span className="text-xs font-medium text-gray-500">
                                                                    {category.name.charAt(0).toUpperCase()}
                                                                </span>
                                                            </div>
                                                        )}
                                                        <div>
                                                            <div className="font-medium">{category.name}</div>
                                                            {category.description && (
                                                                <div className="text-sm text-muted-foreground">
                                                                    {category.description}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={category.isActive ? "default" : "secondary"}>
                                                        {category.isActive ? "Activa" : "Inactiva"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{category.sortOrder}</TableCell>
                                                <TableCell>
                                                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                                        {category.slug}
                                                    </code>
                                                </TableCell>
                                                <TableCell>
                                                    {category.createdAt.toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end space-x-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => toggleCategoryStatus(category.id)}
                                                        >
                                                            {category.isActive ? (
                                                                <EyeOff className="h-4 w-4" />
                                                            ) : (
                                                                <Eye className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                        <CategoryForm
                                                            category={category}
                                                            trigger={
                                                                <Button variant="ghost" size="sm">
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                            }
                                                        />
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDelete(category.id)}
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
