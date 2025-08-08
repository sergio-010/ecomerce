"use client";

import { useEffect, useState } from "react";
import { useOrderStore } from "@/store/order-store";
import { useProductStore } from "@/store/product-store";
import { useCategoryStore } from "@/store/category-store";
import { Order, OrderStatus } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, ShoppingCart, DollarSign, TrendingUp, AlertCircle, TestTube } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

export function AdminDashboard() {
    // Optimizar selectores para evitar bucles infinitos
    const storeOrders = useOrderStore((state) => state.orders)
    const products = useProductStore((state) => state.products)
    const categories = useCategoryStore((state) => state.categories)
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        // Calcular todas las órdenes directamente del store
        setOrders(storeOrders);
    }, [storeOrders]);

    const generateTestOrders = () => {
        // Esta función solo está para demostrar la funcionalidad
        // En un entorno real, las órdenes vendrían de los usuarios
        if (products.length === 0) {
            toast.error("No hay productos disponibles", {
                description: "Necesitas tener productos para generar órdenes de prueba"
            });
            return;
        }

        const testOrders = [];
        const statuses: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

        for (let i = 0; i < 5; i++) {
            const randomProducts = products.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 1);
            const orderItems = randomProducts.map(product => ({
                productId: product.id,
                productName: product.name,
                productImage: product.image,
                price: product.price,
                quantity: Math.floor(Math.random() * 3) + 1,
            }));

            const totalAmount = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

            const testOrder: Order = {
                id: `test_order_${Date.now()}_${i}`,
                userId: `test_user_${i}`,
                userEmail: `usuario${i}@test.com`,
                userName: `Usuario Test ${i + 1}`,
                items: orderItems,
                totalAmount,
                status: randomStatus,
                createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date().toISOString(),
                shippingAddress: {
                    street: `Calle Test ${i + 1}`,
                    city: "Ciudad Test",
                    state: "Estado Test",
                    zipCode: `1000${i}`,
                    country: "País Test",
                },
                phone: `+1234567890${i}`,
                notes: `Orden de prueba número ${i + 1}`,
            };

            testOrders.push(testOrder);
        }

        // Aquí normalmente agregarías las órdenes al store
        toast.success("Órdenes de prueba generadas", {
            description: `Se generarían ${testOrders.length} órdenes de prueba. Esta función es solo para demostrar la interfaz.`
        });
    };

    // Estadísticas de órdenes
    const orderStats = {
        total: orders.length,
        pending: orders.filter(o => o.status === "pending").length,
        confirmed: orders.filter(o => o.status === "confirmed").length,
        shipped: orders.filter(o => o.status === "shipped").length,
        delivered: orders.filter(o => o.status === "delivered").length,
        cancelled: orders.filter(o => o.status === "cancelled").length,
    };

    // Estadísticas de ventas
    const totalRevenue = orders
        .filter(o => o.status !== "cancelled")
        .reduce((sum, order) => sum + order.totalAmount, 0);

    const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

    // Órdenes recientes
    const recentOrders = orders
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

    // Productos con bajo stock
    const lowStockProducts = products.filter(p => p.quantity < 10);

    const statusColors = {
        pending: "bg-yellow-100 text-yellow-800",
        confirmed: "bg-blue-100 text-blue-800",
        shipped: "bg-purple-100 text-purple-800",
        delivered: "bg-green-100 text-green-800",
        cancelled: "bg-red-100 text-red-800",
    };

    const statusLabels = {
        pending: "Pendiente",
        confirmed: "Confirmado",
        shipped: "Enviado",
        delivered: "Entregado",
        cancelled: "Cancelado",
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-gray-600">Resumen general de tu negocio</p>
                </div>
                {orders.length === 0 && (
                    <Button onClick={generateTestOrders} variant="outline" className="flex items-center gap-2">
                        <TestTube className="h-4 w-4" />
                        Generar Órdenes de Prueba
                    </Button>
                )}
            </div>

            {/* Métricas principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Órdenes</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{orderStats.total}</div>
                        <p className="text-xs text-muted-foreground">
                            {orderStats.pending} pendientes
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
                        <div className="text-2xl font-bold">{categories.filter(cat => !cat.parentId).length}</div>
                        <p className="text-xs text-muted-foreground">
                            Categorías activas
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                                    {orderStats.pending}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Confirmadas</span>
                                <Badge className="bg-blue-100 text-blue-800">
                                    {orderStats.confirmed}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Enviadas</span>
                                <Badge className="bg-purple-100 text-purple-800">
                                    {orderStats.shipped}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Entregadas</span>
                                <Badge className="bg-green-100 text-green-800">
                                    {orderStats.delivered}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Canceladas</span>
                                <Badge className="bg-red-100 text-red-800">
                                    {orderStats.cancelled}
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
                                    <div key={order.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="text-sm font-medium">#{order.id.slice(-8)}</p>
                                            <p className="text-xs text-gray-600">{order.userName}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold">${order.totalAmount.toFixed(2)}</p>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {lowStockProducts.slice(0, 6).map((product) => (
                                <div key={product.id} className="flex items-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        width={48}
                                        height={48}
                                        className="object-cover rounded mr-3"
                                    />
                                    <div className="flex-1">
                                        <p className="font-medium text-sm">{product.name}</p>
                                        <p className="text-xs text-orange-600">
                                            Stock: {product.quantity} unidades
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
