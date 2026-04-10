"use client"

import { useState, useEffect, useRef } from "react"
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps"
import { AlertCircle, X } from "lucide-react"

export interface StateMapData {
  patients: number  
  prevalence: number  
  population: number
}

// { "Selangor": { patients, prevalence, population }, ... }
export type YearMapData = Record<string, StateMapData>

export interface ChoroplethMapProps {
  dataByYear: Record<string, YearMapData>
  availableYears: string[]
  lang: string
  t: {
    map_title: string
    map_subtitle: string
    select_year: string
    legend_high: string
    legend_medium: string
    legend_low: string
    click_state: string
    highest_rate: string
    lowest_rate: string
    average_rate: string
  }
}

const MALAYSIA_GEO_URL = "/data/malaysia.geojson"

const getStateName = (geoName: string): string => geoName

// Colour thresholds based on prevalence % (replaces old getColorByPatients)
const getColorByPrevalence = (prevalence: number): string => {
  if (prevalence > 8) return "#1a3a6b"
  if (prevalence > 4) return "#4a7fc1"
  return "#c9dff5"
}

const getRisk = (prevalence: number): "high" | "medium" | "low" => {
  if (prevalence > 8) return "high"
  if (prevalence > 4) return "medium"
  return "low"
}

export function MalaysiaChoroplethMap({ dataByYear, availableYears, lang, t }: ChoroplethMapProps) {
  const [selectedYear, setSelectedYear] = useState(availableYears[availableYears.length - 1] ?? "")
  const [selectedState, setSelectedState] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)
  const [position, setPosition] = useState({ x: 109, y: 4.2 })
  const [mapError, setMapError] = useState(false)
  const [mapLoading, setMapLoading] = useState(false)
  const [containerWidth, setContainerWidth] = useState(800)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [tooltip, setTooltip] = useState<{ name: string; prevalence: number; x: number; y: number } | null>(null)

  const baseScale = Math.max(containerWidth * 4, 2000)

  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width)
        setZoom(1)
        setPosition({ x: 109, y: 4.2 })
      }
    })
    if (mapContainerRef.current) observer.observe(mapContainerRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    fetch(MALAYSIA_GEO_URL)
      .then(res => {
        if (!res.ok) throw new Error("Failed to load map")
        setMapLoading(false)
      })
      .catch(err => {
        console.error("Map fetch error:", err)
        setMapError(true)
        setMapLoading(false)
      })
  }, [])

  const stateData = dataByYear[selectedYear] ?? {}

  const handleStateClick = (geo: any) => {
    const name = getStateName(geo.properties.name)
    if (stateData[name]) setSelectedState(prev => (prev === name ? null : name))
  }

  const stateEntries = Object.entries(stateData)
  const highestState = stateEntries.length ? stateEntries.reduce((a, b) => a[1].prevalence > b[1].prevalence ? a : b) : null
  const lowestState  = stateEntries.length ? stateEntries.reduce((a, b) => a[1].prevalence < b[1].prevalence ? a : b) : null
  const avgPrevalence = stateEntries.length
    ? (stateEntries.reduce((sum, [, d]) => sum + d.prevalence, 0) / stateEntries.length).toFixed(1)
    : "—"

  const labels = ({
    en: { prevalence: "Prevalence", patients: "Total Patients", risk: "Prevalence Level" },
    ms: { prevalence: "Prevalens",  patients: "Jumlah Pesakit", risk: "Tahap Prevalens" },
    zh: { prevalence: "患病率",      patients: "总患者数",        risk: "患病率等级" },
  } as const)[lang as "en" | "ms" | "zh"] ?? { prevalence: "Prevalence", patients: "Total Patients", risk: "Prevalence Level" }

  const riskLabels = ({
    en: { high: "High",   medium: "Medium",    low: "Low" },
    ms: { high: "Tinggi", medium: "Sederhana", low: "Rendah" },
    zh: { high: "高",     medium: "中等",       low: "低" },
  } as const)[lang as "en" | "ms" | "zh"] ?? { high: "High", medium: "Medium", low: "Low" }

  return (
    <div className="bg-card rounded-2xl border border-border p-4 sm:p-6 shadow-sm">
      <h2 className="text-2xl sm:text-3xl font-bold mb-1">{t.map_title}</h2>
      <p className="text-lg text-muted-foreground mb-4">{t.map_subtitle}</p>

      {/* Year selector */}
      <div className="mb-4">
        <p className="text-base font-semibold mb-2">{t.select_year}:</p>
        <div className="flex flex-wrap gap-2">
          {availableYears.map(year => (
            <button
              key={year}
              onClick={() => { setSelectedYear(year); setSelectedState(null) }}
              className={`px-5 py-3 rounded-xl text-lg font-bold transition-all ${
                selectedYear === year
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground hover:bg-muted/80 border border-border"
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-4">
        {[
          { color: "#c9dff5", border: "#7aaed6", label: t.legend_low },
          { color: "#4a7fc1", border: "#2f5f9e", label: t.legend_medium },
          { color: "#1a3a6b", border: "#0f2147", label: t.legend_high },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-2 text-sm sm:text-base">
            <div className="w-5 h-5 rounded border-2" style={{ background: l.color, borderColor: l.border }} />
            <span>{l.label}</span>
          </div>
        ))}
      </div>

      <p className="text-lg text-muted-foreground mb-3">{t.click_state}</p>

      {/* Map canvas */}
      <div
        ref={mapContainerRef}
        className="relative w-full h-[350px] md:aspect-[16/9] min-h-[200px] bg-[#edf0f5] rounded-xl overflow-hidden"
        onMouseLeave={() => setTooltip(null)}
      >
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-1">
          {[
            { label: "+", action: () => setZoom(z => Math.min(z + 0.2, 8)) },
            { label: "−", action: () => setZoom(z => Math.max(z - 0.2, 0.5)) },
            { label: "⊙", action: () => { setZoom(1); setPosition({ x: 109, y: 4.2 }) } },
          ].map(btn => (
            <button key={btn.label} onClick={btn.action}
              className="w-9 h-9 bg-white border border-border rounded-lg shadow flex items-center justify-center text-lg font-bold hover:bg-muted"
            >
              {btn.label}
            </button>
          ))}
        </div>

        {mapLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#f8fafc]">
            <div className="text-center">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-base text-muted-foreground">
                {lang === "ms" ? "Memuatkan peta..." : lang === "zh" ? "加载地图中..." : "Loading map..."}
              </p>
            </div>
          </div>
        )}

        {mapError && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#f8fafc]">
            <div className="text-center p-6">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-base text-muted-foreground">
                {lang === "ms" ? "Tidak dapat memuatkan peta. Data masih tersedia di bawah."
                  : lang === "zh" ? "无法加载地图。数据仍可在下方查看。"
                  : "Unable to load map. Data is still available below."}
              </p>
            </div>
          </div>
        )}

        {!mapError && (
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ scale: baseScale, center: [109, 4.5] }}
            style={{ width: "100%", height: "100%" }}
          >
            <ZoomableGroup
              zoom={zoom}
              center={[position.x, position.y]}
              onMoveEnd={({ zoom: newZoom, coordinates }) => {
                setZoom(newZoom)
                setPosition({ x: coordinates[0], y: coordinates[1] })
              }}
              minZoom={0.5}
              maxZoom={8}
            >
              <Geographies geography={MALAYSIA_GEO_URL}>
                {({ geographies }) =>
                  geographies.map(geo => {
                    const name = getStateName(geo.properties.name)
                    const data = stateData[name]
                    const isSelected = selectedState === name
                    const fillColor = data ? getColorByPrevalence(data.prevalence) : "#e5e7eb"
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={isSelected ? "#f59e0b" : fillColor}
                        stroke="#ffffff"
                        strokeWidth={1}
                        style={{
                          default: { outline: "none" },
                          hover: { fill: "#f59e0b", outline: "none", cursor: "pointer" },
                          pressed: { fill: "#d97706", outline: "none" },
                        }}
                        onMouseEnter={(evt) => {
                          if (data) {
                            const rect = mapContainerRef.current?.getBoundingClientRect()
                            if (rect) {
                              setTooltip({
                                name,
                                prevalence: data.prevalence,
                                x: evt.clientX - rect.left,
                                y: evt.clientY - rect.top,
                              })
                            }
                          }
                        }}
                        onMouseMove={(evt) => {
                          if (data) {
                            const rect = mapContainerRef.current?.getBoundingClientRect()
                            if (rect) {
                              setTooltip(prev => prev ? { ...prev, x: evt.clientX - rect.left, y: evt.clientY - rect.top } : null)
                            }
                          }
                        }}
                        onMouseLeave={() => setTooltip(null)}
                        onClick={() => handleStateClick(geo)}
                      />
                    )
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>
        )}
        {tooltip && (
          <div
            className="absolute z-20 pointer-events-none bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-lg font-medium"
            style={{
              left: tooltip.x + 12,
              top: tooltip.y - 40,
              transform: tooltip.x > containerWidth - 120 ? "translateX(-110%)" : undefined,
            }}
          >
            <p className="font-bold text-gray-800">{tooltip.name}</p>
            <p className="text-gray-600">{tooltip.prevalence.toFixed(1)}%</p>
          </div>
        )}
      </div>

      {/* Selected state detail panel */}
      {selectedState && stateData[selectedState] && (() => {
        const d = stateData[selectedState]
        const risk = getRisk(d.prevalence)

        const riskConfig = {
          high: {
            bg: "#1a3a6b",
            light: "#e8eef8",
            border: "#4a7fc1",
            emoji: "⚠️",
            message: {
              en: "This state has a high diabetes prevalence. A significant portion of adults may be living with diabetes. Regular blood sugar checks are strongly encouraged, especially if you are over 40, overweight, or have a family history of diabetes.",
              ms: "Negeri ini mempunyai prevalens diabetes yang tinggi. Sebahagian besar orang dewasa mungkin menghidap diabetes. Pemeriksaan gula darah secara berkala amat digalakkan, terutama jika anda berumur lebih 40 tahun, berlebihan berat badan, atau mempunyai sejarah keluarga diabetes.",
              zh: "该州糖尿病患病率较高，相当一部分成年人可能患有糖尿病。强烈建议定期检查血糖，尤其是40岁以上、超重或有糖尿病家族史的人士。",
            }
          },
          medium: {
            bg: "#4a7fc1",
            light: "#e8eef8",
            border: "#4a7fc1",
            emoji: "ℹ️",
            message: {
              en: "This state has a moderate diabetes prevalence. Around 1 in 20 adults may be affected. Consider getting a blood sugar screening if you haven't recently, and make small daily changes like reducing sugary drinks and walking more.",
              ms: "Negeri ini mempunyai prevalens diabetes yang sederhana. Kira-kira 1 dalam 20 orang dewasa mungkin terjejas. Pertimbangkan untuk melakukan saringan gula darah jika anda belum melakukannya, dan buat perubahan kecil seperti mengurangkan minuman manis dan berjalan lebih banyak.",
              zh: "该州糖尿病患病率适中，约每20名成年人中就有1人受影响。如果您近期未做过检查，建议进行血糖筛查，并做出小改变，如减少含糖饮料和多步行。",
            }
          },
          low: {
            bg: "#7aaed6",
            light: "#e8eef8",
            border: "#4a7fc1",
            emoji: "✅",
            message: {
              en: "This state has a relatively low diabetes prevalence. While the numbers are encouraging, it's still important to maintain a healthy lifestyle — eat well, stay active, and check your blood sugar regularly.",
              ms: "Negeri ini mempunyai prevalens diabetes yang agak rendah. Walaupun angka ini menggalakkan, masih penting untuk mengekalkan gaya hidup sihat — makan dengan baik, kekal aktif, dan periksa gula darah anda secara berkala.",
              zh: "该州糖尿病患病率相对较低。虽然数据令人鼓舞，但保持健康的生活方式仍然重要——均衡饮食、保持活跃，并定期检查血糖。",
            }
          },
        }
        const config = riskConfig[risk]
        const message = config.message[lang as "en" | "ms" | "zh"] ?? config.message.en
        
        return (
          <div className="mt-4 rounded-2xl overflow-hidden shadow-md border-2" style={{ borderColor: config.border }}>
            <div className="flex items-center justify-between px-5 py-4" style={{ backgroundColor: config.bg }}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{config.emoji}</span>
                <div>
                  <p className="text-white text-sm font-medium uppercase tracking-wider opacity-80"> 
                    {labels.risk}: {riskLabels[risk]}
                  </p>
                  <h3 className="text-white text-xl font-bold leading-tight">{selectedState}</h3>
                </div>
              </div>
              <button
              onClick={() => setSelectedState(null)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 transition-colors" aria-label="Close"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            {/* Stats row */}
            <div
              className="grid grid-cols-2 divide-x divide-gray-200"
              style={{ backgroundColor: config.light }}
            >
              <div className="px-5 py-3 text-center">
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wide mb-1">{labels.prevalence}</p>
                <p className="text-3xl font-bold" style={{ color: "#1a3a6b" }}>{d.prevalence.toFixed(1)}%</p>
              </div>
              <div className="px-5 py-3 text-center">
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wide mb-1">{labels.patients}</p>
                <p className="text-3xl font-bold" style={{ color: "#1a3a6b" }}>{d.patients.toLocaleString()}</p>
              </div>
            </div>
            {/* Message */}
            <div className="px-5 py-4" style={{ backgroundColor: config.light }}>
              <p className="text-lg text-gray-700 leading-relaxed">{message}</p>
            </div>
          </div>
        )
      })()}

      {/* Statistics row */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">{t.highest_rate}</p>
          <p className="text-2xl sm:text-3xl font-bold text-[#8b3a62]">{highestState ? `${highestState[1].prevalence.toFixed(1)}%` : "—"}</p>
          <p className="text-sm text-muted-foreground">{highestState ? `(${highestState[0]})` : ""}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">{t.lowest_rate}</p>
          <p className="text-2xl sm:text-3xl font-bold text-[#1a5276]">{lowestState ? `${lowestState[1].prevalence.toFixed(1)}%` : "—"}</p>
          <p className="text-sm text-muted-foreground">{lowestState ? `(${lowestState[0]})` : ""}</p>
        </div>
      </div>
    </div>
  )
}
