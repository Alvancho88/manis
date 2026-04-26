"use client"

import { PageLayout } from "@/components/page-layout"
import { useState } from "react"
import Image from "next/image"
import { Search, X, TrendingDown, TrendingUp, Minus, Info, AlertTriangle, ChevronDown } from "lucide-react"

type LangCode = "en" | "ms" | "zh"

const categories = {
  en: ["All", "Malaysian", "Chinese", "American", "Indian", "Desserts", "Drinks", "Fruits"],
  ms: ["Semua", "Malaysia", "Cina", "Amerika", "India", "Pencuci Mulut", "Minuman", "Buah-buahan"],
  zh: ["全部", "马来菜", "中餐", "美式", "印度菜", "甜点", "饮料", "水果"],
}

const allFoods = [
  { name: "Nasi Lemak", category: "Malaysian", risk: "medium", image: "/images/food-nasi-lemak.jpg", calories: "644", sugar: "8g", gi: "64", portion: "1 plate (350g)", tip: { en: "Enjoy in smaller portions, less sambal.", ms: "Nikmati dalam bahagian lebih kecil, kurang sambal.", zh: "少量食用，减少参巴酱。" } },
  { name: "Roti Canai", category: "Malaysian", risk: "high", image: "/images/food-roti-canai.jpg", calories: "301", sugar: "4g", gi: "82", portion: "1 plate (350g)", tip: { en: "High GI, eat less. Choose dhal over curry.", ms: "GI tinggi, makan lebih sedikit. Pilih dhal berbanding kari.", zh: "高GI，少吃。选扁豆而非咖喱。" } },
  { name: "Chicken Rice", category: "Chinese", risk: "medium", image: "/images/food-brown-rice.jpg", calories: "702", sugar: "6g", gi: "65", portion: "1 plate (350g)", tip: { en: "Choose steamed chicken over roasted. Ask for less rice.", ms: "Pilih ayam kukus berbanding panggang. Minta kurang nasi.", zh: "选择清蒸鸡而非烤鸡。少要点米饭。" } },
  { name: "Mee Goreng", category: "Malaysian", risk: "medium", image: "/images/food-mee-goreng.jpg", calories: "660", sugar: "5g", gi: "60", portion: "1 plate (350g)", tip: { en: "Add more vegetables, request less oil when ordering.", ms: "Tambah lebih banyak sayuran, minta kurang minyak.", zh: "多加蔬菜，点餐时要求少油。" } },
  { name: "Cendol", category: "Desserts", risk: "high", image: "/images/food-cendol.jpg", calories: "380", sugar: "42g", gi: "78", portion: "1 plate (350g)", tip: { en: "Very high sugar. Avoid or limit to a few spoonfuls only.", ms: "Gula sangat tinggi. Elakkan atau hadkan kepada beberapa sudu sahaja.", zh: "含糖量极高。避免食用或只吃几勺。" } },
  { name: "Apam Balik", category: "Desserts", risk: "high", image: "/images/food-roti-canai.jpg", calories: "320", sugar: "28g", gi: "75", portion: "1 plate (350g)", tip: { en: "High sugar from filling. Share with others or eat half only.", ms: "Gula tinggi dari inti. Kongsi dengan orang lain atau makan separuh sahaja.", zh: "馅料含糖量高。与他人分享或只吃一半。" } },
]

const pageContent = {
  en: {
    title: "Search Food",
    subtitle: "Browse common Malaysian foods and see their sugar, calorie and GI levels.",
    search_placeholder: "Search Food here...",
    no_results: "No foods found. Try a different search.",
    risk_low: "Low Risk",
    risk_medium: "Medium Risk",
    risk_high: "High Risk",
    nutrition_sugar: "Sugar",
    nutrition_cal: "Calories",
    nutrition_gi: "GI",
    portion: "Serving",
    tip_label: "Health Tip",
    close: "Close",
    daily_sugar: "Daily Sugar Limit: Women < 25g · Men < 36g",
    legend_title: "Risk Level Guide:",
    disclaimer: "Disclaimer",
    disclaimer_text: "This information is for educational purposes only and should not replace professional medical advice. Please consult a healthcare provider for personalized dietary guidance.",
    health_tips: "Health Tips",
  },
  ms: {
    title: "Cari Makanan",
    subtitle: "Semak makanan Malaysia biasa dan lihat tahap gula, kalori dan GI.",
    search_placeholder: "Cari makanan di sini...",
    no_results: "Tiada makanan dijumpai. Cuba carian lain.",
    risk_low: "Risiko Rendah",
    risk_medium: "Risiko Sederhana",
    risk_high: "Risiko Tinggi",
    nutrition_sugar: "Gula",
    nutrition_cal: "Kalori",
    nutrition_gi: "GI",
    portion: "Sajian",
    tip_label: "Tip Kesihatan",
    close: "Tutup",
    daily_sugar: "Had Gula Harian: Wanita < 25g · Lelaki < 36g",
    legend_title: "Panduan Tahap Risiko:",
  },
  zh: {
    title: "搜索食物",
    subtitle: "浏览常见的马来西亚食物，查看其糖分、卡路里和GI水平。",
    search_placeholder: "在这里搜索食物...",
    no_results: "未找到食物。请尝试不同的搜索。",
    risk_low: "低风险",
    risk_medium: "中等风险",
    risk_high: "高风险",
    nutrition_sugar: "糖分",
    nutrition_cal: "卡路里",
    nutrition_gi: "GI指数",
    portion: "份量",
    tip_label: "健康提示",
    close: "关闭",
    daily_sugar: "每日糖分限制：女性 < 25g · 男性 < 36g",
    legend_title: "风险等级指南：",
  },
}

function getRiskConfig(risk: string, t: typeof pageContent.en) {
  return {
    low: { label: t.risk_low, icon: TrendingDown, bg: "bg-primary/10", text: "text-primary", border: "border-primary/30" },
    medium: { label: t.risk_medium, icon: Minus, bg: "bg-accent/20", text: "text-accent-foreground", border: "border-accent/40" },
    high: { label: t.risk_high, icon: TrendingUp, bg: "bg-foreground/10", text: "text-foreground", border: "border-foreground/30" },
  }[risk] || { label: "", icon: Minus, bg: "", text: "", border: "" }
}

function FoodCard({ food, t, lang }: { food: typeof allFoods[0]; t: typeof pageContent.en; lang: LangCode }) {
  const [open, setOpen] = useState(false)
  const rc = getRiskConfig(food.risk, t)
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-card rounded-2xl border border-border overflow-hidden hover:border-primary hover:shadow-md transition-all text-left group"
      >
        <div className="relative h-40 w-full">
          <Image src={food.image} alt={food.name} fill className="object-cover group-hover:scale-105 transition-transform" />
          <div className="absolute top-2 right-2">
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold border ${rc.bg} ${rc.text} ${rc.border}`}>
              <rc.icon className="w-3 h-3" />
              {rc.label}
            </span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{food.name}</h3>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="bg-muted rounded-lg px-2 py-1.5 text-center">
              <div className="font-bold text-foreground">{food.sugar}</div>
              <div className="text-muted-foreground text-xs">{t.nutrition_sugar}</div>
            </div>
            <div className="bg-muted rounded-lg px-2 py-1.5 text-center">
              <div className="font-bold text-foreground">{food.calories}</div>
              <div className="text-muted-foreground text-xs">{t.nutrition_cal}</div>
            </div>
            <div className="bg-muted rounded-lg px-2 py-1.5 text-center">
              <div className="font-bold text-foreground">{food.gi}</div>
              <div className="text-muted-foreground text-xs">{t.nutrition_gi}</div>
            </div>
          </div>
        </div>
      </button>

      {/* Detail Modal */}
      {open && (
        <div className="fixed inset-0 bg-foreground/50 z-50 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="bg-card rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="relative h-52 w-full">
              <Image src={food.image} alt={food.name} fill className="object-cover" />
              <button
                onClick={() => setOpen(false)}
                className="absolute top-3 right-3 w-11 h-11 bg-card rounded-xl flex items-center justify-center border border-border shadow"
                aria-label={t.close}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-2xl font-bold">{food.name}</h3>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold border ${rc.bg} ${rc.text} ${rc.border}`}>
                  <rc.icon className="w-4 h-4" />
                  {rc.label}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{t.portion}: {food.portion}</p>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: t.nutrition_sugar, value: food.sugar },
                  { label: t.nutrition_cal, value: food.calories + " kcal" },
                  { label: t.nutrition_gi, value: food.gi },
                ].map((item) => (
                  <div key={item.label} className="bg-muted rounded-xl p-3 text-center">
                    <div className="text-xl font-bold text-primary">{item.value}</div>
                    <div className="text-xs text-muted-foreground mt-1">{item.label}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground text-center mb-3 border border-border rounded-lg px-3 py-2">{t.daily_sugar}</p>
              <div className="bg-primary/10 rounded-xl p-3 flex gap-2">
                <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-foreground"><span className="font-bold">{t.tip_label}:</span> {food.tip[lang] || food.tip.en}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default function FoodPage() {
  return (
    <PageLayout>
      {(lang) => {
        const t = pageContent[lang]
        const cats = categories[lang]
        const [search, setSearch] = useState("")
        const [activeCat, setActiveCat] = useState(0)

        const filtered = allFoods.filter((f) => {
          const catMatch = activeCat === 0 || f.category === categories.en[activeCat]
          const searchMatch = !search || f.name.toLowerCase().includes(search.toLowerCase())
          return catMatch && searchMatch
        })

        return (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14 space-y-8">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-balance">{t.title}</h1>
              <p className="text-xl md:text-2xl text-muted-foreground">{t.subtitle}</p>
            </div>

            {/* Legend */}
            <div className="bg-card rounded-2xl border border-border p-4 flex flex-wrap items-center gap-4">
              <span className="font-bold text-base">{t.legend_title}</span>
              {[
                { risk: "low", label: t.risk_low, icon: TrendingDown, bg: "bg-primary/10", text: "text-primary" },
                { risk: "medium", label: t.risk_medium, icon: Minus, bg: "bg-accent/20", text: "text-accent-foreground" },
                { risk: "high", label: t.risk_high, icon: TrendingUp, bg: "bg-foreground/10", text: "text-foreground" },
              ].map((l) => (
                <span key={l.risk} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${l.bg} ${l.text}`}>
                  <l.icon className="w-4 h-4" />
                  {l.label}
                </span>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="search"
                placeholder={t.search_placeholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg rounded-2xl border-2 border-border focus:border-primary focus:outline-none bg-card"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {cats.map((cat, i) => (
                <button
                  key={i}
                  onClick={() => setActiveCat(i)}
                  className={`px-4 py-2 rounded-2xl text-base font-semibold transition-colors border-2 ${
                    activeCat === i
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-foreground border-border hover:border-primary/50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Food Grid */}
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground text-xl">{t.no_results}</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* {filtered.map((food, i) => (
                  <FoodCard key={i} food={food} t={t} lang={lang} />
                ))} */}
              </div>
            )}
          </div>
        )
      }}
    </PageLayout>
  )
}
