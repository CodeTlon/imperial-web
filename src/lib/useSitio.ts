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
export const PREGUNTAS_BASE = [
  { question: '¿Cuántos jugadores puede tener mi equipo?', answer: 'La lista de buena fe es de hasta 25 jugadores por equipo.' },
  { question: '¿Hasta cuándo puedo completar la lista?', answer: 'Se completa antes de la segunda fecha del torneo.' },
  { question: '¿Cómo cargo a los jugadores?', answer: 'Una vez inscripto, el delegado ingresa a su panel y carga a cada jugador con su DNI (frente y dorso) y su foto. La organización revisa la documentación.' },
  { question: '¿Quién dirige los partidos?', answer: 'Cada partido cuenta con árbitro y veedor.' },
  { question: '¿Cómo se paga la seña?', answer: 'La seña es parte de la inscripción. Cuando te contactemos por WhatsApp te indicamos cómo abonarla.' },
  { question: '¿Dónde se juega?', answer: 'En el predio de Colectora Variante Juárez Celman 500, Córdoba.' },
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
    preguntas: c.faq ?? PREGUNTAS_BASE,
    content: { ...base.content, cta: c.cta ?? base.content.cta },
  }
}
