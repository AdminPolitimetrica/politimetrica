import {
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth"
import { auth } from "./firebase"
import type { User } from "./types"

// Función para enviar token al WebView (si existe)
function sendTokenToWebView(token: string) {
  if (typeof window !== "undefined" && window.ReactNativeWebView) {
    // Para React Native WebView
    window.ReactNativeWebView.postMessage(token)
  } else {
    // Para WebView estándar o debugging
    window.postMessage({ type: "JWT_TOKEN", token }, "*")
  }
}

export async function signInWithGoogle(): Promise<User> {
  try {
    const provider = new GoogleAuthProvider()
    provider.addScope("profile")
    provider.addScope("email")
    provider.setCustomParameters({ prompt: "select_account" })

    const result = await signInWithPopup(auth, provider)
    const user = result.user

    const token = await user.getIdToken()
    sendTokenToWebView(token)

    const userData: User = {
      id: user.uid,
      name: user.displayName || "Usuario de Google",
      email: user.email || "sin-email@example.com",
      role: "user",
      subscription: "free",
    }

    localStorage.setItem("currentUser", JSON.stringify(userData))
    window.dispatchEvent(new Event("storage"))

    return userData
  } catch (error: any) {
    console.error("Error al iniciar sesión con Google:", error)
    throw error
  }
}

export async function loginWithEmail(email: string, password: string): Promise<User> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    const token = await user.getIdToken()
    sendTokenToWebView(token)

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
