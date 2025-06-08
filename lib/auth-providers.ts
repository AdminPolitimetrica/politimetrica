"use client"
import {
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth"
import { auth } from "./firebase"
import type { User } from "./types"

// Autenticación con Google (modificada para redirigir a esquema personalizado)
export async function signInWithGoogle(): Promise<void> {
  try {
    const provider = new GoogleAuthProvider()
    provider.addScope("profile")
    provider.addScope("email")
    provider.setCustomParameters({
      prompt: "select_account",
    })

    console.log("Iniciando proceso de autenticación con Google...")
    const result = await signInWithPopup(auth, provider)
    console.log("Autenticación con Google exitosa")
    const user = result.user

    const userData: User = {
      id: user.uid,
      name: user.displayName || "Usuario de Google",
      email: user.email || "sin-email@example.com",
      role: "user",
      subscription: "free",
    }

    // Guardar en localStorage para persistencia web (opcional)
    localStorage.setItem("currentUser", JSON.stringify(userData))
    window.dispatchEvent(new Event("storage"))

    // Redirigir a esquema personalizado para que Flutter capture la URL
    const redirectUrl = `brandon.app://auth?uid=${user.uid}&name=${encodeURIComponent(user.displayName ?? "")}&email=${encodeURIComponent(user.email ?? "")}`
    window.location.href = redirectUrl
  } catch (error: any) {
    console.error("Error detallado al iniciar sesión con Google:", error)

    if (error.code === "auth/unauthorized-domain") {
      console.error("Dominio no autorizado:", window.location.hostname)
      throw new Error("El dominio no está autorizado en Firebase.")
    }

    if (error.code === "auth/configuration-not-found") {
      console.error("Configuración de Firebase no encontrada.")
      throw new Error("Firebase no está configurado correctamente.")
    }

    throw error
  }
}

// Registro con email y envío de verificación
export async function registerWithEmail(name: string, email: string, password: string): Promise<User> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    await sendEmailVerification(user)

    const userData: User = {
      id: user.uid,
      name: name,
      email: email,
      role: "user",
      subscription: "free",
    }

    localStorage.setItem("currentUser", JSON.stringify(userData))
    window.dispatchEvent(new Event("storage"))

    return userData
  } catch (error: any) {
    console.error("Error al registrar usuario:", error)
    throw error
  }
}

// Inicio de sesión con email
export async function loginWithEmail(email: string, password: string): Promise<User> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    const userData: User = {
      id: user.uid,
      name: user.displayName || email.split("@")[0],
      email: email,
      role: email === "admin@politimetrica.com" ? "admin" : "user",
      subscription: "free",
    }

    localStorage.setItem("currentUser", JSON.stringify(userData))
    window.dispatchEvent(new Event("storage"))

    return userData
  } catch (error: any) {
    console.error("Error al iniciar sesión:", error)
    throw error
  }
}
