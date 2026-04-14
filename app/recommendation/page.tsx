"use client"

import { PageLayout } from "@/components/page-layout"
import { useState, useRef, useCallback, useEffect } from "react"

import Image from "next/image"
import {
  Camera, Upload, X, Star, TrendingDown, TrendingUp, Minus,
  CheckCircle, Info, Loader2, ZoomIn, Utensils, GlassWater, Cake, Salad, Plus, Trash2, ArrowRight, User
} from "lucide-react"
import Link from "next/link"

type LangCode = "en" | "ms" | "zh"

const content = {
  en: {
    page_title: "Food Check & Recommendation",
    page_subtitle: "Upload a photo of your meal and get personalized health advice.",
    guide_title: "How to Take a Good Photo",
    guide_steps: [
      { icon: "camera", text: "Hold your phone steady above the food" },
      { icon: "light", text: "Make sure there is good lighting" },
      { icon: "food", text: "Include all dishes in one photo" },
      { icon: "clear", text: "Ensure the food is clearly visible" },
    ],
    upload_title: "Upload or Take Photo",
    upload_hint: "Tap to upload or take a photo of your meal",
    upload_btn: "Choose Photo",
    camera_btn: "Take Photo",
    uploading: "Uploading...",
    click_to_view: "Click to view full image",
    text_input_title: "Type Your Food Name",
    text_input_hint: "No photo? Type the dish name here instead.",
    text_placeholder: "E.g., Nasi lemak, Roti canai, Teh tarik...",
    analyze_btn: "Analyse & Recommend",
    select_category: "Select Food Category",
    select_category_hint: "Choose which type of food you want to analyse:",
    categories: {
      appetizer: "Appetizer",
      main: "Main Dish",
      dessert: "Dessert",
      drink: "Drinks",
    },
    result_title: "Analysis Result",
    best_choice: "Best Choice",
    disclaimer: "Ranking based on estimated sugar, calories, and GI values. Results are for general guidance only.",
    tip_label: "Health Tip",
    risk_low: "Low Risk",
    risk_medium: "Medium Risk",
    risk_high: "High Risk",
    nutrition_sugar: "Sugar",
    nutrition_cal: "Calories",
    nutrition_gi: "GI Index",
    analyze_another: "Analyse Another Category",
    back_to_upload: "Upload New Photo",
    max_photos: "Max 5 photos",
    photos_count: "photos",
    delete_all: "Delete All",
    common_foods_title: "Popular Malaysian Foods",
    common_foods_subtitle: "Click any food for more info",
    see_more_foods: "See More Foods",
    gi_guide_title: "GI Index Guide",
    gi_description: "GI measures how fast food raises blood sugar.",
    gi_low: "Low GI (0-55)",
    gi_medium: "Medium GI (56-69)",
    gi_high: "High GI (70+)",
    sugar_guide_title: "Sugar Guide",
    sugar_low: "Low (<5g)",
    sugar_medium: "Medium (5-15g)",
    sugar_high: "High (>15g)",
    portion: "Serving",
    tip_label_full: "Health Tip",
    close: "Close",
    daily_sugar_title: "Daily Sugar Limit:",
    daily_sugar_women: "Women < 25g",
    daily_sugar_men: "Men < 36g",
    unrecognized_title: "Some items could not be recognized",
    unrecognized_hint: "Try uploading a clearer image or describe the food in the text box.",
    no_results: "No food items detected",
    no_results_hint: "Please upload a clearer photo of the menu or describe your food.",
    scanning_steps: ["Reading menu...", "Identifying food items...", "Calculating nutrition values...", "Almost done..."],
    success_found: "items found!",
    success_none: "No items detected",
    top3_disclaimer: "We are showing you the Top 3 Healthiest Choices from what was found in your food photo. These are the safest options for your blood sugar.",
    analyze_new_food: "Analyse New Food",
  },
  ms: {
    page_title: "Semak & Cadangan Makanan",
    page_subtitle: "Muat naik foto makanan anda dan dapatkan nasihat kesihatan peribadi.",
    guide_title: "Cara Mengambil Foto yang Baik",
    guide_steps: [
      { icon: "camera", text: "Pegang telefon anda dengan stabil di atas makanan" },
      { icon: "light", text: "Pastikan pencahayaan yang baik" },
      { icon: "food", text: "Masukkan semua hidangan dalam satu foto" },
      { icon: "clear", text: "Pastikan makanan jelas kelihatan" },
    ],
    upload_title: "Muat Naik atau Ambil Foto",
    upload_hint: "Ketik untuk muat naik atau ambil foto makanan anda",
    upload_btn: "Pilih Foto",
    camera_btn: "Ambil Foto",
    uploading: "Memuat naik...",
    click_to_view: "Klik untuk lihat imej penuh",
    text_input_title: "Taip Nama Makanan Anda",
    text_input_hint: "Tiada foto? Taip nama hidangan di sini.",
    text_placeholder: "Cth., Nasi lemak, Roti canai, Teh tarik...",
    analyze_btn: "Analisis & Cadangan",
    select_category: "Pilih Kategori Makanan",
    select_category_hint: "Pilih jenis makanan yang ingin anda analisis:",
    categories: {
      appetizer: "Pembuka Selera",
      main: "Hidangan Utama",
      dessert: "Pencuci Mulut",
      drink: "Minuman",
    },
    result_title: "Keputusan Analisis",
    best_choice: "Pilihan Terbaik",
    disclaimer: "Penarafan berdasarkan anggaran gula, kalori dan nilai GI. Keputusan adalah untuk panduan umum sahaja.",
    tip_label: "Tip Kesihatan",
    risk_low: "Risiko Rendah",
    risk_medium: "Risiko Sederhana",
    risk_high: "Risiko Tinggi",
    nutrition_sugar: "Gula",
    nutrition_cal: "Kalori",
    nutrition_gi: "Indeks GI",
    analyze_another: "Analisis Kategori Lain",
    back_to_upload: "Muat Naik Foto Baru",
    max_photos: "Maks 5 foto",
    photos_count: "foto",
    delete_all: "Padam Semua",
    common_foods_title: "Makanan Malaysia Popular",
    common_foods_subtitle: "Klik mana-mana makanan untuk maklumat lanjut",
    see_more_foods: "Lihat Lebih Banyak Makanan",
    gi_guide_title: "Panduan Indeks GI",
    gi_description: "GI mengukur seberapa cepat makanan meningkatkan gula darah.",
    gi_low: "GI Rendah (0-55)",
    gi_medium: "GI Sederhana (56-69)",
    gi_high: "GI Tinggi (70+)",
    sugar_guide_title: "Panduan Gula",
    sugar_low: "Rendah (<5g)",
    sugar_medium: "Sederhana (5-15g)",
    sugar_high: "Tinggi (>15g)",
    portion: "Sajian",
    tip_label_full: "Tip Kesihatan",
    close: "Tutup",
    daily_sugar_title: "Had Gula Harian:",
    daily_sugar_women: "Wanita < 25g",
    daily_sugar_men: "Lelaki < 36g",
    unrecognized_title: "Beberapa item tidak dapat dikenalpasti",
    unrecognized_hint: "Cuba muat naik imej yang lebih jelas atau terangkan makanan dalam kotak teks.",
    no_results: "Tiada item makanan dikesan",
    no_results_hint: "Sila muat naik foto menu yang lebih jelas atau terangkan makanan anda.",
    scanning_steps: ["Membaca menu...", "Mengenal pasti item makanan...", "Mengira nilai nutrisi...", "Hampir selesai..."],
    success_found: "item dijumpai!",
    success_none: "Tiada item dikesan",
    top3_disclaimer: "Kami menunjukkan kepada anda 3 Pilihan Paling Sihat daripada apa yang dijumpai dalam foto makanan anda. Ini adalah pilihan paling selamat untuk gula darah anda.",
    analyze_new_food: "Analisis Makanan Baru",
  },
  zh: {
    page_title: "食物检查与推荐",
    page_subtitle: "上传您的餐食照片，获取个性化健康建议。",
    guide_title: "如何拍摄好照片",
    guide_steps: [
      { icon: "camera", text: "将手机稳定地放在食物上方" },
      { icon: "light", text: "确保光线充足" },
      { icon: "food", text: "将所有菜肴放在一张照片中" },
      { icon: "clear", text: "确保食物清晰可见" },
    ],
    upload_title: "上传或拍照",
    upload_hint: "点击上传或拍摄您的餐食照片",
    upload_btn: "选择照片",
    camera_btn: "拍照",
    uploading: "上传中...",
    click_to_view: "点击查看大图",
    text_input_title: "输入食物名称",
    text_input_hint: "没有照片？在这里输入菜名。",
    text_placeholder: "例如：椰浆饭、印度煎饼、拉茶...",
    analyze_btn: "分析推荐",
    select_category: "选择食物类别",
    select_category_hint: "选择您想分析的食物类型：",
    categories: {
      appetizer: "前菜",
      main: "主食",
      dessert: "甜点",
      drink: "饮料",
    },
    result_title: "分析结���",
    best_choice: "最佳选择",
    disclaimer: "排名基于估计的糖分、卡路里和GI值。结果仅供一般指导。",
    tip_label: "健康提示",
    risk_low: "低风险",
    risk_medium: "中等风险",
    risk_high: "高风险",
    nutrition_sugar: "糖分",
    nutrition_cal: "卡路里",
    nutrition_gi: "GI指数",
    analyze_another: "分析其他类别",
    back_to_upload: "上传新照片",
    max_photos: "最多5张照片",
    photos_count: "张照片",
    delete_all: "删除全部",
    common_foods_title: "热门马来西亚美食",
    common_foods_subtitle: "点击任意食物获取更多信息",
    see_more_foods: "查看更多食物",
    gi_guide_title: "GI指数指南",
    gi_description: "GI衡量食物升高血糖的速度。",
    gi_low: "低GI (0-55)",
    gi_medium: "中GI (56-69)",
    gi_high: "高GI (70+)",
    sugar_guide_title: "糖分指南",
    sugar_low: "低 (<5g)",
    sugar_medium: "中 (5-15g)",
    sugar_high: "高 (>15g)",
    portion: "份量",
    tip_label_full: "健康提示",
    close: "关闭",
    daily_sugar_title: "每日糖分限制:",
    daily_sugar_women: "女性 < 25g",
    daily_sugar_men: "男性 < 36g",
    unrecognized_title: "部分食物无法识别",
    unrecognized_hint: "请上传更清晰的图片或在文本框中描述食物。",
    no_results: "未检测到食物",
    no_results_hint: "请上传更清晰的菜单照片或描述您的食物。",
    scanning_steps: ["正在读取菜单...", "正在识别食物...", "正在计算营养值...", "即将完成..."],
    success_found: "个食物已找到！",
    success_none: "未检测到食物",
    top3_disclaimer: "我们为您展示了食物照片中发现的前3个最健康的选择。这些是对您血糖最安全的选项。",
    analyze_new_food: "分析新食物",
  },
}

// Common Malaysian foods for quick selection - with full data like food page
// const commonFoods = [
//   { name: "Nasi Lemak", image: "/images/food-nasi-lemak.jpg", sugar: "8g", calories: "644", gi: "64", risk: "medium", portion: "1 plate (350g)", tip: { en: "Enjoy in smaller portions, less sambal.", ms: "Nikmati dalam bahagian lebih kecil, kurang sambal.", zh: "少量食用，减少参巴酱。" } },
//   { name: "Roti Canai", image: "/images/food-roti-canai.jpg", sugar: "4g", calories: "301", gi: "82", risk: "high", portion: "2 pieces", tip: { en: "High GI, eat less. Choose dhal over curry.", ms: "GI tinggi, makan lebih sedikit. Pilih dhal berbanding kari.", zh: "高GI，少吃。选扁豆而非咖喱。" } },
//   { name: "Mee Goreng", image: "/images/food-mee-goreng.jpg", sugar: "5g", calories: "660", gi: "60", risk: "medium", portion: "1 plate (350g)", tip: { en: "Add more vegetables, request less oil when ordering.", ms: "Tambah lebih banyak sayuran, minta kurang minyak.", zh: "多加蔬菜，点餐时要求少油。" } },
//   { name: "Chicken Rice", image: "/images/food-brown-rice.jpg", sugar: "6g", calories: "702", gi: "65", risk: "medium", portion: "1 plate (350g)", tip: { en: "Choose steamed chicken over roasted. Ask for less rice.", ms: "Pilih ayam kukus berbanding panggang. Minta kurang nasi.", zh: "选择清蒸鸡而非烤鸡。少要点米饭。" } },
//   { name: "Cendol", image: "/images/food-cendol.jpg", sugar: "42g", calories: "380", gi: "78", risk: "high", portion: "1 bowl", tip: { en: "Very high sugar. Avoid or limit to a few spoonfuls only.", ms: "Gula sangat tinggi. Elakkan atau hadkan kepada beberapa sudu sahaja.", zh: "含糖量极高。避免食用或只吃几勺。" } },
//   { name: "Teh Tarik", image: "/images/food-teh-tarik.jpg", sugar: "18g", calories: "120", gi: "65", risk: "medium", portion: "1 glass (200ml)", tip: { en: "Ask for 'kurang manis' (less sweet). Condensed milk adds sugar.", ms: "Minta 'kurang manis'. Susu pekat menambah gula.", zh: "要求'少甜'。炼乳会增加糖分。" } },
// ]

// // Mock analysis results by category
// const mockResultsByCategory = {
//   appetizer: [
//     {
//       name: "Popiah",
//       risk: "low",
//       sugar: "3g",
//       calories: "150",
//       gi: "45",
//       tip: { en: "Great choice! Fresh vegetables wrapped in thin skin. Low in sugar and calories.", ms: "Pilihan bagus! Sayuran segar dibungkus dalam kulit nipis. Rendah gula dan kalori.", zh: "很好的选择！新鲜蔬菜裹在薄皮里。糖分和卡路里低。" },
//     },
//     {
//       name: "Satay (3 sticks)",
//       risk: "medium",
//       sugar: "5g",
//       calories: "220",
//       gi: "55",
//       tip: { en: "Grilled meat is good, but watch the peanut sauce. Limit to 3-4 sticks.", ms: "Daging panggang bagus, tetapi perhatikan kuah kacang. Hadkan kepada 3-4 cucuk.", zh: "烤肉不错，但要注意花生酱。限制在3-4串。" },
//     },
//   ],
//   main: [
//     {
//       name: "Brown Rice with Fish",
//       risk: "low",
//       sugar: "2g",
//       calories: "380",
//       gi: "50",
//       tip: { en: "Excellent choice! Brown rice has more fiber and steamed fish is healthy.", ms: "Pilihan hebat! Nasi perang lebih banyak serat dan ikan kukus sihat.", zh: "极佳选择！糙米纤维更多，清蒸鱼很健康。" },
//     },
//     {
//       name: "Nasi Lemak",
//       risk: "medium",
//       sugar: "8g",
//       calories: "644",
//       gi: "64",
//       tip: { en: "Enjoy in smaller portions. Ask for less sambal and skip fried items.", ms: "Nikmati dalam bahagian kecil. Minta sambal yang kurang dan elakkan yang digoreng.", zh: "少量食用。少放参巴酱，不吃油炸食品。" },
//     },
//     {
//       name: "Roti Canai",
//       risk: "high",
//       sugar: "4g",
//       calories: "301",
//       gi: "82",
//       tip: { en: "High GI - causes blood sugar to spike quickly. Eat less often.", ms: "GI tinggi - menyebabkan gula darah naik cepat. Makan kurang kerap.", zh: "高GI - 血糖迅速升高。少吃。" },
//     },
//   ],
//   dessert: [
//     {
//       name: "Fresh Fruits",
//       risk: "low",
//       sugar: "12g",
//       calories: "80",
//       gi: "40",
//       tip: { en: "Best dessert choice! Natural sugars with fiber. Choose papaya, guava over mango.", ms: "Pilihan pencuci mulut terbaik! Gula semula jadi dengan serat. Pilih betik, jambu berbanding mangga.", zh: "最佳甜点选择！天然糖分配纤维。选择木瓜、番石榴而非芒果。" },
//     },
//     {
//       name: "Cendol",
//       risk: "high",
//       sugar: "42g",
//       calories: "380",
//       gi: "78",
//       tip: { en: "Very high in sugar from gula melaka. Enjoy rarely and in small portions.", ms: "Sangat tinggi gula dari gula melaka. Nikmati jarang dan dalam bahagian kecil.", zh: "椰糖含糖量很高。偶尔享用，份量要小。" },
//     },
//   ],
//   drink: [
//     {
//       name: "Plain Water / Teh O Kosong",
//       risk: "low",
//       sugar: "0g",
//       calories: "0",
//       gi: "0",
//       tip: { en: "Perfect choice! Zero sugar and keeps you hydrated.", ms: "Pilihan sempurna! Sifar gula dan memastikan anda terhidrat.", zh: "完美选择！零糖分，保持水分。" },
//     },
//     {
//       name: "Teh Tarik",
//       risk: "medium",
//       sugar: "18g",
//       calories: "120",
//       gi: "65",
//       tip: { en: "Ask for 'kurang manis' (less sweet). Condensed milk adds sugar.", ms: "Minta 'kurang manis'. Susu pekat menambah gula.", zh: "要求'少甜'。炼乳会增加糖分。" },
//     },
//     {
//       name: "Air Sirap",
//       risk: "high",
//       sugar: "35g",
//       calories: "140",
//       gi: "85",
//       tip: { en: "Very high sugar syrup drink. Best avoided or only small sips.", ms: "Minuman sirap sangat tinggi gula. Elakkan atau minum sedikit sahaja.", zh: "糖浆含糖量非常高。最好避免或只喝一小口。" },
//     },
//   ],
// }

function RiskBadge({ risk, t }: { risk: string; t: typeof content.en }) {
  const configs = {
    low: { label: t.risk_low, icon: TrendingDown, bg: "bg-[var(--risk-low-bg)]", text: "text-[var(--risk-low)]", border: "border-[var(--risk-low)]/30" },
    medium: { label: t.risk_medium, icon: Minus, bg: "bg-[var(--risk-medium-bg)]", text: "text-[var(--risk-medium)]", border: "border-[var(--risk-medium)]/30" },
    high: { label: t.risk_high, icon: TrendingUp, bg: "bg-[var(--risk-high-bg)]", text: "text-red-700", border: "border-red-700/30" },
  }
  const c = configs[risk as keyof typeof configs] || configs.medium
  const isHigh = risk === "high"
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full border ${c.bg} ${c.text} ${c.border} ${isHigh ? 'font-extrabold' : ''}`}>
      <c.icon className="w-4 h-4" />
      Risk
    </span>
  )
}

// Get sugar level from sugar string (e.g., "8g" -> "medium")
// Thresholds: Low ≤5g, Medium 5.1–22.5g, High >22.5g
function getSugarLevel(sugar: string): "low" | "medium" | "high" {
  const value = parseFloat(sugar.replace(/[^0-9.]/g, ''))
  if (value <= 5) return "low"
  if (value <= 22.5) return "medium"
  return "high"
}

// Determine overall risk level based on BOTH sugar AND GI (issue #3)
// Low:    sugar ≤5g   AND GI ≤55
// Medium: sugar ≤22.5g AND GI ≤69
// High:   sugar >22.5g AND GI ≥70
function computeRiskFromValues(sugarStr: string, giStr: string, apiRisk: string): "low" | "medium" | "high" {
  const sugar = parseFloat(sugarStr.replace(/[^0-9.]/g, ''))
  const gi = parseInt(giStr.replace(/[^0-9]/g, ''), 10)

  if (!isNaN(sugar) && !isNaN(gi)) {
    // HIGH: Either Sugar > 22.5 OR GI >= 70
    if (sugar > 22.5 || gi >= 70) return "high";
    
    // LOW: Both must be low (Sugar <= 5 AND GI <= 55)
    if (sugar <= 5 && gi <= 55) return "low";
    
    // MEDIUM: Everything else
    return "medium";
  }
  return (apiRisk?.toLowerCase() as "low" | "medium" | "high") ?? "medium"
}

function getSugarConfig(level: "low" | "medium" | "high") {
  return {
    low: { bg: "bg-[var(--sugar-low-bg)]", text: "text-[var(--sugar-low)]", border: "border-[var(--sugar-low)]/30" },
    medium: { bg: "bg-[var(--sugar-medium-bg)]", text: "text-[var(--sugar-medium)]", border: "border-[var(--sugar-medium)]/40" },
    high: { bg: "bg-[var(--sugar-high-bg)]", text: "text-[var(--sugar-high)]", border: "border-[var(--sugar-high)]/30" },
  }[level]
}


type FoodItem = {
  name: string
  risk: string
  sugar: string
  calories: string
  gi: string
  tip: { en: string; ms: string; zh: string }
}

// Location: Inside FoodResultCard function (Around line 301)
function FoodResultCard({ food, isBest, t, lang }: { food: FoodItem; isBest: boolean; t: typeof content.en; lang: LangCode }) {
  const sugarValue = parseFloat(food.sugar.replace(/[^0-9.]/g, ''))
  const giValue = parseInt(food.gi.replace(/[^0-9]/g, ''), 10)
  
  // Apply the same thresholds used in the risk calculation
  const isHighSugar = sugarValue > 22.5
  const isHighGI = giValue >= 70
  
  const tipText = food.tip[lang] || food.tip.en
  
  // This variable now correctly turns true if EITHER is high
  const computedRisk = computeRiskFromValues(food.sugar, food.gi, food.risk)
  const isHighRisk = computedRisk === "high"
  
  return (
    <div className={`bg-card rounded-2xl border-2 shadow-sm overflow-hidden ${isBest ? "border-primary" : "border-border"}`}>
      {isBest && (
        <div className="bg-primary px-4 py-2 flex items-center gap-2">
          <Star className="w-5 h-5 text-primary-foreground" />
          <span className="text-primary-foreground font-bold text-base">{t.best_choice}</span>
        </div>
      )}
      {/* ... Star Badge Code ... */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold">{food.name}</h3>
          <RiskBadge risk={computedRisk} t={t} />
        </div>
        
        <div className="flex flex-wrap gap-4 mb-4 text-base">
          {/* Sugar Box: Turns red if > 22.5 */}
          <div className={`rounded-xl px-4 py-2 ${isHighSugar ? 'bg-red-50 border border-red-200' : 'bg-muted'}`}>
            <span className="font-semibold text-foreground">{t.nutrition_sugar}:</span>
            <span className={`ml-1 ${isHighSugar ? 'text-red-700 font-extrabold' : ''}`}>{food.sugar}</span>
          </div>

          {/* GI Box: Turns red if >= 70 */}
          <div className={`rounded-xl px-4 py-2 ${isHighGI ? 'bg-red-50 border border-red-200' : 'bg-muted'}`}>
            <span className="font-semibold text-foreground">{t.nutrition_gi}:</span>
            <span className={`ml-1 ${isHighGI ? 'text-red-700 font-extrabold' : ''}`}>{food.gi}</span>
          </div>
          
          {/* ... Calories Box ... */}
        </div>

        {/* Health Tip Box: Turns red if isHighRisk is true */}
        <div className={`flex items-start gap-2 rounded-xl p-4 ${isHighRisk ? 'bg-red-50 border border-red-200' : 'bg-accent/20'}`}>
          <Info className={`w-5 h-5 shrink-0 mt-0.5 ${isHighRisk ? 'text-red-700' : 'text-accent-foreground'}`} />
          <p className={`text-base ${isHighRisk ? 'text-red-700 font-extrabold' : 'text-foreground'}`}>
            <span className="font-bold">{t.tip_label}:</span> {tipText}
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Client-side image compression ──────────────────────────────────────────
// Resizes + re-encodes to JPEG before upload so 5 photos stay well under 4MB total
function compressImage(file: File, maxDimension = 1024, quality = 0.75): Promise<File> {
  return new Promise((resolve) => {
    const img = new window.Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const { width, height } = img
      const scale = Math.min(1, maxDimension / Math.max(width, height))
      const w = Math.round(width * scale)
      const h = Math.round(height * scale)
      const canvas = document.createElement("canvas")
      canvas.width = w
      canvas.height = h
      canvas.getContext("2d")!.drawImage(img, 0, 0, w, h)
      canvas.toBlob(
        (blob) => {
          if (!blob) { resolve(file); return }
          resolve(new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), { type: "image/jpeg" }))
        },
        "image/jpeg",
        quality
      )
    }
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file) }
    img.src = url
  })
}

// Map Gemini category key → page category key
const CATEGORY_MAP: Record<string, string> = {
  "Appetizer": "appetizer",
  "Main Dish": "main",
  "Dessert": "dessert",
  "Drinks": "drink",
}

type ApiResultsCache = Record<string, FoodItem[]>

export default function RecommendationPage() {
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  // newFiles: only the photos added since the last analyze (for incremental OCR, issue #2)
  const [newFiles, setNewFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  // AC 1.2.1: current scanning step index (cycles through scanning_steps while isAnalyzing)
  const [scanStep, setScanStep] = useState(0)
  // AC 1.2.2: total items found – shown briefly in the success state before category picker
  const [successCount, setSuccessCount] = useState<number | null>(null)
  const [analyzeError, setAnalyzeError] = useState<string | null>(null)
  const [apiResultsCache, setApiResultsCache] = useState<ApiResultsCache | null>(null)
  // previousOcr: OCR text from the previous analyze run to combine with new scan (issue #2)
  const [previousOcr, setPreviousOcr] = useState<string>("")
  const [textInput, setTextInput] = useState("")
  const [showCategories, setShowCategories] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [results, setResults] = useState<FoodItem[] | null>(null)
  const [showImageModal, setShowImageModal] = useState(false)
  const [modalImage, setModalImage] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const cameraRef = useRef<HTMLInputElement>(null)

  const MAX_IMAGES = 5

  // Persist text input across navigation
  useEffect(() => {
    const savedText = sessionStorage.getItem("rec-text")
    if (savedText) setTextInput(savedText)
  }, [])

  useEffect(() => {
    sessionStorage.setItem("rec-text", textInput)
  }, [textInput])

  // AC 1.2.1: cycle through scanning step labels every 1.8s while analyzing
  useEffect(() => {
    if (!isAnalyzing) { setScanStep(0); return }
    const id = setInterval(() => setScanStep(prev => (prev + 1) % 4), 1800)
    return () => clearInterval(id)
  }, [isAnalyzing])

  const handleFileUpload = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return
    
    const remainingSlots = MAX_IMAGES - uploadedImages.length
    if (remainingSlots <= 0) return
    
    setIsUploading(true)
    
    const filesToProcess = Array.from(files).slice(0, remainingSlots)
    
    // Compress each image client-side before storing (~1024px max, 75% JPEG quality)
    // This keeps 5 photos well under Vercel's 4.5MB body limit
    Promise.all(filesToProcess.map((f) => compressImage(f))).then((compressed) => {
      const newUrls = compressed.map(file => URL.createObjectURL(file))
      setUploadedImages(prev => [...prev, ...newUrls])
      setUploadedFiles(prev => [...prev, ...compressed])
      setIsUploading(false)
      // Reset all analysis state so next Analyse re-scans everything from scratch
      setNewFiles([])
      setPreviousOcr("")
      setApiResultsCache(null)
      setShowCategories(false)
      setSelectedCategory(null)
      setResults(null)
      setAnalyzeError(null)
    })
  }, [uploadedImages.length])

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
    setNewFiles([])
    setPreviousOcr("")
    setShowCategories(false)
    setSelectedCategory(null)
    setResults(null)
    setApiResultsCache(null)
  }

  const removeAllImages = () => {
    setUploadedImages([])
    setUploadedFiles([])
    setNewFiles([])
    setPreviousOcr("")
    setShowCategories(false)
    setSelectedCategory(null)
    setResults(null)
    setApiResultsCache(null)
  }

  const handleAnalyze = async () => {
    setAnalyzeError(null)
    setIsAnalyzing(true)
    setSuccessCount(null)
    setShowCategories(false)
    setSelectedCategory(null)
    setResults(null)

    let succeeded = false
    try {
      const formData = new FormData()
      // Always scan all uploaded files + current text input for a clean consistent result
      if (textInput.trim()) formData.append("userText", textInput.trim())
      uploadedFiles.forEach(file => formData.append("file", file))

      const res = await fetch("/api/predict", { method: "POST", body: formData })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown error" }))
        throw new Error(err.error || `Server error ${res.status}`)
      }

      const data = await res.json()

      // Transform Gemini output → FoodItem shape the UI expects
      // Gemini: { "Main Dish": { ranking: [{f, sugar, c, gi_val, risk, tip}] } }
      // UI:     { main: FoodItem[] }
      const cache: ApiResultsCache = {}
      for (const [geminiKey, pageKey] of Object.entries(CATEGORY_MAP)) {
        const raw = data[geminiKey]?.ranking ?? []
        cache[pageKey] = raw.map((item: { f: string; sugar: number; c: number; gi_val: number; risk: string; tip: string }) => ({
          name: item.f,
          risk: item.risk?.toLowerCase() ?? "medium",
          sugar: `${item.sugar}g`,
          calories: `${item.c}`,
          gi: `${item.gi_val}`,
          tip: { en: item.tip, ms: item.tip, zh: item.tip },
        }))
      }

      setApiResultsCache(cache)
      succeeded = true

      // AC 1.2.2: stop spinner, show success banner for 2s, then reveal category picker
      const totalFound = Object.values(cache).flat().length
      setIsAnalyzing(false)
      setSuccessCount(totalFound)
      await new Promise(resolve => setTimeout(resolve, 2000))
      setSuccessCount(null)
      setShowCategories(true)
    } catch (err: unknown) {
      setAnalyzeError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    } finally {
      // Only reset analyzing spinner on error path; success path already called setIsAnalyzing(false)
      if (!succeeded) setIsAnalyzing(false)
    }
  }

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
    setShowCategories(false)
    const categoryResults = apiResultsCache?.[category] ?? []
    setResults(categoryResults)
  }

  const handleAnalyzeAnother = () => {
    setShowCategories(true)
    setSelectedCategory(null)
    setResults(null)
  }

  const clearAll = () => {
    setUploadedImages([])
    setUploadedFiles([])
    setNewFiles([])
    setPreviousOcr("")
    setTextInput("")
    setShowCategories(false)
    setSelectedCategory(null)
    setResults(null)
    setApiResultsCache(null)
    setAnalyzeError(null)
  }

  const openImageModal = (imageUrl: string) => {
    setModalImage(imageUrl)
    setShowImageModal(true)
  }

  const hasContent = uploadedImages.length > 0 || textInput.trim().length > 0
  const showAnalyzeButton = hasContent && !isAnalyzing && !results && !showCategories && successCount === null

  return (
    <PageLayout>
      {(lang) => {
        const t = content[lang]
        return (
          <div className="max-w-7xl mx-auto px-4 py-10 md:py-14 space-y-10">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-balance">{t.page_title}</h1>
              <p className="text-xl md:text-2xl text-muted-foreground">{t.page_subtitle}</p>
            </div>

            {/* Photo Guide */}
            <div className="bg-primary/5 rounded-2xl border border-primary/20 p-4 md:p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-primary">
                <Camera className="w-7 h-7" />
                {t.guide_title}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {t.guide_steps.map((step, i) => (
                  <div key={i} className="bg-card rounded-xl p-4 text-center border border-border">
                    <div className="w-12 h-12 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center">
                      {i === 0 && <Camera className="w-6 h-6 text-primary" />}
                      {i === 1 && <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
                      {i === 2 && <Utensils className="w-6 h-6 text-primary" />}
                      {i === 3 && <CheckCircle className="w-6 h-6 text-primary" />}
                    </div>
                    <p className="text-base font-medium">{step.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Upload & Text Input Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {/* Left: Upload Area */}
              <div className="bg-card rounded-2xl border border-border p-4 md:p-6 shadow-sm">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <Upload className="w-6 h-6 text-primary" />
                  {t.upload_title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">{t.max_photos} ({uploadedImages.length}/{MAX_IMAGES})</p>
                
                {isUploading ? (
                  <div className="border-2 border-dashed border-primary/40 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[250px]">
                    <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />
                    <p className="text-lg font-semibold text-primary">{t.uploading}</p>
                  </div>
                ) : uploadedImages.length > 0 ? (
                  <div>
                    {/* Image Grid */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {uploadedImages.map((img, index) => (
                        <div key={index} className="relative aspect-square rounded-xl overflow-hidden border-2 border-primary group">
                          <Image src={img} alt={`Uploaded ${index + 1}`} fill className="object-cover cursor-pointer" onClick={() => openImageModal(img)} />
                          {/* Delete button - higher z-index to be clickable */}
                          <button
                            onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                            className="absolute top-1 right-1 z-20 bg-foreground text-background rounded-full w-7 h-7 flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity shadow-md"
                            aria-label="Remove image"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          {/* Zoom overlay - lower z-index */}
                          <div className="absolute inset-0 z-10 bg-foreground/0 group-hover:bg-foreground/20 transition-colors flex items-center justify-center pointer-events-none">
                            <ZoomIn className="w-6 h-6 text-background opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      ))}
                      {/* Add more button */}
                      {uploadedImages.length < MAX_IMAGES && (
                        <button
                          onClick={() => fileRef.current?.click()}
                          className="aspect-square rounded-xl border-2 border-dashed border-primary/40 flex flex-col items-center justify-center hover:border-primary hover:bg-primary/5 transition-colors"
                        >
                          <Plus className="w-8 h-8 text-primary mb-1" />
                          <span className="text-xs text-muted-foreground">Add</span>
                        </button>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => fileRef.current?.click()}
                        disabled={uploadedImages.length >= MAX_IMAGES}
                        className="flex-1 flex items-center justify-center gap-2 border border-primary text-primary font-semibold py-3 px-2 rounded-xl hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Upload className="w-5 h-5 shrink-0" />
                        <span className="truncate">{t.upload_btn}</span>
                      </button>
                      <button
                        onClick={() => cameraRef.current?.click()}
                        disabled={uploadedImages.length >= MAX_IMAGES}
                        className="flex-1 flex items-center justify-center gap-2 border border-primary text-primary font-semibold py-3 px-2 rounded-xl hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Camera className="w-5 h-5 shrink-0" />
                        <span className="truncate">{t.camera_btn}</span>
                      </button>
                    </div>
                    {/* Delete All Button */}
                    {uploadedImages.length > 1 && (
                      <button
                        onClick={removeAllImages}
                        className="mt-3 w-full flex items-center justify-center gap-2 border border-destructive text-destructive font-semibold py-3 rounded-xl hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                        {t.delete_all}
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <div
                      className="border-2 border-dashed border-primary/40 rounded-2xl p-8 text-center hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer min-h-[200px] flex flex-col items-center justify-center"
                      onClick={() => fileRef.current?.click()}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => { e.preventDefault(); handleFileUpload(e.dataTransfer.files) }}
                    >
                      <Upload className="w-16 h-16 text-primary mx-auto mb-4" />
                      <p className="text-lg font-semibold text-foreground mb-2">{t.upload_hint}</p>
                      <p className="text-sm text-muted-foreground">JPG, PNG ({t.max_photos})</p>
                    </div>
                    <div className="mt-4 flex gap-2 min-w-0">
                      <button
                        onClick={() => fileRef.current?.click()}
                        className="flex-1 min-w-0 flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold text-base py-3 px-2 rounded-2xl hover:opacity-90"
                      >
                        <Upload className="w-5 h-5 shrink-0" />
                        <span className="truncate">{t.upload_btn}</span>
                      </button>
                      <button
                        onClick={() => cameraRef.current?.click()}
                        className="flex-1 min-w-0 flex items-center justify-center gap-2 border-2 border-primary text-primary font-bold text-base py-3 px-2 rounded-2xl hover:bg-primary/10"
                      >
                        <Camera className="w-5 h-5 shrink-0" />
                        <span className="truncate">{t.camera_btn}</span>
                      </button>
                    </div>
                  </>
                )}
                {/* File input for choosing photos */}
                <input 
                  ref={fileRef} 
                  type="file" 
                  accept="image/jpeg,image/png" 
                  multiple
                  className="hidden" 
                  onChange={(e) => { handleFileUpload(e.target.files); e.target.value = "" }} 
                />
                {/* Camera input - uses capture attribute to open camera */}
                <input 
                  ref={cameraRef} 
                  type="file" 
                  accept="image/jpeg,image/png" 
                  capture="environment"
                  className="hidden" 
                  onChange={(e) => { handleFileUpload(e.target.files); e.target.value = "" }} 
                />
              </div>

              {/* Right: Text Input */}
              <div className="bg-card rounded-2xl border border-border p-4 md:p-6 shadow-sm">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <Utensils className="w-6 h-6 text-primary" />
                  {t.text_input_title}
                </h3>
                <p className="text-muted-foreground mb-4">{t.text_input_hint}</p>
                <textarea
                  value={textInput}
                  onChange={(e) => {
                    setTextInput(e.target.value)
                    // Reset analysis whenever text changes so Analyse button reappears
                    if (showCategories || results || apiResultsCache) {
                      setShowCategories(false)
                      setSelectedCategory(null)
                      setResults(null)
                      setApiResultsCache(null)
                      setPreviousOcr("")
                      setNewFiles([])
                    }
                  }}
                  placeholder={t.text_placeholder}
                  className="w-full h-[200px] md:h-[250px] p-4 rounded-xl border border-border bg-background text-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                />
              </div>
            </div>

            {/* Analyse Button */}
            {showAnalyzeButton && (
              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="flex items-center justify-center gap-3 bg-accent text-accent-foreground font-bold text-xl px-12 py-5 rounded-2xl hover:opacity-90 transition-opacity shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="w-7 h-7" />
                  {t.analyze_btn}
                </button>
              </div>
            )}

            {/* AC 1.2.1: Loading indicator — shown below the input area while analysing */}
            {isAnalyzing && (
              <div className="flex flex-col items-center gap-4 py-8">
                <div className="relative w-20 h-20">
                  {/* Outer ring */}
                  <svg className="w-20 h-20 animate-spin" viewBox="0 0 80 80" fill="none">
                    <circle cx="40" cy="40" r="34" stroke="var(--color-primary)" strokeOpacity="0.15" strokeWidth="8" />
                    <circle
                      cx="40" cy="40" r="34"
                      stroke="var(--color-primary)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray="53 160"
                    />
                  </svg>
                </div>
                <p className="text-base font-semibold text-primary">{t.scanning_steps[scanStep]}</p>
              </div>
            )}

            {/* Error display — shown below loading area */}
            {analyzeError && !isAnalyzing && (
              <div className="bg-[var(--risk-high-bg)] border border-red-700/30 rounded-xl px-6 py-4 text-red-700 font-semibold text-base text-center max-w-lg mx-auto">
                <Info className="inline w-5 h-5 mr-2 mb-0.5" />
                {analyzeError}
              </div>
            )}

            {/* AC 1.2.2: Success state — shown briefly after API returns before category picker */}
            {successCount !== null && (
              <div className="flex flex-col items-center gap-3 py-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="w-20 h-20 rounded-full bg-[var(--risk-low-bg)] flex items-center justify-center shadow-md">
                  <CheckCircle className="w-10 h-10 text-[var(--risk-low)]" />
                </div>
                <p className="text-2xl font-extrabold text-[var(--risk-low)]">
                  {successCount > 0
                    ? `${successCount} ${t.success_found}`
                    : t.success_none}
                </p>
                <div className="flex gap-1.5">
                  {[0, 1, 2].map(i => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full bg-primary animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Category Selection */}
            {showCategories && (
              <div className="bg-card rounded-2xl border border-border p-4 md:p-6 shadow-sm">
                <h2 className="text-2xl font-bold mb-2 text-center">{t.select_category}</h2>
                <p className="text-muted-foreground text-center mb-6">{t.select_category_hint}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button
                    onClick={() => handleCategorySelect("appetizer")}
                    className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all"
                  >
                    <Salad className="w-12 h-12 text-primary" />
                    <span className="text-xl font-bold">{t.categories.appetizer}</span>
                  </button>
                  <button
                    onClick={() => handleCategorySelect("main")}
                    className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all"
                  >
                    <Utensils className="w-12 h-12 text-primary" />
                    <span className="text-xl font-bold">{t.categories.main}</span>
                  </button>
                  <button
                    onClick={() => handleCategorySelect("dessert")}
                    className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all"
                  >
                    <Cake className="w-12 h-12 text-primary" />
                    <span className="text-xl font-bold">{t.categories.dessert}</span>
                  </button>
                  <button
                    onClick={() => handleCategorySelect("drink")}
                    className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all"
                  >
                    <GlassWater className="w-12 h-12 text-primary" />
                    <span className="text-xl font-bold">{t.categories.drink}</span>
                  </button>
                </div>
              </div>
            )}

            {/* No Results / Unrecognized Handling */}
            {results && results.length === 0 && (
              <div className="bg-[var(--cb-pink)] border border-[#8b3a62]/30 rounded-2xl p-4 md:p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-[#8b3a62]/10 rounded-full flex items-center justify-center">
                  <Info className="w-8 h-8 text-[#8b3a62]" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-[#8b3a62]">{t.no_results}</h3>
                <p className="text-base text-foreground/80 mb-6">{t.no_results_hint}</p>
                {/* Issue #1: always show both action buttons even when no items in category */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={handleAnalyzeAnother}
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-6 py-3 rounded-xl hover:opacity-90"
                  >
                    <CheckCircle className="w-5 h-5" />
                    {t.analyze_another}
                  </button>
                  <button
                    onClick={clearAll}
                    className="inline-flex items-center gap-2 bg-[#8b3a62] text-white font-bold px-6 py-3 rounded-xl hover:opacity-90"
                  >
                    <Upload className="w-5 h-5" />
                    {t.analyze_new_food}
                  </button>
                </div>
              </div>
            )}

            {/* Results */}
            {results && results.length > 0 && (
              <div>
                <h2 className="text-3xl font-bold mb-3">{t.result_title} - {t.categories[selectedCategory as keyof typeof t.categories]}</h2>
                {/* Legend for risk levels */}
                <div className="flex flex-wrap gap-3 mb-4">
                  {[
                    { bg: "bg-[var(--risk-low-bg)]", text: "text-[var(--risk-low)]", label: t.risk_low, icon: TrendingDown, isHigh: false },
                    { bg: "bg-[var(--risk-medium-bg)]", text: "text-[var(--risk-medium)]", label: t.risk_medium, icon: Minus, isHigh: false },
                    { bg: "bg-[var(--risk-high-bg)]", text: "text-red-700", label: t.risk_high, icon: TrendingUp, isHigh: true },
                  ].map((l) => (
                    <span key={l.label} className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-base ${l.isHigh ? 'font-extrabold' : 'font-semibold'} ${l.bg} ${l.text}`}>
                      <l.icon className="w-5 h-5" />
                      Risk
                    </span>
                  ))}
                </div>
                <div className="bg-muted rounded-xl px-4 py-3 mb-4 flex items-start gap-2 text-sm text-muted-foreground">
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  {t.disclaimer}
                </div>
                {/* Top 3 disclaimer — elderly-friendly, large text */}
                <div className="bg-[var(--risk-low-bg)] border border-[var(--risk-low)]/30 rounded-2xl px-5 py-4 mb-6 flex items-start gap-3">
                  <Star className="w-6 h-6 text-[var(--risk-low)] shrink-0 mt-0.5" />
                  <p className="text-lg font-semibold text-[var(--risk-low)] leading-relaxed">
                    {t.top3_disclaimer}
                  </p>
                </div>
                <div className="space-y-4">
                  {results.map((food, i) => (
                    <FoodResultCard 
                      key={i} 
                      food={food} 
                      isBest={i === 0} 
                      t={t} 
                      lang={lang}
                    />
                  ))}
                </div>
                
                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
                  <button
                    onClick={handleAnalyzeAnother}
                    className="flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold text-lg px-8 py-4 rounded-2xl hover:opacity-90"
                  >
                    <CheckCircle className="w-5 h-5" />
                    {t.analyze_another}
                  </button>
                  <button
                    onClick={clearAll}
                    className="flex items-center justify-center gap-2 border-2 border-border text-foreground font-bold text-lg px-8 py-4 rounded-2xl hover:bg-muted"
                  >
                    <Upload className="w-5 h-5" />
                    {t.analyze_new_food}
                  </button>
                </div>
              </div>
            )}

            {/* Image Modal */}
            {showImageModal && modalImage && (
              <div 
                className="fixed inset-0 bg-foreground/80 z-50 flex items-center justify-center p-4"
                onClick={() => setShowImageModal(false)}
              >
                <div className="relative max-w-4xl w-full max-h-[90vh]">
                  <button
                    onClick={() => setShowImageModal(false)}
                    className="absolute -top-12 right-0 text-background hover:text-muted p-2"
                  >
                    <X className="w-8 h-8" />
                  </button>
                  <div className="relative w-full h-[80vh] rounded-2xl overflow-hidden">
                    <Image 
                      src={modalImage} 
                      alt="Full size meal" 
                      fill 
                      className="object-contain bg-background" 
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      }}
    </PageLayout>
  )
}
