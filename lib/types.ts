// Representa a un político en la app
export interface Politician {
  id: string
  name: string
  image?: string
  party: string
  province: string
  currentPosition: string
  experience: number // años de experiencia
  proposalsFulfilled: number
  approvalRating: number // 0–100
  age: number
  birthplace: string
  careerStart: string // fecha en formato ISO
  biography: string
  career: CareerItem[]
  proposals: ProposalItem[]
  analysis?: AnalysisData
  socialMedia?: SocialMediaLinks
}

// Historial de carrera del político
export interface CareerItem {
  title: string
  organization: string
  period: string // ejemplo: "2018-2022"
  description: string
}

// Propuesta legislativa o política del político
export interface ProposalItem {
  title: string
  description: string
  status: "Cumplida" | "En progreso" | "Pendiente"
  progress?: number // 0–100
  category: string
}

// Análisis de desempeño y características del político
export interface AnalysisData {
  categories: {
    name: string
    rating: number // 0–5 o 0–10 según lo definas en frontend
  }[]
  detailed: string
  strengths: string[]
  weaknesses: string[]
}

// Enlaces a redes sociales
export interface SocialMediaLinks {
  facebook?: string
  instagram?: string
  tiktok?: string
  twitter?: string
}

// Representa una provincia de Ecuador
export interface Province {
  id: string
  name: string
  capital: string
  population: number
  description: string
}

// Métodos de pago permitidos
export type PaymentMethod = "paypal" | "credit_card" | "free" | "stripe"

// Usuario de la aplicación
export interface User {
  id: string
  name: string
  email: string | null
  role: "admin" | "user"
  subscription: "free" | "premium"
  securityLevel: number // Ej: 1 = básico, 2 = medio, 3 = admin
  paymentMethod?: PaymentMethod
}