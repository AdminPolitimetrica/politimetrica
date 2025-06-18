"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff, LogIn, AlertCircle } from "lucide-react"
import { FcGoogle } from "react-icons/fc"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useCurrentUser } from "@/lib/auth"
import { loginWithEmail, signInWithGoogle } from "@/lib/auth-providers"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams.get("redirect") || "/suscripcion"
  const oauthError = searchParams.get("error")
  const { user } = useCurrentUser()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState("")

  // Manejar errores de OAuth desde la URL
  useEffect(() => {
    if (oauthError) {
      if (oauthError === "oauth_failed") {
        setError("Error en la autenticación con Google. Por favor intenta de nuevo.")
      } else if (oauthError === "access_denied") {
        setError("Acceso denegado. Por favor autoriza la aplicación para continuar.")
      }
    }
  }, [oauthError])

  // Redirigir si el usuario ya está autenticado
  useEffect(() => {
    if (user) {
      router.push(redirectPath)
    }
  }, [user, router, redirectPath])

  // Manejo de login con email
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await loginWithEmail(email, password)
      router.push(redirectPath)
    } catch (err: any) {
      console.error("Login error:", err)
      
      let errorMessage = "Error al iniciar sesión. Por favor intenta de nuevo."
      
      if (err.message) {
        // Mapeo de errores de Supabase
        if (err.message.includes("Invalid login credentials") || 
            err.message.includes("invalid_credentials")) {
          errorMessage = "Credenciales inválidas. Por favor verifica tu correo y contraseña."
        } else if (err.message.includes("Email not confirmed") || 
                   err.message.includes("email_not_confirmed")) {
          errorMessage = "Por favor verifica tu correo electrónico antes de iniciar sesión. Revisa tu bandeja de entrada."
        } else if (err.message.includes("Too many requests") || 
                   err.message.includes("rate_limit")) {
          errorMessage = "Demasiados intentos fallidos. Por favor intenta más tarde."
        } else if (err.message.includes("User not found")) {
          errorMessage = "No existe una cuenta con este correo electrónico. ¿Quieres registrarte?"
        } else {
          errorMessage = err.message
        }
      }

      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Manejo de login con Google (actualizado para usar callback)
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    setError("")

    try {
      // signInWithGoogle ahora redirige automáticamente a Google OAuth
      // y luego a /auth/callback, no necesitamos manejar la respuesta aquí
      await signInWithGoogle()
      
      // Este código no se ejecutará porque signInWithGoogle redirige
      // La lógica de éxito se maneja en /auth/callback
      
    } catch (err: any) {
      console.error("Google login error:", err)
      
      let errorMessage = "Error al iniciar sesión con Google. Por favor intenta de nuevo."
      
      if (err.message) {
        if (err.message.includes("invalid_redirect_uri")) {
          errorMessage = "Error de configuración. Por favor contacta al soporte técnico."
        } else if (err.message.includes("access_denied")) {
          errorMessage = "Acceso denegado. Por favor autoriza la aplicación para continuar."
        } else if (err.message.includes("popup")) {
          errorMessage = "La ventana de autenticación fue bloqueada. Por favor permite ventanas emergentes."
        } else if (err.message.includes("network")) {
          errorMessage = "Error de conexión. Por favor verifica tu conexión a internet."
        } else {
          errorMessage = err.message
        }
      }

      setError(errorMessage)
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Iniciar Sesión</CardTitle>
          <CardDescription>Ingresa tus credenciales para acceder a tu cuenta</CardDescription>
        </CardHeader>
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
              <span className="bg-background px-2 text-muted-foreground">O inicia sesión con email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Contraseña</Label>
                  <Link href="/auth/reset-password" className="text-sm text-primary hover:underline">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading || googleLoading}
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
              </div>

              <Button type="submit" className="w-full" disabled={loading || googleLoading}>
                {loading ? (
                  "Iniciando sesión..."
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Iniciar Sesión
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-center text-sm">
            ¿No tienes una cuenta?{" "}
            <Link href="/auth/register" className="text-primary hover:underline">
              Regístrate
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}