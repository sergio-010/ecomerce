import { UserAuthForm } from "@/components/public/UserAuthForm";

export default function AuthPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Bienvenido</h1>
                    <p className="text-gray-600 mt-2">Inicia sesión o crea una cuenta para continuar</p>
                </div>
                <UserAuthForm />
            </div>
        </div>
    );
}
