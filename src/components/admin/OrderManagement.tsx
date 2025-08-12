"use client";

import { useEffect, useState } from "react";
import { useOrderStore } from "@/store/order-store";
import { Order, OrderStatus } from "@/types/order";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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

interface OrderManagementProps {
    className?: string;
}

export function OrderManagement({ className }: OrderManagementProps) {
    // Optimizar selectores para evitar bucles infinitos
    const storeOrders = useOrderStore((state) => state.orders)
    const updateOrderStatus = useOrderStore((state) => state.updateOrderStatus)
    const [orders, setOrders] = useState<Order[]>([]);
    const [filterStatus, setFilterStatus] = useState<OrderStatus | "all">("all");

    useEffect(() => {
        // Ordenar las órdenes directamente del store
        const sortedOrders = [...storeOrders].sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setOrders(sortedOrders);
    }, [storeOrders]);

    const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
        updateOrderStatus(orderId, newStatus);
        setOrders(prev => prev.map(order =>
            order.id === orderId
                ? { ...order, status: newStatus, updatedAt: new Date() }
                : order
        ));
    };

    const filteredOrders = filterStatus === "all"
        ? orders
        : orders.filter(order => order.status === filterStatus);

    const getOrderStats = () => {
        const stats = orders.reduce((acc, order) => {
            acc[order.status] = (acc[order.status] || 0) + 1;
            return acc;
        }, {} as Record<OrderStatus, number>);

        return {
            total: orders.length,
            PENDING: stats.PENDING || 0,
            CONFIRMED: stats.CONFIRMED || 0,
            SHIPPED: stats.SHIPPED || 0,
            DELIVERED: stats.DELIVERED || 0,
            CANCELLED: stats.CANCELLED || 0,
        };
    };

    const stats = getOrderStats();

    return (
        <div className={`space-y-6 ${className}`}>
            <div>
                <h1 className="text-3xl font-bold">Gestión de Órdenes</h1>
                <p className="text-gray-600">Administra todas las órdenes del sistema</p>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold">{stats.total}</p>
                            <p className="text-sm text-gray-600">Total</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-yellow-600">{stats.PENDING}</p>
                            <p className="text-sm text-gray-600">Pendientes</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-blue-600">{stats.CONFIRMED}</p>
                            <p className="text-sm text-gray-600">Confirmadas</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-purple-600">{stats.SHIPPED}</p>
                            <p className="text-sm text-gray-600">Enviadas</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">{stats.DELIVERED}</p>
                            <p className="text-sm text-gray-600">Entregadas</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-red-600">{stats.CANCELLED}</p>
                            <p className="text-sm text-gray-600">Canceladas</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filtros */}
            <Card>
                <CardHeader>
                    <CardTitle>Filtros</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4">
                        <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as OrderStatus | "all")}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Filtrar por estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas las órdenes</SelectItem>
                                <SelectItem value="pending">Pendientes</SelectItem>
                                <SelectItem value="confirmed">Confirmadas</SelectItem>
                                <SelectItem value="shipped">Enviadas</SelectItem>
                                <SelectItem value="delivered">Entregadas</SelectItem>
                                <SelectItem value="cancelled">Canceladas</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Lista de órdenes */}
            <Card>
                <CardHeader>
                    <CardTitle>Órdenes ({filteredOrders.length})</CardTitle>
                    <CardDescription>
                        Lista de todas las órdenes del sistema
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {filteredOrders.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No hay órdenes que coincidan con los filtros seleccionados.</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID de Orden</TableHead>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredOrders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-mono text-sm">
                                            {order.id.slice(-8)}
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">Usuario {order.userId}</p>
                                                <p className="text-sm text-gray-600">ID: {order.userId}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            ${order.total.toFixed(2)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={statusColors[order.status]}>
                                                {statusLabels[order.status]}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Select
                                                    value={order.status}
                                                    onValueChange={(value) => handleStatusChange(order.id, value as OrderStatus)}
                                                >
                                                    <SelectTrigger className="w-32">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="pending">Pendiente</SelectItem>
                                                        <SelectItem value="confirmed">Confirmado</SelectItem>
                                                        <SelectItem value="shipped">Enviado</SelectItem>
                                                        <SelectItem value="delivered">Entregado</SelectItem>
                                                        <SelectItem value="cancelled">Cancelado</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
