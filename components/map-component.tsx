
"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// GeoJSON de Ecuador con todas las provincias
const ecuadorGeoJson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Pichincha", id_provincia: "pichincha" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-78.5, -0.2],
            [-78.4, -0.2],
            [-78.4, -0.1],
            [-78.5, -0.1],
            [-78.5, -0.2],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Guayas", id_provincia: "guayas" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-80.0, -2.2],
            [-79.9, -2.2],
            [-79.9, -2.1],
            [-80.0, -2.1],
            [-80.0, -2.2],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Azuay", id_provincia: "azuay" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-79.0, -2.9],
            [-78.9, -2.9],
            [-78.9, -2.8],
            [-79.0, -2.8],
            [-79.0, -2.9],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Bolívar", id_provincia: "bolivar" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-79.2, -1.6],
            [-79.1, -1.6],
            [-79.1, -1.5],
            [-79.2, -1.5],
            [-79.2, -1.6],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Cañar", id_provincia: "canar" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-79.0, -2.5],
            [-78.9, -2.5],
            [-78.9, -2.4],
            [-79.0, -2.4],
            [-79.0, -2.5],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Carchi", id_provincia: "carchi" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-78.0, 0.7],
            [-77.9, 0.7],
            [-77.9, 0.8],
            [-78.0, 0.8],
            [-78.0, 0.7],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Cotopaxi", id_provincia: "cotopaxi" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-78.8, -0.8],
            [-78.7, -0.8],
            [-78.7, -0.7],
            [-78.8, -0.7],
            [-78.8, -0.8],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Chimborazo", id_provincia: "chimborazo" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-78.7, -1.7],
            [-78.6, -1.7],
            [-78.6, -1.6],
            [-78.7, -1.6],
            [-78.7, -1.7],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "El Oro", id_provincia: "el-oro" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-79.8, -3.3],
            [-79.7, -3.3],
            [-79.7, -3.2],
            [-79.8, -3.2],
            [-79.8, -3.3],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Esmeraldas", id_provincia: "esmeraldas" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-79.2, 0.9],
            [-79.1, 0.9],
            [-79.1, 1.0],
            [-79.2, 1.0],
            [-79.2, 0.9],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Galápagos", id_provincia: "galapagos" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-90.5, -0.7],
            [-90.4, -0.7],
            [-90.4, -0.6],
            [-90.5, -0.6],
            [-90.5, -0.7],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Imbabura", id_provincia: "imbabura" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-78.3, 0.3],
            [-78.2, 0.3],
            [-78.2, 0.4],
            [-78.3, 0.4],
            [-78.3, 0.3],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Loja", id_provincia: "loja" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-79.3, -4.0],
            [-79.2, -4.0],
            [-79.2, -3.9],
            [-79.3, -3.9],
            [-79.3, -4.0],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Los Ríos", id_provincia: "los-rios" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-79.5, -1.6],
            [-79.4, -1.6],
            [-79.4, -1.5],
            [-79.5, -1.5],
            [-79.5, -1.6],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Manabí", id_provincia: "manabi" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-80.2, -1.0],
            [-80.1, -1.0],
            [-80.1, -0.9],
            [-80.2, -0.9],
            [-80.2, -1.0],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Morona Santiago", id_provincia: "morona-santiago" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-78.0, -2.5],
            [-77.9, -2.5],
            [-77.9, -2.4],
            [-78.0, -2.4],
            [-78.0, -2.5],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Napo", id_provincia: "napo" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-77.8, -0.9],
            [-77.7, -0.9],
            [-77.7, -0.8],
            [-77.8, -0.8],
            [-77.8, -0.9],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Pastaza", id_provincia: "pastaza" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-77.5, -1.5],
            [-77.4, -1.5],
            [-77.4, -1.4],
            [-77.5, -1.4],
            [-77.5, -1.5],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Tungurahua", id_provincia: "tungurahua" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-78.5, -1.3],
            [-78.4, -1.3],
            [-78.4, -1.2],
            [-78.5, -1.2],
            [-78.5, -1.3],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Zamora Chinchipe", id_provincia: "zamora-chinchipe" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-78.8, -4.1],
            [-78.7, -4.1],
            [-78.7, -4.0],
            [-78.8, -4.0],
            [-78.8, -4.1],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Sucumbíos", id_provincia: "sucumbios" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-77.0, 0.1],
            [-76.9, 0.1],
            [-76.9, 0.2],
            [-77.0, 0.2],
            [-77.0, 0.1],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Orellana", id_provincia: "orellana" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-76.8, -0.8],
            [-76.7, -0.8],
            [-76.7, -0.7],
            [-76.8, -0.7],
            [-76.8, -0.8],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Santo Domingo", id_provincia: "santo-domingo" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-79.2, -0.3],
            [-79.1, -0.3],
            [-79.1, -0.2],
            [-79.2, -0.2],
            [-79.2, -0.3],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Santa Elena", id_provincia: "santa-elena" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-80.8, -2.2],
            [-80.7, -2.2],
            [-80.7, -2.1],
            [-80.8, -2.1],
            [-80.8, -2.2],
          ],
        ],
      },
    },
  ],
}

// GeoJSON simplificado de Perú (departamentos)
const peruGeoJson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Lima", id_provincia: "lima" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-77.5, -12.5],
            [-76.5, -12.5],
            [-76.5, -11.5],
            [-77.5, -11.5],
            [-77.5, -12.5],
          ],
        ],
      },
    },
    // Puedes añadir más departamentos aquí
  ],
}

// GeoJSON simplificado de Colombia (departamentos)
const colombiaGeoJson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Cundinamarca", id_provincia: "cundinamarca" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-74.5, 4.0],
            [-73.5, 4.0],
            [-73.5, 5.0],
            [-74.5, 5.0],
            [-74.5, 4.0],
          ],
        ],
      },
    },
    // Puedes añadir más departamentos aquí
  ],
}

interface MapComponentProps {
  country: "ecuador" | "peru" | "colombia"
  onProvinceSelect?: (provinceId: string) => void
  selectedProvince?: string | null
  highlightedProvinces?: string[]
}

export function MapComponent({
  country,
  onProvinceSelect,
  selectedProvince = null,
  highlightedProvinces = [],
}: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null)
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null)

  // Función para obtener GeoJSON y centro según país
  function getCountryData() {
    switch (country) {
      case "peru":
        return {
          geoJson: peruGeoJson,
          center: [-9.19, -75.0152],
          zoom: 6,
        }
      case "colombia":
        return {
          geoJson: colombiaGeoJson,
          center: [4.5709, -74.2973],
          zoom: 6,
        }
      case "ecuador":
      default:
        return {
          geoJson: ecuadorGeoJson,
          center: [-1.831239, -78.183406],
          zoom: 7,
        }
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const { geoJson, center, zoom } = getCountryData()

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
      } else {
        mapRef.current.setView(center, zoom)
        if (geoJsonLayerRef.current) {
          geoJsonLayerRef.current.clearLayers()
        }
      }

      geoJsonLayerRef.current = L.geoJSON(geoJson, {
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
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [country, highlightedProvinces, selectedProvince])

  return <div id="map" style={{ width: "100%", height: "100%" }} />
}

