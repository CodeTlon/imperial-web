import Image from 'next/image'
import { escudoPorEquipo } from '@/lib/torneo-data'

const STOP = new Set(['fc', 'de', 'del', 'la', 'las', 'los', 'el', 'y', 'dep', 'atl', 'club', 'fem', 'libre'])
// "Las Imperiales FEM" -> "LI", "Colorado +40" -> "CO". Sirve de respaldo cuando un equipo no tiene escudo.
export function inicialesDe(nombre: string) {
  const base = nombre.replace(/\s(\+\d+|Libre|FEM|Femenino)$/i, '')
  const pal = base.split(/[\s.]+/).filter((p) => p && !STOP.has(p.toLowerCase()) && !p.startsWith('+'))
  const p = pal.length ? pal : [base]
  return (p.length > 1 ? p[0][0] + p[1][0] : p[0].slice(0, 2)).toUpperCase()
}

// Escudo de un equipo por su nombre (los 100 equipos tienen uno). Decorativo: el nombre siempre se escribe al lado.
export function Escudo({ equipo, size = 24, className = '' }: { equipo: string; size?: number; className?: string }) {
  const src = escudoPorEquipo[equipo]
  if (src) {
    return (
      <span className={`relative inline-block shrink-0 ${className}`} style={{ width: size, height: size }} aria-hidden>
        <Image src={src} alt="" fill sizes={`${Math.ceil(size)}px`} className="object-contain" />
      </span>
    )
  }
  return (
    <span aria-hidden className={`inline-flex shrink-0 items-center justify-center rounded-full font-bold text-white ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.36, background: 'linear-gradient(135deg,#0494a4,#062f36)', fontFamily: 'var(--demo-font-heading, inherit)' }}>
      {inicialesDe(equipo)}
    </span>
  )
}

// Escudo + nombre en una línea. `negrita` y `className` ajustan el texto.
export function Equipo({ equipo, size = 22, className = '', negrita = false }: { equipo: string; size?: number; className?: string; negrita?: boolean }) {
  return (
    <span className={`inline-flex min-w-0 items-center gap-2 ${className}`}>
      <Escudo equipo={equipo} size={size} />
      <span className={`min-w-0 truncate ${negrita ? 'font-bold' : ''}`}>{equipo}</span>
    </span>
  )
}
