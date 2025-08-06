"use client"

import { useForm } from "react-hook-form"
import { useAuthStore } from "@/store/auth-store"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface LoginFormInputs {
    email: string
    password: string
}

export default function AdminLoginPage() {
    const router = useRouter()
    const login = useAuthStore((state) => state.login)
    const [loginError, setLoginError] = useState("")

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<LoginFormInputs>()

    const onSubmit = async (data: LoginFormInputs) => {
        setLoginError("")

        try {
            const success = await login(data.email, data.password)

            if (success) {
                router.push("/admin/products")
            } else {
                setLoginError("Credenciales incorrectas")
            }
        } catch {
            setLoginError("Error al iniciar sesión")
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Panel de Administración
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Inicia sesión para gestionar tu tienda
                    </p>
                    <div className="mt-4 p-4 bg-blue-50 rounded-md">
                        <p className="text-sm text-blue-800">
                            <strong>Credenciales de prueba:</strong><br />
                            Email: admin@tienda.com<br />
                            Contraseña: admin123
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
                    {loginError && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-3">
                            <p className="text-sm text-red-600">{loginError}</p>
                        </div>
                    )}

                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Correo electrónico
                            </label>
                            <input
                                type="email"
                                {...register("email", {
                                    required: "El correo es obligatorio",
                                    pattern: {
                                        value: /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/,
                                        message: "Correo no válido"
                                    }
                                })}
                                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${errors.email ? "border-red-500" : "border-gray-300"
                                    } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                placeholder="admin@tienda.com"
                                defaultValue="admin@tienda.com"
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                {...register("password", {
                                    required: "La contraseña es obligatoria",
                                    minLength: {
                                        value: 6,
                                        message: "Debe tener al menos 6 caracteres"
                                    }
                                })}
                                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${errors.password ? "border-red-500" : "border-gray-300"
                                    } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                placeholder="Tu contraseña"
                                defaultValue="admin123"
                            />
                            {errors.password && (
                                <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
