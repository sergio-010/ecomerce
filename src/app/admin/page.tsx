import { redirect } from "next/navigation"

// Página de redirección para /admin -> /admin/login
export default function AdminPage() {
    redirect("/admin/login")
}
