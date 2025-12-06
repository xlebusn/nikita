import type React from "react"
import type { Metadata } from "next"

import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

import { Geist, Geist_Mono } from "next/font/google"

const geistSans = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TG Export - Экспорт участников Telegram групп",
  description:
    "Простой и безопасный способ получить список участников закрытых Telegram групп. Бесплатный экспорт 1 раз в сутки.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ru"
      style={
        {
          "--font-geist-sans": geistSans.style.fontFamily,
          "--font-geist-mono": geistMono.style.fontFamily,
        } as React.CSSProperties
      }
    >
      <body className={`${geistSans.className} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
