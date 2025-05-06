"use client"

import type { ReactNode } from "react"
import { useState, useEffect } from "react"
import { LockKeyhole } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useCurrentUser, isAdmin } from "@/lib/auth"
import { getSubscriptionDetails } from "@/lib/subscription"

interface PremiumContentProps {
  children: ReactNode
}

export function PremiumContent({ children }: PremiumContentProps) {
  const { user, loading } = useCurrentUser()
  const [hasAccess, setHasAccess] = useState(false)
  const [checkingSubscription, setCheckingSubscription] = useState(true)

  useEffect(() => {
    const checkSubscription = async () => {
      if (!user) {
        setHasAccess(false)
        setCheckingSubscription(false)
        return
      }

      // Verificar si el usuario es admin o tiene suscripción premium en localStorage
      if (isAdmin(user) || user.subscription === "premium") {
        setHasAccess(true)
        setCheckingSubscription(false)
        return
      }

      // Verificar detalles de suscripción
      try {
        const subscription = await getSubscriptionDetails(user.id)

        // Verificar si tiene una suscripción activa y no expirada
        if (subscription && subscription.status === "active") {
          const endDate = new Date(subscription.endDate)
          const now = new Date()

          if (endDate > now) {
            // La suscripción está activa y no ha expirado
            setHasAccess(true)
          } else {
            setHasAccess(false)
          }
        } else {
          setHasAccess(false)
        }
      } catch (error) {
        console.error("Error al verificar la suscripción:", error)
        setHasAccess(false)
      } finally {
        setCheckingSubscription(false)
      }
    }

    checkSubscription()
  }, [user])

  // Si está cargando, mostrar un indicador de carga
  if (loading || checkingSubscription) {
    return <div className="animate-pulse bg-muted/50 p-8 rounded-md">Cargando contenido...</div>
  }

  // Si el usuario tiene acceso, mostrar el contenido
  if (hasAccess) {
    return <>{children}</>
  }

  // Si no tiene acceso, mostrar el bloqueo
  return (
    <div className="relative">
      <div className="blur-sm pointer-events-none">{children}</div>
      <div className="absolute inset-0 flex items-center justify-center">
        <Card className="p-6 max-w-md text-center space-y-4 bg-background/95 border-politica-burgundy/20">
          <div className="mx-auto bg-politica-burgundy/10 p-3 rounded-full w-fit">
            <LockKeyhole className="h-6 w-6 text-politica-burgundy" />
          </div>
          <h3 className="text-xl font-bold text-politica-burgundy">Contenido Premium</h3>
          <p className="text-muted-foreground">
            Este análisis detallado está disponible solo para usuarios con suscripción premium.
          </p>
          <Link href="/suscripcion">
            <Button variant="burgundy" className="w-full">
              Suscribirse
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  )
}
