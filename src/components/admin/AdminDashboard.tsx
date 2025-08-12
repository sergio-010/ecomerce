"use client";

import { useEffect, useState } from "react";
import { useOrderStore } from "@/store/order-store";
import { useProductStore } from "@/store/product-store";
import { useCategoryStore } from "@/store/category-store";
import { Order } from "@/types/order";
import { Product } from "@/types/product";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, ShoppingCart, DollarSign, TrendingUp, AlertCircle } from "lucide-react";
import Image from "next/image";

export function AdminDashboard() {
    // Optimizar selectores para evitar bucles infinitos
    const storeOrders = useOrderStore((state) => state.orders)
    const products = useProductStore((state) => state.products)
    const fetchProducts = useProductStore((state) => state.fetchProducts)
    const categories = useCategoryStore((state) => state.categories)
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        // Cargar productos si no están cargados
        if (products.length === 0) {
            fetchProducts();
        }
        // Calcular todas las órdenes directamente del store
        setOrders(storeOrders);
    }, [storeOrders, products.length, fetchProducts]);

    // Estadísticas de órdenes
    const orderStats = {
        total: orders.length,
        PENDING: orders.filter(o => o.status === "PENDING").length,
        CONFIRMED: orders.filter(o => o.status === "CONFIRMED").length,
        SHIPPED: orders.filter(o => o.status === "SHIPPED").length,
        DELIVERED: orders.filter(o => o.status === "DELIVERED").length,
        CANCELLED: orders.filter(o => o.status === "CANCELLED").length,
    };

    // Estadísticas de ventas
    const totalRevenue = orders
        .filter(o => o.status !== "CANCELLED")
        .reduce((sum, order) => sum + Number(order.total), 0);

    const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

    // Órdenes recientes
    const recentOrders = orders
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

    // Productos con bajo stock
    const lowStockProducts = products.filter(p => p.stock < 10);

    const statusColors = {
        PENDING: "bg-yellow-100 text-yellow-800",
        CONFIRMED: "bg-blue-100 text-blue-800",
        PROCESSING: "bg-orange-100 text-orange-800",
        SHIPPED: "bg-purple-100 text-purple-800",
        DELIVERED: "bg-green-100 text-green-800",
        CANCELLED: "bg-red-100 text-red-800",
        REFUNDED: "bg-gray-100 text-gray-800",
    };

    const statusLabels = {
        PENDING: "Pendiente",
        CONFIRMED: "Confirmado",
        PROCESSING: "Procesando",
        SHIPPED: "Enviado",
        DELIVERED: "Entregado",
        CANCELLED: "Cancelado",
        REFUNDED: "Reembolsado",
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
                    <p className="text-gray-600">Resumen general de tu negocio</p>
                </div>
            </div>

            {/* Métricas principales */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Órdenes</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{orderStats.total}</div>
                        <p className="text-xs text-muted-foreground">
                            {orderStats.PENDING} pendientes
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">
                            Promedio: ${averageOrderValue.toFixed(2)}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Productos</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{products.length}</div>
                        <p className="text-xs text-muted-foreground">
                            {lowStockProducts.length} con bajo stock
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Categorías</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{categories.length}</div>
                        <p className="text-xs text-muted-foreground">
                            Categorías activas
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                {/* Estados de órdenes */}
                <Card>
                    <CardHeader>
                        <CardTitle>Estado de Órdenes</CardTitle>
                        <CardDescription>Distribución actual de órdenes por estado</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Pendientes</span>
                                <Badge className="bg-yellow-100 text-yellow-800">
                                    {orderStats.PENDING}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Confirmadas</span>
                                <Badge className="bg-blue-100 text-blue-800">
                                    {orderStats.CONFIRMED}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Enviadas</span>
                                <Badge className="bg-purple-100 text-purple-800">
                                    {orderStats.SHIPPED}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Entregadas</span>
                                <Badge className="bg-green-100 text-green-800">
                                    {orderStats.DELIVERED}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Canceladas</span>
                                <Badge className="bg-red-100 text-red-800">
                                    {orderStats.CANCELLED}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Órdenes recientes */}
                <Card>
                    <CardHeader>
                        <CardTitle>Órdenes Recientes</CardTitle>
                        <CardDescription>Las últimas 5 órdenes recibidas</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {recentOrders.length === 0 ? (
                            <p className="text-sm text-gray-500 text-center py-4">
                                No hay órdenes recientes
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {recentOrders.map((order) => (
                                    <div key={order.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-gray-50 rounded-lg gap-2">
                                        <div>
                                            <p className="text-sm font-medium">#{order.id.slice(-8)}</p>
                                            <p className="text-xs text-gray-600">Usuario {order.userId}</p>
                                        </div>
                                        <div className="flex justify-between sm:block sm:text-right">
                                            <p className="text-sm font-semibold">${order.total.toFixed(2)}</p>
                                            <Badge className={statusColors[order.status]} style={{ fontSize: '10px' }}>
                                                {statusLabels[order.status]}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Productos con bajo stock */}
            {lowStockProducts.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-orange-500" />
                            Productos con Bajo Stock
                        </CardTitle>
                        <CardDescription>
                            Productos que necesitan reabastecimiento (menos de 10 unidades)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {lowStockProducts.slice(0, 6).map((product) => {
                                const productAny = product as any;
                                return (
                                    <div key={product.id} className="flex items-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                                        <Image
                                            src={productAny.images && productAny.images.length > 0 ? productAny.images[0].url : "/placeholder.svg"}
                                            alt={product.name}
                                            width={48}
                                            height={48}
                                            className="object-cover rounded mr-3 flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm truncate">{product.name}</p>
                                            <p className="text-xs text-orange-600">
                                                Stock: {product.stock} unidades
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
