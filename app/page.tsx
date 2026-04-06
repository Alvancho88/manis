"use client"

import { PageLayout } from "@/components/page-layout"
import Link from "next/link"
import Image from "next/image"
import { BookOpen, Utensils, Search, MapPin, AlertTriangle, Users, TrendingUp, Heart, Camera } from "lucide-react"

const content = {
  en: {
    hero_tag: "For Malaysian Elderly",
    hero_title: "Prevent Diabetes,\nLive Healthier",
    hero_subtitle: "Learn about diabetes, check your food, and find nearby clinics — all in simple, easy-to-read steps.",
    hero_cta: "Get Started",
    hero_secondary: "Learn More",
    stats_title: "Diabetes in Malaysia",
    stats: [
      { value: "21.1%", label: "Malaysian adults have diabetes", icon: Users },
      { value: "40%", label: "Elderly aged 60+ affected", icon: TrendingUp },
      { value: "4.75M", label: "People living with diabetes", icon: Heart },
    ],
    features_title: "What Can I Do Here?",
    features: [
      {
        href: "/overview",
        icon: BookOpen,
        color: "bg-primary",
        title: "Learn About Diabetes",
        desc: "Understand what diabetes is, its causes, symptoms and how to prevent it.",
      },
      {
        href: "/recommendation",
        icon: Camera,
        color: "bg-primary",
        title: "Check My Food",
        desc: "Upload a photo of your meal and get instant, simple health advice.",
      },
      {
        href: "/explore",
        icon: Search,
        color: "bg-primary",
        title: "Explore & Discover",
        desc: "Myth vs Fact, body map, and more easy-to-understand diabetes content.",
      },
      {
        href: "/food",
        icon: Utensils,
        color: "bg-primary",
        title: "Browse Malaysian Foods",
        desc: "See sugar levels, calories and health tips for your favourite local foods.",
      },
      {
        href: "/healthcare",
        icon: MapPin,
        color: "bg-primary",
        title: "Find a Clinic",
        desc: "Locate nearby diabetes clinics in your area quickly and easily.",
      },
    ],
    warning_title: "Important Notice",
    warning_text: "This website provides general health information only. It is not a substitute for professional medical advice. Please see a doctor for diagnosis and treatment.",
    tip_title: "Today's Health Tip",
    tip: "Replacing white rice with brown rice can help lower your blood sugar. Try it for one meal today!",
  },
  ms: {
    hero_tag: "Untuk Warga Emas Malaysia",
    hero_title: "Cegah Diabetes,\nHidup Lebih Sihat",
    hero_subtitle: "Pelajari tentang diabetes, semak makanan anda, dan cari klinik berdekatan — semua dalam langkah mudah dibaca.",
    hero_cta: "Mulakan",
    hero_secondary: "Ketahui Lebih Lanjut",
    stats_title: "Diabetes di Malaysia",
    stats: [
      { value: "21.1%", label: "Orang dewasa Malaysia menghidap diabetes", icon: Users },
      { value: "40%", label: "Warga emas berusia 60+ terjejas", icon: TrendingUp },
      { value: "4.75J", label: "Orang hidup dengan diabetes", icon: Heart },
    ],
    features_title: "Apa Yang Boleh Saya Lakukan Di Sini?",
    features: [
      {
        href: "/overview",
        icon: BookOpen,
        color: "bg-primary",
        title: "Pelajari Tentang Diabetes",
        desc: "Faham apa itu diabetes, puncanya, gejala dan cara mencegahnya.",
      },
      {
        href: "/recommendation",
        icon: Camera,
        color: "bg-primary",
        title: "Semak Makanan Saya",
        desc: "Muat naik foto makanan anda dan dapatkan nasihat kesihatan segera.",
      },
      {
        href: "/explore",
        icon: Search,
        color: "bg-primary",
        title: "Terokai & Temukan",
        desc: "Mitos vs Fakta, peta badan dan kandungan diabetes yang mudah difahami.",
      },
      {
        href: "/food",
        icon: Utensils,
        color: "bg-primary",
        title: "Semak Makanan Malaysia",
        desc: "Lihat tahap gula, kalori dan tip kesihatan untuk makanan tempatan kegemaran anda.",
      },
      {
        href: "/healthcare",
        icon: MapPin,
        color: "bg-primary",
        title: "Cari Klinik",
        desc: "Cari klinik diabetes berdekatan di kawasan anda dengan cepat dan mudah.",
      },
    ],
    warning_title: "Notis Penting",
    warning_text: "Laman web ini menyediakan maklumat kesihatan umum sahaja. Ia bukan pengganti nasihat perubatan profesional. Sila berjumpa doktor untuk diagnosis dan rawatan.",
    tip_title: "Tip Kesihatan Hari Ini",
    tip: "Menggantikan nasi putih dengan nasi perang boleh membantu menurunkan gula darah anda. Cuba untuk satu hidangan hari ini!",
  },
  zh: {
    hero_tag: "为马来西亚老年人",
    hero_title: "预防糖尿病，\n健康生活",
    hero_subtitle: "了解糖尿病、检查您的食物、找到附近诊所 — 一切步骤简单清晰。",
    hero_cta: "开始使用",
    hero_secondary: "了解更多",
    stats_title: "马来西亚的糖尿病",
    stats: [
      { value: "21.1%", label: "马来西亚成年人患有糖尿病", icon: Users },
      { value: "40%", label: "60岁以上老年人受影响", icon: TrendingUp },
      { value: "475万", label: "人患有糖尿病", icon: Heart },
    ],
    features_title: "我在这里可以做什么？",
    features: [
      {
        href: "/overview",
        icon: BookOpen,
        color: "bg-primary",
        title: "了解糖尿病",
        desc: "了解什么是糖尿病、其原因、症状及预防方法。",
      },
      {
        href: "/recommendation",
        icon: Camera,
        color: "bg-primary",
        title: "检查我的食物",
        desc: "上传您的餐食照片，获取即时简单的健康建议。",
      },
      {
        href: "/explore",
        icon: Search,
        color: "bg-primary",
        title: "探索与发现",
        desc: "神话vs事实、身体地图以及更多易于理解的糖尿病内容。",
      },
      {
        href: "/food",
        icon: Utensils,
        color: "bg-primary",
        title: "浏览马来西亚食物",
        desc: "查看您最喜欢的本地食物的含糖量、卡路里和健康提示。",
      },
      {
        href: "/healthcare",
        icon: MapPin,
        color: "bg-primary",
        title: "找诊所",
        desc: "快速轻松地找到您附近的糖尿病诊所。",
      },
    ],
    warning_title: "重要通知",
    warning_text: "本网站仅提供一般健康信息。它不能替代专业医疗建议。请看医生进行诊断和治疗。",
    tip_title: "今日健康贴士",
    tip: "用糙米代替白米有助于降低您的血糖。今天试试一餐！",
  },
}

export default function HomePage() {
  return (
    <PageLayout>
      {(lang) => {
        const t = content[lang]
        return (
          <div>
            {/* Hero Section */}
            <section className="relative bg-[var(--cb-cyan)] overflow-hidden">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="text-[var(--cb-blue-text)]">
                    <span className="inline-block bg-primary text-primary-foreground text-base font-semibold px-4 py-1.5 rounded-full mb-4">
                      {t.hero_tag}
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-5 text-balance leading-tight whitespace-pre-line">
                      {t.hero_title}
                    </h1>
                    <p className="text-xl md:text-2xl mb-6 opacity-90 leading-relaxed">
                      {t.hero_subtitle}
                    </p>
                    {/* Image shown only on mobile, above the buttons */}
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-6 md:hidden" style={{ height: "224px" }}>
                      <Image
                        src="/images/hero-elderly.jpg"
                        alt="Elderly Malaysian couple eating healthy food"
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                      <Link
                        href="/recommendation"
                        className="flex-1 bg-primary text-primary-foreground font-bold text-lg px-6 py-4 rounded-2xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 whitespace-nowrap"
                      >
                        <Camera className="w-5 h-5 shrink-0" />
                        {t.hero_cta}
                      </Link>
                      <Link
                        href="/overview"
                        className="flex-1 bg-primary/20 text-primary font-bold text-lg px-6 py-4 rounded-2xl hover:bg-primary/30 transition-colors flex items-center justify-center gap-2 border border-primary/30 whitespace-nowrap"
                      >
                        <BookOpen className="w-5 h-5 shrink-0" />
                        {t.hero_secondary}
                      </Link>
                    </div>
                  </div>
                  {/* Image shown only on desktop */}
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl h-64 md:h-80 lg:h-96 hidden md:block">
                    <Image
                      src="/images/hero-elderly.jpg"
                      alt="Elderly Malaysian couple eating healthy food"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Warning Banner */}
            <section className="bg-accent/20 border-b border-accent/40">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-accent-foreground shrink-0 mt-0.5" />
                  <p className="text-base text-accent-foreground font-medium">
                    <span className="font-bold">{t.warning_title}: </span>
                    {t.warning_text}
                  </p>
                </div>
              </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 md:py-16 bg-card">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-balance">{t.stats_title}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {t.stats.map((stat, i) => (
                    <div key={i} className="bg-background rounded-2xl p-6 text-center border border-border shadow-sm">
                      <stat.icon className="w-10 h-10 text-primary mx-auto mb-3" />
                      <div className="text-4xl md:text-5xl font-extrabold text-primary mb-2">{stat.value}</div>
                      <div className="text-base md:text-lg text-muted-foreground font-medium">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Daily Tip */}
            <section className="py-8 bg-amber-100 border-y-2 border-amber-400/50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-amber-500 rounded-xl flex items-center justify-center shrink-0">
                    <Heart className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-amber-800 text-xl mb-1">{t.tip_title}</div>
                    <p className="text-lg md:text-xl text-amber-900">{t.tip}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Features / Navigation Cards */}
            <section className="py-12 md:py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-balance">{t.features_title}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {t.features.map((feature, i) => (
                    <Link
                      key={i}
                      href={feature.href}
                      className="group bg-card rounded-2xl p-6 border border-border hover:border-primary hover:shadow-md transition-all"
                    >
                      <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <feature.icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
                      <p className="text-base text-muted-foreground leading-relaxed">{feature.desc}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )
      }}
    </PageLayout>
  )
}
