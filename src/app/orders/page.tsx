import { UserOrdersList } from "@/components/public/UserOrdersList";
import { Navbar } from "@/components/public/Navbar";

export default function OrdersPage() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <UserOrdersList />
        </div>
    );
}
