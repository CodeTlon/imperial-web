'use client'

import { demoConfig } from '@/lib/demo-config'
import { useDemo } from '@/lib/demo-store'

// Textos originales de lo que se edita desde el panel (Contenido).
export const PORTADA_BASE = { descripcion: 'Fixture, posiciones, goleadores y sanciones de las seis categorías, siempre al día.' }
export const REQUISITOS_BASE = [
  'Seña como parte de la inscripción',
  'Lista de buena fe: hasta 25 jugadores',
  'Se completa antes de la segunda fecha',
  'Árbitro y veedor en cada partido',
]

// Configuración del sitio con los cambios hechos desde el panel (Contenido) por encima de demo-config.ts.
export function useSitio() {
  const { datos } = useDemo()
  const c = datos.contenido ?? {}
  const base = demoConfig
  return {
    ...base,
    business: { ...base.business, ...c.contacto },
    portada: { descripcion: c.portada?.descripcion ?? PORTADA_BASE.descripcion },
    requisitos: c.requisitos ?? REQUISITOS_BASE,
    content: { ...base.content, cta: c.cta ?? base.content.cta },
  }
}
