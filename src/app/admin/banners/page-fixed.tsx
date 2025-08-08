"use client"

import { AdminLayout } from "@/components/admin/AdminLayout"
import { useBannerStore } from "@/store/banner-store"
import { BannerForm } from "@/components/admin/BannerForm"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"

export default function BannersPage() {
    // Optimizar selectores para evitar bucles infinitos
    const banners = useBannerStore((state) => state.banners)
    const deleteBanner = useBannerStore((state) => state.deleteBanner)
    const toggleBannerStatus = useBannerStore((state) => state.toggleBannerStatus)

    const handleDelete = (id: string) => {
        const banner = banners.find(b => b.id === id)
        toast.error(`¿Eliminar ${banner?.title}?`, {
            description: "Esta acción no se puede deshacer",
            action: {
                label: "Eliminar",
                onClick: () => deleteBanner(id)
            }
        })
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Gestión de Banners</h1>
                        <p className="text-muted-foreground">
                            Administra los banners que se muestran en la página principal
                        </p>
                    </div>
                    <BannerForm />
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Banners ({banners.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {banners.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground mb-4">
                                    No hay banners creados todavía
                                </p>
                                <BannerForm trigger={<Button>Crear primer banner</Button>} />
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Título</TableHead>
                                            <TableHead>Estado</TableHead>
                                            <TableHead>Orden</TableHead>
                                            <TableHead>Enlace</TableHead>
                                            <TableHead>Fecha de creación</TableHead>
                                            <TableHead className="text-right">Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {banners
                                            .sort((a, b) => a.sortOrder - b.sortOrder)
                                            .map((banner) => (
                                                <TableRow key={banner.id}>
                                                    <TableCell>
                                                        <div>
                                                            <div className="font-medium">{banner.title}</div>
                                                            {banner.description && (
                                                                <div className="text-sm text-muted-foreground">
                                                                    {banner.description}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={banner.isActive ? "default" : "secondary"}>
                                                            {banner.isActive ? "Activo" : "Inactivo"}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>{banner.sortOrder}</TableCell>
                                                    <TableCell>
                                                        {banner.link ? (
                                                            <span className="text-blue-600">{banner.link}</span>
                                                        ) : (
                                                            <span className="text-muted-foreground">Sin enlace</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {banner.createdAt.toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end space-x-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => toggleBannerStatus(banner.id)}
                                                            >
                                                                {banner.isActive ? (
                                                                    <EyeOff className="h-4 w-4" />
                                                                ) : (
                                                                    <Eye className="h-4 w-4" />
                                                                )}
                                                            </Button>
                                                            <BannerForm
                                                                banner={banner}
                                                                trigger={
                                                                    <Button variant="ghost" size="sm">
                                                                        <Edit className="h-4 w-4" />
                                                                    </Button>
                                                                }
                                                            />
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleDelete(banner.id)}
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
