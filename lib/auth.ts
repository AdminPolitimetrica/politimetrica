"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import type { User } from "./types"

// Hook para obtener el usuario actual (actualizado)
export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user: supabaseUser }, error } = await supabase.auth.getUser()
        
        if (error || !supabaseUser) {
          setUser(null)
          setLoading(false)
          return
        }

        // Buscar el perfil en la tabla "profiles"
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", supabaseUser.id)
          .single()

        if (profileError || !profile) {
          // Si no existe perfil, crear uno básico con los datos de Supabase
          const userData: User = {
            id: supabaseUser.id,
            name: supabaseUser.user_metadata?.full_name || 
                  supabaseUser.user_metadata?.name || 
                  supabaseUser.email?.split("@")[0] || 
                  "Usuario",
            email: supabaseUser.email || "sin-email@example.com",
            role: "user",
            subscription: "free",
            securityLevel: 1
          }

          // Intentar crear el perfil
          const { error: createError } = await supabase
            .from("profiles")
            .upsert({
              id: supabaseUser.id,
              name: userData.name,
              email: userData.email,
              role: userData.role,
              subscription: userData.subscription,
              updated_at: new Date().toISOString()
            })

          if (!createError) {
            setUser(userData)
          } else {
            console.error("Error al crear perfil:", createError)
            setUser(userData) // Usar datos temporales aunque no se guarde en DB
          }
        } else {
          setUser({
            id: profile.id,
            name: profile.name,
            email: profile.email,
            role: profile.role,
            subscription: profile.subscription,
            securityLevel: profile.role === "admin" ? 3 : profile.subscription === "premium" ? 2 : 1
          })
        }
      } catch (err) {
        console.error("Error en fetchUser:", err)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session?.user?.id)
      fetchUser()
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  return { user, loading }
}

// Login con correo y contraseña (actualizado)
export async function login(email: string, password: string): Promise<User> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) throw new Error(error.message)
  if (!data.user) throw new Error("No se encontró el usuario")

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .single()

  if (profileError || !profile) {
    // Crear perfil si no existe
    const userData: User = {
      id: data.user.id,
      name: data.user.user_metadata?.name || email.split("@")[0],
      email: email,
      role: email === "admin@politimetrica.com" ? "admin" : "user",
      subscription: "free",
      securityLevel: email === "admin@politimetrica.com" ? 3 : 1
    }

    const { error: createError } = await supabase
      .from("profiles")
      .upsert({
        id: data.user.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        subscription: userData.subscription,
        updated_at: new Date().toISOString()
      })

    if (createError) {
      console.error("Error al crear perfil:", createError)
    }

    return userData
  }

  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    role: profile.role,
    subscription: profile.subscription,
    securityLevel: profile.role === "admin" ? 3 : profile.subscription === "premium" ? 2 : 1
  }
}

// Registro de nuevo usuario (actualizado)
export async function register(name: string, email: string, password: string): Promise<User> {
  const { data, error } = await supabase.auth.signUp({ 
    email, 
    password,
    options: {
      data: {
        name: name,
        full_name: name
      }
    }
  })

  if (error) throw new Error(error.message)
  if (!data.user) throw new Error("No se pudo crear el usuario")

  const userData: User = {
    id: data.user.id,
    name,
    email,
    role: "user",
    subscription: "free",
    securityLevel: 1
  }

  // Solo crear perfil si el usuario está confirmado
  if (data.user.email_confirmed_at) {
    const { error: insertError } = await supabase.from("profiles").upsert({
      id: data.user.id,
      name,
      email,
      role: "user",
      subscription: "free",
      updated_at: new Date().toISOString()
    })

    if (insertError) {
      console.error("Error al crear perfil:", insertError)
    }
  }

  return userData
}

// Logout (actualizado)
export async function logout(): Promise<void> {
  const { error } = await supabase.auth.signOut()
  if (error) throw new Error(error.message)
  
  // Limpiar localStorage
  if (typeof window !== 'undefined') {
    localStorage.removeItem("currentUser")
    window.dispatchEvent(new Event("storage"))
  }
  
  window.location.href = "/"
}

// Utilidades de acceso (sin cambios)
export function isAdmin(user: User | null): boolean {
  return user?.role === "admin"
}

export function hasSecurityLevel(user: User | null, requiredLevel: number): boolean {
  return user?.securityLevel !== undefined && user.securityLevel >= requiredLevel
}

export function hasAccess(user: User | null, feature: string): boolean {
  if (!user) return false

  switch (feature) {
    case "premium_content":
      return user.subscription === "premium" || user.role === "admin"
    case "admin_panel":
      return user.role === "admin"
    case "edit_politicians":
      return user.role === "admin" || hasSecurityLevel(user, 3)
    case "view_detailed_stats":
      return user.subscription === "premium" || hasSecurityLevel(user, 2)
    case "download_data":
      return user.subscription === "premium" || hasSecurityLevel(user, 2)
    default:
      return false
  }
}

// Login con Google (actualizado para usar callback)
export async function loginWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`
    }
  })
  if (error) throw new Error(error.message)
}