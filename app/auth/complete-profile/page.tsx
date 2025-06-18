"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function CompleteProfilePage() {
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()

      if (sessionError || !session?.user) {
        alert("No se pudo obtener la sesión del usuario. Por favor, intenta nuevamente.")
        return
      }

      const userId = session.user.id

      const { error: profileError } = await supabase.from("profiles").upsert({
        id: userId,
        name,
        email: session.user.email,
        role: "user",
        subscription: "free"
      }, { onConflict: "id" })

      if (profileError) {
        alert("No se pudo crear el perfil. Por favor, intenta nuevamente.")
        return
      }

      router.push("/")
    } catch (error) {
      alert("Ocurrió un error inesperado. Por favor, intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-12">
      <div className="max-w-md mx-auto bg-white rounded-md shadow-md p-8">
        <h2 className="text-2xl font-semibold mb-6">Completa tu perfil</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre</Label>
            <Input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </Button>
        </form>
      </div>
    </div>
  )
}