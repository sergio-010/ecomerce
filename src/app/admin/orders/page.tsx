import { AdminLayout } from "@/components/admin/AdminLayout";
import { OrderManagement } from "@/components/admin/OrderManagement";

export default function AdminOrdersPage() {
    return (
        <AdminLayout>
            <OrderManagement />
        </AdminLayout>
    );
}
