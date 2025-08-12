"use client"

import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { useCategoryStore } from '@/store/category-store'
import { CategoryForm } from '@/components/admin/CategoryForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
    MoreVertical,
    Edit,
    Trash2,
    Eye,
    EyeOff,
    Plus,
    FolderOpen,
    Tag,
    Settings,
    Filter
} from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Image from 'next/image'
import type { Category } from '@/types'

export default function CategoriesPage() {
    const [activeTab, setActiveTab] = useState<'main' | 'sub'>('main')
    const [selectedParentId, setSelectedParentId] = useState<string | null>(null)
    const [menuOpen, setMenuOpen] = useState<string | null>(null)

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

    // Separar categorías principales y subcategorías
    const mainCategories = categories.filter(cat => !cat.parentId)
    const subCategories = categories.filter(cat => cat.parentId)

    // Filtrar subcategorías por categoría padre seleccionada
    const filteredSubCategories = selectedParentId
        ? subCategories.filter(cat => cat.parentId === selectedParentId)
        : subCategories

    const handleDelete = async (category: Category) => {
        const subcategoriesCount = subCategories.filter(sub => sub.parentId === category.id).length
        const hasSubcategories = subcategoriesCount > 0

        if (hasSubcategories) {
            toast.error("No se puede eliminar", {
                description: `La categoría "${category.name}" tiene ${subcategoriesCount} subcategoría${subcategoriesCount > 1 ? 's' : ''}. Elimina primero todas sus subcategorías.`
            })
            return
        }

        // Usar toast para confirmación con acción
        toast(`¿Eliminar "${category.name}"?`, {
            description: "Esta acción no se puede deshacer.",
            action: {
                label: "Eliminar",
                onClick: async () => {
                    try {
                        await deleteCategory(category.id)
                        setMenuOpen(null)
                    } catch (error) {
                        console.error('Error deleting category:', error)
                    }
                },
            },
        })
    }

    const handleToggleStatus = async (category: Category) => {
        try {
            await toggleCategoryStatus(category.id)
            setMenuOpen(null)
        } catch (error) {
            console.error('Error toggling category status:', error)
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

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold">Gestión de Categorías</h1>
                        <p className="text-muted-foreground">
                            Administra las categorías principales y subcategorías de tu tienda
                        </p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold">{categories.length}</div>
                                    <p className="text-xs text-muted-foreground">Total Categorías</p>
                                </div>
                                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <FolderOpen className="h-4 w-4 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold text-blue-600">{mainCategories.length}</div>
                                    <p className="text-xs text-muted-foreground">Principales</p>
                                </div>
                                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <FolderOpen className="h-4 w-4 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold text-green-600">{subCategories.length}</div>
                                    <p className="text-xs text-muted-foreground">Subcategorías</p>
                                </div>
                                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <Tag className="h-4 w-4 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold text-orange-600">
                                        {categories.filter(cat => !cat.isActive).length}
                                    </div>
                                    <p className="text-xs text-muted-foreground">Inactivas</p>
                                </div>
                                <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                                    <EyeOff className="h-4 w-4 text-orange-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs Navigation */}
                <div className="border-b">
                    <nav className="flex space-x-8">
                        <button
                            onClick={() => setActiveTab('main')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'main'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <FolderOpen className="h-4 w-4" />
                                Categorías Principales
                                <Badge variant="secondary" className="ml-1">
                                    {mainCategories.length}
                                </Badge>
                            </div>
                        </button>

                        <button
                            onClick={() => setActiveTab('sub')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'sub'
                                ? 'border-green-600 text-green-600'
                                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <Tag className="h-4 w-4" />
                                Subcategorías / Filtros
                                <Badge variant="secondary" className="ml-1">
                                    {subCategories.length}
                                </Badge>
                            </div>
                        </button>
                    </nav>
                </div>

                {/* Content based on active tab */}
                {activeTab === 'main' && (
                    <div className="space-y-6">
                        {/* Main Categories Header */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <FolderOpen className="h-5 w-5 text-blue-600" />
                                    Categorías Principales
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Estas categorías aparecen en el navbar y página principal de tu tienda
                                </p>
                            </div>
                            <CategoryForm
                                trigger={
                                    <Button className="bg-blue-600 hover:bg-blue-700">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Nueva Categoría Principal
                                    </Button>
                                }
                            />
                        </div>

                        {/* Main Categories Table */}
                        {mainCategories.length > 0 ? (
                            <Card>
                                <CardContent className="p-0">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-16"></TableHead>
                                                <TableHead>Categoría</TableHead>
                                                <TableHead>Estado</TableHead>
                                                <TableHead>Orden</TableHead>
                                                <TableHead>Subcategorías</TableHead>
                                                <TableHead>Slug</TableHead>
                                                <TableHead className="text-right">Acciones</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {mainCategories.map((category) => {
                                                const subcategoriesCount = subCategories.filter(sub => sub.parentId === category.id).length
                                                return (
                                                    <TableRow key={category.id}>
                                                        <TableCell>
                                                            {category.image ? (
                                                                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                                                                    <Image
                                                                        src={category.image}
                                                                        alt={category.name}
                                                                        fill
                                                                        className="object-cover"
                                                                        sizes="48px"
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                                                                    <FolderOpen className="h-6 w-6 text-blue-600" />
                                                                </div>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div>
                                                                <div className="font-medium text-base">{category.name}</div>
                                                                {category.description && (
                                                                    <div className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                                                        {category.description}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant={category.isActive ? "default" : "secondary"}>
                                                                {category.isActive ? "Activa" : "Inactiva"}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>{category.sortOrder}</TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-1">
                                                                <Tag className="h-4 w-4 text-green-600" />
                                                                <span className="text-green-600 font-medium">{subcategoriesCount}</span>
                                                                <span className="text-sm text-muted-foreground">filtros</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                                                {category.slug}
                                                            </code>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <DropdownMenu
                                                                category={category}
                                                                onDelete={handleDelete}
                                                                onToggleStatus={handleToggleStatus}
                                                                isOpen={menuOpen === category.id}
                                                                setIsOpen={(open) => setMenuOpen(open ? category.id : null)}
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="text-center py-16">
                                <div className="max-w-md mx-auto">
                                    <FolderOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-muted-foreground mb-2">
                                        No hay categorías principales
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-6">
                                        Las categorías principales aparecen en tu navbar y organizan tu tienda.
                                        Crea tu primera categoría para empezar.
                                    </p>
                                    <CategoryForm
                                        trigger={
                                            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                                                <Plus className="h-4 w-4 mr-2" />
                                                Crear Primera Categoría Principal
                                            </Button>
                                        }
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'sub' && (
                    <div className="space-y-6">
                        {/* Subcategories Header */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <Tag className="h-5 w-5 text-green-600" />
                                    Subcategorías / Filtros
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Las subcategorías funcionan como filtros dentro de cada categoría principal
                                </p>
                            </div>

                            <div className="flex gap-2">
                                {/* Parent Category Filter */}
                                {mainCategories.length > 0 && (
                                    <select
                                        value={selectedParentId || ''}
                                        onChange={(e) => setSelectedParentId(e.target.value || null)}
                                        className="px-3 py-2 border rounded-md text-sm bg-white"
                                    >
                                        <option value="">Todas las categorías</option>
                                        {mainCategories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                Filtros de: {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                )}

                                {mainCategories.length > 0 && (
                                    <CategoryForm
                                        trigger={
                                            <Button className="bg-green-600 hover:bg-green-700">
                                                <Plus className="h-4 w-4 mr-2" />
                                                Nueva Subcategoría
                                            </Button>
                                        }
                                    />
                                )}
                            </div>
                        </div>

                        {/* Subcategories Content */}
                        {mainCategories.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="max-w-md mx-auto bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                                    <Settings className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                                    <h3 className="font-medium text-yellow-800 mb-2">
                                        Necesitas categorías principales primero
                                    </h3>
                                    <p className="text-sm text-yellow-700 mb-4">
                                        Las subcategorías necesitan una categoría principal.
                                        Crea primero las categorías principales.
                                    </p>
                                    <Button
                                        onClick={() => setActiveTab('main')}
                                        variant="outline"
                                        className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                                    >
                                        Ir a Categorías Principales
                                    </Button>
                                </div>
                            </div>
                        ) : filteredSubCategories.length > 0 ? (
                            <Card>
                                <CardContent className="p-0">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Subcategoría</TableHead>
                                                <TableHead>Categoría Principal</TableHead>
                                                <TableHead>Estado</TableHead>
                                                <TableHead>Orden</TableHead>
                                                <TableHead>Slug</TableHead>
                                                <TableHead className="text-right">Acciones</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredSubCategories.map((subcategory) => {
                                                const parentCategory = mainCategories.find(cat => cat.id === subcategory.parentId)
                                                return (
                                                    <TableRow key={subcategory.id}>
                                                        <TableCell>
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded bg-green-100 flex items-center justify-center">
                                                                    <Tag className="h-4 w-4 text-green-600" />
                                                                </div>
                                                                <div>
                                                                    <div className="font-medium">{subcategory.name}</div>
                                                                    {subcategory.description && (
                                                                        <div className="text-sm text-muted-foreground mt-1 line-clamp-1">
                                                                            {subcategory.description}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            {parentCategory && (
                                                                <div className="flex items-center gap-2">
                                                                    <FolderOpen className="h-4 w-4 text-blue-600" />
                                                                    <span className="text-blue-700 font-medium">{parentCategory.name}</span>
                                                                </div>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant={subcategory.isActive ? "default" : "secondary"}>
                                                                {subcategory.isActive ? "Activa" : "Inactiva"}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>{subcategory.sortOrder}</TableCell>
                                                        <TableCell>
                                                            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                                                {subcategory.slug}
                                                            </code>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <DropdownMenu
                                                                category={subcategory}
                                                                onDelete={handleDelete}
                                                                onToggleStatus={handleToggleStatus}
                                                                isOpen={menuOpen === subcategory.id}
                                                                setIsOpen={(open) => setMenuOpen(open ? subcategory.id : null)}
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="text-center py-16">
                                <div className="max-w-md mx-auto">
                                    <Filter className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-muted-foreground mb-2">
                                        {selectedParentId ? 'No hay filtros para esta categoría' : 'No hay subcategorías creadas'}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-6">
                                        {selectedParentId
                                            ? 'Crea filtros para ayudar a tus clientes a encontrar productos específicos'
                                            : 'Las subcategorías funcionan como filtros para organizar mejor tus productos'
                                        }
                                    </p>
                                    <CategoryForm
                                        trigger={
                                            <Button className="bg-green-600 hover:bg-green-700">
                                                <Plus className="h-4 w-4 mr-2" />
                                                Crear {selectedParentId ? 'Filtro' : 'Primera Subcategoría'}
                                            </Button>
                                        }
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AdminLayout>
    )
}

// Componente del menú dropdown
function DropdownMenu({
    category,
    onDelete,
    onToggleStatus,
    isOpen,
    setIsOpen
}: {
    category: Category
    onDelete: (category: Category) => void
    onToggleStatus: (category: Category) => void
    isOpen: boolean
    setIsOpen: (open: boolean) => void
}) {
    return (
        <div className="relative">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="h-8 w-8 p-0"
            >
                <MoreVertical className="h-4 w-4" />
            </Button>

            {isOpen && (
                <>
                    {/* Overlay to close menu when clicking outside */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />

                    <div className="absolute right-0 top-full mt-1 bg-white border rounded-md shadow-lg py-1 z-20 min-w-[150px]">
                        <CategoryForm
                            category={category}
                            trigger={
                                <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2">
                                    <Edit className="h-4 w-4" />
                                    Editar
                                </button>
                            }
                            onSuccess={() => setIsOpen(false)}
                        />

                        <button
                            onClick={() => {
                                onToggleStatus(category)
                                setIsOpen(false)
                            }}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                        >
                            {category.isActive ? (
                                <>
                                    <EyeOff className="h-4 w-4" />
                                    Desactivar
                                </>
                            ) : (
                                <>
                                    <Eye className="h-4 w-4" />
                                    Activar
                                </>
                            )}
                        </button>

                        <button
                            onClick={() => {
                                onDelete(category)
                                setIsOpen(false)
                            }}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 text-red-600"
                        >
                            <Trash2 className="h-4 w-4" />
                            Eliminar
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}
