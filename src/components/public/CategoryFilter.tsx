"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, ChevronRight, Filter, X } from "lucide-react"
import { Category } from "@/types"

interface CategoryFilterProps {
    onFilterChange: (categoryIds: string[]) => void
    selectedCategories: string[]
}

export function CategoryFilter({ onFilterChange, selectedCategories }: CategoryFilterProps) {
    const [categories, setCategories] = useState<Category[]>([])
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            const response = await fetch("/api/categories")
            if (response.ok) {
                const data = await response.json()
                setCategories(data)
            }
        } catch (error) {
            console.error("Error fetching categories:", error)
        } finally {
            setIsLoading(false)
        }
    }

    // Organizar categorías en jerarquía
    const organizeCategories = () => {
        const mainCategories = categories.filter(cat => !cat.parentId && cat.isActive)
        const subcategories = categories.filter(cat => cat.parentId && cat.isActive)

        return mainCategories.map(mainCat => ({
            ...mainCat,
            subcategories: subcategories.filter(sub => sub.parentId === mainCat.id)
        }))
    }

    const organizedCategories = organizeCategories()

    const toggleCategory = (categoryId: string) => {
        const newSelected = selectedCategories.includes(categoryId)
            ? selectedCategories.filter(id => id !== categoryId)
            : [...selectedCategories, categoryId]

        onFilterChange(newSelected)
    }

    const toggleExpanded = (categoryId: string) => {
        const newExpanded = new Set(expandedCategories)
        if (newExpanded.has(categoryId)) {
            newExpanded.delete(categoryId)
        } else {
            newExpanded.add(categoryId)
        }
        setExpandedCategories(newExpanded)
    }

    const clearFilters = () => {
        onFilterChange([])
    }

    const getSelectedCategoryNames = () => {
        return categories
            .filter(cat => selectedCategories.includes(cat.id))
            .map(cat => cat.name)
    }

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="w-5 h-5" />
                        Filtrar por Categoría
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="animate-pulse space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="w-5 h-5" />
                        Filtrar por Categoría
                    </CardTitle>
                    {selectedCategories.length > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFilters}
                            className="text-xs"
                        >
                            <X className="w-3 h-3 mr-1" />
                            Limpiar
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                {/* Filtros activos */}
                {selectedCategories.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">Filtros activos:</p>
                        <div className="flex flex-wrap gap-1">
                            {getSelectedCategoryNames().map((name, index) => (
                                <Badge
                                    key={index}
                                    variant="default"
                                    className="text-xs cursor-pointer"
                                    onClick={() => {
                                        const categoryId = categories.find(cat => cat.name === name)?.id
                                        if (categoryId) toggleCategory(categoryId)
                                    }}
                                >
                                    {name}
                                    <X className="w-3 h-3 ml-1" />
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                {/* Lista de categorías */}
                <div className="space-y-2">
                    {organizedCategories.map((mainCategory) => (
                        <div key={mainCategory.id} className="space-y-1">
                            {/* Categoría principal */}
                            <div className="flex items-center space-x-2">
                                {mainCategory.subcategories.length > 0 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="p-0 h-6 w-6"
                                        onClick={() => toggleExpanded(mainCategory.id)}
                                    >
                                        {expandedCategories.has(mainCategory.id) ? (
                                            <ChevronDown className="w-4 h-4" />
                                        ) : (
                                            <ChevronRight className="w-4 h-4" />
                                        )}
                                    </Button>
                                )}

                                <label className="flex items-center space-x-2 cursor-pointer flex-1">
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.includes(mainCategory.id)}
                                        onChange={() => toggleCategory(mainCategory.id)}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm font-medium">{mainCategory.name}</span>
                                    {/* Contador de productos */}
                                    <span className="text-xs text-gray-500">
                                        ({(mainCategory as any)._count?.products || 0})
                                    </span>
                                </label>
                            </div>

                            {/* Subcategorías */}
                            {mainCategory.subcategories.length > 0 &&
                                expandedCategories.has(mainCategory.id) && (
                                    <div className="ml-8 space-y-1">
                                        {mainCategory.subcategories.map((subCategory) => (
                                            <label
                                                key={subCategory.id}
                                                className="flex items-center space-x-2 cursor-pointer"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCategories.includes(subCategory.id)}
                                                    onChange={() => toggleCategory(subCategory.id)}
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <span className="text-sm text-gray-700">{subCategory.name}</span>
                                                <span className="text-xs text-gray-500">
                                                    ({(subCategory as any)._count?.products || 0})
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                        </div>
                    ))}
                </div>

                {organizedCategories.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                        No hay categorías disponibles
                    </p>
                )}
            </CardContent>
        </Card>
    )
}
