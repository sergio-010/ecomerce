import { Navbar } from "@/components/public/Navbar"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-white text-gray-900">
            <Navbar />
            <main className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
                    <h1 className="text-2xl font-bold text-center mb-6">
                        Iniciar Sesión
                    </h1>

                    <form className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                                placeholder="tu@email.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                                placeholder="••••••••"
                            />
                        </div>

                        <Button type="submit" className="w-full">
                            Iniciar Sesión
                        </Button>
                    </form>

                    <p className="text-center text-sm text-gray-600 mt-4">
                        ¿No tienes cuenta?{" "}
                        <a href="/register" className="text-gray-900 hover:underline font-medium">
                            Regístrate aquí
                        </a>
                    </p>
                </div>
            </main>
        </div>
    )
}
