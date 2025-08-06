import { getProducts } from "@/lib"
import { ProductGrid } from "@/components/public/ProductGrid"
import { Navbar } from "@/components/public/Navbar"
import Link from "next/link"

interface Props {
    params: Promise<{
        category: string
    }>
}

export default async function CategoryPage({ params }: Props) {
    const { category: categorySlug } = await params
    const allProducts = await getProducts()

    // Filtrar productos por categoría (por ahora usando el campo category existente)
    const products = allProducts.filter(product =>
        product.category.toLowerCase().replace(/\s+/g, '-') === categorySlug.toLowerCase()
    )

    // Generar título legible desde el slug
    const categoryTitle = categorySlug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                        {categoryTitle}
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Explora nuestra selección de {categoryTitle.toLowerCase()}
                    </p>
                </div>

                {products.length > 0 ? (
                    <ProductGrid products={products} />
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
