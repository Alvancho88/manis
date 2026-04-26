"use client"

import { PageLayout } from "@/components/page-layout"
import { useState } from "react"
import { X, CheckCircle, XCircle, ChevronDown, ChevronUp } from "lucide-react"

const myths = {
  en: [
    {
      myth: "Eating too much sugar directly causes diabetes.",
      fact: "Not directly. Diabetes is caused by how the body processes blood sugar. However, eating too much sugar leads to weight gain, which increases the risk of Type 2 diabetes.",
    },
    {
      myth: "Only overweight or obese people get diabetes.",
      fact: "People of normal weight can also develop Type 2 diabetes, especially if they have a family history or are physically inactive. Elderly Malaysians face higher risk regardless of weight.",
    },
    {
      myth: "People with diabetes cannot eat rice.",
      fact: "People with diabetes can still eat rice, but in smaller portions. Choosing brown rice or adding vegetables and protein helps slow down blood sugar rise.",
    },
    {
      myth: "Diabetes only affects old people.",
      fact: "While elderly people are at higher risk, Type 2 diabetes increasingly affects younger adults and even children, especially those with unhealthy diets and inactive lifestyles.",
    },
    {
      myth: "If I feel fine, my blood sugar must be normal.",
      fact: "Prediabetes and early diabetes often have NO symptoms. The only way to know your blood sugar level is through a blood test. Regular check-ups are essential.",
    },
    {
      myth: "Diabetes is not serious if it is mild.",
      fact: "Even mild or prediabetes can lead to serious complications over time, including heart disease, kidney failure, and vision loss if not managed properly.",
    },
  ],
  ms: [
    {
      myth: "Makan terlalu banyak gula secara langsung menyebabkan diabetes.",
      fact: "Tidak secara langsung. Diabetes disebabkan oleh cara badan memproses gula darah. Walau bagaimanapun, makan terlalu banyak gula menyebabkan kenaikan berat badan, yang meningkatkan risiko Diabetes Jenis 2.",
    },
    {
      myth: "Hanya orang gemuk atau obes yang mendapat diabetes.",
      fact: "Orang dengan berat badan normal juga boleh menghidap Diabetes Jenis 2, terutamanya jika mereka mempunyai sejarah keluarga atau tidak aktif secara fizikal. Warga emas Malaysia menghadapi risiko yang lebih tinggi tanpa mengira berat badan.",
    },
    {
      myth: "Orang dengan diabetes tidak boleh makan nasi.",
      fact: "Orang dengan diabetes masih boleh makan nasi, tetapi dalam bahagian yang lebih kecil. Memilih nasi perang atau menambah sayuran dan protein membantu melambatkan kenaikan gula darah.",
    },
    {
      myth: "Diabetes hanya menjejaskan orang tua.",
      fact: "Walaupun warga emas mempunyai risiko yang lebih tinggi, Diabetes Jenis 2 semakin menjejaskan orang dewasa muda dan juga kanak-kanak, terutamanya mereka yang mempunyai diet tidak sihat.",
    },
    {
      myth: "Jika saya berasa baik, gula darah saya mesti normal.",
      fact: "Prediabetes dan diabetes awal sering kali TIDAK mempunyai gejala. Satu-satunya cara untuk mengetahui tahap gula darah anda adalah melalui ujian darah. Pemeriksaan berkala adalah penting.",
    },
    {
      myth: "Diabetes tidak serius jika ia ringan.",
      fact: "Walaupun diabetes ringan atau prediabetes boleh menyebabkan komplikasi serius dari masa ke masa, termasuk penyakit jantung, kegagalan buah pinggang, dan kehilangan penglihatan.",
    },
  ],
  zh: [
    {
      myth: "吃太多糖直接导致糖尿病。",
      fact: "并非直接原因。糖尿病是由身体处理血糖的方式引起的。然而，吃太多糖会导致体重增加，从而增加患2型糖尿病的风险。",
    },
    {
      myth: "只有超重或肥胖的人才会得糖尿病。",
      fact: "体重正常的人也可能患上2型糖尿病，尤其是有家族史或不运动的人。马来西亚老年人无论体重如何都面临更高风险。",
    },
    {
      myth: "糖尿病患者不能吃米饭。",
      fact: "糖尿病患者仍然可以吃米饭，但要少量。选择糙米或添加蔬菜和蛋白质有助于减缓血糖升高。",
    },
    {
      myth: "糖尿病只影响老年人。",
      fact: "虽然老年人风险更高，但2型糖尿病越来越多地影响年轻人甚至儿童，尤其是饮食不健康和不运动的人。",
    },
    {
      myth: "如果我感觉良好，我的血糖一定正常。",
      fact: "前驱糖尿病和早期糖尿病通常没有症状。了解血糖水平的唯一方法是通过血液检测。定期检查至关重要。",
    },
    {
      myth: "糖尿病轻微就不严重。",
      fact: "即使是轻度糖尿病或前驱糖尿病，如果管理不当，也可能随时间导致严重并发症，包括心脏病、肾衰竭和视力丧失。",
    },
  ],
}

const bodyParts = [
  {
    id: "eyes",
    label: { en: "Eyes", ms: "Mata", zh: "眼睛" },
    cx: 200, cy: 95,
    info: {
      en: { title: "Eye Damage", desc: "High blood sugar damages the tiny blood vessels in the eyes. This can cause blurry vision, cataracts, and even blindness (diabetic retinopathy). Get your eyes checked every year!" },
      ms: { title: "Kerosakan Mata", desc: "Gula darah tinggi merosakkan saluran darah kecil di mata. Ini boleh menyebabkan penglihatan kabur, katarak, dan bahkan buta (retinopati diabetik). Periksa mata anda setiap tahun!" },
      zh: { title: "眼部损伤", desc: "高血糖会损伤眼睛中的微小血管。这可能导致视力模糊、白内障，甚至失明（糖尿病视网膜病变）。每年检查一次眼睛！" },
    },
  },
  {
    id: "heart",
    label: { en: "Heart", ms: "Jantung", zh: "心脏" },
    cx: 192, cy: 200,
    info: {
      en: { title: "Heart Disease", desc: "Diabetes doubles the risk of heart disease and stroke. High blood sugar damages blood vessels and nerves that control the heart. Eat healthy and exercise to protect your heart." },
      ms: { title: "Penyakit Jantung", desc: "Diabetes menggandakan risiko penyakit jantung dan strok. Gula darah tinggi merosakkan saluran darah dan saraf yang mengawal jantung. Makan sihat dan bersenam untuk melindungi jantung anda." },
      zh: { title: "心脏病", desc: "糖尿病使心脏病和中风的风险翻倍。高血糖会损伤控制心脏的血管和神经。健康饮食和运动来保护您的心脏。" },
    },
  },
  {
    id: "kidneys",
    label: { en: "Kidneys", ms: "Buah Pinggang", zh: "肾脏" },
    cx: 200, cy: 280,
    info: {
      en: { title: "Kidney Damage", desc: "Diabetes is the leading cause of kidney failure in Malaysia. Damaged kidneys cannot filter blood properly. This may eventually require dialysis (kidney machine). Drink enough water daily!" },
      ms: { title: "Kerosakan Buah Pinggang", desc: "Diabetes adalah punca utama kegagalan buah pinggang di Malaysia. Buah pinggang yang rosak tidak dapat menapis darah dengan betul. Ini mungkin akhirnya memerlukan dialisis. Minum air yang cukup setiap hari!" },
      zh: { title: "肾脏损伤", desc: "糖尿病是马来西亚肾衰竭的主要原因。受损的肾脏无法正常过滤血液。这最终可能需要透析（肾透析机）。每天喝足够的水！" },
    },
  },
  {
    id: "feet",
    label: { en: "Feet", ms: "Kaki", zh: "双脚" },
    cx: 200, cy: 430,
    info: {
      en: { title: "Foot Numbness & Wounds", desc: "Diabetes causes nerve damage in the feet, leading to numbness, tingling, or pain. Wounds on the feet may heal very slowly or not heal at all. Check your feet every day for cuts or sores!" },
      ms: { title: "Kebas & Luka Pada Kaki", desc: "Diabetes menyebabkan kerosakan saraf pada kaki, yang membawa kepada kebas, kesemutan, atau sakit. Luka pada kaki mungkin sembuh sangat perlahan atau tidak sembuh langsung. Periksa kaki anda setiap hari!" },
      zh: { title: "脚部麻木和伤口", desc: "糖尿病会导致脚部神经损伤，引起麻木、刺痛或疼痛。脚部伤口可能愈合非常缓慢或根本无法愈合。每天检查脚是否有割伤或溃疡！" },
    },
  },
]

const pageContent = {
  en: {
    title: "Explore",
    subtitle: "Learn more about diabetes through interactive content.",
    myth_title: "Myth vs Fact",
    myth_subtitle: "Tap a myth to reveal the truth. Test your knowledge!",
    body_title: "How Diabetes Affects Your Body",
    body_subtitle: "Tap on any body part to learn how diabetes affects it.",
    body_instruction: "Tap the circles on the body diagram",
  },
  ms: {
    title: "Terokai",
    subtitle: "Ketahui lebih lanjut tentang diabetes melalui kandungan interaktif.",
    myth_title: "Mitos vs Fakta",
    myth_subtitle: "Ketik mitos untuk mendedahkan kebenaran. Uji pengetahuan anda!",
    body_title: "Bagaimana Diabetes Menjejaskan Badan Anda",
    body_subtitle: "Ketik mana-mana bahagian badan untuk mengetahui bagaimana diabetes menjejaskannya.",
    body_instruction: "Ketik bulatan pada gambar rajah badan",
  },
  zh: {
    title: "探索",
    subtitle: "通过互动内容了解更多关于糖尿病的知识。",
    myth_title: "神话 vs 事实",
    myth_subtitle: "点击神话揭示真相。测试您的知识！",
    body_title: "糖尿病如何影响您的身体",
    body_subtitle: "点击任何身体部位，了解糖尿病如何影响它。",
    body_instruction: "点击身体图上的圆圈",
  },
}

function MythCard({ item, idx }: { item: { myth: string; fact: string }; idx: number }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-card rounded-2xl border-2 border-border overflow-hidden shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left p-5 flex items-start gap-3 hover:bg-muted/50 transition-colors"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center shrink-0">
            <XCircle className="w-6 h-6 text-foreground" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1 block">
              {open ? "" : "MYTH"}
            </span>
            <p className="text-lg font-semibold text-foreground">{item.myth}</p>
          </div>
        </div>
        {open ? <ChevronUp className="w-6 h-6 text-muted-foreground shrink-0 mt-1" /> : <ChevronDown className="w-6 h-6 text-muted-foreground shrink-0 mt-1" />}
      </button>
      {open && (
        <div className="border-t border-border bg-primary/5 p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
              <CheckCircle className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wide text-primary mb-1 block">FACT</span>
              <p className="text-base text-foreground leading-relaxed">{item.fact}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

type LangCode = "en" | "ms" | "zh"

function BodyMap({ lang }: { lang: LangCode }) {
  const [selectedPart, setSelectedPart] = useState<string | null>(null)
  const t = pageContent[lang]
  const selected = bodyParts.find((p) => p.id === selectedPart)

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
      <h2 className="text-2xl md:text-3xl font-bold mb-2">{t.body_title}</h2>
      <p className="text-muted-foreground mb-6">{t.body_subtitle}</p>

      <div className="grid md:grid-cols-2 gap-6 items-start">
        {/* SVG Body */}
        <div className="flex flex-col items-center">
          <p className="text-sm text-muted-foreground mb-3 flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-full bg-primary"></span>
            {t.body_instruction}
          </p>
          <svg viewBox="0 0 400 520" className="w-full max-w-xs" role="img" aria-label="Interactive body diagram">
            {/* Body outline */}
            {/* Head */}
            <ellipse cx="200" cy="65" rx="42" ry="48" fill="#e0eef5" stroke="#4a9eca" strokeWidth="2" />
            {/* Neck */}
            <rect x="182" y="108" width="36" height="25" rx="8" fill="#e0eef5" stroke="#4a9eca" strokeWidth="2" />
            {/* Torso */}
            <rect x="140" y="130" width="120" height="170" rx="20" fill="#e0eef5" stroke="#4a9eca" strokeWidth="2" />
            {/* Arms */}
            <rect x="88" y="135" width="52" height="130" rx="22" fill="#e0eef5" stroke="#4a9eca" strokeWidth="2" />
            <rect x="260" y="135" width="52" height="130" rx="22" fill="#e0eef5" stroke="#4a9eca" strokeWidth="2" />
            {/* Legs */}
            <rect x="148" y="295" width="48" height="160" rx="22" fill="#e0eef5" stroke="#4a9eca" strokeWidth="2" />
            <rect x="204" y="295" width="48" height="160" rx="22" fill="#e0eef5" stroke="#4a9eca" strokeWidth="2" />

            {/* Clickable body part indicators */}
            {bodyParts.map((part) => (
              <g key={part.id} onClick={() => setSelectedPart(part.id === selectedPart ? null : part.id)}>
                <circle
                  cx={part.cx}
                  cy={part.cy}
                  r={22}
                  fill={selectedPart === part.id ? "#1e6091" : "#4a9eca"}
                  stroke="white"
                  strokeWidth="3"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                />
                <text
                  x={part.cx}
                  y={part.cy + 5}
                  textAnchor="middle"
                  fill="white"
                  fontSize="10"
                  fontWeight="bold"
                  className="pointer-events-none"
                >
                  {part.label[lang].split(" ").map((w, i) => (
                    <tspan key={i} x={part.cx} dy={i === 0 ? (part.label[lang].includes(" ") ? -4 : 0) : 13}>{w}</tspan>
                  ))}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Info Panel */}
        <div>
          {selected ? (
            <div className="bg-primary/10 border-2 border-primary rounded-2xl p-5">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-2xl font-bold text-primary">{selected.info[lang].title}</h3>
                <button
                  onClick={() => setSelectedPart(null)}
                  className="w-11 h-11 flex items-center justify-center bg-card rounded-xl border border-border hover:bg-muted transition-colors"
                  aria-label="Close"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-lg text-foreground leading-relaxed">{selected.info[lang].desc}</p>
            </div>
          ) : (
            <div className="bg-muted rounded-2xl p-6 text-center">
              <div className="text-6xl mb-3">👆</div>
              <p className="text-lg text-muted-foreground font-medium">{t.body_instruction}</p>
            </div>
          )}

          {/* Body part list */}
          <div className="mt-4 space-y-2">
            {bodyParts.map((part) => (
              <button
                key={part.id}
                onClick={() => setSelectedPart(part.id === selectedPart ? null : part.id)}
                className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-base font-medium ${
                  selectedPart === part.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card hover:border-primary/50"
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${selectedPart === part.id ? "bg-primary" : "bg-primary/40"}`} />
                {part.label[lang]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ExplorePage() {
  return (
    <PageLayout>
      {(lang) => {
        const t = pageContent[lang]
        const mythList = myths[lang]
        return (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-14 space-y-14">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-balance">{t.title}</h1>
              <p className="text-xl md:text-2xl text-muted-foreground">{t.subtitle}</p>
            </div>

            {/* Myth vs Fact */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">{t.myth_title}</h2>
              <p className="text-muted-foreground text-lg mb-6">{t.myth_subtitle}</p>
              <div className="space-y-4">
                {mythList.map((item, idx) => (
                  <MythCard key={idx} item={item} idx={idx} />
                ))}
              </div>
            </div>

            {/* Interactive Body Map */}
            <BodyMap lang={lang} />
          </div>
        )
      }}
    </PageLayout>
  )
}
