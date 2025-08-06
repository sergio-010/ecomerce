import { getStoreData } from "@/lib"
import type { Metadata } from "next"
import type { ReactNode } from "react"
import { Navbar } from "@/components/public/Navbar"

export async function generateMetadata({
    params,
}: {
    params: Promise<{ storeSlug: string }>
}): Promise<Metadata> {
    const { storeSlug } = await params
    return {
        title: `Tienda - ${storeSlug}`,
    }
}

export default async function StoreLayout({
    children,
    params,
}: {
    children: ReactNode
    params: Promise<{ storeSlug: string }>
}) {
    const { storeSlug } = await params
    const { config } = await getStoreData(storeSlug)

    return (
        <div className="min-h-screen bg-white text-gray-900">
            <Navbar config={config} storeSlug={storeSlug} />
            {children}
        </div>
    )
}
