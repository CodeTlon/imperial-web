import type { MetadataRoute } from 'next'

const RUTAS = ['', '/posiciones', '/fixture', '/equipos', '/campeones', '/reglamento', '/sanciones', '/inscripcion']

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://torneoimperial.vercel.app'
  return RUTAS.map((r) => ({ url: `${base}${r}`, changeFrequency: 'weekly', priority: r === '' ? 1 : 0.7 }))
}
