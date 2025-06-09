
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

const peruGeoJson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Amazonas", id_provincia: "amazonas" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-78.5, -6.0],
            [-77.0, -6.0],
            [-77.0, -3.0],
            [-78.5, -3.0],
            [-78.5, -6.0],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Áncash", id_provincia: "ancash" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-78.5, -10.0],
            [-77.0, -10.0],
            [-77.0, -8.0],
            [-78.5, -8.0],
            [-78.5, -10.0],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Apurímac", id_provincia: "apurimac" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-73.5, -14.5],
            [-72.0, -14.5],
            [-72.0, -13.0],
            [-73.5, -13.0],
            [-73.5, -14.5],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Arequipa", id_provincia: "arequipa" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-73.0, -18.0],
            [-71.0, -18.0],
            [-71.0, -16.0],
            [-73.0, -16.0],
            [-73.0, -18.0],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Ayacucho", id_provincia: "ayacucho" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-75.5, -14.5],
            [-73.5, -14.5],
            [-73.5, -12.5],
            [-75.5, -12.5],
            [-75.5, -14.5],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Cajamarca", id_provincia: "cajamarca" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-79.5, -7.0],
            [-78.0, -7.0],
            [-78.0, -5.0],
            [-79.5, -5.0],
            [-79.5, -7.0],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Callao", id_provincia: "callao" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-77.5, -12.0],
            [-77.0, -12.0],
            [-77.0, -11.5],
            [-77.5, -11.5],
            [-77.5, -12.0],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Cusco", id_provincia: "cusco" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-73.0, -15.0],
            [-71.0, -15.0],
            [-71.0, -13.0],
            [-73.0, -13.0],
            [-73.0, -15.0],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Huancavelica", id_provincia: "huancavelica" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-75.5, -13.5],
            [-74.0, -13.5],
            [-74.0, -12.0],
            [-75.5, -12.0],
            [-75.5, -13.5],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Huánuco", id_provincia: "huanuco" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-76.5, -10.5],
            [-74.5, -10.5],
            [-74.5, -8.5],
            [-76.5, -8.5],
            [-76.5, -10.5],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Ica", id_provincia: "ica" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-76.5, -15.0],
            [-75.0, -15.0],
            [-75.0, -13.5],
            [-76.5, -13.5],
            [-76.5, -15.0],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Junín", id_provincia: "junin" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-76.0, -12.0],
            [-74.0, -12.0],
            [-74.0, -10.0],
            [-76.0, -10.0],
            [-76.0, -12.0],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "La Libertad", id_provincia: "la-libertad" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-79.0, -8.5],
            [-77.5, -8.5],
            [-77.5, -7.0],
            [-79.0, -7.0],
            [-79.0, -8.5],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Lambayeque", id_provincia: "lambayeque" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-80.5, -7.0],
            [-79.5, -7.0],
            [-79.5, -6.0],
            [-80.5, -6.0],
            [-80.5, -7.0],
          ],
        ],
      },
    },
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
    {
      type: "Feature",
      properties: { name: "Loreto", id_provincia: "loreto" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-75.0, -5.0],
            [-71.0, -5.0],
            [-71.0, -1.0],
            [-75.0, -1.0],
            [-75.0, -5.0],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Madre de Dios", id_provincia: "madre-de-dios" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-72.0, -13.0],
            [-69.0, -13.0],
            [-69.0, -10.0],
            [-72.0, -10.0],
            [-72.0, -13.0],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Moquegua", id_provincia: "moquegua" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-71.5, -17.5],
            [-70.5, -17.5],
            [-70.5, -16.5],
            [-71.5, -16.5],
            [-71.5, -17.5],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Pasco", id_provincia: "pasco" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-75.5, -11.0],
            [-74.5, -11.0],
            [-74.5, -9.5],
            [-75.5, -9.5],
            [-75.5, -11.0],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Piura", id_provincia: "piura" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-81.5, -6.0],
            [-79.5, -6.0],
            [-79.5, -3.0],
            [-81.5, -3.0],
            [-81.5, -6.0],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Puno", id_provincia: "puno" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-71.0, -17.0],
            [-69.0, -17.0],
            [-69.0, -14.0],
            [-71.0, -14.0],
            [-71.0, -17.0],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "San Martín", id_provincia: "san-martin" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-77.5, -8.0],
            [-75.5, -8.0],
            [-75.5, -5.5],
            [-77.5, -5.5],
            [-77.5, -8.0],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Tacna", id_provincia: "tacna" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-70.5, -18.0],
            [-69.5, -18.0],
            [-69.5, -17.0],
            [-70.5, -17.0],
            [-70.5, -18.0],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Tumbes", id_provincia: "tumbes" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-81.0, -4.0],
            [-80.0, -4.0],
            [-80.0, -3.0],
            [-81.0, -3.0],
            [-81.0, -4.0],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Ucayali", id_provincia: "ucayali" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-75.0, -10.0],
            [-73.0, -10.0],
            [-73.0, -7.0],
            [-75.0, -7.0],
            [-75.0, -10.0],
          ],
        ],
      },
    },
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

  // Función para calcular bounds de una feature GeoJSON
  function getFeatureBounds(feature: GeoJSON.Feature) {
    const coordinates = feature.geometry.type === "Polygon"
      ? feature.geometry.coordinates[0]
      : feature.geometry.type === "MultiPolygon"
      ? feature.geometry.coordinates[0][0]
      : []

    const latlngs = coordinates.map(([lng, lat]) => L.latLng(lat, lng))
    return L.latLngBounds(latlngs)
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
              // Hacer zoom y centrar en la provincia clickeada
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
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [country, highlightedProvinces, selectedProvince, onProvinceSelect])

  return <div id="map" style={{ width: "100%", height: "100%" }} />
}
