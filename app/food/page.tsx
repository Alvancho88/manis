"use client"

import { PageLayout } from "@/components/page-layout"

const pageContent = {
  en: {
    title: "Browse Malaysian Foods",
    subtitle: "Coming soon in Iteration 2",
  },
  ms: {
    title: "Semak Makanan Malaysia",
    subtitle: "Akan datang dalam Iterasi 2",
  },
  zh: {
    title: "浏览马来西亚食物",
    subtitle: "即将在迭代2中推出",
  },
}

export default function FoodPage() {
  return (
    <PageLayout>
      {(lang) => {
        const t = pageContent[lang]
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-balance">{t.title}</h1>
              <p className="text-xl md:text-2xl text-muted-foreground">{t.subtitle}</p>
            </div>
          </div>
        )
      }}
    </PageLayout>
  )
}
