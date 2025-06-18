"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, UserPlus, Mail, AlertCircle } from "lucide-react"
import { FcGoogle } from "react-icons/fc"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { registerWithEmail, signInWithGoogle } from "@/lib/auth-providers"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState("")
  const [verificationSent, setVerificationSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      setLoading(false)
      return
    }

    try {
      await registerWithEmail(name, email, password)
      setVerificationSent(true)
    } catch (err: any) {
      console.error("Registration error:", err)
      
      // Manejo específico de errores de Supabase
      if (err.message?.includes("User already registered")) {
        setError("Este correo electrónico ya está registrado. Intenta iniciar sesión.")
      } else if (err.message?.includes("Invalid email")) {
        setError("Por favor ingresa un correo electrónico válido.")
      } else if (err.message?.includes("Password")) {
        setError("La contraseña debe tener al menos 6 caracteres.")
      } else {
        setError(err.message || "Error al registrar. Por favor intenta de nuevo.")
      }
    } finally {
      setLoading(false)
    }
  }

  // Función actualizada para usar callback
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    setError("")

    try {
      // signInWithGoogle ahora redirige automáticamente a Google OAuth
      // y luego a /auth/callback, no necesitamos manejar la respuesta aquí
      await signInWithGoogle()
      
      // Este código no se ejecutará porque signInWithGoogle redirige
      
    } catch (err: any) {
      console.error("Google sign-in error:", err)
      
      // Manejo específico de errores de OAuth
      if (err.message?.includes("invalid_redirect_uri")) {
        setError("Error de configuración. Por favor contacta al soporte.")
      } else if (err.message?.includes("access_denied")) {
        setError("Acceso denegado. Por favor intenta de nuevo.")
      } else {
        setError("No se pudo registrar con Google. Por favor intenta con email y contraseña.")
      }
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Crear Cuenta</CardTitle>
          <CardDescription>Ingresa tus datos para registrarte en Politimétrica</CardDescription>
        </CardHeader>
        {verificationSent ? (
          <CardContent className="space-y-4">
            <Alert className="bg-green-50 border-green-200">
              <Mail className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                Hemos enviado un correo de verificación a <strong>{email}</strong>. Por favor, revisa tu bandeja de
                entrada y sigue las instrucciones para verificar tu cuenta antes de iniciar sesión.
              </AlertDescription>
            </Alert>
            <div className="text-center mt-4 space-y-2">
              <Button onClick={() => router.push("/auth/login")} className="w-full">
                Ir a iniciar sesión
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setVerificationSent(false)} 
                className="w-full"
              >
                Volver al registro
              </Button>
            </div>
          </CardContent>
        ) : (
          <>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleSignIn}
                disabled={googleLoading || loading}
              >
                {googleLoading ? (
                  "Conectando..."
                ) : (
                  <>
                    <FcGoogle className="mr-2 h-5 w-5" />
                    Continuar con Google
                  </>
                )}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">O regístrate con email</span>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre Completo</Label>
                    <Input
                      id="name"
                      placeholder="Juan Pérez"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      disabled={loading || googleLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@ejemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading || googleLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading || googleLoading}
                        minLength={6}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading || googleLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="sr-only">{showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}</span>
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      La contraseña debe tener al menos 6 caracteres
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
                    <Input
                      id="confirm-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={loading || googleLoading}
                      minLength={6}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={loading || googleLoading}>
                    {loading ? (
                      "Registrando..."
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Registrarse
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <div className="text-center text-sm">
                ¿Ya tienes una cuenta?{" "}
                <Link href="/auth/login" className="text-primary hover:underline">
                  Iniciar Sesión
                </Link>
              </div>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  )
}