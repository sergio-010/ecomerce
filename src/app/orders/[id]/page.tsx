import { OrderDetails } from "@/components/public/OrderDetails";
import { Navbar } from "@/components/public/Navbar";

interface OrderPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function OrderPage({ params }: OrderPageProps) {
    const { id } = await params;
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <OrderDetails orderId={id} />
        </div>
    );
}
