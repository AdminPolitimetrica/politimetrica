"use client"

import type React from "react"

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
import { loginWithEmail, signInWithGoogle, signInWithGoogleToken } from "@/lib/auth-providers"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams.get("redirect") || "/"
  const { user } = useCurrentUser()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState("")

  // Si el usuario ya está autenticado, redirigir
  useEffect(() => {
    if (user) {
      router.push(redirectPath)
    }
  }, [user, router, redirectPath])

  // Escuchar mensajes desde Flutter WebView con tokens Google
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "GOOGLE_TOKENS") {
        const { idToken } = event.data
        if (idToken) {
          setGoogleLoading(true)
          signInWithGoogleToken(idToken)
            .then(() => {
              router.push(redirectPath)
            })
            .catch((err) => {
              console.error("Error autenticando con token recibido:", err)
              setError("Error al autenticar con Google. Por favor intenta de nuevo.")
            })
            .finally(() => {
              setGoogleLoading(false)
            })
        }
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [router, redirectPath])

  // Manejo de login con email
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const userData = await loginWithEmail(email, password)
      setTimeout(() => {
        if (userData.subscription === "free" && redirectPath === "/") {
          router.push("/suscripcion")
        } else {
          router.push(redirectPath)
        }
      }, 500)
    } catch (err: any) {
      if (err.code) {
        switch (err.code) {
          case "auth/user-not-found":
            setError("No existe una cuenta con este correo electrónico.")
            break
          case "auth/wrong-password":
            setError("Contraseña incorrecta. Por favor intenta de nuevo.")
            break
          case "auth/invalid-credential":
            setError("Credenciales inválidas. Por favor verifica tu correo y contraseña.")
            break
          case "auth/too-many-requests":
            setError("Demasiados intentos fallidos. Por favor intenta más tarde.")
            break
          default:
            setError(err.message || "Error al iniciar sesión. Por favor intenta de nuevo.")
        }
      } else {
        setError("Error al iniciar sesión. Por favor intenta de nuevo.")
      }
    } finally {
      setLoading(false)
    }
  }

  // Manejo de login con Google (botón web)
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    setError("")

    try {
      const userData = await signInWithGoogle()
      if (userData.subscription === "free" && redirectPath === "/") {
        router.push("/suscripcion")
      } else {
        router.push(redirectPath)
      }
    } catch (err: any) {
      if (err.code) {
        switch (err.code) {
          case "auth/unauthorized-domain":
            setError(
              "Este dominio no está autorizado en Firebase. Si estás en un entorno de desarrollo o vista previa, debes agregar este dominio en la consola de Firebase (Authentication > Settings > Authorized domains).",
            )
            break
          case "auth/configuration-not-found":
            setError(
              "Error de configuración: La autenticación con Google no está correctamente configurada. Por favor intenta con email y contraseña o contacta al administrador.",
            )
            break
          case "auth/popup-closed-by-user":
            setError("Inicio de sesión cancelado. La ventana de Google fue cerrada.")
            break
          case "auth/popup-blocked":
            setError(
              "El navegador bloqueó la ventana emergente. Por favor permite ventanas emergentes para este sitio.",
            )
            break
          case "auth/cancelled-popup-request":
            setError("Múltiples solicitudes de ventanas emergentes. Por favor intenta de nuevo.")
            break
          default:
            setError(`Error al iniciar sesión con Google (${err.code}). Por favor intenta con email y contraseña.`)
        }
      } else {
        setError(err.message || "Error al iniciar sesión con Google. Por favor intenta con email y contraseña.")
      }
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
            disabled={googleLoading}
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
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
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

              <Button type="submit" className="w-full" disabled={loading}>
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
