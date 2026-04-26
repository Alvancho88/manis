"use client"

import { useState } from "react"
import Image from "next/image"
import { AlertCircle, X } from "lucide-react"

export type BodyMapEntry = {
  organ: string
  title: string
  accent: string
  conditions: { label: string; bg: string; color: string; dot: string; text: string }[]
  watch: string
}

export type BodyMapData = {
  brain: BodyMapEntry
  eyes: BodyMapEntry
  heart: BodyMapEntry
  kidneys: BodyMapEntry
  vessels: BodyMapEntry
  feet: BodyMapEntry
}

type BodyMapId = keyof BodyMapData

// ─── Static content ────────────────────────────────────────────────────────────

const defaultData: BodyMapData = {
  brain: {
    organ: "Brain", title: "Stroke & cognitive decline", accent: "#534AB7",
    conditions: [
      { label: "Diabetes", bg: "#EEEDFE", color: "#0C447C", dot: "#185FA5", text: "High blood sugar damages blood vessels in the brain over time, raising stroke risk and slowing cognitive function." },
      { label: "High blood pressure", bg: "#FBEAF0", color: "#72243E", dot: "#993556", text: "Uncontrolled hypertension puts constant pressure on brain vessels — the leading cause of haemorrhagic stroke." },
      { label: "High cholesterol", bg: "#FAEEDA", color: "#633806", dot: "#854F0B", text: "Plaque buildup in arteries leading to the brain can trigger an ischaemic stroke by cutting off blood flow." },
    ],
    watch: "Sudden headache, vision changes, numbness on one side, or confusion — seek emergency help immediately.",
  },
  eyes: {
    organ: "Eyes", title: "Retinopathy & vision loss", accent: "#185FA5",
    conditions: [
      { label: "Diabetes", bg: "#E6F1FB", color: "#0C447C", dot: "#185FA5", text: "Excess blood sugar weakens retinal blood vessels, causing leaks or bleeding — the leading cause of blindness in working-age adults." },
      { label: "High blood pressure", bg: "#FBEAF0", color: "#72243E", dot: "#993556", text: "Hypertension causes hypertensive retinopathy, narrowing retinal vessels and reducing blood flow to the eye." },
      { label: "High cholesterol", bg: "#FAEEDA", color: "#633806", dot: "#854F0B", text: "High LDL can deposit in the eye's vessels, increasing risk of retinal vein occlusion and sudden vision loss." },
    ],
    watch: "Blurry vision, floaters, or dark spots — if you have diabetes, get an annual dilated eye exam.",
  },
  heart: {
    organ: "Heart", title: "Heart attack & heart failure", accent: "#993556",
    conditions: [
      { label: "Diabetes", bg: "#E6F1FB", color: "#0C447C", dot: "#185FA5", text: "People with diabetes are 2–3× more likely to develop heart disease. High blood sugar damages coronary arteries and promotes inflammation." },
      { label: "High blood pressure", bg: "#FBEAF0", color: "#72243E", dot: "#993556", text: "The heart works harder against high pressure, causing it to thicken and weaken over time — eventually leading to heart failure." },
      { label: "High cholesterol", bg: "#FAEEDA", color: "#633806", dot: "#854F0B", text: "LDL cholesterol builds up as plaque inside coronary arteries. A plaque rupture causes a heart attack." },
    ],
    watch: "Chest tightness, shortness of breath, or pain radiating to the arm or jaw — call emergency services immediately.",
  },
  kidneys: {
    organ: "Kidneys", title: "Nephropathy & kidney failure", accent: "#854F0B",
    conditions: [
      { label: "Diabetes", bg: "#E6F1FB", color: "#0C447C", dot: "#185FA5", text: "High blood sugar is the leading cause of chronic kidney disease globally, damaging the tiny filtering units inside the kidneys." },
      { label: "High blood pressure", bg: "#FBEAF0", color: "#72243E", dot: "#993556", text: "High pressure in kidney blood vessels scars the filters, reducing their ability to remove waste from blood." },
      { label: "High cholesterol", bg: "#FAEEDA", color: "#633806", dot: "#854F0B", text: "Cholesterol deposits reduce blood flow to the kidneys, accelerating damage — especially combined with diabetes or hypertension." },
    ],
    watch: "Swollen ankles, foamy urine, or fatigue — kidneys often show no symptoms until damage is advanced. Get screened regularly.",
  },
  vessels: {
    organ: "Blood vessels", title: "Atherosclerosis & poor circulation", accent: "#A32D2D",
    conditions: [
      { label: "Diabetes", bg: "#E6F1FB", color: "#0C447C", dot: "#185FA5", text: "High blood sugar makes vessel walls stiff and sticky, accelerating plaque buildup and reducing the ability of vessels to dilate." },
      { label: "High blood pressure", bg: "#FBEAF0", color: "#72243E", dot: "#993556", text: "Constant high pressure damages the artery lining, creating sites where cholesterol plaque begins to accumulate." },
      { label: "High cholesterol", bg: "#FAEEDA", color: "#633806", dot: "#854F0B", text: "LDL is the primary driver of atherosclerosis — it infiltrates damaged artery walls and forms plaques that narrow and harden the arteries." },
    ],
    watch: "Cold hands or feet, leg cramps when walking, or slow-healing wounds can indicate poor circulation.",
  },
  feet: {
    organ: "Feet & legs", title: "Neuropathy & diabetic foot", accent: "#0F6E56",
    conditions: [
      { label: "Diabetes", bg: "#E6F1FB", color: "#0C447C", dot: "#185FA5", text: "High blood sugar damages nerves in the feet (neuropathy), causing numbness or burning. Small wounds can go unnoticed and become serious infections." },
      { label: "High blood pressure", bg: "#FBEAF0", color: "#72243E", dot: "#993556", text: "Reduced blood flow from hypertension slows wound healing in the feet and lower legs." },
      { label: "High cholesterol", bg: "#FAEEDA", color: "#633806", dot: "#854F0B", text: "Peripheral artery disease from plaque buildup restricts blood supply to the legs, worsening neuropathy and increasing amputation risk." },
    ],
    watch: "Check your feet daily for cuts, blisters, or sores — especially if you have reduced sensation. Never walk barefoot.",
  },
}

const defaultWatchLabel = "Watch for"
const defaultEmptyLabel = "Click a hotspot on the body to see how the Three Highs affect that area"
const defaultLegendLabels = {
  diabetes: "Diabetes",
  bloodPressure: "High blood pressure",
  cholesterol: "High cholesterol",
}

// ─── Hotspot layout ────────────────────────────────────────────────────────────

const hotspotPositions: { id: BodyMapId; top: string; left: string; color: string }[] = [
  { id: "brain",   top: "15%",  left: "49%", color: "#534AB7" },
  { id: "eyes",    top: "20%", left: "45%", color: "#185FA5" },
  { id: "heart",   top: "35%", left: "58%", color: "#993556" },
  { id: "kidneys", top: "48%", left: "57%", color: "#854F0B" },
  { id: "vessels", top: "42%", left: "50%", color: "#A32D2D" },
  { id: "feet",    top: "84%", left: "30%", color: "#0F6E56" },
]

// ─── Props (all optional — falls back to built-in defaults) ───────────────────

interface BodyMapProps {
  data?: BodyMapData
  watchLabel?: string
  emptyLabel?: string
  legendLabels?: { diabetes: string; bloodPressure: string; cholesterol: string }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function BodyMap({
  data = defaultData,
  watchLabel = defaultWatchLabel,
  emptyLabel = defaultEmptyLabel,
  legendLabels = defaultLegendLabels,
}: BodyMapProps) {
  const [activeId, setActiveId] = useState<BodyMapId | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  function handleHotspot(id: BodyMapId) {
    setActiveId(id)
    if (window.innerWidth < 560) setDrawerOpen(true)
  }

  function close() {
    setActiveId(null)
    setDrawerOpen(false)
  }

  const active = activeId ? data[activeId] : null

  const PanelContent = ({ d }: { d: BodyMapEntry }) => (
    <>
      <div className="h-1 w-full" style={{ backgroundColor: d.accent }} />
      <div className="flex items-start justify-between p-4 pb-0">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-0.5">{d.organ}</p>
          <h3 className="text-lg font-semibold" style={{ color: d.accent }}>{d.title}</h3>
        </div>
        <button
          onClick={close}
          className="w-7 h-7 rounded-full border flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors shrink-0 mt-0.5"
          style={{ borderColor: "var(--border)" }}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="p-4 flex flex-col gap-3">
        {d.conditions.map((c, i) => (
          <div key={i}>
            <span
              className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full mb-1.5"
              style={{ backgroundColor: c.bg, color: c.color }}
            >
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: c.dot }} />
              {c.label}
            </span>
            <p className="text-sm leading-relaxed text-muted-foreground">{c.text}</p>
          </div>
        ))}
        <div className="rounded-xl p-3 mt-1" style={{ backgroundColor: "var(--muted)" }}>
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-1">{watchLabel}</p>
          <p className="text-sm leading-relaxed">{d.watch}</p>
        </div>
      </div>
    </>
  )

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-6 min-h-[480px]">

        {/* Body image with hotspots */}
        <div className="flex-shrink-0 flex justify-center sm:justify-start">
          <div className="relative w-[200px] h-[480px]">
            <Image
              src="/images/human-body-1.png"
              alt="Human body diagram"
              fill
              className="object-contain"
            />
            {hotspotPositions.map(({ id, top, left, color }) => (
              <button
                key={id}
                onClick={() => handleHotspot(id)}
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2 group"
                style={{ top, left }}
                aria-label={data[id].organ}
              >
                <span
                  className="absolute inset-0 rounded-full animate-ping"
                  style={{ backgroundColor: color, animationDuration: "2s", opacity: 0.3 }}
                />
                <span
                  className="relative flex w-6 h-6 rounded-full border-2 border-white items-center justify-center transition-transform duration-150 group-hover:scale-125"
                  style={{
                    backgroundColor: color,
                    boxShadow: activeId === id ? `0 0 0 3px ${color}40` : "0 1px 4px rgba(0,0,0,0.2)",
                  }}
                >
                  <span className="w-2 h-2 rounded-full bg-white" />
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Desktop side panel */}
        <div className="hidden sm:flex flex-1 min-w-0">
          {!active ? (
            <div
              className="flex-1 flex flex-col items-center justify-center gap-3 text-muted-foreground text-sm text-center border border-dashed rounded-2xl p-8"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <AlertCircle className="w-5 h-5" />
              </div>
              {emptyLabel}
            </div>
          ) : (
            <div
              className="flex-1 rounded-2xl border overflow-hidden animate-in fade-in slide-in-from-right-4 duration-200 overflow-y-auto max-h-[480px]"
              style={{ borderColor: "var(--border)" }}
            >
              <PanelContent d={active} />
            </div>
          )}
        </div>
      </div>

      {/* Mobile bottom drawer */}
      {drawerOpen && active && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 sm:hidden" onClick={close} />
          <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-background rounded-t-2xl max-h-[75vh] overflow-y-auto animate-in slide-in-from-bottom duration-250">
            <div className="w-9 h-1 rounded-full bg-border mx-auto mt-3 mb-1" />
            <PanelContent d={active} />
          </div>
        </>
      )}
    </div>
  )
}
