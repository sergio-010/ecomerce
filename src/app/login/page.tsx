"use client"

import { useState, useEffect } from "react"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import Link from "next/link"
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/public/Navbar"

interface LoginFormInputs {
    email: string
    password: string
}

export default function LoginPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [loginError, setLoginError] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    // Redireccionar si ya está logueado
    useEffect(() => {
        if (status === "authenticated") {
            router.push("/")
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
            const result = await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false,
            })

            if (result?.error) {
                setLoginError("Credenciales incorrectas. Verifica tu email y contraseña.")
            } else if (result?.ok) {
                router.push("/")
            }
        } catch {
            setLoginError("Error al iniciar sesión. Inténtalo de nuevo.")
        }
    }

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Cargando...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container max-w-md mx-auto px-4 py-20">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="text-center space-y-2">
                        <div className="flex justify-center mb-4">
                            <div className="p-3 bg-primary/10 rounded-full">
                                <User className="w-8 h-8 text-primary" />
                            </div>
                        </div>

                        <h1 className="text-2xl font-bold tracking-tight">Iniciar Sesión</h1>
                        <p className="text-muted-foreground">
                            Accede a tu cuenta para una mejor experiencia de compra
                        </p>
                    </div>

                    {/* Login Card */}
                    <Card className="shadow-lg">
                        <CardHeader className="space-y-1 pb-4">
                            <CardTitle className="text-xl text-center">Bienvenido de vuelta</CardTitle>
                            <CardDescription className="text-center">
                                Ingresa tus credenciales para continuar
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* Credenciales de prueba */}
                            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm text-blue-800">
                                    <strong>Credenciales de prueba:</strong><br />
                                    📧 usuario@tienda.com<br />
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
                                            placeholder="tu@email.com"
                                            className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                                            defaultValue="usuario@tienda.com"
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
                                    className="w-full h-11"
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

                            <div className="mt-6 text-center">
                                <p className="text-sm text-muted-foreground">
                                    ¿Eres administrador?{" "}
                                    <Link href="/admin/login" className="text-primary hover:underline font-medium">
                                        Accede al panel de administración
                                    </Link>
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
