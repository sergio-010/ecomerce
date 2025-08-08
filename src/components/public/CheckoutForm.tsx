"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/store/cart-store";
import { useOrderStore } from "@/store/order-store";
import { useNotifications } from "@/components/ui/notifications";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";

interface ShippingForm {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
    notes: string;
}

export function CheckoutForm() {
    const router = useRouter();
    const { data: session } = useSession();

    // Optimizar selectores para evitar bucles infinitos
    const items = useCartStore((state) => state.items)
    const clearCart = useCartStore((state) => state.clearCart)
    const createOrder = useOrderStore((state) => state.createOrder)
    const isLoading = useOrderStore((state) => state.isLoading)

    // Calcular el total directamente
    const getTotalPrice = () => items.reduce((total, item) => total + item.quantity * item.product.price, 0)

    const { showSuccess, showError } = useNotifications();
    const [shippingForm, setShippingForm] = useState<ShippingForm>({
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        phone: "",
        notes: "",
    });
    const [isCheckingCart, setIsCheckingCart] = useState(true);

    // Verificar si el carrito está vacío al cargar el componente
    useEffect(() => {
        const timer = setTimeout(() => {
            if (items.length === 0) {
                showError("Carrito vacío", "No hay productos en tu carrito. Añade algunos productos antes de proceder al checkout.");
                router.push('/');
            } else {
                setIsCheckingCart(false);
            }
        }, 100); // Pequeño delay para asegurar que el estado se haya hidratado

        return () => clearTimeout(timer);
    }, [items.length, router, showError]); const handleInputChange = (field: keyof ShippingForm, value: string) => {
        setShippingForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!session?.user) {
            showError("Acceso requerido", "Debes iniciar sesión para realizar una compra");
            router.push("/auth");
            return;
        }

        if (items.length === 0) {
            showError("Carrito vacío", "No hay productos en tu carrito para procesar");
            return;
        }

        try {
            const order = await createOrder({
                items,
                shippingAddress: {
                    street: shippingForm.street,
                    city: shippingForm.city,
                    state: shippingForm.state,
                    zipCode: shippingForm.zipCode,
                    country: shippingForm.country,
                },
                phone: shippingForm.phone,
                notes: shippingForm.notes,
            }, session);

            clearCart();
            showSuccess(
                "¡Orden creada exitosamente!",
                `Tu orden #${order.id.slice(-8)} ha sido registrada`,
                {
                    action: {
                        label: "Ver orden",
                        onClick: () => router.push(`/orders/${order.id}`)
                    }
                }
            );
            router.push(`/orders/${order.id}`);
        } catch (error) {
            console.error("Error al crear la orden:", error);
            showError(
                "Error al procesar la orden",
                "Hubo un problema al crear tu orden. Por favor intenta de nuevo."
            );
        }
    };

    // Mostrar loading si estamos verificando el carrito
    if (isCheckingCart) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Verificando carrito...</p>
                </div>
            </div>
        );
    }

    if (!session?.user) {
        return (
            <div className="text-center p-8">
                <h2 className="text-2xl font-bold mb-4">Inicia sesión para continuar</h2>
                <p className="text-gray-600 mb-4">Necesitas una cuenta para realizar una compra.</p>
                <Button onClick={() => router.push("/auth")}>
                    Iniciar Sesión
                </Button>
            </div>
        );
    } if (items.length === 0) {
        return (
            <div className="text-center p-8">
                <h2 className="text-2xl font-bold mb-4">Tu carrito está vacío</h2>
                <p className="text-gray-600">Agrega algunos productos antes de proceder al checkout.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <h1 className="text-3xl font-bold">Checkout</h1>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Formulario de envío */}
                <Card>
                    <CardHeader>
                        <CardTitle>Información de Envío</CardTitle>
                        <CardDescription>
                            Completa los datos para el envío de tu orden
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="street">Dirección</Label>
                                <Input
                                    id="street"
                                    value={shippingForm.street}
                                    onChange={(e) => handleInputChange("street", e.target.value)}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="city">Ciudad</Label>
                                    <Input
                                        id="city"
                                        value={shippingForm.city}
                                        onChange={(e) => handleInputChange("city", e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="state">Estado/Provincia</Label>
                                    <Input
                                        id="state"
                                        value={shippingForm.state}
                                        onChange={(e) => handleInputChange("state", e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="zipCode">Código Postal</Label>
                                    <Input
                                        id="zipCode"
                                        value={shippingForm.zipCode}
                                        onChange={(e) => handleInputChange("zipCode", e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="country">País</Label>
                                    <Input
                                        id="country"
                                        value={shippingForm.country}
                                        onChange={(e) => handleInputChange("country", e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="phone">Teléfono</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={shippingForm.phone}
                                    onChange={(e) => handleInputChange("phone", e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="notes">Notas (opcional)</Label>
                                <Textarea
                                    id="notes"
                                    value={shippingForm.notes}
                                    onChange={(e) => handleInputChange("notes", e.target.value)}
                                    placeholder="Instrucciones especiales para la entrega..."
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? "Procesando..." : "Confirmar Orden"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Resumen de la orden */}
                <Card>
                    <CardHeader>
                        <CardTitle>Resumen de la Orden</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div key={item.product.id} className="flex justify-between items-center">
                                    <div className="flex items-center space-x-3">
                                        <Image
                                            src={item.product.image}
                                            alt={item.product.name}
                                            width={48}
                                            height={48}
                                            className="object-cover rounded"
                                        />
                                        <div>
                                            <p className="font-medium">{item.product.name}</p>
                                            <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p className="font-semibold">
                                        {formatPrice(item.product.price * item.quantity)}
                                    </p>
                                </div>
                            ))}

                            <div className="border-t pt-4">
                                <div className="flex justify-between items-center text-lg font-bold">
                                    <span>Total:</span>
                                    <span>{formatPrice(getTotalPrice())}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
