"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Check, CreditCard, AlertCircle, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useCurrentUser } from "@/lib/auth"
import { subscribeToPlan, getActiveSubscription, type SubscriptionDetails } from "@/lib/subscription"
import { SubscriptionInfo } from "@/components/subscription-info"

export default function SuscripcionPage() {
  const router = useRouter()
  const { user, loading } = useCurrentUser()
  const [selectedPlan, setSelectedPlan] = useState("monthly")
  const [processingSubscription, setProcessingSubscription] = useState(false)
  const [redirectingToLogin, setRedirectingToLogin] = useState(false)
  const [error, setError] = useState("")
  const [subscription, setSubscription] = useState<SubscriptionDetails | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<"paypal" | "credit_card" | "free" | "stripe">("credit_card")
  const [subscriptionSuccess, setSubscriptionSuccess] = useState(false)

  useEffect(() => {
    // Si no hay usuario y ya terminamos de verificar, redirigir al login
    if (!loading && !user && !redirectingToLogin) {
      setRedirectingToLogin(true)
      router.push("/auth/login?redirect=/suscripcion")
    }

    // Si hay usuario, cargar detalles de suscripción
    if (user) {
      getActiveSubscription(user.id).then((details) => {
        setSubscription(details)

        // Si la suscripción está cancelada o expirada, actualizar el método de pago
        if (details && (details.status === "cancelled" || new Date(details.end_date) < new Date())) {
          // Usar el método de pago anterior si no era gratuito
          if (details.payment_method !== "free") {
            setPaymentMethod(details.payment_method)
          }
        }
      })
    }
  }, [user, loading, router, redirectingToLogin])

  const handleSubscribe = async () => {
    if (!user) {
      router.push("/auth/login?redirect=/suscripcion")
      return
    }

    // Validar que se haya seleccionado un método de pago
    if (selectedPlan !== "free" && paymentMethod === "free") {
      setError("Por favor selecciona un método de pago válido para el plan seleccionado.")
      return
    }

    setProcessingSubscription(true)
    setError("")

    try {
      // Determinar el plan basado en la selección
      const plan = selectedPlan === "monthly" ? "basic" : "premium"

      // Si el plan es gratuito, forzar el método de pago a "free"
      const finalPaymentMethod = selectedPlan === "free" ? "free" : paymentMethod

      const result = await subscribeToPlan(user.id, plan, finalPaymentMethod)
      setSubscription(result)
      setSubscriptionSuccess(true)

      // Mostrar mensaje de éxito y redirigir después de un tiempo
      setTimeout(() => {
        router.push("/")
      }, 5000)
    } catch (error: any) {
      setError(error.message || "Error al suscribirse. Por favor intenta nuevamente.")
    } finally {
      setProcessingSubscription(false)
    }
  }

  // Mostrar un estado de carga mientras verificamos la autenticación
  if (loading) {
    return (
      <div className="container mx-auto py-12 flex items-center justify-center">
        <p className="text-lg">Cargando...</p>
      </div>
    )
  }

  // Si no hay usuario, no renderizar nada (la redirección ya se habrá activado)
  if (!user) {
    return null
  }

  // Si la suscripción se ha completado con éxito, mostrar mensaje de éxito
  if (subscriptionSuccess) {
    return (
      <div className="container mx-auto py-12 max-w-md">
        <Card>
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-center">¡Suscripción Exitosa!</CardTitle>
            <CardDescription className="text-center">Tu suscripción ha sido activada correctamente.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center mb-4">Ahora puedes disfrutar de todas las funciones premium de Politimétrica.</p>
            {subscription && <SubscriptionInfo subscription={subscription} />}
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => router.push("/")} className="w-full">
              Ir al inicio
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Si el usuario ya tiene una suscripción activa
  if (subscription && subscription.status === "active") {
    const endDate = new Date(subscription.end_date)
    const now = new Date()
    const isExpired = endDate < now

    if (!isExpired) {
      return (
        <div className="container mx-auto py-12 max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>Ya estás suscrito</CardTitle>
              <CardDescription>
                Actualmente tienes una suscripción {subscription.plan === "premium" ? "Premium" : "Básica"} activa.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SubscriptionInfo subscription={subscription} />
            </CardContent>
            <CardFooter>
              <Button onClick={() => router.push("/")} className="w-full">
                Volver al inicio
              </Button>
            </CardFooter>
          </Card>
        </div>
      )
    }
  }

  // Añadir una opción de plan gratuito
  const handlePlanChange = (value: string) => {
    setSelectedPlan(value)

    // Si se selecciona el plan gratuito, establecer el método de pago como "free"
    if (value === "free") {
      setPaymentMethod("free")
    }
  }

  return (
    <div className="container mx-auto py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Bienvenido a Politimétrica, {user.name}</h1>
          <p className="text-muted-foreground">
            Para acceder a todas las funcionalidades, elige un plan de suscripción:
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="max-w-md mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-8 md:grid-cols-3">
          <Card className={selectedPlan === "free" ? "border-primary" : ""}>
            <CardHeader>
              <CardTitle>Prueba Gratuita</CardTitle>
              <CardDescription>Acceso básico por 1 día</CardDescription>
              <div className="mt-2">
                <span className="text-3xl font-bold">$0.00</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Acceso a información básica</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Duración de 1 día</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Sin compromiso</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <RadioGroup value={selectedPlan} onValueChange={handlePlanChange} className="w-full">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="free" id="free" />
                  <Label htmlFor="free">Seleccionar prueba gratuita</Label>
                </div>
              </RadioGroup>
            </CardFooter>
          </Card>

          <Card className={selectedPlan === "monthly" ? "border-primary" : ""}>
            <CardHeader>
              <CardTitle>Plan Mensual</CardTitle>
              <CardDescription>Acceso premium renovable mensualmente</CardDescription>
              <div className="mt-2">
                <span className="text-3xl font-bold">$9.99</span>
                <span className="text-muted-foreground"> /mes</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Análisis detallados de políticos</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Comparación avanzada entre políticos</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Recomendaciones personalizadas</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Sin publicidad</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <RadioGroup value={selectedPlan} onValueChange={handlePlanChange} className="w-full">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="monthly" id="monthly" />
                  <Label htmlFor="monthly">Seleccionar plan mensual</Label>
                </div>
              </RadioGroup>
            </CardFooter>
          </Card>

          <Card className={selectedPlan === "annual" ? "border-primary" : ""}>
            <CardHeader>
              <CardTitle>Plan Anual</CardTitle>
              <CardDescription>Ahorra con nuestra suscripción anual</CardDescription>
              <div className="mt-2">
                <span className="text-3xl font-bold">$99.99</span>
                <span className="text-muted-foreground"> /año</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Todo lo incluido en el plan mensual</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Ahorra más de 15% comparado con el plan mensual</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Acceso a webinars exclusivos</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Reportes descargables en PDF</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <RadioGroup value={selectedPlan} onValueChange={handlePlanChange} className="w-full">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="annual" id="annual" />
                  <Label htmlFor="annual">Seleccionar plan anual</Label>
                </div>
              </RadioGroup>
            </CardFooter>
          </Card>
        </div>

        <div className="max-w-md mx-auto space-y-6">
          {selectedPlan !== "free" && (
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">Método de pago</h3>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value: any) => setPaymentMethod(value)}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="credit_card" id="credit_card" />
                  <Label htmlFor="credit_card" className="flex items-center">
                    <span className="mr-2">Tarjeta de crédito</span>
                    <CreditCard className="h-4 w-4" />
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="free" id="demo_payment" />
                  <Label htmlFor="demo_payment">Demostración (sin cargo real)</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          <Button
            onClick={handleSubscribe}
            className="w-full flex items-center justify-center"
            disabled={processingSubscription}
          >
            {processingSubscription ? (
              "Procesando..."
            ) : (
              <>
                <CreditCard className="mr-2 h-5 w-5" />
                {selectedPlan === "free" ? "Activar prueba gratuita" : "Suscribirse Ahora"}
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Al suscribirte, aceptas nuestros{" "}
            <a href="#" className="underline">
              Términos y Condiciones
            </a>{" "}
            y{" "}
            <a href="#" className="underline">
              Política de Privacidad
            </a>
            . {selectedPlan !== "free" && "Para esta demostración, no se realizará ningún cargo real."}
          </p>
        </div>
      </div>
    </div>
  )
}