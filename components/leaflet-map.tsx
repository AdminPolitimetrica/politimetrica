"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MapContainer, TileLayer, GeoJSON, Marker, Tooltip } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// GeoJSON simplificado para Ecuador, Perú y Colombia (usa tus datos completos)
const ecuadorGeoJson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Pichincha", id: "pichincha" },
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
      properties: { name: "Guayas", id: "guayas" },
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
      properties: { name: "Azuay", id: "azuay" },
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
      properties: { name: "Bolívar", id: "bolivar" },
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
      properties: { name: "Cañar", id: "canar" },
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
      properties: { name: "Carchi", id: "carchi" },
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
      properties: { name: "Cotopaxi", id: "cotopaxi" },
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
      properties: { name: "Chimborazo", id: "chimborazo" },
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
      properties: { name: "El Oro", id: "el-oro" },
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
      properties: { name: "Esmeraldas", id: "esmeraldas" },
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
      properties: { name: "Galápagos", id: "galapagos" },
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
      properties: { name: "Imbabura", id: "imbabura" },
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
      properties: { name: "Loja", id: "loja" },
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
      properties: { name: "Los Ríos", id: "los-rios" },
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
      properties: { name: "Manabí", id: "manabi" },
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
      properties: { name: "Morona Santiago", id: "morona-santiago" },
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
      properties: { name: "Napo", id: "napo" },
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
      properties: { name: "Pastaza", id: "pastaza" },
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
      properties: { name: "Tungurahua", id: "tungurahua" },
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
      properties: { name: "Zamora Chinchipe", id: "zamora-chinchipe" },
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
      properties: { name: "Sucumbíos", id: "sucumbios" },
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
      properties: { name: "Orellana", id: "orellana" },
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
      properties: { name: "Santo Domingo", id: "santo-domingo" },
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
      properties: { name: "Santa Elena", id: "santa-elena" },
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
      properties: { name: "Amazonas", id: "amazonas" },
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
      properties: { name: "Áncash", id: "ancash" },
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
      properties: { name: "Apurímac", id: "apurimac" },
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
      properties: { name: "Arequipa", id: "arequipa" },
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
      properties: { name: "Ayacucho", id: "ayacucho" },
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
      properties: { name: "Cajamarca", id: "cajamarca" },
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
      properties: { name: "Callao", id: "callao" },
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
      properties: { name: "Cusco", id: "cusco" },
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
      properties: { name: "Huancavelica", id: "huancavelica" },
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
      properties: { name: "Huánuco", id: "huanuco" },
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
      properties: { name: "Ica", id: "ica" },
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
      properties: { name: "Junín", id: "junin" },
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
      properties: { name: "La Libertad", id: "la-libertad" },
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
      properties: { name: "Lambayeque", id: "lambayeque" },
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
      properties: { name: "Lima", id: "lima" },
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
      properties: { name: "Loreto", id: "loreto" },
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
      properties: { name: "Madre de Dios", id: "madre-de-dios" },
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
      properties: { name: "Moquegua", id: "moquegua" },
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
      properties: { name: "Pasco", id: "pasco" },
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
      properties: { name: "Piura", id: "piura" },
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
      properties: { name: "Puno", id: "puno" },
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
      properties: { name: "San Martín", id: "san-martin" },
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
      properties: { name: "Tacna", id: "tacna" },
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
      properties: { name: "Tumbes", id: "tumbes" },
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
      properties: { name: "Ucayali", id: "ucayali" },
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
};

const colombiaGeoJson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Cundinamarca", id: "cundinamarca" },
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
    // Añade más departamentos aquí...
  ],
}

interface MapComponentProps {
  country: "ecuador" | "peru" | "colombia"
  onProvinceSelect?: (provinceId: string) => void
  selectedProvince?: string | null
}

export default function MapComponent({ country, onProvinceSelect, selectedProvince }: MapComponentProps) {
  const router = useRouter()
  const [internalSelectedProvince, setInternalSelectedProvince] = useState<string | null>(selectedProvince || null)
  const [map, setMap] = useState<L.Map | null>(null)

  useEffect(() => {
    setInternalSelectedProvince(selectedProvince || null)
  }, [selectedProvince])

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
          center: [-1.8312, -78.1834],
          zoom: 7,
        }
    }
  }

  const { geoJson, center, zoom } = getCountryData()

  const handleProvinceClick = (province: string, feature: GeoJSON.Feature) => {
    setInternalSelectedProvince(province)
    if (onProvinceSelect) {
      onProvinceSelect(province)
    } else {
      router.push(`/provincias/${province}`)
    }
    if (map) {
      const bounds = getFeatureBounds(feature)
      map.fitBounds(bounds, { maxZoom: 12, padding: [20, 20] })
    }
  }

  const provinceStyle = (feature: any) => {
    return {
      fillColor: feature.properties.id === internalSelectedProvince ? "#3b82f6" : "#64748b",
      weight: 1,
      opacity: 1,
      color: "white",
      fillOpacity: 0.7,
    }
  }

  function getFeatureBounds(feature: GeoJSON.Feature) {
    const coords =
      feature.geometry.type === "Polygon"
        ? feature.geometry.coordinates[0]
        : feature.geometry.type === "MultiPolygon"
        ? feature.geometry.coordinates[0][0]
        : []

    const latlngs = coords.map(([lng, lat]) => L.latLng(lat, lng))
    return L.latLngBounds(latlngs)
  }

  function getCentroid(coordinates: number[][]) {
    let latSum = 0
    let lngSum = 0
    let count = 0
    coordinates.forEach(([lng, lat]) => {
      latSum += lat
      lngSum += lng
      count++
    })
    return [latSum / count, lngSum / count] as [number, number]
  }

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: "100%", width: "100%" }}
      whenCreated={setMap}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <GeoJSON
        data={geoJson as any}
        style={provinceStyle}
        onEachFeature={(feature, layer) => {
          layer.on({
            click: () => handleProvinceClick(feature.properties.id, feature),
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
      {geoJson.features.map((feature) => {
        const coords = feature.geometry.coordinates[0]
        const [lat, lng] = getCentroid(coords)
        return (
          <Marker key={feature.properties.id} position={[lat, lng]}>
            <Tooltip>{feature.properties.name}</Tooltip>
          </Marker>
        )
      })}
    </MapContainer>
  )
}
