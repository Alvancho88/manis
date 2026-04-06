import type { Metadata } from 'next'
import { Noto_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const notoSans = Noto_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'MANIS - Modern Analytics & Nutrition Interactive System',
  description: 'MANIS helps Malaysian elderly understand and manage their sugar intake for diabetes prevention. Sistem Interaktif Analitik & Pemakanan Moden untuk warga emas Malaysia. 面向马来西亚老年人的现代分析与营养互动系统。',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ms">
      <body className={`${notoSans.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
