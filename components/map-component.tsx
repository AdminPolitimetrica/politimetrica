"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

interface Region {
  id: string
  country_id: number
  name: string
  geom: GeoJSON.Geometry
}

interface MapComponentProps {
  country: string
  onProvinceSelect?: (provinceKey: string) => void
  selectedProvince?: string | null
  highlightedProvinces?: string[]
  regions?: Region[]
}

export function MapComponent({
  country,
  onProvinceSelect,
  selectedProvince = null,
  highlightedProvinces = [],
  regions = [],
}: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null)
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null)

  // Centro y zoom por país para centrar el mapa
  function getCountryView(): { center: [number, number]; zoom: number } {
    const countryLower = country.toLowerCase();
    switch (countryLower) {
      case "peru":
        return { center: [-9.19, -75.0152], zoom: 6 }
      case "colombia":
        return { center: [4.5709, -74.2973], zoom: 6 }
      case "ecuador":
        return { center: [-1.831239, -78.183406], zoom: 7 }
      default:
        // Por defecto Ecuador si no coincide
        return { center: [-1.831239, -78.183406], zoom: 7 }
    }
  }

  function getFeatureBounds(feature: GeoJSON.Feature) {
    const coordinates =
      feature.geometry.type === "Polygon"
        ? feature.geometry.coordinates[0]
        : feature.geometry.type === "MultiPolygon"
        ? feature.geometry.coordinates[0][0]
        : []

    const latlngs = coordinates.map(([lng, lat]) => L.latLng(lat, lng))
    return L.latLngBounds(latlngs)
  }

  useEffect(() => {
    if (typeof window === "undefined") return

    const { center, zoom } = getCountryView()

    if (!mapRef.current) {
      mapRef.current = L.map("map", {
        center,
        zoom,
        zoomControl: true,
        attributionControl: false,
      })

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(mapRef.current)
    }

    // Centrar el mapa siempre
    mapRef.current.setView(center, zoom)

    // Limpiar capas anteriores
    if (geoJsonLayerRef.current) {
      geoJsonLayerRef.current.clearLayers()
      geoJsonLayerRef.current = null
    }

    // Si no hay regiones, mostrar solo el mapa base
    if (regions.length === 0) return

    const features: GeoJSON.Feature[] = regions.map((region) => ({
      type: "Feature",
      properties: {
        name: region.name,
        id_provincia: `${region.id}-${region.country_id}`,
      },
      geometry: region.geom,
    }))

    geoJsonLayerRef.current = L.geoJSON(features, {
      style: (feature) => {
        const provinceId = feature?.properties?.id_provincia?.toLowerCase() || ""
        const isHighlighted = highlightedProvinces.length === 0 || highlightedProvinces.includes(provinceId)
        const isSelected = selectedProvince === provinceId

        return {
          fillColor: isSelected ? "#3b82f6" : isHighlighted ? "#93c5fd" : "#d1d5db",
          weight: isSelected ? 2 : 1,
          opacity: 1,
          color: isSelected ? "#1d4ed8" : "#6b7280",
          fillOpacity: isHighlighted ? 0.7 : 0.3,
        }
      },
      onEachFeature: (feature, layer) => {
        const provinceId = feature?.properties?.id_provincia?.toLowerCase() || ""
        const provinceName = feature?.properties?.name || "Provincia"

        layer.bindTooltip(provinceName, {
          permanent: false,
          direction: "center",
          className: "province-tooltip",
        })

        layer.on({
          click: () => {
            if (onProvinceSelect) {
              onProvinceSelect(provinceId)
            }
            if (mapRef.current) {
              const bounds = getFeatureBounds(feature)
              mapRef.current.fitBounds(bounds, { maxZoom: 12, padding: [20, 20] })
            }
          },
          mouseover: (e) => {
            const isHighlighted = highlightedProvinces.length === 0 || highlightedProvinces.includes(provinceId)
            if (isHighlighted) {
              const layer = e.target
              layer.setStyle({
                fillOpacity: 0.9,
              })
            }
          },
          mouseout: (e) => {
            const isHighlighted = highlightedProvinces.length === 0 || highlightedProvinces.includes(provinceId)
            const isSelected = selectedProvince === provinceId

            const layer = e.target
            layer.setStyle({
              fillOpacity: isSelected ? 0.8 : isHighlighted ? 0.7 : 0.3,
            })
          },
        })
      },
    }).addTo(mapRef.current)

    return () => {
      if (geoJsonLayerRef.current) {
        geoJsonLayerRef.current.clearLayers()
      }
    }
  }, [country, regions, highlightedProvinces, selectedProvince, onProvinceSelect])

  return <div id="map" style={{ width: "100%", height: "100%" }} />
}