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

// Autenticación con Google
export async function signInWithGoogle(): Promise<User> {
  try {
    const provider = new GoogleAuthProvider()
    // Añadir scopes para acceder a la información del perfil del usuario
    provider.addScope("profile")
    provider.addScope("email")

    // Configurar el comportamiento de selección de cuenta
    provider.setCustomParameters({
      prompt: "select_account",
    })

    console.log("Iniciando proceso de autenticación con Google...")
    const result = await signInWithPopup(auth, provider)
    console.log("Autenticación con Google exitosa")
    const user = result.user

    // Crear objeto de usuario con los datos de Google
    const userData: User = {
      id: user.uid,
      name: user.displayName || "Usuario de Google",
      email: user.email || "sin-email@example.com",
      role: "user",
      subscription: "free",
    }

    // Guardar en localStorage para simular persistencia
    localStorage.setItem("currentUser", JSON.stringify(userData))

    // Disparar evento para notificar cambios
    window.dispatchEvent(new Event("storage"))

    return userData
  } catch (error: any) {
    console.error("Error detallado al iniciar sesión con Google:", error)

    // Manejar específicamente el error de dominio no autorizado
    if (error.code === "auth/unauthorized-domain") {
      console.error(
        "Error de dominio no autorizado: El dominio actual no está autorizado en la consola de Firebase.",
        window.location.hostname,
      )
      throw new Error(
        "El dominio desde el que estás accediendo no está autorizado en Firebase. Debes agregar este dominio en la configuración de Firebase Auth.",
      )
    }

    // Manejar específicamente el error de configuración no encontrada
    if (error.code === "auth/configuration-not-found") {
      console.error(
        "Error de configuración de Firebase: Verifica que la autenticación de Google esté habilitada en la consola de Firebase y que el dominio esté autorizado.",
      )
      throw new Error(
        "Error de configuración de Firebase: La autenticación con Google no está correctamente configurada. Por favor contacta al administrador.",
      )
    }

    throw error
  }
}

// Registro con email y envío de verificación
export async function registerWithEmail(name: string, email: string, password: string): Promise<User> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Enviar email de verificación
    await sendEmailVerification(user)

    const userData: User = {
      id: user.uid,
      name: name,
      email: email,
      role: "user",
      subscription: "free",
    }

    // Guardar en localStorage para simular persistencia
    localStorage.setItem("currentUser", JSON.stringify(userData))

    // Disparar evento para notificar cambios
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

    // En una implementación real, aquí obtendríamos los datos del usuario desde nuestra base de datos
    const userData: User = {
      id: user.uid,
      name: user.displayName || email.split("@")[0],
      email: email,
      role: email === "admin@politimetrica.com" ? "admin" : "user",
      subscription: "free",
    }

    // Guardar en localStorage para simular persistencia
    localStorage.setItem("currentUser", JSON.stringify(userData))

    // Disparar evento para notificar cambios
    window.dispatchEvent(new Event("storage"))

    return userData
  } catch (error: any) {
    console.error("Error al iniciar sesión:", error)
    throw error
  }
}
