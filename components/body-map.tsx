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
  image?: { src: string; caption: string }
}

export type BodyMapData = {
  brain: BodyMapEntry
  eyes: BodyMapEntry
  heart: BodyMapEntry
  kidneys: BodyMapEntry
  feet: BodyMapEntry
}

type BodyMapId = keyof BodyMapData

type BodyMapContent = {
  title: string
  watchLabel: string
  emptyLabel: string
  legend: { diabetes: string; bloodPressure: string; cholesterol: string }
  data: BodyMapData
}

// ─── Static content ────────────────────────────────────────────────────────────
const bodyMapContent: Record<string, BodyMapContent> = {
  en: {
    title: "How the Three Highs affect your body",
    watchLabel: "Watch for",
    emptyLabel: "Click a hotspot on the body to see how the Three Highs affect that area",
    legend: { diabetes: "Diabetes", bloodPressure: "High blood pressure", cholesterol: "High cholesterol" },
    data: {
      brain: {
        organ: "Brain", title: "Stroke & cognitive decline", accent: "#534AB7",
        conditions: [
          { label: "Diabetes", bg: "#E6F1FB", color: "#0C447C", dot: "#185FA5", text: "High blood sugar damages blood vessels in the brain over time, raising stroke risk and slowing cognitive function." },
          { label: "High blood pressure", bg: "#FBEAF0", color: "#72243E", dot: "#993556", text: "Uncontrolled hypertension puts constant pressure on brain vessels; the leading cause of haemorrhagic stroke." },
          { label: "High cholesterol", bg: "#FAEEDA", color: "#633806", dot: "#854F0B", text: "Plaque buildup in arteries leading to the brain can trigger an ischaemic stroke by cutting off blood flow." },
        ],
        watch: "Sudden headache, vision changes, numbness on one side, or confusion; seek emergency help immediately.",
      },
      eyes: {
        organ: "Eyes", title: "Retinopathy & vision loss", accent: "#185FA5",
        conditions: [
          { label: "Diabetes", bg: "#E6F1FB", color: "#0C447C", dot: "#185FA5", text: "Excess blood sugar weakens retinal blood vessels, causing leaks or bleeding; the leading cause of blindness in working-age adults." },
          { label: "High blood pressure", bg: "#FBEAF0", color: "#72243E", dot: "#993556", text: "Hypertension causes hypertensive retinopathy, narrowing retinal vessels and reducing blood flow to the eye." },
          { label: "High cholesterol", bg: "#FAEEDA", color: "#633806", dot: "#854F0B", text: "High LDL can deposit in the eye's vessels, increasing risk of retinal vein occlusion and sudden vision loss." },
        ],
        watch: "Blurry vision, floaters, or dark spots; if you have diabetes, get an annual dilated eye exam.",
      },
      heart: {
        organ: "Heart", title: "Heart attack & heart failure", accent: "#993556",
        conditions: [
          { label: "Diabetes", bg: "#E6F1FB", color: "#0C447C", dot: "#185FA5", text: "People with diabetes are 2–3× more likely to develop heart disease. High blood sugar damages coronary arteries and promotes inflammation." },
          { label: "High blood pressure", bg: "#FBEAF0", color: "#72243E", dot: "#993556", text: "The heart works harder against high pressure, causing it to thicken and weaken over time — eventually leading to heart failure." },
          { label: "High cholesterol", bg: "#FAEEDA", color: "#633806", dot: "#854F0B", text: "LDL cholesterol builds up as plaque inside coronary arteries. A plaque rupture causes a heart attack." },
        ],
        watch: "Chest tightness, shortness of breath, or pain radiating to the arm or jaw; call emergency services immediately.",
      },
      kidneys: {
        organ: "Kidneys", title: "Nephropathy & kidney failure", accent: "#854F0B",
        conditions: [
          { label: "Diabetes", bg: "#E6F1FB", color: "#0C447C", dot: "#185FA5", text: "High blood sugar is the leading cause of chronic kidney disease globally, damaging the tiny filtering units inside the kidneys." },
          { label: "High blood pressure", bg: "#FBEAF0", color: "#72243E", dot: "#993556", text: "High pressure in kidney blood vessels scars the filters, reducing their ability to remove waste from blood." },
          { label: "High cholesterol", bg: "#FAEEDA", color: "#633806", dot: "#854F0B", text: "Cholesterol deposits reduce blood flow to the kidneys, accelerating damage — especially combined with diabetes or hypertension." },
        ],
        watch: "Swollen ankles, foamy urine, or fatigue; kidneys often show no symptoms until damage is advanced. Get screened regularly.",
      },
      feet: {
        organ: "Feet & legs", title: "Neuropathy & diabetic foot", accent: "#0F6E56",
        conditions: [
          { label: "Diabetes", bg: "#E6F1FB", color: "#0C447C", dot: "#185FA5", text: "High blood sugar damages nerves in the feet (neuropathy), causing numbness or burning. Small wounds can go unnoticed and become serious infections." },
          { label: "High blood pressure", bg: "#FBEAF0", color: "#72243E", dot: "#993556", text: "Reduced blood flow from hypertension slows wound healing in the feet and lower legs." },
          { label: "High cholesterol", bg: "#FAEEDA", color: "#633806", dot: "#854F0B", text: "Peripheral artery disease from plaque buildup restricts blood supply to the legs, worsening neuropathy and increasing amputation risk." },
        ],
        watch: "Check your feet daily for cuts, blisters, or sores; especially if you have reduced sensation. Never walk barefoot.",
      },
    },
  },
  ms: {
    title: "Bagaimana Tiga Tinggi mempengaruhi badan anda",
    watchLabel: "Perhatikan tanda-tanda ini",
    emptyLabel: "Klik titik panas pada badan untuk melihat bagaimana Tiga Tinggi mempengaruhi kawasan tersebut",
    legend: { diabetes: "Diabetes", bloodPressure: "Tekanan darah tinggi", cholesterol: "Kolesterol tinggi" },
    data: {
      brain: {
        organ: "Otak", title: "Strok & penurunan kognitif", accent: "#534AB7",
        conditions: [
          { label: "Diabetes", bg: "#E6F1FB", color: "#0C447C", dot: "#185FA5", text: "Gula darah tinggi merosakkan saluran darah di otak dari semasa ke semasa, meningkatkan risiko strok dan melambatkan fungsi kognitif." },
          { label: "Tekanan darah tinggi", bg: "#FBEAF0", color: "#72243E", dot: "#993556", text: "Hipertensi yang tidak terkawal memberi tekanan berterusan pada saluran otak; punca utama strok hemoragik." },
          { label: "Kolesterol tinggi", bg: "#FAEEDA", color: "#633806", dot: "#854F0B", text: "Penumpukan plak dalam arteri menuju otak boleh mencetuskan strok iskemia dengan menyekat aliran darah." },
        ],
        watch: "Sakit kepala mengejut, perubahan penglihatan, kebas di satu sisi, atau kekeliruan; dapatkan pertolongan kecemasan dengan segera.",
      },
      eyes: {
        organ: "Mata", title: "Retinopati & kehilangan penglihatan", accent: "#185FA5",
        conditions: [
          { label: "Diabetes", bg: "#E6F1FB", color: "#0C447C", dot: "#185FA5", text: "Gula darah berlebihan melemahkan saluran darah retina, menyebabkan kebocoran atau pendarahan; punca utama kebutaan dalam kalangan orang dewasa yang bekerja." },
          { label: "Tekanan darah tinggi", bg: "#FBEAF0", color: "#72243E", dot: "#993556", text: "Hipertensi menyebabkan retinopati hipertensif, menyempitkan saluran retina dan mengurangkan aliran darah ke mata." },
          { label: "Kolesterol tinggi", bg: "#FAEEDA", color: "#633806", dot: "#854F0B", text: "LDL tinggi boleh mendap dalam saluran mata, meningkatkan risiko penyumbatan vena retina dan kehilangan penglihatan mengejut." },
        ],
        watch: "Penglihatan kabur, titisan terapung, atau bintik gelap; jika anda menghidap diabetes, lakukan pemeriksaan mata tahunan.",
      },
      heart: {
        organ: "Jantung", title: "Serangan jantung & kegagalan jantung", accent: "#993556",
        conditions: [
          { label: "Diabetes", bg: "#E6F1FB", color: "#0C447C", dot: "#185FA5", text: "Penghidap diabetes 2–3× lebih berisiko mendapat penyakit jantung. Gula darah tinggi merosakkan arteri koronari dan menggalakkan keradangan." },
          { label: "Tekanan darah tinggi", bg: "#FBEAF0", color: "#72243E", dot: "#993556", text: "Jantung perlu bekerja lebih keras menentang tekanan tinggi, menyebabkannya menebal dan melemah; akhirnya membawa kepada kegagalan jantung." },
          { label: "Kolesterol tinggi", bg: "#FAEEDA", color: "#633806", dot: "#854F0B", text: "Kolesterol LDL terkumpul sebagai plak dalam arteri koronari. Pecahan plak menyebabkan serangan jantung." },
        ],
        watch: "Rasa sesak dada, sesak nafas, atau sakit yang memancar ke lengan atau rahang; hubungi perkhidmatan kecemasan dengan segera.",
      },
      kidneys: {
        organ: "Buah pinggang", title: "Nefropati & kegagalan buah pinggang", accent: "#854F0B",
        conditions: [
          { label: "Diabetes", bg: "#E6F1FB", color: "#0C447C", dot: "#185FA5", text: "Gula darah tinggi adalah punca utama penyakit buah pinggang kronik di seluruh dunia, merosakkan unit penapisan kecil dalam buah pinggang." },
          { label: "Tekanan darah tinggi", bg: "#FBEAF0", color: "#72243E", dot: "#993556", text: "Tekanan tinggi dalam saluran darah buah pinggang mengerutkan penapis, mengurangkan keupayaannya membuang sisa dari darah." },
          { label: "Kolesterol tinggi", bg: "#FAEEDA", color: "#633806", dot: "#854F0B", text: "Mendapan kolesterol mengurangkan aliran darah ke buah pinggang, mempercepatkan kerosakan; terutama apabila digabungkan dengan diabetes atau hipertensi." },
        ],
        watch: "Pergelangan kaki bengkak, air kencing berbuih, atau keletihan; buah pinggang sering tidak menunjukkan gejala sehingga kerosakan teruk. Jalani saringan berkala.",
      },
      feet: {
        organ: "Kaki & betis", title: "Neuropati & kaki diabetik", accent: "#0F6E56",
        conditions: [
          { label: "Diabetes", bg: "#E6F1FB", color: "#0C447C", dot: "#185FA5", text: "Gula darah tinggi merosakkan saraf di kaki (neuropati), menyebabkan kebas atau rasa terbakar. Luka kecil boleh tidak disedari dan menjadi jangkitan serius." },
          { label: "Tekanan darah tinggi", bg: "#FBEAF0", color: "#72243E", dot: "#993556", text: "Aliran darah yang berkurangan akibat hipertensi melambatkan penyembuhan luka di kaki dan betis." },
          { label: "Kolesterol tinggi", bg: "#FAEEDA", color: "#633806", dot: "#854F0B", text: "Penyakit arteri periferi akibat penumpukan plak menyekat bekalan darah ke kaki, memburukkan neuropati dan meningkatkan risiko amputasi." },
        ],
        watch: "Periksa kaki anda setiap hari untuk luka, lepuh, atau kudis; terutama jika anda mengalami pengurangan deria. Jangan berjalan tanpa alas kaki.",
      },
    },
  },
  zh: {
    title: "三高如何影响您的身体",
    watchLabel: "注意征兆",
    emptyLabel: "点击身体上的热点，查看三高如何影响该部位",
    legend: { diabetes: "糖尿病", bloodPressure: "高血压", cholesterol: "高胆固醇" },
    data: {
      brain: {
        organ: "大脑", title: "中风与认知衰退", accent: "#534AB7",
        conditions: [
          { label: "糖尿病", bg: "#E6F1FB", color: "#0C447C", dot: "#185FA5", text: "长期高血糖会损伤大脑血管，增加中风风险并降低认知功能。" },
          { label: "高血压", bg: "#FBEAF0", color: "#72243E", dot: "#993556", text: "未受控制的高血压对脑血管持续施压是出血性中风的主要原因。" },
          { label: "高胆固醇", bg: "#FAEEDA", color: "#633806", dot: "#854F0B", text: "通往大脑的动脉斑块堆积可通过阻断血流引发缺血性中风。" },
        ],
        watch: "突发头痛、视力变化、一侧肢体麻木或意识混乱，请立即寻求紧急救助。",
      },
      eyes: {
        organ: "眼睛", title: "视网膜病变与视力丧失", accent: "#185FA5",
        conditions: [
          { label: "糖尿病", bg: "#E6F1FB", color: "#0C447C", dot: "#185FA5", text: "过高的血糖会削弱视网膜血管，导致渗漏或出血是工作年龄成人失明的主要原因。" },
          { label: "高血压", bg: "#FBEAF0", color: "#72243E", dot: "#993556", text: "高血压会引起高血压性视网膜病变，使视网膜血管变窄、减少眼部血流。" },
          { label: "高胆固醇", bg: "#FAEEDA", color: "#633806", dot: "#854F0B", text: "高LDL可沉积在眼部血管中，增加视网膜静脉阻塞和突发性视力丧失的风险。" },
        ],
        watch: "视力模糊、飞蚊症或黑点，如果您患有糖尿病，请每年进行一次散瞳眼科检查。",
      },
      heart: {
        organ: "心脏", title: "心脏病发作与心力衰竭", accent: "#993556",
        conditions: [
          { label: "糖尿病", bg: "#E6F1FB", color: "#0C447C", dot: "#185FA5", text: "糖尿病患者患心脏病的风险是常人的2–3倍。高血糖损伤冠状动脉并促进炎症。" },
          { label: "高血压", bg: "#FBEAF0", color: "#72243E", dot: "#993556", text: "心脏需要在高压下更努力地工作，导致心肌增厚和衰弱，最终引发心力衰竭。" },
          { label: "高胆固醇", bg: "#FAEEDA", color: "#633806", dot: "#854F0B", text: "LDL胆固醇在冠状动脉内堆积形成斑块。斑块破裂会导致心脏病发作。" },
        ],
        watch: "胸部紧绷感、呼吸困难或疼痛放射至手臂或下颌，请立即拨打紧急服务电话。",
      },
      kidneys: {
        organ: "肾脏", title: "肾病与肾衰竭", accent: "#854F0B",
        conditions: [
          { label: "糖尿病", bg: "#E6F1FB", color: "#0C447C", dot: "#185FA5", text: "高血糖是全球慢性肾病的主要原因，会损伤肾脏内的微小过滤单元。" },
          { label: "高血压", bg: "#FBEAF0", color: "#72243E", dot: "#993556", text: "肾脏血管中的高压会损伤过滤器，降低其从血液中清除废物的能力。" },
          { label: "高胆固醇", bg: "#FAEEDA", color: "#633806", dot: "#854F0B", text: "胆固醇沉积会减少肾脏的血流，加速损伤；尤其是与糖尿病或高血压合并时。" },
        ],
        watch: "脚踝肿胀、尿液起泡沫或疲劳，肾脏通常在损伤严重之前无明显症状。请定期筛查。",
      },
      feet: {
        organ: "双脚与腿部", title: "神经病变与糖尿病足", accent: "#0F6E56",
        conditions: [
          { label: "糖尿病", bg: "#E6F1FB", color: "#0C447C", dot: "#185FA5", text: "高血糖损伤脚部神经（神经病变），引起麻木或灼热感。小伤口可能被忽视，进而发展为严重感染。" },
          { label: "高血压", bg: "#FBEAF0", color: "#72243E", dot: "#993556", text: "高血压导致的血流减少会减慢脚部和小腿的伤口愈合速度。" },
          { label: "高胆固醇", bg: "#FAEEDA", color: "#633806", dot: "#854F0B", text: "斑块堆积引起的外周动脉疾病限制了腿部的血液供应，加重神经病变并增加截肢风险。" },
        ],
        watch: "每天检查双脚是否有割伤、水泡或溃疡，尤其是感觉减退时。不要赤脚行走。",
      },
    },
  },
}

// ─── Hotspot layout ────────────────────────────────────────────────────────────

const hotspotPositions: { id: BodyMapId; top: string; left: string; color: string }[] = [
  { id: "brain",   top: "10%",  left: "49%", color: "#534AB7" },
  { id: "eyes",    top: "16%", left: "42%", color: "#185FA5" },
  { id: "heart",   top: "35%", left: "58%", color: "#993556" },
  { id: "kidneys", top: "48%", left: "40%", color: "#854F0B" },
  { id: "feet",    top: "87%", left: "30%", color: "#0F6E56" },
]

// ─── Props (all optional — falls back to built-in defaults) ───────────────────

interface BodyMapProps {
  lang: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function BodyMap({ lang }: BodyMapProps) {
  const t = bodyMapContent[lang] ?? bodyMapContent.en
  const [activeId, setActiveId] = useState<BodyMapId | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  function handleHotspot(id: BodyMapId) {
    setActiveId(id)
    if (window.innerWidth < 768) setDrawerOpen(true)
  }

  function close() {
    setActiveId(null)
    setDrawerOpen(false)
  }

  const active = activeId ? t.data[activeId] : null

  const PanelContent = ({ d }: { d: BodyMapEntry }) => (
    <>
      <div className="h-1 w-full" style={{ backgroundColor: d.accent }} />
      <div className="flex items-start justify-between p-4 pb-0">
        <div>
          <p className="text-base font-medium uppercase tracking-widest text-muted-foreground mb-0.5">{d.organ}</p>
          <h3 className="text-xl font-semibold" style={{ color: d.accent }}>{d.title}</h3>
        </div>
        <button
          onClick={close}
          className="w-7 h-7 rounded-full border flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors shrink-0 mt-0.5"
          style={{ borderColor: "var(--border)" }}
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-4 flex flex-col gap-3">
        {d.conditions.map((c, i) => (
          <div key={i}>
            <span
              className="inline-flex items-center gap-1.5 text-base font-medium px-2.5 py-1 rounded-full mb-1.5"
              style={{ backgroundColor: c.bg, color: c.color }}
            >
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: c.dot }} />
              {c.label}
            </span>
            <p className="text-lg leading-relaxed text-muted-foreground">{c.text}</p>
          </div>
        ))}
        <div className="rounded-xl p-3 mt-1" style={{ backgroundColor: "var(--muted)" }}>
          <p className="text-base font-medium uppercase tracking-widest text-muted-foreground mb-1">{t.watchLabel}</p>
          <p className="text-lg leading-relaxed">{d.watch}</p>
        </div>

        {d.image && (
          <div className="mx-4 mt-3 rounded-xl overflow-hidden">
            <img
              src={d.image.src}
              alt={d.image.caption}
              className="w-full h-40 object-cover"
            />
            <p className="text-xs text-muted-foreground px-1 pt-1.5 pb-0.5">{d.image.caption}</p>
          </div>
        )}
      </div>
    </>
  )

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-6 min-h-[550px]">

        {/* Body image with hotspots */}
        <div className="flex-shrink-0 flex justify-center sm:justify-start">
          <div className="relative w-[220px] h-[480px]">
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
                aria-label={t. data[id].organ}
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
              className="flex-1 flex flex-col items-center justify-center gap-3 text-foreground text-lg text-center border border-dashed rounded-2xl p-8"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <AlertCircle className="w-10 h-10" />
              </div>
              {t.emptyLabel}
            </div>
          ) : (
            <div
              className="flex-1 rounded-2xl border overflow-hidden animate-in fade-in slide-in-from-right-4 duration-200 overflow-y-auto max-h-[550px]"
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
