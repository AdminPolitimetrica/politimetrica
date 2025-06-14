"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { MapContainer, TileLayer, GeoJSON, Marker, Tooltip } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { supabase } from "@/lib/supabaseClient"

interface Region {
  id: string
  name: string
  geom: GeoJSON.Geometry
  country_id: number
}

interface MapComponentProps {
  countryCode: string // código del país, ej. "ecuador", "peru", "colombia"
  onProvinceSelect?: (provinceKey: string) => void
  selectedProvince?: string | null
}

export default function LeafletMap({ countryCode, onProvinceSelect, selectedProvince }: MapComponentProps) {
  const router = useRouter()
  const [regions, setRegions] = useState<Region[]>([])
  const [internalSelectedProvince, setInternalSelectedProvince] = useState<string | null>(selectedProvince || null)
  const mapRef = useRef<L.Map>(null)
  const [map, setMap] = useState<L.Map | null>(null)

  useEffect(() => {
    setInternalSelectedProvince(selectedProvince || null)
  }, [selectedProvince])

  // Coordenadas y zoom por país
  function getCountryView(): { center: L.LatLngExpression; zoom: number } {
    switch (countryCode.toLowerCase()) {
      case "peru":
        return { center: [-9.19, -75.0152] as L.LatLngTuple, zoom: 6 }
      case "colombia":
        return { center: [4.5709, -74.2973] as L.LatLngTuple, zoom: 6 }
      case "ecuador":
      default:
        return { center: [-1.8312, -78.1834] as L.LatLngTuple, zoom: 7 }
    }
  }

  // Cargar regiones desde Supabase cuando cambia el país
  useEffect(() => {
    if (!countryCode) {
      setRegions([])
      return
    }
    async function fetchRegions() {
      // Obtener id del país
      const { data: countryData, error: countryError } = await supabase
        .from("countries")
        .select("id, code")
        .eq("code", countryCode.toUpperCase())
        .limit(1)
        .single()

      if (countryError || !countryData) {
        console.error("Error fetching country:", countryError)
        setRegions([])
        return
      }

      const countryId = countryData.id

      // Consultar regiones desde la vista regions_geojson
      const { data, error } = await supabase
        .from("regions_geojson")
        .select("id, country_id, name, geom_geojson")
        .eq("country_id", countryId)
        .order("name", { ascending: true })

      if (error) {
        console.error("Error fetching regions:", error)
        setRegions([])
      } else if (data) {
        // Parsear geom_geojson a objeto GeoJSON
        const parsedRegions = data.map((r) => {
          try {
            const geom = typeof r.geom_geojson === 'string' 
              ? JSON.parse(r.geom_geojson)
              : r.geom_geojson

            if (!geom || !geom.type || !geom.coordinates) {
              throw new Error(`Invalid GeoJSON for region ${r.id}`)
            }

            return {
              id: r.id,
              country_id: r.country_id,
              name: r.name,
              geom
            }
          } catch (parseError) {
            console.error(`Error parsing region ${r.id}:`, parseError)
            return null
          }
        }).filter(Boolean) as Region[]

        setRegions(parsedRegions)
      }
    }
    fetchRegions()
  }, [countryCode])

  const { center, zoom } = getCountryView()

  const handleProvinceClick = (provinceKey: string, feature: GeoJSON.Feature) => {
    setInternalSelectedProvince(provinceKey)
    if (onProvinceSelect) {
      onProvinceSelect(provinceKey)
    } else {
      router.push(`/provincias/${provinceKey}`)
    }
    if (map) {
      const bounds = getFeatureBounds(feature)
      map.fitBounds(bounds, { maxZoom: 12, padding: [20, 20] })
    }
  }

  const provinceStyle = (feature: any) => ({
    fillColor: feature.properties.id_provincia === internalSelectedProvince ? "#3b82f6" : "#64748b",
    weight: 1,
    opacity: 1,
    color: "white",
    fillOpacity: 0.7,
  })

  function getFeatureBounds(feature: GeoJSON.Feature): L.LatLngBounds {
    const coords =
      feature.geometry.type === "Polygon"
        ? feature.geometry.coordinates[0]
        : feature.geometry.type === "MultiPolygon"
        ? feature.geometry.coordinates[0][0]
        : []

    const latlngs = coords.map(([lng, lat]) => L.latLng(lat, lng))
    return L.latLngBounds(latlngs)
  }

  function getCentroid(coordinates: number[][]): [number, number] {
    if (coordinates.length === 0) return [0, 0]
    
    let latSum = 0
    let lngSum = 0
    let count = 0
    
    coordinates.forEach(([lng, lat]) => {
      latSum += lat
      lngSum += lng
      count++
    })
    
    return [latSum / count, lngSum / count]
  }

  return (
    <MapContainer 
      center={center} 
      zoom={zoom} 
      style={{ height: "100%", width: "100%" }} 
      ref={(mapInstance) => {
        if (mapInstance) {
          setMap(mapInstance)
          mapRef.current = mapInstance
        }
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <GeoJSON
        data={{
          type: "FeatureCollection",
          features: regions.map((region) => ({
            type: "Feature",
            properties: {
              id_provincia: `${region.id}-${region.country_id}`,
              name: region.name,
            },
            geometry: region.geom,
          })),
        } as GeoJSON.FeatureCollection}
        style={provinceStyle}
        onEachFeature={(feature, layer) => {
          layer.on({
            click: () => handleProvinceClick(feature.properties.id_provincia, feature),
            mouseover: (e) => {
              const layer = e.target
              layer.setStyle({
                fillOpacity: 0.9,
                weight: 2,
              })
            },
            mouseout: (e) => {
              const layer = e.target
              layer.setStyle({
                fillOpacity: 0.7,
                weight: 1,
              })
            },
          })
          layer.bindTooltip(feature.properties.name, { permanent: false })
        }}
      />
      {regions.map((region) => {
        const coords =
          region.geom.type === "Polygon"
            ? region.geom.coordinates[0]
            : region.geom.type === "MultiPolygon"
            ? region.geom.coordinates[0][0]
            : []

        const [lat, lng] = getCentroid(coords)
        return (
          <Marker 
            key={`${region.id}-${region.country_id}`} 
            position={[lat, lng]}
            interactive={false}
          >
            <Tooltip permanent>{region.name}</Tooltip>
          </Marker>
        )
      })}
    </MapContainer>
  )
}