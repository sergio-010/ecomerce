import { getProducts } from "@/lib"
import { ProductGrid } from "@/components/public/ProductGrid"
import { Navbar } from "@/components/public/Navbar"
import Link from "next/link"

interface Props {
    params: Promise<{
        category: string
    }>
}

// Función para obtener categorías del lado del servidor
function getCategories() {
    // Simulamos obtener las categorías (esto debería venir del store pero adaptado para SSR)
    const mockCategories = [
        {
            id: "1",
            name: "Electrónicos",
            slug: "electronicos",
            description: "Dispositivos electrónicos y gadgets",
            isActive: true,
            order: 1,
            productCount: 25,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: "2",
            name: "Ropa",
            slug: "ropa",
            description: "Ropa y accesorios de moda",
            isActive: true,
            order: 2,
            productCount: 45,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: "3",
            name: "Hogar",
            slug: "hogar",
            description: "Artículos para el hogar y decoración",
            isActive: true,
            order: 3,
            productCount: 30,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: "4",
            name: "Smartphones",
            slug: "smartphones",
            description: "Teléfonos inteligentes y accesorios",
            parentId: "1",
            isActive: true,
            order: 1,
            productCount: 15,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ];
    return mockCategories;
}

export default async function CategoryPage({ params }: Props) {
    const { category: categorySlug } = await params
    const allProducts = await getProducts()
    const categories = getCategories()

    // Buscar la categoría actual por slug
    const currentCategory = categories.find(cat => cat.slug === categorySlug)

    if (!currentCategory) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="text-center py-16">
                        <h1 className="text-2xl font-bold mb-4">Categoría no encontrada</h1>
                        <Link
                            href="/"
                            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                        >
                            Volver al inicio
                        </Link>
                    </div>
                </main>
            </div>
        )
    }

    // Obtener subcategorías si la categoría actual es padre
    const subcategories = categories.filter(cat => cat.parentId === currentCategory.id)

    // Filtrar productos - si tiene subcategorías, mostrar productos de todas las subcategorías
    // Si no tiene subcategorías, mostrar productos de esta categoría
    let products;
    if (subcategories.length > 0) {
        // Obtener productos de la categoría padre y todas sus subcategorías
        const categoryIds = [currentCategory.id, ...subcategories.map(sub => sub.id)]
        products = allProducts.filter(product =>
            product.categoryId && categoryIds.includes(product.categoryId)
        )
    } else {
        // Si no hay subcategorías, buscar por categoryId o por el nombre de categoría (compatibilidad)
        products = allProducts.filter(product =>
            (product.categoryId === currentCategory.id) ||
            product.category.toLowerCase().replace(/\s+/g, '-') === categorySlug.toLowerCase()
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                        {currentCategory.name}
                    </h1>
                    {currentCategory.description && (
                        <p className="text-muted-foreground text-lg mb-4">
                            {currentCategory.description}
                        </p>
                    )}
                </div>

                {/* Mostrar subcategorías si las hay */}
                {subcategories.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">Subcategorías</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {subcategories.map((subcategory) => (
                                <Link
                                    key={subcategory.id}
                                    href={`/category/${subcategory.slug}`}
                                    className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                                >
                                    <h3 className="font-medium">{subcategory.name}</h3>
                                    {subcategory.description && (
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {subcategory.description}
                                        </p>
                                    )}
                                    {subcategory.productCount && (
                                        <p className="text-xs text-muted-foreground mt-2">
                                            {subcategory.productCount} productos
                                        </p>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Mostrar productos */}
                {products.length > 0 ? (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">
                            {subcategories.length > 0 ? 'Todos los productos' : 'Productos'}
                        </h2>
                        <ProductGrid products={products} />
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="max-w-md mx-auto">
                            <h3 className="text-xl font-semibold mb-2">
                                No hay productos disponibles
                            </h3>
                            <p className="text-muted-foreground mb-6">
                                No se encontraron productos en esta categoría en este momento.
                            </p>
                            <Link
                                href="/"
                                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                            >
                                Ver todos los productos
                            </Link>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
