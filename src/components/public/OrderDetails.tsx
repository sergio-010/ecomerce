"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useOrderStore } from "@/store/order-store";
import { Order } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface OrderDetailsProps {
    orderId: string;
}

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

export function OrderDetails({ orderId }: OrderDetailsProps) {
    // Optimizar selectores para evitar bucles infinitos - calcular directamente
    const orders = useOrderStore((state) => state.orders)
    const cancelOrder = useOrderStore((state) => state.cancelOrder)
    const { data: session } = useSession();
    const router = useRouter();
    const [order, setOrder] = useState<Order | undefined>();

    useEffect(() => {
        const foundOrder = orders.find(order => order.id === orderId);
        setOrder(foundOrder);
    }, [orderId, orders]); const handleCancelOrder = () => {
        if (order && (order.status === "pending" || order.status === "confirmed")) {
            if (confirm("¿Estás seguro de que quieres cancelar esta orden?")) {
                cancelOrder(order.id);
                setOrder({ ...order, status: "cancelled" });
            }
        }
    };

    if (!order) {
        return (
            <div className="text-center p-8">
                <h2 className="text-2xl font-bold mb-4">Orden no encontrada</h2>
                <p className="text-gray-600">La orden que buscas no existe o no tienes permisos para verla.</p>
            </div>
        );
    }

    // Verificar permisos
    if (!session?.user) {
        return (
            <div className="text-center p-8">
                <h2 className="text-2xl font-bold mb-4">Acceso denegado</h2>
                <p className="text-gray-600 mb-4">Debes iniciar sesión para ver esta orden.</p>
                <Button onClick={() => router.push("/auth")}>
                    Iniciar Sesión
                </Button>
            </div>
        );
    }

    if (session.user.role !== "admin" && session.user.id !== order.userId) {
        return (
            <div className="text-center p-8">
                <h2 className="text-2xl font-bold mb-4">Acceso denegado</h2>
                <p className="text-gray-600">No tienes permisos para ver esta orden.</p>
            </div>
        );
    } return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold">Orden #{order.id}</h1>
                    <p className="text-gray-600">
                        Creada el {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Badge className={statusColors[order.status]}>
                        {statusLabels[order.status]}
                    </Badge>
                    {(order.status === "pending" || order.status === "confirmed") && (
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleCancelOrder}
                        >
                            Cancelar Orden
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Información del cliente */}
                <Card>
                    <CardHeader>
                        <CardTitle>Información del Cliente</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p><strong>Nombre:</strong> {order.userName}</p>
                        <p><strong>Email:</strong> {order.userEmail}</p>
                        <p><strong>Teléfono:</strong> {order.phone}</p>
                    </CardContent>
                </Card>

                {/* Dirección de envío */}
                <Card>
                    <CardHeader>
                        <CardTitle>Dirección de Envío</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p>{order.shippingAddress.street}</p>
                        <p>
                            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                        </p>
                        <p>{order.shippingAddress.country}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Productos de la orden */}
            <Card>
                <CardHeader>
                    <CardTitle>Productos</CardTitle>
                    <CardDescription>
                        {order.items.length} producto{order.items.length !== 1 ? "s" : ""} en esta orden
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {order.items.map((item) => (
                            <div key={item.productId} className="flex justify-between items-center border-b pb-4">
                                <div className="flex items-center space-x-3">
                                    <Image
                                        src={item.productImage}
                                        alt={item.productName}
                                        width={64}
                                        height={64}
                                        className="object-cover rounded"
                                    />
                                    <div>
                                        <h3 className="font-medium">{item.productName}</h3>
                                        <p className="text-sm text-gray-600">
                                            ${item.price.toFixed(2)} x {item.quantity}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        ))}

                        <div className="border-t pt-4">
                            <div className="flex justify-between items-center text-xl font-bold">
                                <span>Total:</span>
                                <span>${order.totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Notas */}
            {order.notes && (
                <Card>
                    <CardHeader>
                        <CardTitle>Notas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{order.notes}</p>
                    </CardContent>
                </Card>
            )}

            {/* Historial de estado */}
            <Card>
                <CardHeader>
                    <CardTitle>Historial</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <p className="text-sm">
                            <strong>Creada:</strong> {new Date(order.createdAt).toLocaleString()}
                        </p>
                        <p className="text-sm">
                            <strong>Última actualización:</strong> {new Date(order.updatedAt).toLocaleString()}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
