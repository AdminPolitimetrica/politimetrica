"use client"

import { useState, useEffect } from "react"
import { MapComponent } from "./map-component"
import { supabase } from "@/lib/supabaseClient"

interface Country {
  id: number
  name: string
  code: string
}

interface Region {
  id: string
  country_id: number
  name: string
  geom: GeoJSON.Geometry
}

interface MapComponentWrapperProps {
  onProvinceSelect: (provinceKey: string) => void
  selectedProvince: string | null
  highlightedProvinces?: string[]
}

const COUNTRY_CODE_MAP: Record<string, string> = {
  PE: "peru",
  CO: "colombia",
  EC: "ecuador"
}

export default function MapComponentWrapper({
  onProvinceSelect,
  selectedProvince,
  highlightedProvinces = [],
}: MapComponentWrapperProps) {
  const [countries, setCountries] = useState<Country[]>([])
  const [country, setCountry] = useState<Country | null>(null)
  const [regions, setRegions] = useState<Region[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCountries() {
      try {
        const { data, error } = await supabase
          .from("countries")
          .select("id, name, code")
          .order("name", { ascending: true })

        if (error) throw error

        setCountries(data || [])
        setCountry(data?.[0] || null)
      } catch (error) {
        console.error("Error fetching countries:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchCountries()
  }, [])

  useEffect(() => {
    if (!country) {
      setRegions([])
      return
    }

    async function fetchRegions() {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from("regions_geojson")
          .select("id, country_id, name, geom_geojson")
          .eq("country_id", country!.id)
          .order("name", { ascending: true })

        if (error) throw error

        const regionsParsed = data?.map(r => {
          try {
            // Verificar si geom_geojson es un string o ya es un objeto
            const geom = typeof r.geom_geojson === 'string' 
              ? JSON.parse(r.geom_geojson)
              : r.geom_geojson

            // Validar la estructura básica de GeoJSON
            if (!geom || !geom.type || !geom.coordinates) {
              throw new Error(`Invalid GeoJSON structure for region ${r.id}`)
            }

            return {
              id: r.id,
              country_id: r.country_id,
              name: r.name,
              geom
            }
          } catch (parseError) {
            console.error(`Error parsing geometry for region ${r.id}:`, parseError)
            return null
          }
        }).filter(Boolean) as Region[]

        setRegions(regionsParsed)
      } catch (error) {
        console.error("Error fetching regions:", error)
        setRegions([])
      } finally {
        setLoading(false)
      }
    }

    fetchRegions()
  }, [country])

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value)
    const selectedCountry = countries.find(c => c.id === selectedId) || null
    setCountry(selectedCountry)
  }

  const getMapCountryCode = (code: string): string => {
    return COUNTRY_CODE_MAP[code] || "ecuador"
  }

  if (loading) {
    return <div>Cargando mapa...</div>
  }

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <div style={{ marginBottom: 10 }}>
        <label htmlFor="country-select" style={{ marginRight: 8 }}>
          Selecciona país:
        </label>
        <select 
          id="country-select" 
          value={country?.id || ""} 
          onChange={handleCountryChange}
          disabled={loading}
        >
          {countries.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {country && (
        <MapComponent
          country={getMapCountryCode(country.code)}
          onProvinceSelect={onProvinceSelect}
          selectedProvince={selectedProvince}
          highlightedProvinces={highlightedProvinces}
          regions={regions}
        />
      )}
    </div>
  )
}