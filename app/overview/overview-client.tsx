"use client"

import { PageLayout } from "@/components/page-layout"
import { useState, useEffect, useRef } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, Cell, LabelList } from "recharts"
import { AlertCircle, Heart, Activity, Eye, X, ChevronDown, Users, TrendingUp, Skull, HeartPulse } from "lucide-react"
import { MalaysiaChoroplethMap, type YearMapData } from "@/components/malaysia-choropleth-map"
import Image from "next/image"


export interface NationalTrendRow {
  trend_id: number
  year: number
  patients: number
  prevalence: string // decimal comes back as string from Drizzle/pg
}

export interface EthnicityRow {
  ethnicity_id: number
  patients: string
  percentage: string // decimal as string from Drizzle/pg
}

interface OverviewClientProps {
  dataByYear: Record<string, YearMapData>
  availableYears: string[]
  nationalTrend: NationalTrendRow[]
  ethnicityData: EthnicityRow[]
}

const content = {
  en: {
    page_title: "The Big Picture: Diabetes in Malaysia",
    page_subtitle: "Diabetes is a growing challenge for our nation, but understanding the facts is the first step toward a healthier life.",
    stats_title: "Diabetes in Malaysia",
    stats: [
      { value: "3rd", label: "Leading cause of death in Malaysia", icon: Skull },
      { value: "6929", label: "People die from diabetes in 2024", icon: Users },
      { value: "78%", label: "Of deaths are age 60+", icon: HeartPulse },
    ],
    tab_prevalence: "Diabetes Prevalence",
    tab_trends: "Diabetes Trends",
    tab_hints: "💡 Tip: Use the buttons below to switch between different views of the data. ",
    map_title: "Explore the Situation in Your Area",
    map_subtitle: "Diabetes affects every state differently. Use this map to see how common it is in your area and understand our local health challenges.",
    trends_title: "Understanding Diabetes Trends in Malaysia",
    trends_subtitle: "This chart shows how diabetes prevalence has changed over the last decade.",
    trends_y_label: "Prevalence (%)",
    trends_y_label2: "Estimated Patients",
    trends_note: "In just 10 years, the number of Malaysians living with diabetes has nearly doubled. A rising line doesn't have to be our future. By starting small healthy habits today, we can work together to turn this trend around.",
    select_year: "Year",
    ethnicity_title: "Health in Our Communities",
    ethnicity_subtitle: "Understanding how diabetes affects our different communities helps us provide better care for everyone.",
    ethnicity_y_label: "Percentage (%)",
    legend_high: "High Prevalence (>8%)",
    legend_medium: "Medium Prevalence (4-8%)",
    legend_low: "Lower Prevalence (<4%)",
    highest_rate: "Highest Rate",
    lowest_rate: "Lowest Rate",
    average_rate: "Average Rate",
    click_state: "👆 Tap a state for more information",
    edu_title: "Understand Diabetes",
    edu_sections: [
      {
        icon: AlertCircle,
        bgColor: "#B5E0F1",
        textColor: "#1a5276",
        title: "What is Diabetes?",
        points: [
          "Too much sugar in your blood",
          "Happens when body cannot use sugar properly",
          "Insulin does not work well or is not enough",
        ],
        subSection: {
          title: "Prediabetes",
          points: [
            "Blood sugar is higher than normal",
            "Not diabetes yet, but high risk",
            "About 11.6% Malaysians have prediabetes",
          ],
        },
      },
      {
        icon: Activity,
        bgColor: "#DAE0AF",
        textColor: "#5d6d1e",
        title: "Why Does It Happen?",
        points: [
          "Eat too much sugar / unhealthy food",
          "Lack of exercise",
          "Overweight",
          "Family history",
          "Age (risk higher for elderly)",
        ],
      },
      {
        icon: Eye,
        bgColor: "#F8DFF1",
        textColor: "#8b3a62",
        title: "Symptoms",
        points: [
          "Very thirsty",
          "Urinate often",
          "Feel tired",
          "Blurry vision",
          "Wounds heal slowly",
        ],
        warning: "Some people may have no symptoms early",
      },
      {
        icon: Heart,
        bgColor: "#E6EAC7",
        textColor: "#4a5a23",
        title: "Prevention",
        points: [
          "Reduce sugar and sweet drinks",
          "Choose healthier food options",
          "Exercise regularly (e.g., walking)",
          "Maintain healthy weight",
          "Check blood sugar regularly",
        ],
      },
    ],
    disclaimer_text: "These numbers represent real people who deserve support and accurate information. This is why understanding diabetes matters.",
  },
  ms: {
    page_title: "Gambaran",
    page_subtitle: "Fahami data diabetes di Malaysia dan belajar melindungi diri anda.",
    stats_title: "Diabetes di Malaysia",
    stats: [
      { value: "4.75M", label: "People living with diabetes", icon: Heart },
      { value: "3rd", label: "Leading cause of death in Malaysia", icon: Skull },
      { value: "78%", label: "Of deaths are age 60+", icon: Users },
    ],
    tab_prevalence: "Prevalens Diabetes",
    tab_trends: "Trend Diabetes",
    tab_hints: "💡 Tip: ",
    map_title: "Prevalens Diabetes di Malaysia",
    map_subtitle: "Pesakit diabetes per 1,000 orang dewasa mengikut negeri dan tahun",
    trends_title: "Trend Diabetes di Malaysia",
    trends_subtitle: "Trend pesakit diabetes per 1,000 dewasa mengikut negeri sepanjang tahun",
    trends_y_label: "Prevalens (%)",
    trends_y_label2: "Anggaran Pesakit",
    trends_note: "Dalam masa 10 tahun sahaja, bilangan rakyat Malaysia yang menghidap diabetes hampir dua kali ganda. Garis yang meningkat tidak semestinya masa depan kita. Dengan memulakan tabiat sihat kecil hari ini, kita boleh bekerjasama untuk membalikkan trend ini.",
    select_year: "Tahun",
    ethnicity_title: "Kesihatan dalam Komuniti Kita",
    ethnicity_subtitle: "Memahami bagaimana diabetes mempengaruhi komuniti kita yang berbeza membantu kita memberikan penjagaan yang lebih baik untuk semua.",
    ethnicity_y_label: "Peratusan (%)",
    legend_high: "Risiko Tinggi (>8%)",
    legend_medium: "Risiko Sederhana (4-8%)",
    legend_low: "Risiko Rendah (<4%)",
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
        points: [
          "Terlalu banyak gula dalam darah anda",
          "Berlaku apabila badan tidak dapat menggunakan gula dengan betul",
          "Insulin tidak berfungsi dengan baik atau tidak mencukupi",
        ],
        subSection: {
          title: "Pradiabetes",
          points: [
            "Gula darah lebih tinggi daripada biasa",
            "Belum diabetes, tetapi berisiko tinggi",
            "Kira-kira 11.6% rakyat Malaysia menghidap pradiabetes",
          ],
        },
      },
      {
        icon: Activity,
        bgColor: "#DAE0AF",
        textColor: "#5d6d1e",
        title: "Kenapa Ia Berlaku?",
        points: [
          "Makan terlalu banyak gula / makanan tidak sihat",
          "Kurang bersenam",
          "Berat badan berlebihan",
          "Sejarah keluarga",
          "Umur (risiko lebih tinggi untuk warga emas)",
        ],
      },
      {
        icon: Eye,
        bgColor: "#F8DFF1",
        textColor: "#8b3a62",
        title: "Gejala",
        points: [
          "Sangat dahaga",
          "Kerap kencing",
          "Rasa penat",
          "Penglihatan kabur",
          "Luka lambat sembuh",
        ],
        warning: "Sesetengah orang mungkin tiada gejala pada peringkat awal",
      },
      {
        icon: Heart,
        bgColor: "#E6EAC7",
        textColor: "#4a5a23",
        title: "Pencegahan",
        points: [
          "Kurangkan gula dan minuman manis",
          "Pilih makanan yang lebih sihat",
          "Bersenam secara tetap (contoh: berjalan kaki)",
          "Kekalkan berat badan yang sihat",
          "Periksa gula darah secara berkala",
        ],
      },
    ],
    disclaimer_text: "Nombor-nombor ini mewakili orang sebenar yang memerlukan sokongan dan maklumat yang tepat. Inilah sebabnya memahami diabetes penting.",
  },
  zh: {
    page_title: "概览",
    page_subtitle: "了解马来西亚的糖尿病数据，学习如何保护自己。",
    stats_title: "马来西亚的糖尿病",
    stats: [
      { value: "4.75M", label: "People living with diabetes", icon: Heart },
      { value: "3rd", label: "Leading cause of death in Malaysia", icon: Skull },
      { value: "78%", label: "Of deaths are age 60+", icon: Users },
    ],
    tab_prevalence: "糖尿病患病率",
    tab_trends: "糖尿病趋势",
    tab_hints: "💡 Tip: ",
    map_title: "马来西亚糖尿病患病率",
    map_subtitle: "按州属和年份每1,000名成年人中的糖尿病患者人数",
    trends_title: "马来西亚糖尿病趋势",
    trends_subtitle: "各州每1,000成年人糖尿病患者趋势",
    trends_y_label: "患病率 (%)",
    trends_y_label2: "估计患者数",
    trends_note: "短短10年间，马来西亚糖尿病患者人数几乎翻倍。上升的趋势不一定是我们的未来。从今天开始养成健康习惯，我们可以共同努力扭转这一趋势。",
    select_year: "年份",
    ethnicity_title: "我们社区的健康",
    ethnicity_subtitle: "了解糖尿病如何影响我们不同的社区，有助于我们为每个人提供更好的护理。",
    ethnicity_y_label: "百分比 (%)",
    legend_high: "高风险 (>8%)",
    legend_medium: "中等风险 (4-8%)",
    legend_low: "较低风险 (<4%)",
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
        points: [
          "血液中糖分过多",
          "当身体无法正常使用糖分时发生",
          "胰岛素功能不佳或不足",
        ],
        subSection: {
          title: "糖尿病前期",
          points: [
            "血糖高于正常水平",
            "尚未患糖尿病，但风险很高",
            "约11.6%的马来西亚人有糖尿病前期",
          ],
        },
      },
      {
        icon: Activity,
        bgColor: "#DAE0AF",
        textColor: "#5d6d1e",
        title: "为什么会患上？",
        points: [
          "摄入过多糖分/不健康食物",
          "缺乏运动",
          "超重",
          "家族病史",
          "年龄（老年人风险更高）",
        ],
      },
      {
        icon: Eye,
        bgColor: "#F8DFF1",
        textColor: "#8b3a62",
        title: "症状",
        points: [
          "非常口渴",
          "频繁排尿",
          "感到疲倦",
          "视力模糊",
          "伤口愈合缓慢",
        ],
        warning: "有些人早期可能没有症状",
      },
      {
        icon: Heart,
        bgColor: "#E6EAC7",
        textColor: "#4a5a23",
        title: "预防",
        points: [
          "减少糖分和甜饮料",
          "选择更健康的食物",
          "定期运动（如散步）",
          "保持健康体重",
          "定期检查血糖",
        ],
      },
    ],
    disclaimer_text: "这些数字代表真实的人，他们需要支持和准确的信息。这就是为什么了解糖尿病很重要。",
  },
}

const ETHNICITY_EXPLANATIONS: Record<string, { en: string; ms: string; zh: string }> = {
  "Indian": {
    en: "The Indian community currently shows the highest prevalence. This is often linked to a higher genetic sensitivity to insulin and traditional diets rich in refined carbohydrates like white rice and roti canai. Early and regular blood sugar screenings are highly recommended for elders in this community.",
    ms: "Komuniti India menunjukkan prevalens tertinggi. Ini sering dikaitkan dengan sensitivitas genetik yang lebih tinggi terhadap insulin dan diet tradisional yang kaya akan karbohidrat halus seperti nasi putih dan roti canai. Skrining gula darah secara dini dan teratur sangat disarankan untuk warga emas dalam komunitas ini.",
    zh: "印度裔社群目前显示出最高的糖尿病患病率。这通常与对胰岛素更高的遗传敏感性以及传统饮食中精制碳水化合物（如白米和印度煎饼）的丰富有关。强烈建议该社区的老年人进行早期和定期的血糖筛查。",
  },
  "Malay": {
    en: "With nearly 1 in 6 affected, the Malay community faces a significant challenge. The high consumption of hidden sugars in traditional 'kuih-muih' and sweet drinks contributes to this trend. Small changes, like choosing 'Kurang Manis' options, can have a big impact.",
    ms: "Dengan hampir 1 dari 6 orang dewasa yang terpengaruh, komunitas Melayu menghadapi tantangan besar. Konsumsi tinggi gula tersembunyi dalam 'kuih-muih' tradisional dan minuman manis berkontribusi pada tren ini. Perubahan kecil, seperti memilih opsi 'Kurang Manis', dapat memiliki dampak besar.",
    zh: "近六分之一的成年人受影响，马来裔社区面临重大挑战。传统“kuih-muih”（马来糕点）和甜饮料中隐藏的高糖摄入量促成了这一趋势。小的改变，比如选择“Kurang Manis”（少糖）选项，可以产生很大的影响。",
  },
  "Chinese": {
    en: "The Chinese community has a moderate diabetes rate relative to other groups in Malaysia. While traditional Chinese diets can be balanced, increasing adoption of processed foods and sedentary urban lifestyles have contributed to rising rates in recent years. Maintaining a balanced 'Suku-Suku-Separuh' plate is essential to keep these numbers from rising.",
    ms: "Komuniti Cina mempunyai kadar diabetes yang sederhana berbanding kumpulan lain di Malaysia. Walaupun diet tradisional Cina boleh diseimbangkan, peningkatan penggunaan makanan yang diproses dan gaya hidup bandar yang tidak aktif telah menyumbang kepada peningkatan kadar dalam beberapa tahun kebelakangan ini. Mengekalkan pinggan 'Suku-Suku-Separuh' yang seimbang adalah penting untuk mengelakkan peningkatan angka ini.",
    zh: "与其他马来西亚族群相比，华人糖尿病发病率处于中等水平。虽然传统的华人饮食较为均衡，但近年来加工食品的日益普及和久坐不动的都市生活方式导致糖尿病发病率上升。保持均衡的“五谷杂粮”（Suku-Suku-Separuh）饮食习惯对于控制糖尿病发病率至关重要。",
  },
  "Bumiputera Sarawak": {
    en: "Prevalence in Bumiputera Sarawak highlights the impact of changing lifestyles and urbanisation. As traditional active lifestyles shift, focusing on reducing sugary drinks and increasing daily movement is key to protecting the health of our Sarawakian seniors.",
    ms: "Prevalens dalam kalangan Bumiputera Sarawak menonjolkan kesan perubahan gaya hidup dan pembandaran. Seiring dengan perubahan gaya hidup aktif tradisional, memberi tumpuan kepada pengurangan minuman bergula dan meningkatkan pergerakan harian adalah kunci untuk melindungi kesihatan warga emas Sarawak kita.",
    zh: "砂拉越土著居民的患病率凸显了生活方式改变和城市化进程的影响。随着传统积极生活方式的转变，减少含糖饮料的摄入并增加日常运动量是保护砂拉越老年人健康的关键。",
  },
  "Bumiputera Sabah": {
    en: "While Bumiputera Sabah currently shows a lower prevalence compared to other groups, the number is still significant. This is the 'Golden Window' to focus on prevention and education to ensure our Sabahan communities remain healthy and strong for generations to come.",
    ms: "Walaupun Bumiputera Sabah kini menunjukkan prevalens yang lebih rendah berbanding kumpulan lain, jumlahnya masih ketara. Ini adalah 'Tingkap Emas' untuk memberi tumpuan kepada pencegahan dan pendidikan bagi memastikan komuniti Sabah kita kekal sihat dan kuat untuk generasi akan datang.",
    zh: "虽然沙巴土著目前的患病率低于其他群体，但人数仍然相当可观。现在正是重视预防和教育的“黄金时期”，以确保沙巴社区世世代代保持健康强壮。",
  },
}

const DEFAULT_EXPLANATION = {
  en: "Diabetes prevalence in this group is influenced by a combination of genetic, dietary, and lifestyle factors. Regular health screenings and a balanced diet can help manage and reduce the risk.",
  ms: "Prevalens diabetes dalam kumpulan ini dipengaruhi oleh gabungan faktor genetik, pemakanan, dan gaya hidup. Saringan kesihatan yang kerap dan diet seimbang boleh membantu mengurus dan mengurangkan risiko.",
  zh: "该群体的糖尿病患病率受遗传、饮食和生活方式等多种因素影响。定期健康筛查和均衡饮食有助于管理和降低风险。",
}

function EduCard({ section }: { section: (typeof content.en.edu_sections)[0] }) {
  return (
    <div 
      className="rounded-2xl border border-border/30 overflow-hidden shadow-sm p-6 sm:p-8"
      style={{ backgroundColor: section.bgColor }}
    >
      <h3 
        className="text-2xl font-bold mb-5"
        style={{ color: section.textColor }}
      >
        {section.title}
      </h3>
      <ul className="space-y-3 mb-4">
        {section.points.map((point, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <section.icon 
              className="w-5 h-5 shrink-0 mt-0.5" 
              style={{ color: section.textColor }}
            />
            <span className="text-lg leading-relaxed text-foreground/90">{point}</span>
          </li>
        ))}
      </ul>
      
      {/* SubSection for Prediabetes info */}
      {section.subSection && (
        <div className="mt-6 pt-4 border-t border-foreground/10">
          <h4 
            className="text-xl font-bold mb-3"
            style={{ color: section.textColor }}
          >
            {section.subSection.title}
          </h4>
          <ul className="space-y-2">
            {section.subSection.points.map((point, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span 
                  className="w-2 h-2 rounded-full shrink-0 mt-2" 
                  style={{ backgroundColor: section.textColor }}
                />
                <span className="text-lg leading-relaxed text-foreground/90">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Warning message */}
      {section.warning && (
        <div 
          className="mt-4 p-3 rounded-xl flex items-center gap-3"
          style={{ backgroundColor: `${section.textColor}15` }}
        >
          <AlertCircle 
            className="w-5 h-5 shrink-0" 
            style={{ color: section.textColor }}
          />
          <span 
            className="text-base font-medium"
            style={{ color: section.textColor }}
          >
            {section.warning}
          </span>
        </div>
      )}
    </div>
  )
}

const PREVALENCE_COLOR = "#282626"
const PATIENTS_COLOR   = "#282626"

function TrendTooltip({
  active,
  payload,
  label,
  t,
}: {
  active?: boolean
  payload?: { value?: unknown; payload?: { patients: number } }[]
  label?: number
  t: { trends_y_label: string; trends_y_label2: string }
}) {
  if (!active || !payload?.length) return null
  const item = payload[0]
  const prevalence = typeof item.value === "number" ? item.value : 0
  const patients = item.payload?.patients ?? 0
  return (
    <div style={{
      backgroundColor: "var(--card)",
      border: "1px solid var(--border)",
      borderRadius: "12px",
      padding: "12px 16px",
      fontSize: "18px",
    }}>
      <p style={{ fontWeight: "bold", fontSize: "20px", marginBottom: "8px", color: "var(--foreground)" }}>
        {label}
      </p>
      <p style={{ color: PREVALENCE_COLOR, marginBottom: "4px" }}>
        <span style={{ fontWeight: 300 }}>{t.trends_y_label}:</span>{" "}
        {prevalence.toFixed(1)}%
      </p>
      <p style={{ color: PATIENTS_COLOR }}>
        <span style={{ fontWeight: 300 }}>{t.trends_y_label2}:</span>{" "}
        {patients.toLocaleString()}
      </p>
    </div>
  )
}

function TrendsChart({ t, nationalTrend }: { t: typeof content.en; nationalTrend: NationalTrendRow[] }) {
  const chartData = [...nationalTrend]
    .sort((a, b) => a.year - b.year)
    .map(row => ({
      year: row.year,
      prevalence: parseFloat(row.prevalence as string),
      patients: row.patients,
    }))

  return (
    <div className="bg-card rounded-2xl border border-border p-4 sm:p-6 shadow-sm">
      <h2 className="text-2xl sm:text-3xl font-bold mb-1">{t.trends_title}</h2>
      <p className="text-lg text-muted-foreground mb-6">{t.trends_subtitle}</p>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ left: 10, right: 20, top: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" tick={{ fontSize: 20 }} />
          <YAxis
            yAxisId="prevalence"
            domain={[0, 25]}
            tickFormatter={v => `${v}%`}
            tick={{ fontSize: 18, fill: PREVALENCE_COLOR }}
            label={{ value: t.trends_y_label, angle: -90, position: "insideLeft", offset: -5, style: { fontSize: 16, fill: PREVALENCE_COLOR } }}
          />
          <Tooltip content={({ active, payload, label }) => <TrendTooltip active={active} payload={payload} label={label} t={t} />} />
          <Line
            yAxisId="prevalence"
            type="monotone"
            dataKey="prevalence"
            stroke="#4a7fc1"
            strokeWidth={3}
            dot={{ fill: "#4a7fc1", r: 5 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <p className="mt-4 text-lg border-l-4 border-amber-400 pl-4">
        {t.trends_note}
      </p>
    </div>
  )
}

const ETHNICITY_COLORS = ["#56b4e9", "#e07b4a", "#0072b1", "#a76bbf", "#cc79a7", "#f0e444"]

function EthnicityBarChart({t, ethnicityData,}: {t: typeof content.en; ethnicityData: EthnicityRow[]}) {
  const chartData = ethnicityData.map((row) => ({
    ethnicity: row.patients, // aliased column holds the ethnicity name
    percentage: parseFloat(row.percentage as string),
  }))
  .sort((a, b) => b.percentage - a.percentage)

  const [selected, setSelected] = useState<{ ethnicity: string; percentage: number } | null>(null)
  const [explanation, setExplanation] = useState<string>("")
  const explanationRef = useRef<HTMLDivElement>(null)

  const langCode = t.ethnicity_title === "Health in Our Communities" ? "en"
    : t.ethnicity_title === "Diabetes Mengikut Etnik" ? "ms"
    : "zh"
  
  function handleBarClick(data: { ethnicity: string; percentage: number }) {
    // If clicking the same bar, deselect it
    if (selected?.ethnicity === data.ethnicity) {
      setSelected(null)
      setExplanation("")
      return
    }
    setSelected(data)
    const entry = ETHNICITY_EXPLANATIONS[data.ethnicity] ?? DEFAULT_EXPLANATION
    setExplanation(entry[langCode])
  }
  return (
    <div className="bg-card rounded-2xl border border-border p-4 sm:p-6 shadow-sm mt-6">
      <h2 className="text-2xl sm:text-3xl font-bold mb-1">{t.ethnicity_title}</h2>
      <p className="text-lg text-muted-foreground mb-6">{t.ethnicity_subtitle}</p>

      <ResponsiveContainer width="100%" height={360}>
        <BarChart data={chartData} margin={{ left: 10, right: 20, top: 20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="ethnicity" tick={false} height={8} />
          <YAxis
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 18 }}
            label={{
              value: t.ethnicity_y_label,
              angle: -90,
              position: "insideLeft",
              offset: -5,
              style: { fontSize: 16, fill: "var(--muted-foreground)" },
            }}
            domain={[0, "auto"]}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null
              const { ethnicity, percentage } = payload[0].payload
              return (
                <div style={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  padding: "10px 14px",
                  fontSize: "18px",
                }}>
                  <p style={{ fontWeight: 700, marginBottom: "4px", color: "var(--foreground)" }}>{ethnicity}</p>
                  <p style={{ color: "var(--muted-foreground)" }}>{percentage.toFixed(1)}%</p>
                </div>
              )
            }}
          />
          <Bar dataKey="percentage" radius={[6, 6, 0, 0]} maxBarSize={80} onClick={(data) => handleBarClick(data as { ethnicity: string; percentage: number })} style={{ cursor: "pointer" }}>
            {chartData.map((entry, index) => (
              <Cell key={index} fill={ETHNICITY_COLORS[index % ETHNICITY_COLORS.length]} opacity={selected && selected.ethnicity !== entry.ethnicity ? 0.35 : 1} />
            ))}
            <LabelList
              dataKey="percentage"
              position="top"
              formatter={(v: number) => `${v.toFixed(1)}`}
              style={{ fontSize: 16, fontWeight: 600, fill: "var(--foreground)" }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Colour legend */}
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4">
        {chartData.map((entry, index) => (
          <button key={index} onClick={() => handleBarClick(entry)} className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <span
              className="w-3 h-3 rounded-sm shrink-0"
              style={{ backgroundColor: ETHNICITY_COLORS[index % ETHNICITY_COLORS.length] }}
            />
            <span className="text-lg text-muted-foreground">{entry.ethnicity}</span>
          </button>
        ))}
      </div>

      {/* Explanation panel */}
      {explanation && (
        <div ref={explanationRef} className="mt-6 scroll-mt-6">
          {/* Header row */}
          <div
            className="flex items-center justify-between rounded-t-2xl px-5 py-4"
            style={{
              backgroundColor: ETHNICITY_COLORS[chartData.findIndex((d) => d.ethnicity === selected?.ethnicity) % ETHNICITY_COLORS.length]
            }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔍</span>
              <div>
                <p className="text-white font-bold text-xl leading-tight">{selected?.ethnicity}</p>
                <p className="text-white text-lg">{selected?.percentage.toFixed(1)}% prevalence</p>
              </div>
            </div>
            <button
              onClick={() => { setSelected(null); setExplanation("") }}
              className="text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/20"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Body */}
          <div className="border border-t-0 border-border rounded-b-2xl px-5 py-5 bg-card" style={{ borderColor: "#4a7fc1" }}>
            <p className="text-lg leading-relaxed text-foreground">{explanation}</p>
          </div>
        </div>
      )}

      {/* Tap hint, only shown before any selection */}
      {!selected && (
        <p className="text-center text-lg text-muted-foreground mt-5">
          👆 Tap any bar or label to learn more
        </p>
      )}
    </div>
  )
}

export default function OverviewClient({ dataByYear, availableYears, nationalTrend, ethnicityData }: OverviewClientProps) {
  const [activeTab, setActiveTab] = useState<"prevalence" | "trends">("prevalence")

  return (
    <PageLayout>
      {(lang) => {
        const t = content[lang]
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14 space-y-10">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-balance">{t.page_title}</h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto whitespace-normal">{t.page_subtitle}</p>
            </div>

            {/* Stats Section */}
            <section className="py-12 md:py-16 bg-card">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-balance">{t.stats_title}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {t.stats.map((stat, i) => (
                    <div key={i} className="bg-background rounded-2xl p-6 text-center border border-border shadow-sm">
                      {stat.icon ? (
                        <stat.icon className="w-16 h-16 text-primary mx-auto mb-3" />
                      ) : null}
                      <div className="text-4xl md:text-5xl font-extrabold text-primary mb-2">{stat.value}</div>
                      <div className="text-base md:text-lg text-muted-foreground font-medium">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <div>
              <p className="text-base md:text-base mb-1 text-center">{t.tab_hints}</p>
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
              <>
                <MalaysiaChoroplethMap t={t} lang={lang} dataByYear={dataByYear} availableYears={availableYears} />
                
              </>
            ) : (
              <TrendsChart t={t} nationalTrend={nationalTrend} />
            )}

            {/* Ethnicity Bar Chart */}
            <EthnicityBarChart t={t} ethnicityData={ethnicityData} />

            {/* Disclaimer */}
            <div className="bg-amber-100 border border-[var(--cb-sage-text)]/20 rounded-2xl p-5 flex gap-4">
              <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
              <p className="text-lg font-medium">{t.disclaimer_text}</p>
            </div>

            {/* Education Section */}
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
