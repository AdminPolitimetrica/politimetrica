"use client"

import React, { useState } from "react"
import { Send, ChevronDown, ChevronUp, User, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { saveContactMessageWithSuggestions } from "@/lib/supabaseClient"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface Politician {
  id: string
  name: string
  image: string
  party_id: string
  current_position: string
  experience: string
  proposals_fulfilled: string
  approval_rating: string
  age: string
  birthplace: string
  career_start: string
  biography: string
  region_id: string
  country_id: string
}

interface Party {
  id: string
  name: string
}

interface FormData {
  name: string
  email: string
  subject: string
  message: string
  politician: Politician
  party: Party
}

export function ContactForm() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPoliticianForm, setShowPoliticianForm] = useState(false)
  const [showPartyForm, setShowPartyForm] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
    politician: {
      id: "",
      name: "",
      image: "",
      party_id: "",
      current_position: "",
      experience: "",
      proposals_fulfilled: "",
      approval_rating: "",
      age: "",
      birthplace: "",
      career_start: "",
      biography: "",
      region_id: "",
      country_id: "",
    },
    party: {
      id: "",
      name: "",
    },
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    section?: "politician" | "party"
  ) => {
    const { name, value } = e.target
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [name]: value,
        },
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const dataToSend = {
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
      date: new Date().toISOString(),
      status: "pendiente",
      politician: showPoliticianForm ? {
        id: formData.politician.id || "",
        name: formData.politician.name,
        image: formData.politician.image,
        party_id: formData.politician.party_id,
        current_position: formData.politician.current_position,
        experience: formData.politician.experience ? Number(formData.politician.experience) : null,
        proposals_fulfilled: formData.politician.proposals_fulfilled ? Number(formData.politician.proposals_fulfilled) : null,
        approval_rating: formData.politician.approval_rating ? Number(formData.politician.approval_rating) : null,
        age: formData.politician.age ? Number(formData.politician.age) : null,
        birthplace: formData.politician.birthplace,
        career_start: formData.politician.career_start,
        biography: formData.politician.biography,
        region_id: formData.politician.region_id,
        country_id: formData.politician.country_id ? Number(formData.politician.country_id) : null,
      } : {
        id: "",
        name: "",
        image: "",
        party_id: "",
        current_position: "",
        experience: null,
        proposals_fulfilled: null,
        approval_rating: null,
        age: null,
        birthplace: "",
        career_start: "",
        biography: "",
        region_id: "",
        country_id: null,
      },
      party: showPartyForm ? {
        id: formData.party.id,
        name: formData.party.name,
      } : null,
    }

    try {
      await saveContactMessageWithSuggestions(dataToSend)

      setShowConfirmation(true)

      // Reset form only if not in confirmation state
      if (!showConfirmation) {
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
          politician: {
            id: "",
            name: "",
            image: "",
            party_id: "",
            current_position: "",
            experience: "",
            proposals_fulfilled: "",
            approval_rating: "",
            age: "",
            birthplace: "",
            career_start: "",
            biography: "",
            region_id: "",
            country_id: "",
          },
          party: {
            id: "",
            name: "",
          },
        })
        setShowPoliticianForm(false)
        setShowPartyForm(false)
      }
    } catch (error: unknown) {
      console.error("Error al enviar el mensaje:", error)
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      toast({
        title: "Error al enviar",
        description: `Hubo un problema al enviar tu mensaje: ${errorMessage}. Por favor intenta nuevamente.`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setShowConfirmation(false)
  }

  if (showConfirmation) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto bg-green-100 p-4 rounded-full w-20 h-20 flex items-center justify-center">
            <Send className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold">¡Mensaje enviado con éxito!</h2>
          <p className="text-gray-600">
            Hemos recibido tu mensaje{showPoliticianForm || showPartyForm ? " y sugerencias" : ""}.
            Te responderemos a la brevedad posible.
          </p>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button onClick={resetForm} className="mt-4">
            Enviar otro mensaje
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <Card>
        <CardContent className="p-6 space-y-6">
          <h2 className="text-xl font-semibold">Información de contacto</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo *</Label>
              <Input
                id="name"
                name="name"
                placeholder="Tu nombre"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="tu@ejemplo.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Asunto *</Label>
            <Input
              id="subject"
              name="subject"
              placeholder="Asunto de tu mensaje"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Mensaje *</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Escribe tu mensaje aquí..."
              value={formData.message}
              onChange={handleChange}
              rows={6}
              required
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-6 pb-0">
          <Button
            type="button"
            variant="ghost"
            className="w-full justify-between text-lg font-semibold"
            onClick={() => setShowPoliticianForm(!showPoliticianForm)}
          >
            <div className="flex items-center gap-3">
              <User className="h-5 w-5" />
              <span>Sugerir un político</span>
            </div>
            {showPoliticianForm ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </Button>
        </CardHeader>

        {showPoliticianForm && (
          <CardContent className="p-6 pt-0 space-y-6">
            <Separator className="my-4" />
            <p className="text-sm text-gray-500">
              Completa la información del político que deseas sugerir (todos los campos son opcionales)
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="politician-name">Nombre completo</Label>
                <Input
                  id="politician-name"
                  name="name"
                  placeholder="Ej. Daniel Noboa"
                  value={formData.politician.name}
                  onChange={(e) => handleChange(e, "politician")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="politician-image">URL de imagen</Label>
                <Input
                  id="politician-image"
                  name="image"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  value={formData.politician.image}
                  onChange={(e) => handleChange(e, "politician")}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="politician-party">Partido político</Label>
                <Input
                  id="politician-party"
                  name="party_id"
                  placeholder="Ej. ADN"
                  value={formData.politician.party_id}
                  onChange={(e) => handleChange(e, "politician")}
                />
                <p className="text-sm text-gray-500">ID o nombre corto del partido</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="politician-position">Cargo actual</Label>
                <Input
                  id="politician-position"
                  name="current_position"
                  placeholder="Ej. Presidente, Diputado"
                  value={formData.politician.current_position}
                  onChange={(e) => handleChange(e, "politician")}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="politician-experience">Años de experiencia</Label>
                <Input
                  id="politician-experience"
                  name="experience"
                  type="number"
                  min={0}
                  placeholder="Ej. 10"
                  value={formData.politician.experience}
                  onChange={(e) => handleChange(e, "politician")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="politician-age">Edad</Label>
                <Input
                  id="politician-age"
                  name="age"
                  type="number"
                  min={0}
                  placeholder="Ej. 45"
                  value={formData.politician.age}
                  onChange={(e) => handleChange(e, "politician")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="politician-approval">Aprobación (%)</Label>
                <Input
                  id="politician-approval"
                  name="approval_rating"
                  type="number"
                  min={0}
                  max={100}
                  placeholder="Ej. 75"
                  value={formData.politician.approval_rating}
                  onChange={(e) => handleChange(e, "politician")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="politician-biography">Biografía breve</Label>
              <Textarea
                id="politician-biography"
                name="biography"
                placeholder="Escribe una breve descripción o biografía"
                value={formData.politician.biography}
                onChange={(e) => handleChange(e, "politician")}
                rows={4}
              />
            </div>
          </CardContent>
        )}
      </Card>

      <Card>
        <CardHeader className="p-6 pb-0">
          <Button
            type="button"
            variant="ghost"
            className="w-full justify-between text-lg font-semibold"
            onClick={() => setShowPartyForm(!showPartyForm)}
          >
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5" />
              <span>Sugerir un partido político</span>
            </div>
            {showPartyForm ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </Button>
        </CardHeader>

        {showPartyForm && (
          <CardContent className="p-6 pt-0 space-y-6">
            <Separator className="my-4" />
            <p className="text-sm text-gray-500">
              Completa la información del partido político que deseas sugerir (todos los campos son opcionales)
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="party-name">Nombre del partido</Label>
                <Input
                  id="party-name"
                  name="name"
                  placeholder="Ej. Acción Democrática Nacional"
                  value={formData.party.name}
                  onChange={(e) => handleChange(e, "party")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="party-id">ID o siglas del partido</Label>
                <Input
                  id="party-id"
                  name="id"
                  placeholder="Ej. ADN"
                  value={formData.party.id}
                  onChange={(e) => handleChange(e, "party")}
                />
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Enviando...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Enviar mensaje
          </span>
        )}
      </Button>
    </form>
  )
}