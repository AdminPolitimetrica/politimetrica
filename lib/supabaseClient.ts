import { createClient } from '@supabase/supabase-js'

// Verificación de variables de entorno
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is not defined')
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined')
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false
  }
})

// Tipos de interfaces
interface PoliticianData {
  id?: string
  name?: string | null
  image?: string | null
  party_id?: string | null
  current_position?: string | null
  experience?: string | number | null
  proposals_fulfilled?: string | number | null
  approval_rating?: string | number | null
  age?: string | number | null
  birthplace?: string | null
  career_start?: string | null
  biography?: string | null
  region_id?: string | null
  country_id?: string | number | null
}

interface PartyData {
  id?: string | null
  name?: string | null
}

/**
 * Función para convertir valores a número de forma segura
 */
const safeNumber = (value: any): number | null => {
  if (value === null || value === undefined || value === '') return null
  const num = Number(value)
  return isNaN(num) ? null : num
}

/**
 * Función para limpiar strings (trim y convertir empty a null)
 */
const cleanString = (value: any): string | null => {
  if (!value) return null
  const str = String(value).trim()
  return str === '' ? null : str
}

/**
 * Guarda un mensaje de contacto junto con sugerencias de políticos y partidos
 */
export async function saveContactMessageWithSuggestions(data: {
  name: string
  email: string
  subject: string
  message: string
  date?: string
  status?: string
  politician: PoliticianData
  party: PartyData | null
}) {
  try {
    // Validación básica de campos requeridos
    if (!data.name?.trim() || !data.email?.trim() || !data.subject?.trim() || !data.message?.trim()) {
      throw new Error('Todos los campos principales son requeridos')
    }

    // 1. Insertar mensaje principal
    const messageInsert = {
      name: data.name.trim(),
      email: data.email.trim(),
      subject: data.subject.trim(),
      message: data.message.trim(),
      date: data.date || new Date().toISOString(),
      status: data.status || 'pendiente'
    }

    const { data: messageData, error: messageError } = await supabase
      .from('contact_messages')
      .insert(messageInsert)
      .select('id')
      .single()

    if (messageError) {
      console.error('Error al insertar mensaje:', {
        error: messageError,
        attemptedData: messageInsert,
        details: messageError.details,
        code: messageError.code
      })
      throw new Error(`Error al guardar mensaje: ${messageError.message}`)
    }

    const contactMessageId = messageData.id

    // 2. Insertar sugerencia de político (si existe nombre)
    if (data.politician?.name?.trim()) {
      const politicianToInsert = {
        name: data.politician.name.trim(),
        contact_message_id: contactMessageId,
        image: cleanString(data.politician.image),
        party_id: cleanString(data.politician.party_id),
        current_position: cleanString(data.politician.current_position),
        birthplace: cleanString(data.politician.birthplace),
        career_start: cleanString(data.politician.career_start),
        biography: cleanString(data.politician.biography),
        region_id: cleanString(data.politician.region_id),
        experience: safeNumber(data.politician.experience),
        age: safeNumber(data.politician.age),
        approval_rating: safeNumber(data.politician.approval_rating),
        proposals_fulfilled: safeNumber(data.politician.proposals_fulfilled),
        country_id: safeNumber(data.politician.country_id)
      }

      const { error: polError } = await supabase
        .from('suggested_politicians')
        .insert(politicianToInsert)

      if (polError) {
        console.error('Error al insertar político:', {
          error: polError,
          attemptedData: politicianToInsert,
          details: polError.details,
          hint: polError.hint
        })
        // No hacemos throw aquí para no perder el mensaje principal
      }
    }

    // 3. Insertar sugerencia de partido (si existe id o nombre)
    if (data.party && (data.party.id?.trim() || data.party.name?.trim())) {
      const partyToInsert = {
        id: data.party.id?.trim() || undefined,
        name: data.party.name!.trim(),
        contact_message_id: contactMessageId
      }

      const { error: partyError } = await supabase
        .from('suggested_parties')
        .insert(partyToInsert)

      if (partyError) {
        console.error('Error al insertar partido:', {
          error: partyError,
          attemptedData: partyToInsert,
          details: partyError.details
        })
        // No hacemos throw aquí para no perder el mensaje principal
      }
    }

    return {
      success: true,
      messageId: contactMessageId,
      message: 'Mensaje y sugerencias guardados correctamente'
    }

  } catch (error: unknown) {
    console.error('Error completo en saveContactMessageWithSuggestions:', error)
    
    // Convertir error desconocido a Error
    const normalizedError = error instanceof Error 
      ? error 
      : new Error('Error desconocido al guardar el mensaje')

    // Log adicional para diagnóstico
    if (error instanceof Error) {
      console.error('Stack trace:', error.stack)
    }

    throw normalizedError
  }
}

/**
 * Función de prueba para verificar conexión con Supabase
 */
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('id')
      .limit(1)
      .single()

    if (error) throw error

    return {
      connected: true,
      message: 'Conexión exitosa con Supabase',
      data
    }
  } catch (error) {
    console.error('Error de conexión con Supabase:', error)
    return {
      connected: false,
      message: error instanceof Error ? error.message : 'Error desconocido'
    }
  }
}