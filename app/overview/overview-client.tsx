"use client"

import { PageLayout } from "@/components/page-layout"
import { useState, useEffect, useRef } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, Cell, LabelList } from "recharts"
import { AlertCircle, Heart, Activity, Eye, X, ChevronDown, Users, TrendingUp, Skull, HeartPulse, TriangleAlert, CalendarCheck } from "lucide-react"
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
    edu_learn_more: "Learn more",
    edu_show_less: "Show less",
    edu_sections: [
      {
        icon: AlertCircle,
        borderColor: "#378ADD",
        iconBg: "#E6F1FB",
        iconColor: "#185FA5",
        titleColor: "#0C447C",
        title: "What is diabetes?",
        points: [
          "Sugar = Energy for your body.",
          "Insulin is the \"key\" that lets sugar into your cells.",
          "In diabetes, the key is broken. Sugar gets stuck in your blood.",
        ],
        types: [
          { label: "■ Type 1", bg: "#E6F1FB", textColor: "#0C447C", desc: "Born with it.\nBody makes no insulin.\nNeeds daily injections.", image: "/images/edu/Type1.png" },
          { label: "▲ Type 2", bg: "#E1F5EE", textColor: "#085041", desc: "Lifestyle linked.\nBody ignores insulin.\nMost common type.", image: "/images/edu/Type2.png" },
        ],
        subSection: {
          bg: "#E6F1FB",
          titleColor: "#0C447C",
          dotColor: "#378ADD",
          title: "Prediabetes",
          points: [
            { text: "Blood sugar higher than normal", highlight: false },
            { text: "Not yet diabetes", highlight: false },
            { text: "It is reversible, healthy habits can bring it back to normal", highlight: true },
          ],
        },
        learnMore: [
          "Diabetes is a long-term condition. It cannot be cured, but it can be managed well. Many people with diabetes live full, healthy lives.",
          "Type 2 makes up over 90% of cases in Malaysia and develops slowly over years, often without obvious signs.",
          "Doctors diagnose diabetes using an HbA1c blood test, which shows your average blood sugar over 3 months. A fasting blood sugar test is also commonly used.",
        ],
      },
      {
        icon: Eye,
        borderColor: "#BA7517",
        iconBg: "#FAEEDA",
        iconColor: "#854F0B",
        titleColor: "#633806",
        title: "Symptoms to watch for",
        imageTiles: [
          { label: "Very thirsty", image: "/images/edu/symptom-thirsty.png" },
          { label: "Urinate often", image: "/images/edu/symptom-urinate.png" },
          { label: "Tired & weak", image: "/images/edu/symptom-tired.png" },
          { label: "Blurry vision", image: "/images/edu/symptom-vision.png" },
          { label: "Slow healing", image: "/images/edu/symptom-healing.png" },
          { label: "Numbness", image: "/images/edu/symptom-numbness.png" },
        ],
        tileBg: "#FAEEDA",
        tileLabelColor: "#633806",
        warning: {
          bg: "#FAEEDA",
          iconColor: "#854F0B",
          textColor: "#633806",
          text: "Many people have NO symptoms for years.",
        },
        seeDoctor: {
          bg: "#E6F1FB",
          titleColor: "#0C447C",
          dotColor: "#378ADD",
          textColor: "#185FA5",
          title: "See a doctor if you:",
          points: [
            "Have 2+ symptoms above",
            "Have a family member with diabetes",
            "Haven't had a blood sugar check in over a year",
          ],
        },
        learnMore: [
          "Foot numbness and tingling are early signs of nerve damage (neuropathy): a complication of long-term high blood sugar that, if ignored, can lead to serious foot problems.",
          "Eye, kidney, and heart damage also develop silently over years. This is why regular screening matters more than waiting for symptoms.",
        ],
      },
      {
        icon: Activity,
        borderColor: "#1D9E75",
        iconBg: "#E1F5EE",
        iconColor: "#0F6E56",
        titleColor: "#085041",
        title: "Risk factors",
        points: [
          "Unhealthy diet & lack of exercise",
          "Being overweight, especially belly fat",
          "Family history of diabetes",
          "Age 40 and above",
        ],
        controllableTiles: {
          canControlLabel: "Can control",
          canControl: [
            { label: "Diet", image: "/images/edu/risk-diet.png" },
            { label: "Exercise", image: "/images/edu/risk-exercise.png" },
            { label: "Weight", image: "/images/edu/risk-weight.png" },
          ],
          cannotControlLabel: "Cannot control",
          cannotControl: [
            { label: "Age", image: "/images/edu/risk-age.png" },
            { label: "Family history", image: "/images/edu/risk-family.png" },
          ],
        },
        learnMore: [
          "Having one or two risk factors does not mean you will definitely get diabetes, but the more you have, the higher your chance.",
          "Belly fat is a particularly strong risk factor because fat around the organs directly affects how insulin works.",
          "Even if diabetes runs in your family, lifestyle changes can delay or prevent it. You are not powerless against your genes.",
        ],
      },
      {
        icon: Heart,
        borderColor: "#7F77DD",
        iconBg: "#EEEDFE",
        iconColor: "#534AB7",
        titleColor: "#3C3489",
        title: "Prevention & healthy habits",
        imageTiles: [
          { label: "Drink water", image: "/images/edu/prevention-water.png" },
          { label: "Less rice", image: "/images/edu/prevention-rice.png" },
          { label: "Walk daily", image: "/images/edu/prevention-walk.png" },
          { label: "Smaller plate", image: "/images/edu/prevention-plate.png" },
          { label: "Yearly check", image: "/images/edu/prevention-check.png" },
          { label: "Sleep well", image: "/images/edu/prevention-sleep.png" },
        ],
        tileBg: "#EEEDFE",
        tileLabelColor: "#3C3489",
        note: { bg: "#EEEDFE", textColor: "#3C3489", text: "Small changes done consistently matter more than big changes done occasionally." },
        learnMore: [
          "Brisk walking is one of the most effective activities for blood sugar control, no gym needed. Even 10-minute walks after meals help.",
          "Reducing portion size matters as much as food choice. Using a smaller plate is a simple, practical way to eat less without feeling deprived.",
          "Stress raises blood sugar too. Adequate sleep (7–8 hours), social connection, and relaxation all play a real role in diabetes prevention.",
        ],
      },
      {
        icon: CalendarCheck,
        borderColor: "#D4537E",
        iconBg: "#FBEAF0",
        iconColor: "#993556",
        titleColor: "#72243E",
        title: "Living with diabetes",
        intro: "Already diagnosed? Here is what to stay on top of:",
        imageTiles: [
          { label: "Take medication daily", image: "/images/edu/living-medication.png" },
          { label: "Monitor blood sugar", image: "/images/edu/living-monitor.png" },
          { label: "Clinic follow-up", image: "/images/edu/living-followup.png" },
          { label: "Annual checks", image: "/images/edu/living-checks.png" },
        ],
        tileBg: "#FBEAF0",
        tileLabelColor: "#72243E",
        note: { bg: "#FBEAF0", textColor: "#72243E", text: "Managing diabetes is a long journey. It is okay to ask for help from family, doctors, or support groups." },
        learnMore: [
          "Your HbA1c target is usually below 7%, ask your doctor what your personal target is. This single number gives the clearest picture of overall blood sugar control.",
          "If you use insulin or certain medications, always carry a snack in case your blood sugar drops too low (hypoglycaemia). Signs include shaking, sweating, and confusion.",
          "Emotional wellbeing matters. Diabetes distress, feeling frustrated or burnt out, is very common and very treatable. Speak to your doctor or a counsellor.",
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
    edu_learn_more: "Klik untuk maklumat lanjut",
    edu_show_less: "Sembunyikan",
    edu_sections: [
      {
        icon: AlertCircle,
        borderColor: "#378ADD",
        iconBg: "#E6F1FB",
        iconColor: "#185FA5",
        titleColor: "#0C447C",
        title: "Apa itu diabetes?",
        points: [
          "Badan anda memerlukan gula (glukosa) untuk tenaga",
          "Insulin adalah \"kunci\" yang membenarkan gula masuk ke dalam sel anda",
          "Dalam diabetes, kunci hilang atau rosak — gula berkumpul dalam darah",
        ],
        types: [
          { label: "Jenis 1", bg: "#E6F1FB", textColor: "#0C447C", desc: "Badan tidak menghasilkan insulin. Perlu suntikan harian. Biasanya bermula muda.", image: "/images/edu/Type1.png" },
          { label: "Jenis 2", bg: "#E1F5EE", textColor: "#085041", desc: "Badan mengabaikan insulin. Lebih biasa. Berkait rapat dengan gaya hidup.", image: "/images/edu/Type2.png" },
        ],
        subSection: {
          bg: "#E6F1FB",
          titleColor: "#0C447C",
          dotColor: "#378ADD",
          title: "Pradiabetes",
          points: [
            { text: "Gula darah lebih tinggi daripada biasa", highlight: false },
            { text: "Tetapi belum diabetes", highlight: false },
            { text: "Ia boleh dipulihkan — tabiat sihat boleh mengembalikannya ke normal", highlight: true },
          ],
        },
        learnMore: [
          "Diabetes adalah keadaan jangka panjang — ia tidak boleh disembuhkan, tetapi boleh diuruskan dengan baik. Ramai penghidap diabetes menjalani kehidupan yang penuh dan sihat.",
          "Jenis 2 merangkumi lebih 90% kes di Malaysia dan berkembang perlahan selama bertahun-tahun, sering tanpa tanda yang jelas.",
          "Doktor mendiagnosis diabetes menggunakan ujian darah HbA1c, yang menunjukkan purata gula darah anda selama 3 bulan.",
        ],
      },
      {
        icon: Eye,
        borderColor: "#BA7517",
        iconBg: "#FAEEDA",
        iconColor: "#854F0B",
        titleColor: "#633806",
        title: "Gejala yang perlu dipantau",
        imageTiles: [
          { label: "Sangat dahaga", image: "/images/edu/symptom-thirsty.png" },
          { label: "Kerap kencing", image: "/images/edu/symptom-urinate.png" },
          { label: "Penat & lemah", image: "/images/edu/symptom-tired.png" },
          { label: "Penglihatan kabur", image: "/images/edu/symptom-vision.png" },
          { label: "Luka lambat sembuh", image: "/images/edu/symptom-healing.png" },
          { label: "Kebas & kesemutan", image: "/images/edu/symptom-numbness.png" },
        ],
        tileBg: "#FAEEDA",
        tileLabelColor: "#633806",
        warning: {
          bg: "#FAEEDA",
          iconColor: "#854F0B",
          textColor: "#633806",
          text: "Ramai penghidap diabetes Jenis 2 tidak mempunyai gejala selama bertahun-tahun. Kerosakan boleh berlaku secara senyap.",
        },
        seeDoctor: {
          bg: "#E6F1FB",
          titleColor: "#0C447C",
          dotColor: "#378ADD",
          textColor: "#185FA5",
          title: "Berjumpa doktor jika anda:",
          points: [
            "Mempunyai 2 atau lebih gejala di atas",
            "Mempunyai ahli keluarga yang menghidap diabetes",
            "Belum memeriksa gula darah lebih dari setahun",
          ],
        },
        learnMore: [
          "Kebas dan kesemutan kaki adalah tanda awal kerosakan saraf (neuropati) — komplikasi gula darah tinggi jangka panjang yang boleh membawa masalah kaki yang serius.",
          "Kerosakan mata, buah pinggang, dan jantung juga berlaku secara senyap selama bertahun-tahun. Ini sebabnya saringan berkala lebih penting daripada menunggu gejala.",
        ],
      },
      {
        icon: Activity,
        borderColor: "#1D9E75",
        iconBg: "#E1F5EE",
        iconColor: "#0F6E56",
        titleColor: "#085041",
        title: "Faktor risiko",
        points: [
          "Makanan tidak sihat & kurang senaman",
          "Berat badan berlebihan, terutama di bahagian perut",
          "Sejarah keluarga diabetes",
          "Umur 40 tahun ke atas",
        ],
        controllableTiles: {
          canControlLabel: "Boleh dikawal",
          canControl: [
            { label: "Pemakanan", image: "/images/edu/risk-diet.png" },
            { label: "Senaman", image: "/images/edu/risk-exercise.png" },
            { label: "Berat badan", image: "/images/edu/risk-weight.png" },
          ],
          cannotControlLabel: "Tidak boleh dikawal",
          cannotControl: [
            { label: "Umur", image: "/images/edu/risk-age.png" },
            { label: "Sejarah keluarga", image: "/images/edu/risk-family.png" },
          ],
        },
        learnMore: [
          "Mempunyai satu atau dua faktor risiko tidak bermakna anda pasti akan menghidap diabetes — tetapi lebih banyak faktor yang anda ada, lebih tinggi peluangnya.",
          "Lemak perut adalah faktor risiko yang sangat kuat kerana lemak di sekeliling organ mempengaruhi cara insulin berfungsi.",
          "Walaupun diabetes ada dalam keluarga anda, perubahan gaya hidup boleh melambatkan atau mencegahnya.",
        ],
      },
      {
        icon: Heart,
        borderColor: "#7F77DD",
        iconBg: "#EEEDFE",
        iconColor: "#534AB7",
        titleColor: "#3C3489",
        title: "Pencegahan & tabiat sihat",
        imageTiles: [
          { label: "Minum air kosong", image: "/images/edu/prevention-water.png" },
          { label: "Kurang nasi", image: "/images/edu/prevention-rice.png" },
          { label: "Berjalan kaki", image: "/images/edu/prevention-walk.png" },
          { label: "Pinggan lebih kecil", image: "/images/edu/prevention-plate.png" },
          { label: "Semak tahunan", image: "/images/edu/prevention-check.png" },
          { label: "Tidur cukup", image: "/images/edu/prevention-sleep.png" },
        ],
        tileBg: "#EEEDFE",
        tileLabelColor: "#3C3489",
        note: { bg: "#EEEDFE", textColor: "#3C3489", text: "Perubahan kecil yang dilakukan secara konsisten lebih berkesan daripada perubahan besar yang dilakukan sekali-sekala." },
        learnMore: [
          "Berjalan kaki dengan pantas adalah salah satu aktiviti paling berkesan untuk kawalan gula darah — tidak perlu pergi ke gimnasium. Malah berjalan 10 minit selepas makan pun membantu.",
          "Mengurangkan saiz hidangan sama pentingnya dengan pilihan makanan. Menggunakan pinggan yang lebih kecil adalah cara mudah untuk makan lebih sedikit.",
          "Tekanan juga meningkatkan gula darah. Tidur yang cukup (7–8 jam), hubungan sosial, dan relaksasi memainkan peranan nyata dalam pencegahan diabetes.",
        ],
      },
      {
        icon: CalendarCheck,
        borderColor: "#D4537E",
        iconBg: "#FBEAF0",
        iconColor: "#993556",
        titleColor: "#72243E",
        title: "Menjalani hidup dengan diabetes",
        intro: "Sudah didiagnosis? Berikut adalah perkara yang perlu diberi perhatian:",
        imageTiles: [
          { label: "Ambil ubat setiap hari", image: "/images/edu/living-medication.png" },
          { label: "Pantau gula darah", image: "/images/edu/living-monitor.png" },
          { label: "Susulan klinik", image: "/images/edu/living-followup.png" },
          { label: "Pemeriksaan tahunan", image: "/images/edu/living-checks.png" },
        ],
        tileBg: "#FBEAF0",
        tileLabelColor: "#72243E",
        note: { bg: "#FBEAF0", textColor: "#72243E", text: "Mengurus diabetes adalah perjalanan yang panjang. Tidak mengapa untuk meminta bantuan daripada keluarga, doktor, atau kumpulan sokongan." },
        learnMore: [
          "Sasaran HbA1c anda biasanya di bawah 7% — tanya doktor anda apakah sasaran peribadi anda. Nombor tunggal ini memberikan gambaran paling jelas tentang kawalan gula darah keseluruhan.",
          "Jika anda menggunakan insulin atau ubat-ubatan tertentu, sentiasa bawa snek sekiranya gula darah turun terlalu rendah (hipoglisemia). Tanda-tandanya termasuk menggigil, berpeluh, dan keliru.",
          "Kesejahteraan emosi penting. Tekanan diabetes — rasa kecewa atau keletihan — sangat biasa dan boleh dirawat. Berbicara dengan doktor atau kaunselor anda.",
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
    edu_learn_more: "了解更多",
    edu_show_less: "收起",
    edu_sections: [
      {
        icon: AlertCircle,
        borderColor: "#378ADD",
        iconBg: "#E6F1FB",
        iconColor: "#185FA5",
        titleColor: "#0C447C",
        title: "什么是糖尿病？",
        points: [
          "您的身体需要糖（葡萄糖）来提供能量",
          "胰岛素是让糖进入细胞的\"钥匙\"",
          "糖尿病时，钥匙丢失或损坏——糖在血液中积聚",
        ],
        types: [
          { label: "1型", bg: "#E6F1FB", textColor: "#0C447C", desc: "身体不产生胰岛素。需要每日注射。通常年轻时发病。", image: "/images/edu/Type1.png" },
          { label: "2型", bg: "#E1F5EE", textColor: "#085041", desc: "身体忽视胰岛素。更常见。与生活方式密切相关。", image: "/images/edu/Type2.png" },
        ],
        subSection: {
          bg: "#E6F1FB",
          titleColor: "#0C447C",
          dotColor: "#378ADD",
          title: "糖尿病前期",
          points: [
            { text: "血糖高于正常水平", highlight: false },
            { text: "尚未达到糖尿病标准", highlight: false },
            { text: "可以逆转——健康习惯可以让血糖恢复正常", highlight: true },
          ],
        },
        learnMore: [
          "糖尿病是一种长期病症——无法治愈，但可以得到良好控制。许多糖尿病患者过着充实健康的生活。",
          "2型糖尿病占马来西亚病例的90%以上，通常在数年内缓慢发展，往往没有明显症状。",
          "医生使用HbA1c血液检测来诊断糖尿病，该检测显示您过去3个月的平均血糖水平。",
        ],
      },
      {
        icon: Eye,
        borderColor: "#BA7517",
        iconBg: "#FAEEDA",
        iconColor: "#854F0B",
        titleColor: "#633806",
        title: "需要注意的症状",
        imageTiles: [
          { label: "非常口渴", image: "/images/edu/symptom-thirsty.png" },
          { label: "频繁排尿", image: "/images/edu/symptom-urinate.png" },
          { label: "疲倦虚弱", image: "/images/edu/symptom-tired.png" },
          { label: "视力模糊", image: "/images/edu/symptom-vision.png" },
          { label: "伤口难愈", image: "/images/edu/symptom-healing.png" },
          { label: "麻木刺痛", image: "/images/edu/symptom-numbness.png" },
        ],
        tileBg: "#FAEEDA",
        tileLabelColor: "#633806",
        warning: {
          bg: "#FAEEDA",
          iconColor: "#854F0B",
          textColor: "#633806",
          text: "许多2型糖尿病患者多年来没有任何症状。损害可能在无声中发生。",
        },
        seeDoctor: {
          bg: "#E6F1FB",
          titleColor: "#0C447C",
          dotColor: "#378ADD",
          textColor: "#185FA5",
          title: "如有以下情况请就医：",
          points: [
            "有2个或以上上述症状",
            "家族成员患有糖尿病",
            "超过一年未检查血糖",
          ],
        },
        learnMore: [
          "脚部麻木和刺痛是神经损伤（神经病变）的早期迹象——这是长期高血糖的并发症，若忽视可能导致严重的足部问题。",
          "眼睛、肾脏和心脏损伤也会在多年内无声发生。这就是为什么定期筛查比等待症状出现更重要。",
        ],
      },
      {
        icon: Activity,
        borderColor: "#1D9E75",
        iconBg: "#E1F5EE",
        iconColor: "#0F6E56",
        titleColor: "#085041",
        title: "风险因素",
        points: [
          "摄入过多糖分、白米或加工食品",
          "日常活动不足",
          "超重，尤其是腹部肥胖",
          "家族成员（父母或兄弟姐妹）患有糖尿病",
          "40岁及以上",
          "曾有妊娠糖尿病史",
        ],
        controllableTiles: {
          canControlLabel: "可以控制",
          canControl: [
            { label: "饮食", image: "/images/edu/risk-diet.png" },
            { label: "运动", image: "/images/edu/risk-exercise.png" },
            { label: "体重", image: "/images/edu/risk-weight.png" },
          ],
          cannotControlLabel: "无法控制",
          cannotControl: [
            { label: "年龄", image: "/images/edu/risk-age.png" },
            { label: "家族史", image: "/images/edu/risk-family.png" },
          ],
        },
        learnMore: [
          "拥有一两个风险因素并不意味着您一定会得糖尿病——但风险因素越多，患病机会越高。",
          "腹部脂肪是一个特别强的风险因素，因为器官周围的脂肪直接影响胰岛素的工作方式。",
          "即使糖尿病在您的家族中有遗传，生活方式的改变也可以延迟或预防它。",
        ],
      },
      {
        icon: Heart,
        borderColor: "#7F77DD",
        iconBg: "#EEEDFE",
        iconColor: "#534AB7",
        titleColor: "#3C3489",
        title: "预防与健康习惯",
        imageTiles: [
          { label: "喝白开水", image: "/images/edu/prevention-water.png" },
          { label: "少吃白米", image: "/images/edu/prevention-rice.png" },
          { label: "每日步行", image: "/images/edu/prevention-walk.png" },
          { label: "小碗进食", image: "/images/edu/prevention-plate.png" },
          { label: "每年检查", image: "/images/edu/prevention-check.png" },
          { label: "充足睡眠", image: "/images/edu/prevention-sleep.png" },
        ],
        tileBg: "#EEEDFE",
        tileLabelColor: "#3C3489",
        note: { bg: "#EEEDFE", textColor: "#3C3489", text: "持续做出小改变比偶尔做出大改变更有效。" },
        learnMore: [
          "快步行走是控制血糖最有效的活动之一——不需要去健身房。甚至饭后散步10分钟也有帮助。",
          "减少食物份量与食物选择同样重要。使用较小的碗碟是减少进食量的简单方法。",
          "压力也会升高血糖。充足睡眠（7-8小时）、社交联系和放松在预防糖尿病中都起着真实的作用。",
        ],
      },
      {
        icon: CalendarCheck,
        borderColor: "#D4537E",
        iconBg: "#FBEAF0",
        iconColor: "#993556",
        titleColor: "#72243E",
        title: "与糖尿病共存",
        intro: "已确诊？以下是需要注意的事项：",
        imageTiles: [
          { label: "每日按时服药", image: "/images/edu/living-medication.png" },
          { label: "监测血糖", image: "/images/edu/living-monitor.png" },
          { label: "定期复诊", image: "/images/edu/living-followup.png" },
          { label: "年度检查", image: "/images/edu/living-checks.png" },
        ],
        tileBg: "#FBEAF0",
        tileLabelColor: "#72243E",
        note: { bg: "#FBEAF0", textColor: "#72243E", text: "控制糖尿病是一段漫长的旅程。向家人、医生或支持团体寻求帮助是完全可以的。" },
        learnMore: [
          "您的HbA1c目标通常在7%以下——询问医生您的个人目标。这个数字可以最清楚地反映整体血糖控制情况。",
          "如果您使用胰岛素或某些药物，请随身携带零食，以防血糖过低（低血糖）。症状包括颤抖、出汗和意识混乱。",
          "情绪健康很重要。糖尿病困扰——感到沮丧或精疲力竭——非常普遍且可以治疗。请与医生或辅导员交流。",
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

// Shared placeholder shown when an image hasn't been added yet
function ImgOrPlaceholder({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-xl flex items-center justify-center ${className ?? ""}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain"
        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none" }}
      />
    </div>
  )
}

function EduCard({ section, learnMoreLabel, showLessLabel }: { section: typeof content.en.edu_sections[0]; learnMoreLabel: string; showLessLabel: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="rounded-2xl bg-background flex flex-col overflow-hidden"
      style={{ border: `2px solid ${section.borderColor}` }}
    >
      {/* Card body */}
      <div className="p-6 sm:p-7 flex flex-col gap-4">

        {/* Header */}
        <div className="flex items-center gap-3">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: section.iconBg }}
          >
            <section.icon className="w-8 h-8" style={{ color: section.iconColor }} />
          </div>
          <h3 className="text-2xl font-bold leading-snug" style={{ color: section.titleColor }}>
            {section.title}
          </h3>
        </div>

        <div className="border-t border-border/30" />

        {/* Main bullet points */}
        {"points" in section && section.points && (
          <ul className="space-y-2.5">
            {(section.points as string[]).map((point, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 mt-[7px]"
                  style={{ backgroundColor: section.borderColor }}
                />
                <span className="text-lg leading-relaxed text-foreground">{point}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Type 1 / Type 2 tiles — with image */}
        {"types" in section && section.types && (
          <div className="grid grid-cols-2 gap-3">
            {section.types.map((t, i) => (
              <div key={i} className="rounded-xl p-4 flex flex-col items-center text-center gap-2" style={{ backgroundColor: t.bg }}>
                <ImgOrPlaceholder src={t.image} alt={t.label} className="w-full h-24" />
                <p className="text-base font-bold" style={{ color: t.textColor }}>{t.label}</p>
                <p className="text-base leading-snug text-foreground whitespace-pre-line">{t.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* Prediabetes subsection */}
        {"subSection" in section && section.subSection && (
          <div className="rounded-xl p-4" style={{ backgroundColor: section.subSection.bg }}>
            <p className="text-base font-bold mb-2.5" style={{ color: section.subSection.titleColor }}>
              {section.subSection.title}
            </p>
            <ul className="space-y-2">
              {section.subSection.points.map((pt, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span
                    className="w-2 h-2 rounded-full shrink-0 mt-[7px]"
                    style={{ backgroundColor: section.subSection!.dotColor }}
                  />
                  <span
                    className="text-base leading-relaxed"
                    style={{
                      color: pt.highlight ? section.subSection!.titleColor : "var(--foreground)",
                      fontWeight: pt.highlight ? 800 : 400,
                    }}
                  >
                    {pt.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Controllable tiles (risk factors) */}
        {"controllableTiles" in section && section.controllableTiles && (
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-sm font-medium mb-2" style={{ color: "#085041" }}>
                {section.controllableTiles.canControlLabel}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {section.controllableTiles.canControl.map((tile, i) => (
                  <div key={i} className="rounded-xl p-2 flex flex-col items-center gap-2 text-center" style={{ backgroundColor: "#E1F5EE" }}>
                    <ImgOrPlaceholder src={tile.image} alt={tile.label} className="w-full h-20" />
                    <p className="text-sm font-medium leading-tight" style={{ color: "#085041" }}>{tile.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2" style={{ color: "#633806" }}>
                {section.controllableTiles.cannotControlLabel}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {section.controllableTiles.cannotControl.map((tile, i) => (
                  <div key={i} className="rounded-xl p-2 flex flex-col items-center gap-2 text-center" style={{ backgroundColor: "#FAEEDA" }}>
                    <ImgOrPlaceholder src={tile.image} alt={tile.label} className="w-full h-20" />
                    <p className="text-sm font-medium leading-tight" style={{ color: "#633806" }}>{tile.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}


        {/* Image tiles — label only (symptoms, prevention, living) */}
        {"imageTiles" in section && section.imageTiles && (
          <div className="grid grid-cols-2 gap-3">
            {section.imageTiles.map((tile, i) => (
              <div
                key={i}
                className="rounded-xl p-2 flex flex-col items-center gap-2 text-center"
                style={{ backgroundColor: section.tileBg }}
              >
                <ImgOrPlaceholder src={tile.image} alt={tile.label} className="w-full h-20" />
                <p className="text-base font-medium leading-tight" style={{ color: section.tileLabelColor }}>
                  {tile.label}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Warning box (symptoms) */}
        {"warning" in section && section.warning && typeof section.warning === "object" && (
          <div className="rounded-xl p-3 flex items-start gap-3" style={{ backgroundColor: section.warning.bg }}>
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: section.warning.iconColor }} />
            <span className="text-base font-medium leading-snug" style={{ color: section.warning.textColor }}>
              {section.warning.text}
            </span>
          </div>
        )}

        {/* See a doctor box (symptoms) */}
        {"seeDoctor" in section && section.seeDoctor && (
          <div className="rounded-xl p-4" style={{ backgroundColor: section.seeDoctor.bg }}>
            <p className="text-base font-bold mb-2" style={{ color: section.seeDoctor.titleColor }}>
              {section.seeDoctor.title}
            </p>
            <ul className="space-y-1.5">
              {section.seeDoctor.points.map((pt, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-[8px]" style={{ backgroundColor: section.seeDoctor!.dotColor }} />
                  <span className="text-base leading-relaxed" >{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Note / quote */}
        {"note" in section && section.note && (
          <div className="rounded-xl p-3" style={{ backgroundColor: section.note.bg }}>
            <p className="text-base leading-relaxed italic" style={{ color: section.note.textColor }}>
              {section.note.text}
            </p>
          </div>
        )}

        {/* Learn more expandable */}
      {"learnMore" in section && section.learnMore && (
        <>
          <button
            onClick={() => setOpen(o => !o)}
            className="w-full flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-base font-medium border border-border/100 text-foreground hover:bg-muted transition-colors"
          >
            <ChevronDown
              className="w-4 h-4 transition-transform duration-200"
              style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
            />
            {open ? showLessLabel : learnMoreLabel}
          </button>
          {open && (
            <div className="flex flex-col gap-2 pt-1 border-t border-border/20">
              {(section.learnMore as string[]).map((para, idx) => (
                <p key={idx} className="text-base leading-relaxed text-foreground">{para}</p>
              ))}
            </div>
          )}
        </>
      )}
      </div>     
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {t.edu_sections.map((section, idx) => (
                  <EduCard
                    key={idx}
                    section={section}
                    learnMoreLabel={t.edu_learn_more}
                    showLessLabel={t.edu_show_less}
                  />
                ))}
              </div>
            </div>
          </div>
        )
      }}
    </PageLayout>
  )
}
