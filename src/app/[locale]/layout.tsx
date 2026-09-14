import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Mundial 2026 - México, Estados Unidos, Canadá",
  description: "Sitio oficial del Mundial de Fútbol 2026. Fixture, resultados, estadísticas, selecciones, jugadores y más.",
  keywords: ["Mundial 2026", "World Cup 2026", "Fútbol", "México", "Estados Unidos", "Canadá"],
}

export default async function LocaleLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const messages = await getMessages()
  const currentYear = new Date().getFullYear()

  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} scroll-smooth`}>
      <body className="min-h-screen antialiased font-sans bg-gradient-to-b from-slate-950 to-blue-950 text-slate-100">
        <NextIntlClientProvider messages={messages}>
          {children}
          <footer className="py-6 text-center text-sm opacity-70">
            © {currentYear} Mundial 2026 - Proyecto de Mauricio Nieva
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}