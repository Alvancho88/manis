"use client"

import { useEffect, useRef } from "react"
import { PageLayout } from "@/components/page-layout"
import Link from "next/link"
import Image from "next/image"
import { BookOpen, Utensils, Search, MapPin, AlertTriangle, Users, TrendingUp, Heart, Camera } from "lucide-react"

const content = {
  en: {
    hero_tag: "For Malaysian Elderly",
    hero_title: "Prevent Diabetes,\nLive Healthier",
    hero_subtitle: "Learn about diabetes, scan the menu and get personalised recommendations — all in simple, easy-to-read steps.",
    hero_cta: "Get Started",
    hero_secondary: "Learn More",
    stats_title: "Diabetes in Malaysia",
    stats: [
      { value: "1 in 5", label: "Malaysian adults have diabetes", image: "/images/1-in-5.png" },
      { value: "2 in 5", label: "Elderly aged 60+ are affected", icon: Users },
      { value: "4.75M", label: "People living with diabetes.", icon: Heart },
    ],
    prediabetes_title: "The Warning Sign We Cannot Ignore",
    prediabetes_value: "11.6%",
    prediabetes_sublabel: "of Malaysian adults have prediabetes, and it is growing",
    prediabetes_approx: "≈ 2.6 million people",
    prediabetes_bars: [
      { label: "Healthy", value: 67.3, colorClass: "bg-blue-500", textColorClass: "text-blue-700" },
      { label: "Diabetes", value: 21.1, colorClass: "bg-red-500", textColorClass: "text-red-700" },
      { label: "Prediabetes ↑", value: 11.6, colorClass: "bg-amber-500", textColorClass: "text-amber-700", highlight: true },
    ],
    prediabetes_callout_title: "11.6% of us are at a crossroads — and that number is climbing.",
    prediabetes_callout_body: "Prediabetes is your last window of opportunity. With the right steps today, you can stop it from becoming diabetes, but that window will not stay open forever. ",
    prediabetes_cta_hint: "Use the buttons below to start your journey of prevention and learn more about prediabetes and diabetes.",
    features_title: "What Can I Do Here?",
    features: [
      {
        href: "/recommendation",
        icon: Camera,
        color: "bg-primary",
        title: "Recommend Food",
        desc: "Upload a photo of the menu and get an instant food recommendation with health tips.",
      },
      {
        href: "/overview",
        icon: BookOpen,
        color: "bg-primary",
        title: "Learn About Diabetes",
        desc: "Understand what diabetes is, its causes, symptoms and how to prevent it.",
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
      { value: "21.1%", label: "Orang dewasa Malaysia menghidap diabetes", image: "/images/1-in-5.png" },
      { value: "40%", label: "Warga emas berusia 60+ terjejas", icon: TrendingUp },
      { value: "4.75J", label: "Orang hidup dengan diabetes", icon: Heart },
    ],
    prediabetes_title: "Amaran Yang Tidak Boleh Diabaikan",
    prediabetes_value: "11.6%",
    prediabetes_sublabel: "orang dewasa Malaysia menghidap prediabetes — dan semakin meningkat",
    prediabetes_approx: "≈ 2.6 juta orang",
    prediabetes_bars: [
      { label: "Sihat", value: 67.3, colorClass: "bg-blue-500", textColorClass: "text-blue-700" },
      { label: "Diabetes", value: 21.1, colorClass: "bg-red-500", textColorClass: "text-red-700" },
      { label: "Prediabetes ↑", value: 11.6, colorClass: "bg-amber-500", textColorClass: "text-amber-700", highlight: true },
    ],
    prediabetes_callout_title: "11.6% daripada kita berada di persimpangan — dan angka itu semakin meningkat.",
    prediabetes_callout_body: "Prediabetes adalah peluang terakhir anda. Dengan langkah yang betul hari ini, anda boleh menghalangnya daripada menjadi diabetes — tetapi peluang itu tidak akan kekal selamanya.",
    prediabetes_cta_hint: "Gunakan butang di bawah untuk memulakan perjalanan pencegahan anda dan ketahui lebih lanjut tentang prediabetes dan diabetes.",
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
      { value: "21.1%", label: "马来西亚成年人患有糖尿病", image: "/images/1-in-5.png" },
      { value: "40%", label: "60岁以上老年人受影响", icon: TrendingUp },
      { value: "475万", label: "人患有糖尿病", icon: Heart },
    ],
    prediabetes_title: "我们不能忽视的警告信号",
    prediabetes_value: "11.6%",
    prediabetes_sublabel: "的马来西亚成年人患有前驱糖尿病 — 且仍在增加",
    prediabetes_approx: "约 260 万人",
    prediabetes_bars: [
      { label: "健康", value: 67.3, colorClass: "bg-blue-500", textColorClass: "text-blue-700" },
      { label: "糖尿病", value: 21.1, colorClass: "bg-red-500", textColorClass: "text-red-700" },
      { label: "前驱糖尿病 ↑", value: 11.6, colorClass: "bg-amber-500", textColorClass: "text-amber-700", highlight: true },
    ],
    prediabetes_callout_title: "11.6% 的人站在十字路口 — 而这个数字还在攀升。",
    prediabetes_callout_body: "前驱糖尿病是您最后的机会窗口。今天采取正确的步骤，您可以阻止它发展为糖尿病 — 但这个窗口不会永远敞开。",
    prediabetes_cta_hint: "使用下方的按钮，开始您的预防之旅，并进一步了解前驱糖尿病和糖尿病。",
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

// Animated bar component — grows from 0 to target width on mount
function AnimatedBar({ value, colorClass }: { value: number; colorClass: string }) {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = barRef.current
    if (!el) return
    // Start at 0, then animate to target after a short delay so the transition fires
    el.style.width = "0%"
    const timer = setTimeout(() => {
      el.style.width = `${value}%`
    }, 150)
    return () => clearTimeout(timer)
  }, [value])

  return (
    <div ref={barRef} className={`h-full rounded-full ${colorClass} transition-all duration-[1400ms] ease-[cubic-bezier(.4,0,.2,1)]`} style={{ width: "0%" }} />
  )
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
                  <p className="text-lg text-accent-foreground font-medium">
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
                      {stat.image ? (
                        <div className="relative w-35 h-16 mx-auto mb-3">
                          <Image
                            src={stat.image}
                            alt={stat.label}
                            fill
                            className="object-contain"
                          />
                        </div>
                      ) : stat.icon ? (
                        <stat.icon className="w-16 h-16 text-primary mx-auto mb-3" />
                      ) : null}
                      <div className="text-4xl md:text-5xl font-extrabold text-primary mb-2">{stat.value}</div>
                      <div className="text-base md:text-lg text-muted-foreground font-medium">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Prediabetes Prevalence Section */}
            <section className="py-12 md:py-16 bg-background">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-balance">
                  {t.prediabetes_title}
                </h2>
                <div className="bg-card rounded-2xl border border-border shadow-sm p-6 md:p-8">

                  {/* Big number */}
                  <div className="mb-8">
                    <div className="flex items-baseline gap-3 mb-1">
                      <span className="text-5xl md:text-6xl font-extrabold text-amber-600">
                        {t.prediabetes_value}
                      </span>
                      <span className="text-lg md:text-xl text-muted-foreground leading-snug">
                        {t.prediabetes_sublabel}
                      </span>
                    </div>
                    <p className="text-lg text-muted-foreground">{t.prediabetes_approx}</p>
                  </div>

                  {/* Animated bars */}
                  <div className="flex flex-col gap-4 mb-8">
                    {t.prediabetes_bars.map((bar, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-4 bg-background rounded-2xl px-5 py-4 border ${
                          bar.highlight ? "border-amber-400" : "border-border"
                        }`}
                      >
                        <span
                          className={`text-lg w-36 shrink-0 ${
                            bar.highlight ? "font-bold text-amber-700" : "text-muted-foreground"
                          }`}
                        >
                          {bar.label}
                        </span>
                        <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                          <AnimatedBar value={bar.value} colorClass={bar.colorClass} />
                        </div>
                        <span className={`text-lg font-bold w-12 text-right ${bar.textColorClass}`}>
                          {bar.value}%
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Callout text */}
                  <div className="border-l-4 border-amber-400 pl-4 md:pl-5">
                    <p className="text-base md:text-xl font-bold text-foreground mb-1">
                      {t.prediabetes_callout_title}
                    </p>
                    <p className="text-sm md:text-lg text-muted-foreground leading-relaxed">
                      {t.prediabetes_callout_body}
                    </p>
                    
                  </div>

                  <p className="text-lg md:text-lg font-bold">
                      {t.prediabetes_cta_hint}
                  </p>

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
                    <div className="font-bold text-xl mb-1">{t.tip_title}</div>
                    <p className="text-lg md:text-xl">{t.tip}</p>
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
                      <p className="text-lg text-muted-foreground leading-relaxed">{feature.desc}</p>
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
