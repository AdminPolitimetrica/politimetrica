"use client"

import { supabase } from "./supabaseClient"
import type { User } from "./types"

// Función para crear o actualizar perfil de usuario
async function createOrUpdateProfile(userId: string, userData: Partial<User>): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .upsert({
      id: userId,
      name: userData.name,
      email: userData.email,
      role: userData.role || "user",
      subscription: userData.subscription || "free",
      updated_at: new Date().toISOString()
    })

  if (error) {
    console.error("Error al crear/actualizar perfil:", error)
    throw error
  }
}

// Obtener URL de callback según el entorno
function getCallbackUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  return `${baseUrl}/auth/callback`
}

// Autenticación con Google (actualizada para usar callback)
export async function signInWithGoogle(): Promise<void> {
  try {
    console.log("Iniciando proceso de autenticación con Google...")
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: getCallbackUrl(),
        queryParams: {
          prompt: "select_account",
        }
      }
    })

    if (error) {
      console.error("Error detallado al iniciar sesión con Google:", error)
      throw error
    }

    console.log("Redirigiendo a Google para autenticación...")
    
  } catch (error: any) {
    console.error("Error en signInWithGoogle:", error)

    if (error.code === "invalid_redirect_uri") {
      console.error("URI de redirección no válida:", error.message)
      throw new Error("Configuración de autenticación incorrecta.")
    }

    throw error
  }
}

// Registro con email (actualizado)
export async function registerWithEmail(name: string, email: string, password: string): Promise<User> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
          full_name: name
        },
        emailRedirectTo: getCallbackUrl()
      }
    })

    if (error) {
      console.error("Error al registrar usuario:", error)
      throw error
    }

    if (!data.user) {
      throw new Error("No se pudo crear el usuario")
    }

    const userData: User = {
      id: data.user.id,
      name: name,
      email: email,
      role: "user",
      subscription: "free",
      securityLevel: 1
    }

    // Solo crear perfil si el usuario está confirmado
    if (data.user.email_confirmed_at) {
      await createOrUpdateProfile(data.user.id, userData)
      
      if (typeof window !== 'undefined') {
        localStorage.setItem("currentUser", JSON.stringify(userData))
        window.dispatchEvent(new Event("storage"))
      }
    }

    return userData
  } catch (error: any) {
    console.error("Error en registerWithEmail:", error)
    throw error
  }
}

// Inicio de sesión con email (actualizado)
export async function loginWithEmail(email: string, password: string): Promise<User> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      console.error("Error al iniciar sesión:", error)
      throw error
    }

    if (!data.user) {
      throw new Error("No se pudo autenticar el usuario")
    }

    // Intentar obtener el perfil de la base de datos
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single()

    let userData: User

    if (profile && !profileError) {
      // Si existe el perfil, usar esos datos
      userData = {
        id: data.user.id,
        name: profile.name || data.user.user_metadata?.name || email.split("@")[0],
        email: email,
        role: profile.role || (email === "admin@politimetrica.com" ? "admin" : "user"),
        subscription: profile.subscription || "free",
        securityLevel: profile.role === "admin" ? 3 : profile.subscription === "premium" ? 2 : 1
      }
    } else {
      // Si no existe el perfil, crear uno nuevo
      userData = {
        id: data.user.id,
        name: data.user.user_metadata?.name || email.split("@")[0],
        email: email,
        role: email === "admin@politimetrica.com" ? "admin" : "user",
        subscription: "free",
        securityLevel: email === "admin@politimetrica.com" ? 3 : 1
      }

      // Crear el perfil en la base de datos
      await createOrUpdateProfile(data.user.id, userData)
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem("currentUser", JSON.stringify(userData))
      window.dispatchEvent(new Event("storage"))
    }

    return userData
  } catch (error: any) {
    console.error("Error en loginWithEmail:", error)
    throw error
  }
}

// Función para cerrar sesión
export async function signOut(): Promise<void> {
  try {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error("Error al cerrar sesión:", error)
      throw error
    }

    // Limpiar localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem("currentUser")
      window.dispatchEvent(new Event("storage"))
    }
  } catch (error: any) {
    console.error("Error en signOut:", error)
    throw error
  }
}

// Función para obtener el usuario actual
export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: { user: supabaseUser }, error } = await supabase.auth.getUser()
    
    if (error || !supabaseUser) {
      return null
    }

    // Intentar obtener el perfil de la base de datos
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", supabaseUser.id)
      .single()

    const userData: User = {
      id: supabaseUser.id,
      name: profile?.name || supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || supabaseUser.email?.split("@")[0] || "Usuario",
      email: supabaseUser.email || "sin-email@example.com",
      role: profile?.role || "user",
      subscription: profile?.subscription || "free",
      securityLevel: profile?.role === "admin" ? 3 : profile?.subscription === "premium" ? 2 : 1
    }

    return userData
  } catch (error: any) {
    console.error("Error en getCurrentUser:", error)
    return null
  }
}