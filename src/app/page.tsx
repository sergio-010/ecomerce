import { getFeaturedProducts } from "@/lib"
import { ProductGrid } from "@/components/public/ProductGrid"
import { HeroBanner } from "@/components/public/HeroBanner"
import { CategoryGrid } from "@/components/public/CategoryGrid"
import { Footer } from "@/components/public/Footer"
import { Navbar } from "@/components/public/Navbar"

export default async function Home() {
  const featuredProducts = await getFeaturedProducts()

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Banner */}
        <section className="py-8">
          <HeroBanner />
        </section>

        {/* Categories Section */}
        <section className="py-12">
          <CategoryGrid />
        </section>

        {/* Products Section - Solo mostrar si hay productos destacados */}
        {featuredProducts.length > 0 && (
          <section className="py-12">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">
                Productos Destacados
              </h2>
              <p className="text-muted-foreground text-center">
                Descubre nuestros productos más populares
              </p>
            </div>
            <ProductGrid products={featuredProducts} />
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}
