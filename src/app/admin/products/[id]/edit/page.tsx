"use client"

import { AdminLayout } from "@/components/admin/AdminLayout"
import { ProductForm } from "@/components/admin/ProductForm"
import { use } from "react"

interface EditProductPageProps {
    params: Promise<{ id: string }>
}

export default function EditProductPage({ params }: EditProductPageProps) {
    const { id } = use(params)

    return (
        <AdminLayout>
            <ProductForm productId={id} />
        </AdminLayout>
    )
}
