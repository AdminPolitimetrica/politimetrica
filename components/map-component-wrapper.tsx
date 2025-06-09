"use client"

import { useState } from "react"
import { MapComponent } from "./map-component"

interface MapComponentWrapperProps {
  onProvinceSelect: (provinceId: string) => void
  selectedProvince: string | null
  highlightedProvinces?: string[]
}

export default function MapComponentWrapper({
  onProvinceSelect,
  selectedProvince,
  highlightedProvinces = [],
}: MapComponentWrapperProps) {
  const [country, setCountry] = useState<"ecuador" | "peru" | "colombia">("ecuador")

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <div style={{ marginBottom: 10 }}>
        <label htmlFor="country-select" style={{ marginRight: 8 }}>
          Selecciona país:
        </label>
        <select
          id="country-select"
          value={country}
          onChange={(e) => setCountry(e.target.value as "ecuador" | "peru" | "colombia")}
        >
          <option value="ecuador">Ecuador</option>
          <option value="peru">Perú</option>
          <option value="colombia">Colombia</option>
        </select>
      </div>

      <MapComponent
        country={country}
        onProvinceSelect={onProvinceSelect}
        selectedProvince={selectedProvince}
        highlightedProvinces={highlightedProvinces}
      />
    </div>
  )
}
