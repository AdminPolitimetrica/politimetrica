"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CalendarIcon, CreditCard, CheckCircle, XCircle, RefreshCw, AlertCircle, PackagePlus } from "lucide-react"
import { format, formatDistanceToNow, isPast } from "date-fns"
import { es } from "date-fns/locale"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import type { SubscriptionDetails, SubscriptionPlan } from "@/lib/subscription"
import { cancelSubscription, updateSubscriptionPlan, getActiveSubscription } from "@/lib/subscription"
import { useToast } from "@/hooks/use-toast"
import { useCurrentUser } from "@/lib/auth"

interface SubscriptionInfoProps {
  subscription?: SubscriptionDetails
}

export function SubscriptionInfo({ subscription }: SubscriptionInfoProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useCurrentUser()
  const [cancelling, setCancelling] = useState(false)
  const [changingPlan, setChangingPlan] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(subscription?.plan || "free")
  const [paymentMethod, setPaymentMethod] = useState<"paypal" | "credit_card" | "free" | "stripe">(
    subscription?.payment_method === "free" ? "free" : "credit_card",
  )
  const [error, setError] = useState("")
  const [isChangePlanOpen, setIsChangePlanOpen] = useState(false)
  const [loading, setLoading] = useState(!subscription)
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionDetails | null>(subscription || null)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    async function loadSubscription() {
      if (!user || subscription) return

      try {
        setLoading(true)
        setLoadError(null)
        const details = await getActiveSubscription(user.id)
        setSubscriptionData(details)
      } catch (error: any) {
        console.error("Error al cargar la suscripción:", error)
        setLoadError(error.message || "No se pudieron cargar los datos de suscripción")
      } finally {
        setLoading(false)
      }
    }

    loadSubscription()
  }, [user, subscription])

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="h-6 bg-muted animate-pulse rounded-md"></div>
            <div className="h-20 bg-muted animate-pulse rounded-md"></div>
            <div className="h-10 bg-muted animate-pulse rounded-md"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loadError) {
    return (
      <Card>
        <CardContent className="p-6">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>{loadError}</AlertDescription>
          </Alert>
          <Button onClick={() => router.push("/suscripcion")} className="w-full">
            Ver planes de suscripción
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!subscriptionData) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <PackagePlus className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No tienes una suscripción activa</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Obtén acceso a todas las funciones premium de Politimétrica con una suscripción.
            </p>
            <div className="flex flex-col space-y-2">
              <Button onClick={() => router.push("/suscripcion")} className="w-full">
                Ver planes de suscripción
              </Button>
              <Button variant="outline" onClick={() => router.push("/")} className="w-full">
                Explorar funciones gratuitas
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const startDate = new Date(subscriptionData.start_date)
  const endDate = new Date(subscriptionData.end_date)
  const isExpired = isPast(endDate)

  const handleCancelSubscription = async () => {
    if (!confirm("¿Estás seguro de que deseas cancelar tu suscripción?")) {
      return
    }

    setCancelling(true)
    try {
      await cancelSubscription(subscriptionData.user_id)
      toast({
        title: "Suscripción cancelada",
        description: "Tu suscripción ha sido cancelada exitosamente.",
      })

      router.push("/suscripcion")
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cancelar la suscripción. Por favor intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setCancelling(false)
    }
  }

  const handleChangePlan = async () => {
    setChangingPlan(true)
    setError("")

    try {
      if (!user) throw new Error("Usuario no encontrado.")

      await updateSubscriptionPlan(user.id, selectedPlan, paymentMethod)
      toast({
        title: "Plan actualizado",
        description: "Tu plan ha sido actualizado exitosamente.",
      })
      router.refresh()
      setIsChangePlanOpen(false)
    } catch (error: any) {
      console.error("Error al cambiar el plan:", error)
      setError(error.message || "No se pudo cambiar el plan. Por favor intenta nuevamente.")
    } finally {
      setChangingPlan(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant={isExpired ? "secondary" : subscriptionData.status === "active" ? "default" : "secondary"}>
                {isExpired ? "Expirada" : subscriptionData.status === "active" ? "Activa" : "Cancelada"}
              </Badge>
              <span className="text-sm font-medium">
                Plan{" "}
                {subscriptionData.plan === "premium"
                  ? "Premium"
                  : subscriptionData.plan === "basic"
                  ? "Básico"
                  : "Gratuito"}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">ID: {subscriptionData.id}</div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <span>Inicio: {format(startDate, "PPP", { locale: es })}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <span>
                Vencimiento: {format(endDate, "PPP", { locale: es })}
                {!isExpired && (
                  <span className="ml-1 text-xs text-muted-foreground">
                    (en {formatDistanceToNow(endDate, { locale: es })})
                  </span>
                )}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span>
                Método de pago:{" "}
                {subscriptionData.payment_method === "paypal"
                  ? "PayPal"
                  : subscriptionData.payment_method === "credit_card"
                  ? "Tarjeta de crédito"
                  : "Prueba gratuita"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              {subscriptionData.auto_renew ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Renovación automática activada</span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span>Renovación automática desactivada</span>
                </>
              )}
            </div>
          </div>

          <Separator />

          <div className="flex flex-col sm:flex-row gap-2">
            {subscriptionData.status === "active" && !isExpired && (
              <Button variant="outline" className="flex-1" onClick={handleCancelSubscription} disabled={cancelling}>
                {cancelling ? "Cancelando..." : "Cancelar suscripción"}
              </Button>
            )}

            <Dialog open={isChangePlanOpen} onOpenChange={setIsChangePlanOpen}>
              <DialogTrigger asChild>
                <Button variant="default" className="flex-1" disabled={changingPlan}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Cambiar plan
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Cambiar plan de suscripción</DialogTitle>
                  <DialogDescription>Selecciona el nuevo plan al que deseas cambiar.</DialogDescription>
                </DialogHeader>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Selecciona un plan:</h4>
                    <RadioGroup value={selectedPlan} onValueChange={(value: any) => setSelectedPlan(value)}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="basic" id="basic" />
                        <Label htmlFor="basic">Plan Básico - $9.99/mes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="premium" id="premium" />
                        <Label htmlFor="premium">Plan Premium - $99.99/año</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="free" id="free-trial" />
                        <Label htmlFor="free-trial">Prueba gratuita (1 día)</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Método de pago:</h4>
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={(value: any) => setPaymentMethod(value)}
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="credit_card" id="credit-card" />
                        <Label htmlFor="credit-card" className="flex items-center">
                          <span className="mr-2">Tarjeta de crédito</span>
                          <CreditCard className="h-4 w-4" />
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="free" id="demo" />
                        <Label htmlFor="demo">Demostración (sin cargo)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <DialogFooter>
                  <Button type="submit" onClick={handleChangePlan} disabled={changingPlan}>
                    {changingPlan ? "Cambiando plan..." : "Confirmar cambio"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {(subscriptionData.status === "cancelled" || isExpired) && (
              <Button variant="default" className="flex-1" onClick={() => router.push("/suscripcion")}>
                Renovar suscripción
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}