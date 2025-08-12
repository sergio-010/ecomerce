"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useOrderStore } from "@/store/order-store";
import { Order } from "@/types/order";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";

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

export function UserOrdersList() {
    // Optimizar selectores para evitar bucles infinitos - calcular directamente
    const allOrders = useOrderStore((state) => state.orders)
    const { data: session } = useSession();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        if (session?.user?.id) {
            const userOrders = allOrders.filter(order => order.userId === session.user.id);
            setOrders(userOrders.sort((a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            ));
        }
    }, [session?.user?.id, allOrders]);

    if (!session?.user) {
        return (
            <div className="text-center p-8">
                <h2 className="text-2xl font-bold mb-4">Inicia sesión para ver tus órdenes</h2>
                <p className="text-gray-600 mb-4">Necesitas una cuenta para ver tu historial de órdenes.</p>
                <Button onClick={() => router.push("/auth")}>
                    Iniciar Sesión
                </Button>
            </div>
        );
    } if (orders.length === 0) {
        return (
            <div className="text-center p-8">
                <h2 className="text-2xl font-bold mb-4">No tienes órdenes aún</h2>
                <p className="text-gray-600 mb-6">Cuando realices tu primera compra, aparecerá aquí.</p>
                <Link href="/">
                    <Button>Continuar Comprando</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Mis Órdenes</h1>

            <div className="space-y-4 sm:space-y-6">
                {orders.map((order) => (
                    <Card key={order.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                <div>
                                    <CardTitle className="text-lg">Orden #{order.id}</CardTitle>
                                    <CardDescription>
                                        {new Date(order.createdAt).toLocaleDateString()} • Orden
                                    </CardDescription>
                                </div>
                                <Badge className={statusColors[order.status]}>
                                    {statusLabels[order.status]}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {/* Información de la orden */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Número de orden:</span>
                                        <span className="text-sm font-medium">{order.orderNumber}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Subtotal:</span>
                                        <span className="text-sm">${order.subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Envío:</span>
                                        <span className="text-sm">${order.shipping.toFixed(2)}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Impuestos:</span>
                                        <span className="text-sm">${order.tax.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-4 border-t gap-3">
                                    <div>
                                        <p className="text-lg font-semibold">
                                            Total: ${order.total.toFixed(2)}
                                        </p>
                                    </div>
                                    <Link href={`/orders/${order.id}`}>
                                        <Button variant="outline" className="w-full sm:w-auto">Ver Detalles</Button>
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
