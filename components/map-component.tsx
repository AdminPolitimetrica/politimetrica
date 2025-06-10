
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
            [-78.0, -5.0],
            [-77.8, -5.0],
            [-77.8, -4.8],
            [-78.0, -4.8],
            [-78.0, -5.0],
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
            [-78.0, -9.0],
            [-77.8, -9.0],
            [-77.8, -8.8],
            [-78.0, -8.8],
            [-78.0, -9.0],
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
            [-73.0, -14.0],
            [-72.8, -14.0],
            [-72.8, -13.8],
            [-73.0, -13.8],
            [-73.0, -14.0],
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
            [-72.5, -17.0],
            [-72.3, -17.0],
            [-72.3, -16.8],
            [-72.5, -16.8],
            [-72.5, -17.0],
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
            [-74.0, -13.0],
            [-73.8, -13.0],
            [-73.8, -12.8],
            [-74.0, -12.8],
            [-74.0, -13.0],
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
            [-79.0, -6.0],
            [-78.8, -6.0],
            [-78.8, -5.8],
            [-79.0, -5.8],
            [-79.0, -6.0],
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
            [-77.2, -12.0],
            [-77.0, -12.0],
            [-77.0, -11.8],
            [-77.2, -11.8],
            [-77.2, -12.0],
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
            [-72.0, -13.0],
            [-71.8, -13.0],
            [-71.8, -12.8],
            [-72.0, -12.8],
            [-72.0, -13.0],
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
            [-75.0, -13.0],
            [-74.8, -13.0],
            [-74.8, -12.8],
            [-75.0, -12.8],
            [-75.0, -13.0],
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
            [-76.0, -10.0],
            [-75.8, -10.0],
            [-75.8, -9.8],
            [-76.0, -9.8],
            [-76.0, -10.0],
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
            [-75.5, -14.0],
            [-75.3, -14.0],
            [-75.3, -13.8],
            [-75.5, -13.8],
            [-75.5, -14.0],
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
            [-75.0, -11.5],
            [-74.8, -11.5],
            [-74.8, -11.3],
            [-75.0, -11.3],
            [-75.0, -11.5],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "La Libertad", id_provincia: "la_libertad" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-79.0, -8.0],
            [-78.8, -8.0],
            [-78.8, -7.8],
            [-79.0, -7.8],
            [-79.0, -8.0],
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
            [-80.0, -6.5],
            [-79.8, -6.5],
            [-79.8, -6.3],
            [-80.0, -6.3],
            [-80.0, -6.5],
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
            [-77.5, -12.0],
            [-77.3, -12.0],
            [-77.3, -11.8],
            [-77.5, -11.8],
            [-77.5, -12.0],
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
            [-74.0, -4.0],
            [-73.8, -4.0],
            [-73.8, -3.8],
            [-74.0, -3.8],
            [-74.0, -4.0],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Madre de Dios", id_provincia: "madre_de_dios" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-70.0, -12.0],
            [-69.8, -12.0],
            [-69.8, -11.8],
            [-70.0, -11.8],
            [-70.0, -12.0],
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
            [-71.0, -17.0],
            [-70.8, -17.0],
            [-70.8, -16.8],
            [-71.0, -16.8],
            [-71.0, -17.0],
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
            [-75.5, -10.5],
            [-75.3, -10.5],
            [-75.3, -10.3],
            [-75.5, -10.3],
            [-75.5, -10.5],
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
            [-81.0, -5.0],
            [-80.8, -5.0],
            [-80.8, -4.8],
            [-81.0, -4.8],
            [-81.0, -5.0],
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
            [-70.0, -16.0],
            [-69.8, -16.0],
            [-69.8, -15.8],
            [-70.0, -15.8],
            [-70.0, -16.0],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "San Martín", id_provincia: "san_martin" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-77.0, -7.0],
            [-76.8, -7.0],
            [-76.8, -6.8],
            [-77.0, -6.8],
            [-77.0, -7.0],
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
            [-70.3, -18.0],
            [-70.3, -17.8],
            [-70.5, -17.8],
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
            [-80.5, -3.5],
            [-80.3, -3.5],
            [-80.3, -3.3],
            [-80.5, -3.3],
            [-80.5, -3.5],
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
            [-75.0, -8.0],
            [-74.8, -8.0],
            [-74.8, -7.8],
            [-75.0, -7.8],
            [-75.0, -8.0],
          ],
        ],
      },
    },
  ],
}


const colombiaGeoJson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Amazonas", id_provincia: "amazonas" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-70.0, -1.5],
            [-69.8, -1.5],
            [-69.8, -1.3],
            [-70.0, -1.3],
            [-70.0, -1.5],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Antioquia", id_provincia: "antioquia" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-75.5, 6.0],
            [-75.3, 6.0],
            [-75.3, 6.2],
            [-75.5, 6.2],
            [-75.5, 6.0],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Arauca", id_provincia: "arauca" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-70.0, 7.0],
            [-69.8, 7.0],
            [-69.8, 7.2],
            [-70.0, 7.2],
            [-70.0, 7.0],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Atlántico", id_provincia: "atlantico" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-75.5, 10.5],
            [-75.3, 10.5],
            [-75.3, 10.7],
            [-75.5, 10.7],
            [-75.5, 10.5],
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
            [-75.0, 8.5],
            [-74.8, 8.5],
            [-74.8, 8.7],
            [-75.0, 8.7],
            [-75.0, 8.5],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Boyacá", id_provincia: "boyaca" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-73.5, 6.0],
            [-73.3, 6.0],
            [-73.3, 6.2],
            [-73.5, 6.2],
            [-73.5, 6.0],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Caldas", id_provincia: "caldas" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-75.5, 5.0],
            [-75.3, 5.0],
            [-75.3, 5.2],
            [-75.5, 5.2],
            [-75.5, 5.0],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Caquetá", id_provincia: "caqueta" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-74.0, 0.5],
            [-73.8, 0.5],
            [-73.8, 0.7],
            [-74.0, 0.7],
            [-74.0, 0.5],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Casanare", id_provincia: "casanare" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-71.5, 5.0],
            [-71.3, 5.0],
            [-71.3, 5.2],
            [-71.5, 5.2],
            [-71.5, 5.0],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Cauca", id_provincia: "cauca" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-77.0, 2.5],
            [-76.8, 2.5],
            [-76.8, 2.7],
            [-77.0, 2.7],
            [-77.0, 2.5],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Cesar", id_provincia: "cesar" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-73.5, 9.0],
            [-73.3, 9.0],
            [-73.3, 9.2],
            [-73.5, 9.2],
            [-73.5, 9.0],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Chocó", id_provincia: "choco" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-77.5, 5.0],
            [-77.3, 5.0],
            [-77.3, 5.2],
            [-77.5, 5.2],
            [-77.5, 5.0],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Córdoba", id_provincia: "cordoba" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-76.0, 9.0],
            [-75.8, 9.0],
            [-75.8, 9.2],
            [-76.0, 9.2],
            [-76.0, 9.0],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Cundinamarca", id_provincia: "cundinamarca" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-74.5, 4.0],
            [-74.3, 4.0],
            [-74.3, 4.2],
            [-74.5, 4.2],
            [-74.5, 4.0],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Guainía", id_provincia: "guainia" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-67.5, 2.0],
            [-67.3, 2.0],
            [-67.3, 2.2],
            [-67.5, 2.2],
            [-67.5, 2.0],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Guaviare", id_provincia: "guaviare" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-72.0, 1.0],
            [-71.8, 1.0],
            [-71.8, 1.2],
            [-72.0, 1.2],
            [-72.0, 1.0],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Huila", id_provincia: "huila" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-76.0, 2.5],
            [-75.8, 2.5],
            [-75.8, 2.7],
            [-76.0, 2.7],
            [-76.0, 2.5],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "La Guajira", id_provincia: "la_guajira" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-72.5, 11.5],
            [-72.3, 11.5],
            [-72.3, 11.7],
            [-72.5, 11.7],
            [-72.5, 11.5],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Magdalena", id_provincia: "magdalena" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-74.5, 10.0],
            [-74.3, 10.0],
            [-74.3, 10.2],
            [-74.5, 10.2],
            [-74.5, 10.0],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Meta", id_provincia: "meta" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-73.0, 3.5],
            [-72.8, 3.5],
            [-72.8, 3.7],
            [-73.0, 3.7],
            [-73.0, 3.5],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Nariño", id_provincia: "narino" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-78.5, 1.0],
            [-78.3, 1.0],
            [-78.3, 1.2],
            [-78.5, 1.2],
            [-78.5, 1.0],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Norte de Santander", id_provincia: "norte_de_santander" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-73.5, 8.0],
            [-73.3, 8.0],
            [-73.3, 8.2],
            [-73.5, 8.2],
            [-73.5, 8.0],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Putumayo", id_provincia: "putumayo" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-76.5, -0.5],
            [-76.3, -0.5],
            [-76.3, -0.3],
            [-76.5, -0.3],
            [-76.5, -0.5],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Quindío", id_provincia: "quindio" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-75.5, 4.5],
            [-75.3, 4.5],
            [-75.3, 4.7],
            [-75.5, 4.7],
            [-75.5, 4.5],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Risaralda", id_provincia: "risaralda" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-75.8, 5.0],
            [-75.6, 5.0],
            [-75.6, 5.2],
            [-75.8, 5.2],
            [-75.8, 5.0],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "San Andrés y Providencia", id_provincia: "san_andres_y_providencia" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-81.7, 12.5],
            [-81.5, 12.5],
            [-81.5, 12.7],
            [-81.7, 12.7],
            [-81.7, 12.5],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Santander", id_provincia: "santander" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-73.5, 6.5],
            [-73.3, 6.5],
            [-73.3, 6.7],
            [-73.5, 6.7],
            [-73.5, 6.5],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Sucre", id_provincia: "sucre" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-75.0, 9.0],
            [-74.8, 9.0],
            [-74.8, 9.2],
            [-75.0, 9.2],
            [-75.0, 9.0],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Tolima", id_provincia: "tolima" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-75.0, 4.0],
            [-74.8, 4.0],
            [-74.8, 4.2],
            [-75.0, 4.2],
            [-75.0, 4.0],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Valle del Cauca", id_provincia: "valle_del_cauca" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-76.0, 3.5],
            [-75.8, 3.5],
            [-75.8, 3.7],
            [-76.0, 3.7],
            [-76.0, 3.5],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Vaupés", id_provincia: "vaupes" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-70.0, 0.5],
            [-69.8, 0.5],
            [-69.8, 0.7],
            [-70.0, 0.7],
            [-70.0, 0.5],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Vichada", id_provincia: "vichada" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-69.0, 4.0],
            [-68.8, 4.0],
            [-68.8, 4.2],
            [-69.0, 4.2],
            [-69.0, 4.0],
          ],
        ],
      },
    },
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
