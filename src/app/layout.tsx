import CardSpotlight from '@/components/ui/CardSpotlight'
import type { Metadata } from 'next'
import { Montserrat, Oswald } from 'next/font/google'
import './globals.css'
import { demoConfig } from '@/lib/demo-config'
import { CategoryProvider } from '@/lib/category-context'
import { DemoProvider } from '@/lib/demo-store'

// Solo las fuentes de la marca (misma tipografía que la app: títulos Oswald, texto Montserrat)
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat', display: 'swap' })
const oswald = Oswald({ subsets: ['latin'], variable: '--font-oswald', display: 'swap' })

const FONT_MAP: Record<string, string> = {
  'Montserrat': '--font-montserrat',
  'Oswald': '--font-oswald',
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://torneoimperial.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${demoConfig.business.name} · Fútbol amateur en Córdoba`, template: `%s · ${demoConfig.business.name}` },
  description: demoConfig.business.tagline,
  openGraph: {
    title: demoConfig.business.name,
    description: demoConfig.business.tagline,
    type: 'website',
    locale: 'es_AR',
    images: [{ url: '/images/hero.jpg', width: 1600, height: 900, alt: demoConfig.business.name }],
  },
  twitter: { card: 'summary_large_image', title: demoConfig.business.name, description: demoConfig.business.tagline },
  robots: { index: true, follow: true },
}

const RADIUS_MAP: Record<string, [string, string]> = {
  sharp: ['0.25rem', '0.5rem'],   // industrial / brutalista
  soft:  ['0.5rem', '0.75rem'],
  round: ['9999px', '1.5rem'],    // pill: botones/chips/tabs quedan 100% redondeados,
                                   // cards e imágenes con esquinas bien curvas (no cápsula)
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { brand, style } = demoConfig
  const headingFontVar = FONT_MAP[brand.headingFont] ?? '--font-montserrat'
  const bodyFontVar = FONT_MAP[brand.bodyFont] ?? '--font-montserrat'
  const [radius, radiusLg] = RADIUS_MAP[style.radius] ?? RADIUS_MAP.round

  const cssVars = {
    '--demo-bg': brand.background,
    '--demo-surface': brand.surface,
    '--demo-surface-alt': brand.surfaceAlt,
    '--demo-heading': brand.heading,
    '--demo-text': brand.text,
    '--demo-muted': brand.muted,
    '--demo-border': brand.border,
    '--demo-accent': brand.accent,
    '--demo-on-accent': brand.onAccent,
    '--demo-structural': brand.structural,
    '--demo-on-structural': brand.onStructural,
    '--demo-font-heading': `var(${headingFontVar})`,
    '--demo-font': `var(${bodyFontVar})`,
    '--demo-radius': radius,
    '--demo-radius-lg': radiusLg,
  } as React.CSSProperties

  const allFontVars = [montserrat.variable, oswald.variable].join(' ')

  return (
    <html lang="es" className={allFontVars} data-cards={style.cards}>
      <body style={cssVars}>
        <CardSpotlight />
        <CategoryProvider><DemoProvider>{children}</DemoProvider></CategoryProvider>
      </body>
    </html>
  )
}
