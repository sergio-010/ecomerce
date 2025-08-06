"use client"

import { useForm } from "react-hook-form"

interface LoginFormInputs {
    email: string
    password: string
}

export default function AdminLoginPage() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<LoginFormInputs>()

    const onSubmit = async (data: LoginFormInputs) => {
        console.log("Datos enviados:", data)
        // Aquí podrías llamar a tu endpoint de login con fetch o axios
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Iniciar sesión como administrador
                    </h2>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <input
                                type="email"
                                {...register("email", {
                                    required: "El correo es obligatorio",
                                    pattern: {
                                        value: /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/,
                                        message: "Correo no válido"
                                    }
                                })}
                                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${errors.email ? "border-red-500" : "border-gray-300"
                                    } placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                                placeholder="Correo electrónico"
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <input
                                type="password"
                                {...register("password", {
                                    required: "La contraseña es obligatoria",
                                    minLength: {
                                        value: 6,
                                        message: "Debe tener al menos 6 caracteres"
                                    }
                                })}
                                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${errors.password ? "border-red-500" : "border-gray-300"
                                    } placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                                placeholder="Contraseña"
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
                            {isSubmitting ? "Enviando..." : "Iniciar sesión"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
