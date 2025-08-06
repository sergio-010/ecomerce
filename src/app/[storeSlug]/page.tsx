import { getStoreData } from "@/lib"
import { ProductGrid } from "@/components/public/ProductGrid"

interface Props {
    params: Promise<{
        storeSlug: string
    }>
}

export default async function StorePage({ params }: Props) {
    const { storeSlug } = await params
    const { products } = await getStoreData(storeSlug)

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Productos disponibles
            </h2>

            <ProductGrid products={products} />
        </main>
    )
}
