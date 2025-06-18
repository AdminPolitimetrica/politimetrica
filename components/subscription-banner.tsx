"use client"

import Link from "next/link"
import { LockKeyhole } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCurrentUser } from "@/lib/auth"

// Componente cliente que usa useCurrentUser
export function SubscriptionBanner() {
  const { user } = useCurrentUser()

  // Si el usuario tiene suscripción premium, no mostrar banner
  if (user?.subscription === "premium") {
    return null
  }

  return (
    <Card className="bg-politica-burgundy/5 border-politica-burgundy/20">
      <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-politica-burgundy/10 p-2 rounded-full">
            <LockKeyhole className="h-6 w-6 text-politica-burgundy" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-politica-burgundy">Desbloquea todas las funciones</h3>
            <p className="text-muted-foreground">Accede a análisis detallados, comparaciones avanzadas y más</p>
          </div>
        </div>
        <Link href="/suscripcion">
          <Button variant="burgundy">Suscribirse</Button>
        </Link>
      </CardContent>
    </Card>
  )
}

// Componente servidor que renderiza el componente cliente
export function SubscriptionBannerWrapper() {
  return <SubscriptionBanner />
}