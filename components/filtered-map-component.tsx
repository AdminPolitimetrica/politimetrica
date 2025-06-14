"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import type { Politician } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { PoliticianCard } from "@/components/politician-card"
import { getPoliticians, getPoliticiansByProvince, getParties } from "@/lib/data"
import { supabase } from "@/lib/supabaseClient"

const MapComponent = dynamic(() => import("@/components/map-component-wrapper"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-gray-100">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  ),
})

interface Party {
  id: string
  name: string
}

interface Country {
  id: number
  name: string
  code: string
}

interface FilteredMapComponentProps {
  parties?: Party[]
}

export function FilteredMapComponent({ parties: initialParties = [] }: FilteredMapComponentProps) {
  const [politicians, setPoliticians] = useState<Politician[]>([])
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null) // clave compuesta id-country_id
  const [selectedParty, setSelectedParty] = useState<string>("")
  const [provincePoliticians, setProvincePoliticians] = useState<Politician[]>([])
  const [parties, setParties] = useState<Party[]>(initialParties)
  const [highlightedProvinces, setHighlightedProvinces] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [country, setCountry] = useState<"ecuador" | "peru" | "colombia">("ecuador")
  const [countries, setCountries] = useState<Country[]>([])

  useEffect(() => {
    async function fetchCountries() {
      const { data, error } = await supabase.from("countries").select("id, name, code").order("name", { ascending: true })
      if (error) {
        console.error("Error fetching countries:", error)
      } else if (data) {
        setCountries(data)
        if (!data.find((c) => c.code === country)) {
          setCountry(data[0]?.code as "ecuador" | "peru" | "colombia" || "ecuador")
        }
      }
    }
    fetchCountries()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const allPoliticians = await getPoliticians()
        setPoliticians(allPoliticians || [])

        if (!initialParties.length) {
          const partiesData = await getParties()
          setParties(partiesData || [])
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [initialParties])

  useEffect(() => {
    if (selectedParty) {
      const filteredByParty = politicians.filter((p) =>
        p.party.toLowerCase().includes(getPartyName(selectedParty).toLowerCase())
      )
      const provinces = [...new Set(filteredByParty.map((p) => p.province))]
      setHighlightedProvinces(provinces)
    } else {
      setHighlightedProvinces([])
    }
  }, [selectedParty, politicians])

  useEffect(() => {
    const fetchProvincePoliticians = async () => {
      if (!selectedProvince) {
        setProvincePoliticians([])
        return
      }
      setLoading(true)
      try {
        let filteredPoliticians = await getPoliticiansByProvince(selectedProvince)
        if (selectedParty) {
          filteredPoliticians = filteredPoliticians.filter((p) =>
            p.party.toLowerCase().includes(getPartyName(selectedParty).toLowerCase())
          )
        }
        setProvincePoliticians(filteredPoliticians || [])
      } catch (error) {
        console.error("Error fetching province politicians:", error)
        setProvincePoliticians([])
      } finally {
        setLoading(false)
      }
    }
    fetchProvincePoliticians()
  }, [selectedProvince, selectedParty])

  function getPartyName(partyId: string) {
    const party = parties.find((p) => p.id === partyId)
    return party ? party.name : partyId
  }

  function formatProvinceName(provinceKey: string | null) {
    if (!provinceKey) return ""
    const parts = provinceKey.split("-")
    if (parts.length < 2) return provinceKey
    const id = parts.slice(0, -1).join("-")
    return id
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
  }

  const handleProvinceSelect = (provinceKey: string) => setSelectedProvince(provinceKey)
  const handlePartyChange = (value: string) => setSelectedParty(value === "all" ? "" : value)
  const handleClearFilters = () => {
    setSelectedProvince(null)
    setSelectedParty("")
    setHighlightedProvinces([])
  }
  const handleCountryChange = (value: string) => {
    if (value === "ecuador" || value === "peru" || value === "colombia") {
      setCountry(value)
      setSelectedProvince(null)
      setHighlightedProvinces([])
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="w-full sm:w-64">
          <Select value={selectedParty} onValueChange={handlePartyChange}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por partido" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los partidos</SelectItem>
              {parties.map((party) => (
                <SelectItem key={party.id} value={party.id}>
                  {party.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-48">
          <Select value={country} onValueChange={handleCountryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona país" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((c) => (
                <SelectItem key={c.id} value={c.code}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" onClick={handleClearFilters} disabled={!selectedProvince && !selectedParty}>
          Limpiar filtros
        </Button>
      </div>

      {selectedParty && (
        <div className="text-sm text-muted-foreground">
          {highlightedProvinces.length > 0
            ? `Mostrando provincias con políticos del partido seleccionado (${highlightedProvinces.length} provincias)`
            : "No hay políticos de este partido en ninguna provincia"}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Card className="h-[500px]">
            <CardHeader className="p-4">
              <CardTitle className="text-xl">
                Mapa de Provincias
                {selectedProvince && (
                  <span className="ml-2 text-muted-foreground">
                    - {formatProvinceName(selectedProvince)}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-[420px]">
              <MapComponent
                country={country}
                onProvinceSelect={handleProvinceSelect}
                selectedProvince={selectedProvince}
                highlightedProvinces={highlightedProvinces}
              />
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="h-[500px] overflow-auto">
            <CardHeader className="p-4 sticky top-0 bg-card z-10">
              <CardTitle className="text-xl">
                {selectedProvince
                  ? `Políticos de ${formatProvinceName(selectedProvince)}`
                  : "Selecciona una provincia"}
                {selectedParty && (
                  <span className="ml-2 text-muted-foreground">
                    - {getPartyName(selectedParty)}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : provincePoliticians.length > 0 ? (
                <div className="space-y-4">
                  {provincePoliticians.map((politician) => (
                    <PoliticianCard key={politician.id} politician={politician} />
                  ))}
                </div>
              ) : selectedProvince ? (
                <div className="text-center py-8 text-muted-foreground">
                  No se encontraron políticos
                  {selectedParty && " del partido seleccionado"}
                  en esta provincia
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Selecciona una provincia para ver sus políticos
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}