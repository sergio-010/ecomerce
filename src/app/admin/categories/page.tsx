"use client"

import React from "react"
import { AdminLayout } from "@/components/admin/AdminLayout"
import { useCategoryStore } from "@/store/category-store"
import { CategoryForm } from "@/components/admin/CategoryForm"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Eye, EyeOff, FolderOpen } from "lucide-react"

export default function CategoriesPage() {
    const { categories, deleteCategory, toggleCategoryStatus, getParentCategories, getChildCategories } = useCategoryStore()

    const handleDelete = (id: string) => {
        if (confirm('¿Estás seguro de que quieres eliminar esta categoría? Se eliminarán también todas las subcategorías.')) {
            deleteCategory(id)
        }
    }

    const parentCategories = getParentCategories()

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Gestión de Categorías</h1>
                        <p className="text-muted-foreground">
                            Administra las categorías y subcategorías de productos
                        </p>
                    </div>
                    <CategoryForm />
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
                                            <TableHead>Nombre</TableHead>
                                            <TableHead>Slug</TableHead>
                                            <TableHead>Estado</TableHead>
                                            <TableHead>Tipo</TableHead>
                                            <TableHead>Productos</TableHead>
                                            <TableHead>Orden</TableHead>
                                            <TableHead className="text-right">Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {/* Categorías padre */}
                                        {parentCategories
                                            .sort((a, b) => a.order - b.order)
                                            .map((category) => {
                                                const childCategories = getChildCategories(category.id)
                                                return (
                                                    <React.Fragment key={category.id}>
                                                        <TableRow>
                                                            <TableCell>
                                                                <div className="flex items-center">
                                                                    <FolderOpen className="h-4 w-4 mr-2 text-blue-600" />
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
                                                                <code className="text-sm bg-muted px-2 py-1 rounded">
                                                                    {category.slug}
                                                                </code>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge variant={category.isActive ? "default" : "secondary"}>
                                                                    {category.isActive ? "Activa" : "Inactiva"}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge variant="outline">Categoría Padre</Badge>
                                                            </TableCell>
                                                            <TableCell>
                                                                {category.productCount || 0}
                                                            </TableCell>
                                                            <TableCell>{category.order}</TableCell>
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

                                                        {/* Subcategorías */}
                                                        {childCategories.map((subCategory) => (
                                                            <TableRow key={subCategory.id} className="bg-muted/50">
                                                                <TableCell>
                                                                    <div className="flex items-center pl-6">
                                                                        <div className="w-4 h-4 mr-2 border-l-2 border-b-2 border-muted-foreground/30"></div>
                                                                        <div>
                                                                            <div className="font-medium">{subCategory.name}</div>
                                                                            {subCategory.description && (
                                                                                <div className="text-sm text-muted-foreground">
                                                                                    {subCategory.description}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <code className="text-sm bg-background px-2 py-1 rounded">
                                                                        {subCategory.slug}
                                                                    </code>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Badge variant={subCategory.isActive ? "default" : "secondary"}>
                                                                        {subCategory.isActive ? "Activa" : "Inactiva"}
                                                                    </Badge>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Badge variant="secondary">Subcategoría</Badge>
                                                                </TableCell>
                                                                <TableCell>
                                                                    {subCategory.productCount || 0}
                                                                </TableCell>
                                                                <TableCell>{subCategory.order}</TableCell>
                                                                <TableCell className="text-right">
                                                                    <div className="flex justify-end space-x-2">
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() => toggleCategoryStatus(subCategory.id)}
                                                                        >
                                                                            {subCategory.isActive ? (
                                                                                <EyeOff className="h-4 w-4" />
                                                                            ) : (
                                                                                <Eye className="h-4 w-4" />
                                                                            )}
                                                                        </Button>
                                                                        <CategoryForm
                                                                            category={subCategory}
                                                                            trigger={
                                                                                <Button variant="ghost" size="sm">
                                                                                    <Edit className="h-4 w-4" />
                                                                                </Button>
                                                                            }
                                                                        />
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() => handleDelete(subCategory.id)}
                                                                            className="text-red-600 hover:text-red-700"
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </React.Fragment>
                                                )
                                            })}
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
