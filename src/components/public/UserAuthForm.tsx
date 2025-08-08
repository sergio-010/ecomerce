"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface LoginFormInputs {
    email: string;
    password: string;
}

interface RegisterFormInputs {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export function UserAuthForm() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [authError, setAuthError] = useState("");

    const {
        register: registerLogin,
        handleSubmit: handleSubmitLogin,
        formState: { errors: loginErrors, isSubmitting: isLoggingIn }
    } = useForm<LoginFormInputs>();

    const {
        register: registerSignup,
        handleSubmit: handleSubmitSignup,
        formState: { errors: signupErrors, isSubmitting: isSigningUp },
        watch,
    } = useForm<RegisterFormInputs>();

    const onLogin = async (data: LoginFormInputs) => {
        setAuthError("");

        try {
            const loadingToast = toast.loading("Iniciando sesión...", {
                description: "Verificando credenciales"
            });

            const result = await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false,
            });

            toast.dismiss(loadingToast);

            if (result?.error) {
                toast.error("Credenciales incorrectas", {
                    description: "Verifica tu email y contraseña"
                });
                setAuthError("Credenciales incorrectas. Verifica tu email y contraseña.");
            } else if (result?.ok) {
                toast.success("¡Bienvenido!", {
                    description: "Has iniciado sesión exitosamente"
                });
                router.push("/");
            }
        } catch (_error) {
            toast.error("Error al iniciar sesión", {
                description: "Inténtalo de nuevo más tarde"
            });
            setAuthError("Error al iniciar sesión. Inténtalo de nuevo.");
        }
    };

    const onRegister = async (data: RegisterFormInputs) => {
        setAuthError("");

        if (data.password !== data.confirmPassword) {
            toast.error("Las contraseñas no coinciden", {
                description: "Verifica que ambas contraseñas sean iguales"
            });
            setAuthError("Las contraseñas no coinciden");
            return;
        }

        try {
            // Aquí iría la lógica de registro
            // Por ahora simulamos un registro exitoso
            toast.info("Funcionalidad en desarrollo", {
                description: "Por ahora usa las credenciales de prueba"
            });
        } catch (_error) {
            toast.error("Error al crear la cuenta", {
                description: "Inténtalo de nuevo más tarde"
            });
            setAuthError("Error al crear la cuenta. Inténtalo de nuevo.");
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <Card>
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl text-center">
                        {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
                    </CardTitle>
                    <CardDescription className="text-center">
                        {isLogin
                            ? "Ingresa tus credenciales para acceder"
                            : "Crea una cuenta para realizar compras"
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Botones de alternancia */}
                    <div className="flex border rounded-lg p-1 mb-6 bg-gray-100">
                        <button
                            type="button"
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${isLogin
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            Iniciar Sesión
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${!isLogin
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            Registrarse
                        </button>
                    </div>

                    {authError && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
                            <p className="text-sm text-red-600">{authError}</p>
                        </div>
                    )}

                    {/* Credenciales de prueba */}
                    {isLogin && (
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800">
                                <strong>Credenciales de prueba:</strong><br />
                                📧 usuario@tienda.com<br />
                                🔒 admin123
                            </p>
                        </div>
                    )}

                    {isLogin ? (
                        /* Formulario de Login */
                        <form onSubmit={handleSubmitLogin(onLogin)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="tu@email.com"
                                        className={`pl-10 ${loginErrors.email ? "border-red-500" : ""}`}
                                        defaultValue="usuario@tienda.com"
                                        {...registerLogin("email", {
                                            required: "El email es obligatorio",
                                            pattern: {
                                                value: /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/,
                                                message: "Email no válido"
                                            }
                                        })}
                                    />
                                </div>
                                {loginErrors.email && (
                                    <p className="text-sm text-red-500">{loginErrors.email.message}</p>
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
                                        className={`pl-10 pr-10 ${loginErrors.password ? "border-red-500" : ""}`}
                                        defaultValue="admin123"
                                        {...registerLogin("password", {
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
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                </div>
                                {loginErrors.password && (
                                    <p className="text-sm text-red-500">{loginErrors.password.message}</p>
                                )}
                            </div>

                            <Button type="submit" className="w-full" disabled={isLoggingIn}>
                                {isLoggingIn ? "Iniciando sesión..." : "Iniciar Sesión"}
                            </Button>
                        </form>
                    ) : (
                        /* Formulario de Registro */
                        <form onSubmit={handleSubmitSignup(onRegister)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nombre completo</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Tu nombre completo"
                                        className={`pl-10 ${signupErrors.name ? "border-red-500" : ""}`}
                                        {...registerSignup("name", {
                                            required: "El nombre es obligatorio",
                                            minLength: {
                                                value: 2,
                                                message: "Debe tener al menos 2 caracteres"
                                            }
                                        })}
                                    />
                                </div>
                                {signupErrors.name && (
                                    <p className="text-sm text-red-500">{signupErrors.name.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="signup-email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="signup-email"
                                        type="email"
                                        placeholder="tu@email.com"
                                        className={`pl-10 ${signupErrors.email ? "border-red-500" : ""}`}
                                        {...registerSignup("email", {
                                            required: "El email es obligatorio",
                                            pattern: {
                                                value: /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/,
                                                message: "Email no válido"
                                            }
                                        })}
                                    />
                                </div>
                                {signupErrors.email && (
                                    <p className="text-sm text-red-500">{signupErrors.email.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="signup-password">Contraseña</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="signup-password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Tu contraseña"
                                        className={`pl-10 pr-10 ${signupErrors.password ? "border-red-500" : ""}`}
                                        {...registerSignup("password", {
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
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                </div>
                                {signupErrors.password && (
                                    <p className="text-sm text-red-500">{signupErrors.password.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">Confirmar contraseña</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="confirm-password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Confirma tu contraseña"
                                        className={`pl-10 ${signupErrors.confirmPassword ? "border-red-500" : ""}`}
                                        {...registerSignup("confirmPassword", {
                                            required: "Confirma tu contraseña",
                                            validate: (value) =>
                                                value === watch("password") || "Las contraseñas no coinciden"
                                        })}
                                    />
                                </div>
                                {signupErrors.confirmPassword && (
                                    <p className="text-sm text-red-500">{signupErrors.confirmPassword.message}</p>
                                )}
                            </div>

                            <Button type="submit" className="w-full" disabled={isSigningUp}>
                                {isSigningUp ? "Creando cuenta..." : "Crear Cuenta"}
                            </Button>
                        </form>
                    )}

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
                            <button
                                type="button"
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                                {isLogin ? "Regístrate aquí" : "Inicia sesión"}
                            </button>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
