"use client"

import { supabase } from "./supabaseClient"
import type { User } from "./types"

// Tipos de suscripción
export type SubscriptionPlan = "free" | "basic" | "premium"
export type PaymentMethod = "paypal" | "credit_card" | "free" | "stripe"
export type SubscriptionStatus = "active" | "cancelled" | "expired" | "pending"

export interface SubscriptionDetails {
  id: string
  user_id: string
  plan: SubscriptionPlan
  start_date: string
  end_date: string
  auto_renew: boolean
  payment_method: PaymentMethod
  status: SubscriptionStatus
  last_payment_date?: string | null
  next_payment_date?: string | null
  stripe_subscription_id?: string | null
}

export async function subscribeToPlan(
  userId: string,
  plan: SubscriptionPlan,
  paymentMethod: PaymentMethod
): Promise<SubscriptionDetails> {
  try {
    // Validar parámetros
    if (!userId || !plan || !paymentMethod) {
      throw new Error("Parámetros inválidos para crear suscripción")
    }

    // 1. Validar que no exista una suscripción activa para el usuario
    const { data: activeSubscription, error: activeError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .single()

    if (activeError && activeError.code !== "PGRST116") { // PGRST116 = no rows found, que es válido aquí
      console.error("Error al verificar suscripción activa:", activeError)
      throw new Error("Error al verificar suscripción activa")
    }

    if (activeSubscription) {
      throw new Error("El usuario ya tiene una suscripción activa")
    }

    // 2. Validar método de pago coherente con el plan
    if (plan !== "free" && paymentMethod === "free") {
      throw new Error("El método de pago debe ser válido para planes de pago")
    }

    const now = new Date().toISOString()
    const endDate = calculateEndDate(plan, paymentMethod)

    // 3. Crear la suscripción
    const { data: subscription, error } = await supabase
      .from("subscriptions")
      .insert({
        user_id: userId,
        plan,
        start_date: now,
        end_date: endDate,
        auto_renew: paymentMethod !== "free",
        payment_method: paymentMethod,
        status: "active"
      })
      .select()
      .single()

    if (error) throw error

    // 4. Actualizar perfil del usuario
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ subscription: plan })
      .eq("id", userId)

    if (profileError) {
      console.error("Error al actualizar perfil:", profileError)
      // Revertir la suscripción si no se puede actualizar el perfil
      await supabase.from("subscriptions").delete().eq("id", subscription.id)
      throw new Error("No se pudo actualizar el perfil del usuario")
    }

    return subscription
  } catch (error) {
    console.error("Error en subscribeToPlan:", error)
    throw error instanceof Error ? error : new Error("Error al crear suscripción")
  }
}

/**
 * Obtiene la suscripción activa de un usuario
 */
export async function getActiveSubscription(userId: string): Promise<SubscriptionDetails | null> {
  try {
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .gt("end_date", new Date().toISOString())
      .order("start_date", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error en getActiveSubscription:", error)
    return null
  }
}

/**
 * Cancela una suscripción activa
 */
export async function cancelSubscription(userId: string): Promise<boolean> {
  try {
    // Obtener suscripción activa
    const activeSub = await getActiveSubscription(userId)
    if (!activeSub) throw new Error("No se encontró suscripción activa")

    // Actualizar suscripción
    const { error: subError } = await supabase
      .from("subscriptions")
      .update({
        status: "cancelled",
        auto_renew: false,
        end_date: new Date().toISOString() // Cancela inmediatamente
      })
      .eq("id", activeSub.id)

    if (subError) throw subError

    // Actualizar perfil del usuario a free
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ subscription: "free" })
      .eq("id", userId)

    if (profileError) {
      console.error("Error al actualizar perfil:", profileError)
      // No revertimos la cancelación aunque falle la actualización del perfil
    }

    return true
  } catch (error) {
    console.error("Error en cancelSubscription:", error)
    throw error instanceof Error ? error : new Error("Error al cancelar suscripción")
  }
}

/**
 * Actualiza el plan de suscripción de un usuario
 */
export async function updateSubscriptionPlan(
  userId: string,
  newPlan: SubscriptionPlan,
  paymentMethod: PaymentMethod
): Promise<SubscriptionDetails> {
  try {
    // Cancelar suscripción actual si existe
    await cancelSubscription(userId)

    // Crear nueva suscripción
    return await subscribeToPlan(userId, newPlan, paymentMethod)
  } catch (error) {
    console.error("Error en updateSubscriptionPlan:", error)
    throw error instanceof Error ? error : new Error("Error al actualizar suscripción")
  }
}

/**
 * Verifica si un usuario tiene una suscripción activa
 */
export async function hasActiveSubscription(userId: string): Promise<boolean> {
  const subscription = await getActiveSubscription(userId)
  return !!subscription
}

/**
 * Obtiene el plan actual de un usuario desde su perfil
 */
export async function getUserPlan(userId: string): Promise<SubscriptionPlan> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("subscription")
      .eq("id", userId)
      .single()

    if (error || !data) throw error || new Error("Perfil no encontrado")
    return data.subscription as SubscriptionPlan || "free"
  } catch (error) {
    console.error("Error en getUserPlan:", error)
    return "free"
  }
}

// Función auxiliar para calcular fecha de finalización
function calculateEndDate(plan: SubscriptionPlan, paymentMethod: PaymentMethod): string {
  const endDate = new Date()

  if (paymentMethod === "free") {
    endDate.setDate(endDate.getDate() + 1) // 1 día para pruebas gratuitas
  } else if (plan === "premium") {
    endDate.setMonth(endDate.getMonth() + 1) // 1 mes para premium
  } else {
    endDate.setMonth(endDate.getMonth() + 12) // 1 año para básico
  }

  return endDate.toISOString()
}