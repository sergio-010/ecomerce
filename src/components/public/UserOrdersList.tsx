"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useOrderStore } from "@/store/order-store";
import { Order } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";

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
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8">Mis Órdenes</h1>

            <div className="space-y-6">
                {orders.map((order) => (
                    <Card key={order.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-lg">Orden #{order.id}</CardTitle>
                                    <CardDescription>
                                        {new Date(order.createdAt).toLocaleDateString()} • {order.items.length} producto{order.items.length !== 1 ? "s" : ""}
                                    </CardDescription>
                                </div>
                                <Badge className={statusColors[order.status]}>
                                    {statusLabels[order.status]}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {/* Productos de la orden (mostrar máximo 3) */}
                                <div className="space-y-2">
                                    {order.items.slice(0, 3).map((item) => (
                                        <div key={item.productId} className="flex items-center space-x-3">
                                            <Image
                                                src={item.productImage}
                                                alt={item.productName}
                                                width={40}
                                                height={40}
                                                className="object-cover rounded"
                                            />
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">{item.productName}</p>
                                                <p className="text-xs text-gray-600">
                                                    Cantidad: {item.quantity} • ${item.price.toFixed(2)} c/u
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    {order.items.length > 3 && (
                                        <p className="text-xs text-gray-500">
                                            +{order.items.length - 3} producto{order.items.length - 3 !== 1 ? "s" : ""} más
                                        </p>
                                    )}
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t">
                                    <div>
                                        <p className="text-lg font-semibold">
                                            Total: ${order.totalAmount.toFixed(2)}
                                        </p>
                                    </div>
                                    <Link href={`/orders/${order.id}`}>
                                        <Button variant="outline">Ver Detalles</Button>
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
