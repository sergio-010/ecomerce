"use client"

import { useState, useEffect } from "react"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import Link from "next/link"
import { ArrowLeft, Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface LoginFormInputs {
    email: string
    password: string
}

export default function AdminLoginPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [loginError, setLoginError] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    // Redireccionar si ya está logueado
    useEffect(() => {
        if (status === "authenticated" && session?.user?.role === "admin") {
            router.push("/admin/products")
        }
    }, [session, status, router])

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<LoginFormInputs>()

    const onSubmit = async (data: LoginFormInputs) => {
        setLoginError("")

        try {
            console.log("Attempting login with:", data.email);

            const result = await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false,
            })

            console.log("SignIn result:", result);

            if (result?.error) {
                console.error("Login error:", result.error);
                setLoginError("Credenciales incorrectas. Verifica tu email y contraseña.")
            } else if (result?.ok) {
                console.log("Login successful, redirecting to admin...");
                // Usar window.location.href para forzar una recarga completa
                window.location.href = "/admin"
            } else {
                console.error("Unexpected login result:", result);
                setLoginError("Error inesperado al iniciar sesión.")
            }
        } catch (error) {
            console.error("Login exception:", error);
            setLoginError("Error al iniciar sesión. Inténtalo de nuevo.")
        }
    }

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Cargando...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
            <div className="w-full max-w-md space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                    <Link
                        href="/"
                        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Volver a la tienda
                    </Link>

                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-primary/10 rounded-full">
                            <ShieldCheck className="w-8 h-8 text-primary" />
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold tracking-tight">Panel de Administración</h1>
                    <p className="text-muted-foreground">
                        Inicia sesión para gestionar tu tienda
                    </p>
                </div>

                {/* Login Card */}
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="space-y-1 pb-4">
                        <CardTitle className="text-xl text-center">Iniciar Sesión</CardTitle>
                        <CardDescription className="text-center">
                            Ingresa tus credenciales de administrador
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Credenciales de prueba */}
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800">
                                <strong>Credenciales de prueba:</strong><br />
                                📧 admin@tienda.com<br />
                                🔒 admin123
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {loginError && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-sm text-red-600">{loginError}</p>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email">Correo electrónico</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="admin@tienda.com"
                                        className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                                        defaultValue="admin@tienda.com"
                                        {...register("email", {
                                            required: "El correo es obligatorio",
                                            pattern: {
                                                value: /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/,
                                                message: "Correo no válido"
                                            }
                                        })}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-sm text-red-500">{errors.email.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Contraseña</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Tu contraseña"
                                        className={`pl-10 pr-10 ${errors.password ? "border-red-500" : ""}`}
                                        defaultValue="admin123"
                                        {...register("password", {
                                            required: "La contraseña es obligatoria",
                                            minLength: {
                                                value: 6,
                                                message: "Debe tener al menos 6 caracteres"
                                            }
                                        })}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-1 top-1 h-8 w-8 p-0"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                                {errors.password && (
                                    <p className="text-sm text-red-500">{errors.password.message}</p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-11 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Iniciando sesión...
                                    </div>
                                ) : (
                                    "Iniciar sesión"
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
                <p className="text-center text-xs text-muted-foreground">
                    Este es un panel de administración seguro.
                    <br />
                    Solo usuarios autorizados pueden acceder.
                </p>
            </div>
        </div>
    )
}
