"use client"

import { useEffect } from "react"
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
    const {
        categories,
        isLoading,
        error,
        fetchCategories,
        deleteCategory,
        toggleCategoryStatus
    } = useCategoryStore()

    useEffect(() => {
        fetchCategories()
    }, [fetchCategories])

    const handleDelete = async (id: string) => {
        const category = categories.find(c => c.id === id)

        if (confirm(`¿Estás seguro de que quieres eliminar "${category?.name}"?`)) {
            try {
                await deleteCategory(id)
            } catch (error) {
                console.error("Error deleting category:", error)
            }
        }
    }

    const handleToggleStatus = async (id: string) => {
        try {
            await toggleCategoryStatus(id)
        } catch (error) {
            console.error("Error toggling category status:", error)
        }
    }

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                        <p className="mt-4 text-muted-foreground">Cargando categorías...</p>
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
                        <Button onClick={fetchCategories}>Reintentar</Button>
                    </div>
                </div>
            </AdminLayout>
        )
    }

    // Organizar categorías con jerarquía
    const organizeCategories = () => {
        const mainCategories = categories.filter(cat => !cat.parentId)
        const subcategories = categories.filter(cat => cat.parentId)

        const organized: Array<{ category: typeof categories[0]; level: number; isSubcategory: boolean }> = []

        mainCategories.sort((a, b) => a.sortOrder - b.sortOrder).forEach(mainCat => {
            organized.push({ category: mainCat, level: 0, isSubcategory: false })

            const subs = subcategories
                .filter(subCat => subCat.parentId === mainCat.id)
                .sort((a, b) => a.sortOrder - b.sortOrder)

            subs.forEach(subCat => {
                organized.push({ category: subCat, level: 1, isSubcategory: true })
            })
        })

        return organized
    }

    const organizedCategories = organizeCategories()
    const mainCategoriesCount = categories.filter(cat => !cat.parentId).length
    const subcategoriesCount = categories.filter(cat => cat.parentId).length
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
                            <p className="text-xs text-muted-foreground">Todas las categorías</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="text-2xl font-bold text-blue-600">{mainCategoriesCount}</div>
                                <div className="ml-auto text-blue-600">Principales</div>
                            </div>
                            <p className="text-xs text-muted-foreground">Categorías padre</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="text-2xl font-bold text-green-600">{subcategoriesCount}</div>
                                <div className="ml-auto text-green-600">Subcategorías</div>
                            </div>
                            <p className="text-xs text-muted-foreground">Categorías hijo</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="text-2xl font-bold text-orange-600">{inactiveCount}</div>
                                <div className="ml-auto text-orange-600">Inactivas</div>
                            </div>
                            <p className="text-xs text-muted-foreground">Categorías deshabilitadas</p>
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
                                            <TableHead>Tipo</TableHead>
                                            <TableHead>Estado</TableHead>
                                            <TableHead>Orden</TableHead>
                                            <TableHead>Slug</TableHead>
                                            <TableHead className="text-right">Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {organizedCategories.map(({ category, level, isSubcategory }) => (
                                            <TableRow key={category.id}>
                                                <TableCell>
                                                    <div className="flex items-center space-x-3">
                                                        {/* Indentación visual para subcategorías */}
                                                        {level > 0 && (
                                                            <div className="w-6 h-6 flex items-center justify-center">
                                                                <div className="w-4 h-px bg-gray-300"></div>
                                                            </div>
                                                        )}

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
                                                            <div className={`font-medium ${level > 0 ? 'text-sm' : ''}`}>
                                                                {category.name}
                                                            </div>
                                                            {category.description && (
                                                                <div className="text-sm text-muted-foreground">
                                                                    {category.description}
                                                                </div>
                                                            )}
                                                            {/* Mostrar categoría padre si es subcategoría */}
                                                            {isSubcategory && (
                                                                <div className="text-xs text-blue-600">
                                                                    ↳ Subcategoría de: {categories.find(c => c.id === category.parentId)?.name}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={isSubcategory ? "outline" : "default"} className={isSubcategory ? "text-blue-600 border-blue-300" : ""}>
                                                        {isSubcategory ? "Subcategoría" : "Principal"}
                                                    </Badge>
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
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end space-x-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleToggleStatus(category.id)}
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
