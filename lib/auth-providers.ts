import { GoogleAuthProvider, signInWithCredential } from "firebase/auth"
import { auth } from "./firebase"
import type { User } from "./types"

// Función para autenticar con Firebase usando token de Google recibido desde Flutter
export async function signInWithGoogleToken(idToken: string): Promise<User> {
  try {
    const credential = GoogleAuthProvider.credential(idToken)
    const userCredential = await signInWithCredential(auth, credential)
    const user = userCredential.user

    const token = await user.getIdToken()
    // Puedes enviar este token al WebView si quieres

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
  } catch (error) {
    console.error("Error autenticando con token de Google:", error)
    throw error
  }
}
