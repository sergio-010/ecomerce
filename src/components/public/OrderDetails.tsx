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
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";

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
    const { data: session } = useSession();
    const router = useRouter();

    // Optimizar selectores para evitar bucles infinitos
    const orders = useOrderStore((state) => state.orders)
    const cancelOrder = useOrderStore((state) => state.cancelOrder)

    // Estado local del componente
    const [order, setOrder] = useState<Order | undefined>();

    useEffect(() => {
        const foundOrder = orders.find(order => order.id === orderId);
        setOrder(foundOrder);
    }, [orderId, orders]);

    const handleCancelOrder = () => {
        if (order && (order.status === "pending" || order.status === "confirmed")) {
            toast.error("¿Cancelar esta orden?", {
                description: "Esta acción no se puede deshacer",
                action: {
                    label: "Cancelar orden",
                    onClick: () => {
                        cancelOrder(order.id);
                        setOrder({ ...order, status: "cancelled" });
                    }
                }
            })
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

    const canCancel = order.status === "pending" || order.status === "confirmed";
    const orderDate = new Date(order.createdAt).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header de la orden */}
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-2xl">Orden #{order.id.slice(-8)}</CardTitle>
                            <CardDescription className="text-base mt-2">
                                Realizada el {orderDate}
                            </CardDescription>
                        </div>
                        <div className="text-right">
                            <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                                {statusLabels[order.status as keyof typeof statusLabels]}
                            </Badge>
                            <div className="mt-2 text-2xl font-bold">
                                {formatPrice(order.totalAmount)}
                            </div>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Información del cliente */}
            <Card>
                <CardHeader>
                    <CardTitle>Información de entrega</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-semibold mb-2">Cliente</h4>
                            <p>{order.userName}</p>
                            <p className="text-gray-600">{order.userEmail}</p>
                            {order.phone && <p className="text-gray-600">{order.phone}</p>}
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">Dirección de envío</h4>
                            {order.shippingAddress ? (
                                <div className="text-gray-600">
                                    <p>{order.shippingAddress.street}</p>
                                    <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                                    <p>{order.shippingAddress.zipCode}</p>
                                    <p>{order.shippingAddress.country}</p>
                                </div>
                            ) : (
                                <p className="text-gray-500">No especificada</p>
                            )}
                        </div>
                    </div>
                    {order.notes && (
                        <div className="mt-4">
                            <h4 className="font-semibold mb-2">Notas adicionales</h4>
                            <p className="text-gray-600">{order.notes}</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Items de la orden */}
            <Card>
                <CardHeader>
                    <CardTitle>Productos ordenados</CardTitle>
                    <CardDescription>
                        {order.items.length} {order.items.length === 1 ? 'producto' : 'productos'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {order.items.map((item, index: number) => (
                            <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                                <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                                    <Image
                                        src={item.productImage || "/placeholder.svg"}
                                        alt={item.productName}
                                        fill
                                        className="object-cover"
                                        sizes="64px"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold">{item.productName}</h4>
                                    <p className="text-gray-600">Cantidad: {item.quantity}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                                    <p className="text-sm text-gray-600">{formatPrice(item.price)} c/u</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Total */}
                    <div className="border-t pt-4 mt-6">
                        <div className="flex justify-between items-center text-lg font-bold">
                            <span>Total:</span>
                            <span>{formatPrice(order.totalAmount)}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Acciones */}
            {canCancel && (
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="font-semibold">¿Necesitas cancelar tu orden?</h4>
                                <p className="text-gray-600 text-sm">
                                    Puedes cancelar tu orden mientras esté en estado pendiente o confirmado.
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                onClick={handleCancelOrder}
                                className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                                Cancelar orden
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}