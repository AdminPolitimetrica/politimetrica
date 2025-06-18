// En /app/auth/callback/page.tsx
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error || !session?.user) {
        console.error("Error en callback:", error)
        return
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single()

      if (profileError || !profile) {
        router.push("/auth/complete-profile")
        return
      }

      router.push("/")
    }

    handleCallback()
  }, [router])

  return <div className="container mx-auto py-12">Redirigiendo...</div>
}