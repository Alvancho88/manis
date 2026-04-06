"use client"

import { PageLayout } from "@/components/page-layout"
import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { AlertCircle, Heart, Activity, Eye, X, ChevronDown } from "lucide-react"
import { ComposableMap, Geographies, Geography } from "react-simple-maps"
import { useEffect } from "react"

// Malaysian diabetes data by state and year (normalized per 1,000 adults)
const stateDataByYear: Record<string, Record<string, { patients: number; risk: string; totalPatients: string }>> = {
  "2013": {
    "Sabah": { patients: 220, risk: "medium", totalPatients: "250,000" },
    "Sarawak": { patients: 165, risk: "low", totalPatients: "220,000" },
    "Labuan": { patients: 180, risk: "medium", totalPatients: "9,000" },
    "Kedah": { patients: 260, risk: "medium", totalPatients: "300,000" },
    "Kelantan": { patients: 290, risk: "high", totalPatients: "350,000" },
    "Terengganu": { patients: 250, risk: "medium", totalPatients: "170,000" },
    "Pahang": { patients: 220, risk: "medium", totalPatients: "200,000" },
    "Perak": { patients: 195, risk: "medium", totalPatients: "290,000" },
    "Selangor": { patients: 170, risk: "low", totalPatients: "650,000" },
    "Kuala Lumpur": { patients: 160, risk: "low", totalPatients: "220,000" },
    "Negeri Sembilan": { patients: 185, risk: "medium", totalPatients: "120,000" },
    "Melaka": { patients: 200, risk: "medium", totalPatients: "110,000" },
    "Johor": { patients: 180, risk: "medium", totalPatients: "380,000" },
    "Perlis": { patients: 230, risk: "medium", totalPatients: "35,000" },
    "Penang": { patients: 155, risk: "low", totalPatients: "180,000" },
    "Putrajaya": { patients: 145, risk: "low", totalPatients: "5,000" },
  },
  "2017": {
    "Sabah": { patients: 250, risk: "medium", totalPatients: "290,000" },
    "Sarawak": { patients: 180, risk: "medium", totalPatients: "250,000" },
    "Labuan": { patients: 195, risk: "medium", totalPatients: "10,000" },
    "Kedah": { patients: 285, risk: "high", totalPatients: "340,000" },
    "Kelantan": { patients: 315, risk: "high", totalPatients: "385,000" },
    "Terengganu": { patients: 275, risk: "medium", totalPatients: "190,000" },
    "Pahang": { patients: 240, risk: "medium", totalPatients: "225,000" },
    "Perak": { patients: 215, risk: "medium", totalPatients: "320,000" },
    "Selangor": { patients: 185, risk: "medium", totalPatients: "750,000" },
    "Kuala Lumpur": { patients: 175, risk: "low", totalPatients: "250,000" },
    "Negeri Sembilan": { patients: 205, risk: "medium", totalPatients: "135,000" },
    "Melaka": { patients: 220, risk: "medium", totalPatients: "125,000" },
    "Johor": { patients: 195, risk: "medium", totalPatients: "430,000" },
    "Perlis": { patients: 250, risk: "medium", totalPatients: "40,000" },
    "Penang": { patients: 170, risk: "low", totalPatients: "200,000" },
    "Putrajaya": { patients: 160, risk: "low", totalPatients: "6,500" },
  },
  "2019": {
    "Sabah": { patients: 265, risk: "medium", totalPatients: "305,000" },
    "Sarawak": { patients: 188, risk: "medium", totalPatients: "268,000" },
    "Labuan": { patients: 205, risk: "medium", totalPatients: "11,000" },
    "Kedah": { patients: 298, risk: "high", totalPatients: "360,000" },
    "Kelantan": { patients: 328, risk: "high", totalPatients: "400,000" },
    "Terengganu": { patients: 285, risk: "high", totalPatients: "200,000" },
    "Pahang": { patients: 250, risk: "medium", totalPatients: "238,000" },
    "Perak": { patients: 222, risk: "medium", totalPatients: "335,000" },
    "Selangor": { patients: 193, risk: "medium", totalPatients: "800,000" },
    "Kuala Lumpur": { patients: 183, risk: "medium", totalPatients: "265,000" },
    "Negeri Sembilan": { patients: 212, risk: "medium", totalPatients: "142,000" },
    "Melaka": { patients: 230, risk: "medium", totalPatients: "132,000" },
    "Johor": { patients: 203, risk: "medium", totalPatients: "455,000" },
    "Perlis": { patients: 260, risk: "medium", totalPatients: "42,000" },
    "Penang": { patients: 178, risk: "low", totalPatients: "210,000" },
    "Putrajaya": { patients: 168, risk: "low", totalPatients: "7,200" },
  },
  "2021": {
    "Sabah": { patients: 280, risk: "high", totalPatients: "320,000" },
    "Sarawak": { patients: 195, risk: "medium", totalPatients: "280,000" },
    "Labuan": { patients: 215, risk: "medium", totalPatients: "12,000" },
    "Kedah": { patients: 310, risk: "high", totalPatients: "380,000" },
    "Kelantan": { patients: 340, risk: "high", totalPatients: "420,000" },
    "Terengganu": { patients: 295, risk: "high", totalPatients: "210,000" },
    "Pahang": { patients: 260, risk: "medium", totalPatients: "250,000" },
    "Perak": { patients: 230, risk: "medium", totalPatients: "350,000" },
    "Selangor": { patients: 200, risk: "medium", totalPatients: "850,000" },
    "Kuala Lumpur": { patients: 190, risk: "medium", totalPatients: "280,000" },
    "Negeri Sembilan": { patients: 220, risk: "medium", totalPatients: "150,000" },
    "Melaka": { patients: 240, risk: "medium", totalPatients: "140,000" },
    "Johor": { patients: 210, risk: "medium", totalPatients: "480,000" },
    "Perlis": { patients: 270, risk: "medium", totalPatients: "45,000" },
    "Penang": { patients: 185, risk: "medium", totalPatients: "220,000" },
    "Putrajaya": { patients: 175, risk: "low", totalPatients: "8,000" },
  },
  "2023": {
    "Sabah": { patients: 295, risk: "high", totalPatients: "340,000" },
    "Sarawak": { patients: 205, risk: "medium", totalPatients: "295,000" },
    "Labuan": { patients: 225, risk: "medium", totalPatients: "13,000" },
    "Kedah": { patients: 325, risk: "high", totalPatients: "400,000" },
    "Kelantan": { patients: 355, risk: "high", totalPatients: "445,000" },
    "Terengganu": { patients: 308, risk: "high", totalPatients: "225,000" },
    "Pahang": { patients: 272, risk: "medium", totalPatients: "265,000" },
    "Perak": { patients: 242, risk: "medium", totalPatients: "365,000" },
    "Selangor": { patients: 212, risk: "medium", totalPatients: "920,000" },
    "Kuala Lumpur": { patients: 198, risk: "medium", totalPatients: "295,000" },
    "Negeri Sembilan": { patients: 232, risk: "medium", totalPatients: "160,000" },
    "Melaka": { patients: 252, risk: "medium", totalPatients: "150,000" },
    "Johor": { patients: 222, risk: "medium", totalPatients: "510,000" },
    "Perlis": { patients: 282, risk: "high", totalPatients: "48,000" },
    "Penang": { patients: 192, risk: "medium", totalPatients: "235,000" },
    "Putrajaya": { patients: 182, risk: "medium", totalPatients: "9,000" },
  },
}

const years = ["2013", "2017", "2019", "2021", "2023"]

// State list for multi-select
const allStates = [
  "Sabah", "Sarawak", "Labuan", "Kedah", "Kelantan", "Terengganu",
  "Pahang", "Perak", "Selangor", "Kuala Lumpur", "Negeri Sembilan",
  "Melaka", "Johor", "Perlis", "Penang", "Putrajaya"
]

// Malaysia GeoJSON URL
const MALAYSIA_GEO_URL = "https://raw.githubusercontent.com/apisit/malaysia.json/master/malaysia.state.geojson"

const content = {
  en: {
    page_title: "Overview",
    page_subtitle: "Understand diabetes data in Malaysia and learn to protect yourself.",
    tab_prevalence: "Diabetes Prevalence",
    tab_trends: "Diabetes Trends",
    map_title: "Diabetes Prevalence in Malaysia",
    map_subtitle: "Diabetes patients per 1,000 adults by state and year",
    trends_title: "Diabetes Trends in Malaysia",
    trends_subtitle: "Trend of diabetes patients per 1,000 adults by state across the years",
    select_year: "Year",
    select_states: "Select States",
    select_all: "Select All",
    clear: "Clear",
    legend_high: "High Risk (>280)",
    legend_medium: "Medium Risk (180-280)",
    legend_low: "Lower Risk (<180)",
    highest_rate: "Highest Rate",
    lowest_rate: "Lowest Rate",
    average_rate: "Average Rate",
    click_state: "Click on a state to see details",
    edu_title: "Understand Diabetes",
    edu_sections: [
      {
        icon: AlertCircle,
        bgColor: "#B5E0F1",
        textColor: "#1a5276",
        title: "What is Diabetes?",
        image: "/images/diabetes-what.jpg",
        points: [
          "A condition where your blood has too much sugar",
          "Food turns into sugar (glucose) in your blood when you eat",
          "Your body needs insulin to move sugar into cells for energy",
          "With diabetes, this process does not work properly",
        ],
      },
      {
        icon: Activity,
        bgColor: "#DAE0AF",
        textColor: "#5d6d1e",
        title: "Why Does It Happen?",
        image: "/images/diabetes-why.jpg",
        points: [
          "Eating too much sweet or oily food",
          "Lack of exercise",
          "Being overweight",
          "Family history of diabetes",
          "High blood pressure",
          "Age (risk increases after 45 years old)",
        ],
      },
      {
        icon: Eye,
        bgColor: "#F8DFF1",
        textColor: "#8b3a62",
        title: "Symptoms",
        image: "/images/diabetes-symptoms.jpg",
        points: [
          "Feeling very thirsty all the time",
          "Urinating often (especially at night)",
          "Feeling very tired",
          "Blurry vision",
          "Slow healing of wounds",
          "Feeling hungry even after eating",
        ],
      },
      {
        icon: Heart,
        bgColor: "#E6EAC7",
        textColor: "#4a5a23",
        title: "Prevention",
        image: "/images/diabetes-prevention.jpg",
        points: [
          "Eat less sweet food and sugary drinks",
          "Choose brown rice over white rice",
          "Exercise for 30 minutes daily (walking is fine!)",
          "Maintain a healthy weight",
          "Do regular blood sugar checks",
        ],
      },
    ],
    disclaimer_text: "These numbers represent real people who deserve support and accurate information. This is why understanding diabetes matters.",
  },
  ms: {
    page_title: "Gambaran",
    page_subtitle: "Fahami data diabetes di Malaysia dan belajar melindungi diri anda.",
    tab_prevalence: "Prevalens Diabetes",
    tab_trends: "Trend Diabetes",
    map_title: "Prevalens Diabetes di Malaysia",
    map_subtitle: "Pesakit diabetes per 1,000 orang dewasa mengikut negeri dan tahun",
    trends_title: "Trend Diabetes di Malaysia",
    trends_subtitle: "Trend pesakit diabetes per 1,000 dewasa mengikut negeri sepanjang tahun",
    select_year: "Tahun",
    select_states: "Pilih Negeri",
    select_all: "Pilih Semua",
    clear: "Kosongkan",
    legend_high: "Risiko Tinggi (>280)",
    legend_medium: "Risiko Sederhana (180-280)",
    legend_low: "Risiko Rendah (<180)",
    highest_rate: "Kadar Tertinggi",
    lowest_rate: "Kadar Terendah",
    average_rate: "Kadar Purata",
    click_state: "Klik pada negeri untuk maklumat lanjut",
    edu_title: "Fahami Diabetes",
    edu_sections: [
      {
        icon: AlertCircle,
        bgColor: "#B5E0F1",
        textColor: "#1a5276",
        title: "Apa Itu Diabetes?",
        image: "/images/diabetes-what.jpg",
        points: [
          "Keadaan di mana darah anda mengandungi terlalu banyak gula",
          "Makanan bertukar menjadi gula (glukosa) dalam darah anda",
          "Badan anda memerlukan insulin untuk memindahkan gula ke dalam sel",
          "Dengan diabetes, proses ini tidak berfungsi dengan betul",
        ],
      },
      {
        icon: Activity,
        bgColor: "#DAE0AF",
        textColor: "#5d6d1e",
        title: "Kenapa Ia Berlaku?",
        image: "/images/diabetes-why.jpg",
        points: [
          "Makan terlalu banyak makanan manis atau berminyak",
          "Kurang bersenam",
          "Berat badan berlebihan",
          "Sejarah keluarga diabetes",
          "Tekanan darah tinggi",
          "Umur (risiko meningkat selepas 45 tahun)",
        ],
      },
      {
        icon: Eye,
        bgColor: "#F8DFF1",
        textColor: "#8b3a62",
        title: "Gejala",
        image: "/images/diabetes-symptoms.jpg",
        points: [
          "Rasa dahaga yang berlebihan",
          "Kerap kencing (terutama pada waktu malam)",
          "Rasa sangat penat",
          "Penglihatan kabur",
          "Penyembuhan luka yang lambat",
          "Rasa lapar walaupun selepas makan",
        ],
      },
      {
        icon: Heart,
        bgColor: "#E6EAC7",
        textColor: "#4a5a23",
        title: "Pencegahan",
        image: "/images/diabetes-prevention.jpg",
        points: [
          "Makan kurang makanan manis dan minuman bergula",
          "Pilih nasi perang berbanding nasi putih",
          "Bersenam 30 minit sehari (berjalan kaki pun boleh!)",
          "Mengekalkan berat badan yang sihat",
          "Melakukan pemeriksaan gula darah secara berkala",
        ],
      },
    ],
    disclaimer_text: "Nombor-nombor ini mewakili orang sebenar yang memerlukan sokongan dan maklumat yang tepat. Inilah sebabnya memahami diabetes penting.",
  },
  zh: {
    page_title: "概览",
    page_subtitle: "了解马来西亚的糖尿病数据，学习如何保护自己。",
    tab_prevalence: "糖尿病患病率",
    tab_trends: "糖尿病趋势",
    map_title: "马来西亚糖尿病患病率",
    map_subtitle: "按州属和年份每1,000名成年人中的糖尿病患者人数",
    trends_title: "马来西亚糖尿病趋势",
    trends_subtitle: "各州每1,000成年人糖尿病患者趋势",
    select_year: "年份",
    select_states: "选择州属",
    select_all: "全选",
    clear: "清除",
    legend_high: "高风险 (>280)",
    legend_medium: "中等风险 (180-280)",
    legend_low: "较低风险 (<180)",
    highest_rate: "最高率",
    lowest_rate: "最低率",
    average_rate: "平均率",
    click_state: "点击州属查看详情",
    edu_title: "了解糖尿病",
    edu_sections: [
      {
        icon: AlertCircle,
        bgColor: "#B5E0F1",
        textColor: "#1a5276",
        title: "什么是糖尿病？",
        image: "/images/diabetes-what.jpg",
        points: [
          "血液中糖分过多的一种疾病",
          "进食时食物在血液中转化为糖（葡萄糖）",
          "身体需要胰岛素将糖转移到细胞中获取能量",
          "患有糖尿病时，这个过程不能正常运作",
        ],
      },
      {
        icon: Activity,
        bgColor: "#DAE0AF",
        textColor: "#5d6d1e",
        title: "为什么会患上？",
        image: "/images/diabetes-why.jpg",
        points: [
          "摄入过多甜食或油腻食物",
          "缺乏运动",
          "超重",
          "糖尿病家族史",
          "高血压",
          "年龄（45岁后风险增加）",
        ],
      },
      {
        icon: Eye,
        bgColor: "#F8DFF1",
        textColor: "#8b3a62",
        title: "症状",
        image: "/images/diabetes-symptoms.jpg",
        points: [
          "经常感到极度口渴",
          "频繁排尿（尤其是夜间）",
          "感到非常疲倦",
          "视力模糊",
          "伤口愈合缓慢",
          "吃饭后仍感到饥饿",
        ],
      },
      {
        icon: Heart,
        bgColor: "#E6EAC7",
        textColor: "#4a5a23",
        title: "预防",
        image: "/images/diabetes-prevention.jpg",
        points: [
          "减少甜食和含糖饮料",
          "选择糙米而非白米",
          "每天运动30分钟（散步也行！）",
          "维持健康体重",
          "定期检测血糖",
        ],
      },
    ],
    disclaimer_text: "这些数字代表真实的人，他们需要支持和准确的信息。这就是为什么了解糖尿病很重要。",
  },
}

function EduCard({ section }: { section: (typeof content.en.edu_sections)[0] }) {
  return (
    <div 
      className="rounded-2xl border border-border/30 overflow-hidden shadow-sm"
      style={{ backgroundColor: section.bgColor }}
    >
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="md:w-2/5 aspect-[4/3] md:aspect-auto relative overflow-hidden">
          <img 
            src={section.image} 
            alt={section.title}
            className="w-full h-full object-cover"
          />
        </div>
        {/* Content Section */}
        <div className="md:w-3/5 p-8 flex flex-col justify-center">
          <h3 
            className="text-2xl font-bold mb-5"
            style={{ color: section.textColor }}
          >
            {section.title}
          </h3>
          <ul className="space-y-3">
            {section.points.map((point, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <section.icon 
                  className="w-5 h-5 shrink-0" 
                  style={{ color: section.textColor }}
                />
                <span className="text-base leading-relaxed text-foreground/90">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

// Map state names from GeoJSON to our data keys
const stateNameMap: Record<string, string> = {
  "Pulau Pinang": "Penang",
  "W.P. Kuala Lumpur": "Kuala Lumpur",
  "W.P. Labuan": "Labuan",
  "W.P. Putrajaya": "Putrajaya",
  "Negeri Sembilan": "Negeri Sembilan",
}

const getStateName = (geoName: string): string => {
  return stateNameMap[geoName] || geoName
}

const getColorByPatients = (patients: number) => {
  if (patients > 280) return "#F8DFF1" // high - pink
  if (patients >= 180) return "#DAE0AF" // medium - olive
  return "#C9EBF8" // low - cyan
}

// Color palette for line chart (colorblind-friendly)
const stateColors: Record<string, string> = {
  "Sabah": "#1a5276",
  "Sarawak": "#2874a6",
  "Labuan": "#3498db",
  "Kedah": "#5d6d1e",
  "Kelantan": "#7d8f2e",
  "Terengganu": "#9db03e",
  "Pahang": "#8b3a62",
  "Perak": "#ab4a72",
  "Selangor": "#cb5a82",
  "Kuala Lumpur": "#d97706",
  "Negeri Sembilan": "#f59e0b",
  "Melaka": "#fbbf24",
  "Johor": "#059669",
  "Perlis": "#10b981",
  "Penang": "#6366f1",
  "Putrajaya": "#8b5cf6",
}

function MalaysiaMapWithYears({ t, lang, selectedYear, setSelectedYear }: { 
  t: typeof content.en; 
  lang: string; 
  selectedYear: string;
  setSelectedYear: (year: string) => void;
}) {
  const [selectedState, setSelectedState] = useState<string | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [mapError, setMapError] = useState(false)
  const [mapLoading, setMapLoading] = useState(true)
  
  const stateData = stateDataByYear[selectedYear]
  
  // Pre-fetch the GeoJSON to handle errors gracefully
  useEffect(() => {
    fetch(MALAYSIA_GEO_URL)
      .then(res => {
        if (!res.ok) throw new Error("Failed to load map")
        setMapLoading(false)
      })
      .catch(() => {
        setMapError(true)
        setMapLoading(false)
      })
  }, [])

  const handleStateClick = (geo: any, evt: React.MouseEvent) => {
    const stateName = getStateName(geo.properties.name)
    if (stateData[stateName]) {
      setSelectedState(stateName)
      const rect = (evt.target as SVGElement).closest('svg')?.getBoundingClientRect()
      if (rect) {
        setTooltipPosition({
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top,
        })
      }
    }
  }

  const closeTooltip = () => setSelectedState(null)

  const tooltipLabels = {
    en: { state: "State", normalized: "Patients per 1,000 adults", total: "Total Patients", risk: "Risk Level" },
    ms: { state: "Negeri", normalized: "Pesakit per 1,000 dewasa", total: "Jumlah Pesakit", risk: "Tahap Risiko" },
    zh: { state: "州属", normalized: "每1,000成年人患者数", total: "总患者数", risk: "风险等级" },
  }
  const riskLabels = {
    en: { high: "High", medium: "Medium", low: "Low" },
    ms: { high: "Tinggi", medium: "Sederhana", low: "Rendah" },
    zh: { high: "高", medium: "中等", low: "低" },
  }
  const labels = tooltipLabels[lang as keyof typeof tooltipLabels] || tooltipLabels.en
  const risks = riskLabels[lang as keyof typeof riskLabels] || riskLabels.en

  // Calculate statistics
  const stateValues = Object.entries(stateData)
  const highestState = stateValues.reduce((a, b) => a[1].patients > b[1].patients ? a : b)
  const lowestState = stateValues.reduce((a, b) => a[1].patients < b[1].patients ? a : b)
  const avgRate = Math.round(stateValues.reduce((sum, [, data]) => sum + data.patients, 0) / stateValues.length)

  return (
    <div className="bg-card rounded-2xl border border-border p-4 sm:p-6 shadow-sm">
      <h2 className="text-2xl sm:text-3xl font-bold mb-1">{t.map_title}</h2>
      <p className="text-base text-muted-foreground mb-4">{t.map_subtitle}</p>
      
      {/* Year Selection Buttons - Elderly Friendly */}
      <div className="mb-4">
        <p className="text-base font-semibold mb-2">{t.select_year}:</p>
        <div className="flex flex-wrap gap-2">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
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
          { color: "#F8DFF1", border: "#8b3a62", label: t.legend_high },
          { color: "#DAE0AF", border: "#5d6d1e", label: t.legend_medium },
          { color: "#C9EBF8", border: "#1a5276", label: t.legend_low },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-2 text-sm sm:text-base">
            <div className="w-5 h-5 rounded border-2" style={{ background: l.color, borderColor: l.border }} />
            <span>{l.label}</span>
          </div>
        ))}
      </div>

      <p className="text-sm text-muted-foreground mb-3">{t.click_state}</p>

      <div className="relative w-full aspect-[4/3] md:aspect-[16/9] min-h-[300px] bg-[#f8fafc] rounded-xl overflow-hidden">
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
                {lang === "ms" ? "Tidak dapat memuatkan peta. Data masih tersedia di bawah." : 
                 lang === "zh" ? "无法加载地图。数据仍可在下方查看。" : 
                 "Unable to load map. Data is still available below."}
              </p>
            </div>
          </div>
        )}
        {!mapError && (
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 2200,
              center: [109, 4.5],
            }}
            style={{ width: "100%", height: "100%" }}
          >
            <Geographies geography={MALAYSIA_GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const stateName = getStateName(geo.properties.name)
                  const data = stateData[stateName]
                  const fillColor = data ? getColorByPatients(data.patients) : "#e5e7eb"
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={fillColor}
                      stroke="#fff"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: { fill: "#f59e0b", outline: "none", cursor: "pointer" },
                        pressed: { fill: "#d97706", outline: "none" },
                      }}
                      onClick={(evt) => handleStateClick(geo, evt)}
                    />
                  )
                })
              }
            </Geographies>
          </ComposableMap>
        )}

        {/* Tooltip */}
        {selectedState && stateData[selectedState] && (
          <div
            className="absolute z-50 bg-card border-2 border-primary rounded-xl p-4 shadow-xl min-w-[220px]"
            style={{
              left: Math.min(tooltipPosition.x + 10, 200),
              top: Math.min(tooltipPosition.y + 10, 100),
            }}
          >
            <button
              onClick={closeTooltip}
              className="absolute top-2 right-2 p-1 hover:bg-muted rounded-full"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-lg font-bold text-primary mb-2">{selectedState}</h3>
            <div className="space-y-1 text-base">
              <p><span className="font-medium">{labels.normalized}:</span> {stateData[selectedState].patients}</p>
              <p><span className="font-medium">{labels.total}:</span> {stateData[selectedState].totalPatients}</p>
              <p>
                <span className="font-medium">{labels.risk}:</span>{" "}
                <span
                  className="font-bold"
                  style={{
                    color: stateData[selectedState].risk === "high"
                      ? "#8b3a62"
                      : stateData[selectedState].risk === "medium"
                      ? "#5d6d1e"
                      : "#1a5276"
                  }}
                >
                  {risks[stateData[selectedState].risk as keyof typeof risks]}
                </span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">{t.highest_rate}</p>
          <p className="text-2xl sm:text-3xl font-bold text-[#8b3a62]">{highestState[1].patients}</p>
          <p className="text-sm text-muted-foreground">({highestState[0]})</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">{t.lowest_rate}</p>
          <p className="text-2xl sm:text-3xl font-bold text-[#1a5276]">{lowestState[1].patients}</p>
          <p className="text-sm text-muted-foreground">({lowestState[0]})</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">{t.average_rate}</p>
          <p className="text-2xl sm:text-3xl font-bold text-[#5d6d1e]">{avgRate}</p>
        </div>
      </div>
    </div>
  )
}

function TrendsChart({ t, lang }: { t: typeof content.en; lang: string }) {
  const [selectedStates, setSelectedStates] = useState<string[]>(["Kelantan"])
  const [showDropdown, setShowDropdown] = useState(false)

  const toggleState = (state: string) => {
    setSelectedStates(prev => 
      prev.includes(state) 
        ? prev.filter(s => s !== state)
        : [...prev, state]
    )
  }

  const selectAll = () => setSelectedStates([...allStates])
  const clearAll = () => setSelectedStates([])

  // Build chart data
  const chartData = years.map(year => {
    const row: Record<string, string | number> = { year }
    selectedStates.forEach(state => {
      row[state] = stateDataByYear[year][state]?.patients || 0
    })
    return row
  })

  return (
    <div className="bg-card rounded-2xl border border-border p-4 sm:p-6 shadow-sm">
      <h2 className="text-2xl sm:text-3xl font-bold mb-1">{t.trends_title}</h2>
      <p className="text-base text-muted-foreground mb-4">{t.trends_subtitle}</p>
      
      {/* State Selection */}
      <div className="mb-4">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <p className="text-base font-semibold">{t.select_states}:</p>
          <button onClick={selectAll} className="px-3 py-1 text-sm font-medium bg-muted rounded-lg hover:bg-muted/80">
            {t.select_all}
          </button>
          <button onClick={clearAll} className="px-3 py-1 text-sm font-medium bg-muted rounded-lg hover:bg-muted/80">
            {t.clear}
          </button>
        </div>
        
        {/* Selected states as chips */}
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedStates.map(state => (
            <span 
              key={state}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium text-primary-foreground"
              style={{ backgroundColor: stateColors[state] }}
            >
              {state}
              <button onClick={() => toggleState(state)} className="hover:opacity-80">
                <X className="w-4 h-4" />
              </button>
            </span>
          ))}
        </div>

        {/* State dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 px-4 py-3 border border-border rounded-xl bg-background text-base w-full sm:w-auto"
          >
            {t.select_states}
            <ChevronDown className={`w-5 h-5 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>
          {showDropdown && (
            <div className="absolute z-20 mt-1 w-full sm:w-64 bg-card border border-border rounded-xl shadow-lg max-h-64 overflow-y-auto">
              {allStates.map(state => (
                <button
                  key={state}
                  onClick={() => toggleState(state)}
                  className={`w-full text-left px-4 py-3 text-base hover:bg-muted flex items-center gap-2 ${
                    selectedStates.includes(state) ? 'bg-primary/10' : ''
                  }`}
                >
                  <div 
                    className="w-4 h-4 rounded border-2" 
                    style={{ 
                      backgroundColor: selectedStates.includes(state) ? stateColors[state] : 'transparent',
                      borderColor: stateColors[state]
                    }} 
                  />
                  {state}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      {selectedStates.length > 0 ? (
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData} margin={{ left: 10, right: 20, top: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" tick={{ fontSize: 14 }} />
            <YAxis domain={[100, 400]} tick={{ fontSize: 14 }} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}
              labelStyle={{ fontWeight: 'bold', fontSize: '14px' }}
            />
            <Legend wrapperStyle={{ fontSize: '14px' }} />
            {selectedStates.map(state => (
              <Line
                key={state}
                type="monotone"
                dataKey={state}
                stroke={stateColors[state]}
                strokeWidth={3}
                dot={{ fill: stateColors[state], r: 5 }}
                activeDot={{ r: 8 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[350px] flex items-center justify-center text-muted-foreground text-lg">
          {lang === "ms" ? "Pilih negeri untuk melihat trend" : lang === "zh" ? "选择州属查看趋势" : "Select states to view trends"}
        </div>
      )}
    </div>
  )
}

export default function OverviewPage() {
  const [activeTab, setActiveTab] = useState<"prevalence" | "trends">("prevalence")
  const [selectedYear, setSelectedYear] = useState("2023")

  return (
    <PageLayout>
      {(lang) => {
        const t = content[lang]
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14 space-y-10">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-balance">{t.page_title}</h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto whitespace-nowrap">{t.page_subtitle}</p>
            </div>

            {/* Tab Buttons - Large for elderly */}
            <div className="flex justify-center">
              <div className="inline-flex rounded-2xl border-2 border-border overflow-hidden">
                <button
                  onClick={() => setActiveTab("prevalence")}
                  className={`px-6 sm:px-8 py-4 text-lg font-bold transition-colors ${
                    activeTab === "prevalence"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-foreground hover:bg-muted"
                  }`}
                >
                  {t.tab_prevalence}
                </button>
                <button
                  onClick={() => setActiveTab("trends")}
                  className={`px-6 sm:px-8 py-4 text-lg font-bold transition-colors ${
                    activeTab === "trends"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-foreground hover:bg-muted"
                  }`}
                >
                  {t.tab_trends}
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === "prevalence" ? (
              <MalaysiaMapWithYears t={t} lang={lang} selectedYear={selectedYear} setSelectedYear={setSelectedYear} />
            ) : (
              <TrendsChart t={t} lang={lang} />
            )}

            {/* Disclaimer */}
            <div className="bg-[var(--cb-sage)] border border-[var(--cb-sage-text)]/20 rounded-2xl p-5 flex gap-4">
              <AlertCircle className="w-6 h-6 text-[var(--cb-sage-text)] shrink-0 mt-0.5" />
              <p className="text-base text-[var(--cb-sage-text)]">{t.disclaimer_text}</p>
            </div>

            {/* Education Section - Vertical layout with image left, points right */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">{t.edu_title}</h2>
              <div className="flex flex-col gap-6">
                {t.edu_sections.map((section, idx) => (
                  <EduCard key={idx} section={section} />
                ))}
              </div>
            </div>
          </div>
        )
      }}
    </PageLayout>
  )
}
