'use client'

import Image from 'next/image'
import { Clock, MapPin } from 'lucide-react'
import { escudoPorEquipo, type Partido } from '@/lib/torneo-data'
import { useMiEquipo } from '@/lib/mi-equipo'

const iniciales = (n: string) =>
  n.split(' ').filter((w) => w[0] === w[0].toUpperCase()).slice(0, 2).map((w) => w[0]).join('')

export function Escudo({ nombre, size = 44 }: { nombre: string; size?: number }) {
  const escudo = escudoPorEquipo[nombre]
  if (escudo) {
    return <span className="relative flex-shrink-0" style={{ width: size, height: size }}><Image src={escudo} alt="" fill className="object-contain" /></span>
  }
  return (
    <span
      className="rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
      style={{ width: size, height: size, backgroundColor: 'var(--demo-accent)', color: 'var(--demo-on-accent)' }}
    >
      {iniciales(nombre)}
    </span>
  )
}

// Tarjeta de partido única (home y /fixture). Si ya se jugó, el ganador va en negrita y el perdedor
// atenuado; si no, "VS". Cada equipo tiene ☆ para marcarlo como "mi equipo".
export default function MatchCard({ p, categoria }: { p: Partido; categoria: string }) {
  const { esFavorito, alternar } = useMiEquipo()
  const jugado = p.golesLocal !== undefined && p.golesVisitante !== undefined
  const gana = (lado: 'l' | 'v') =>
    jugado && (lado === 'l' ? p.golesLocal! > p.golesVisitante! : p.golesVisitante! > p.golesLocal!)
  const pierde = (lado: 'l' | 'v') =>
    jugado && (lado === 'l' ? p.golesLocal! < p.golesVisitante! : p.golesVisitante! < p.golesLocal!)

  const Lado = ({ nombre, lado }: { nombre: string; lado: 'l' | 'v' }) => {
    const fav = esFavorito(nombre, categoria)
    return (
      <div className="flex-1 flex flex-col items-center gap-1.5 min-w-0" style={{ opacity: pierde(lado) ? 0.55 : 1 }}>
        <Escudo nombre={nombre} />
        <p className={`text-xs sm:text-sm text-center ${gana(lado) ? 'font-extrabold' : 'font-semibold'}`} style={{ color: 'var(--demo-heading)' }}>{nombre}</p>
        <button
          type="button"
          onClick={() => alternar(nombre, categoria)}
          aria-pressed={fav}
          aria-label={fav ? `Quitar ${nombre} de mi equipo` : `Marcar ${nombre} como mi equipo`}
          className="text-base leading-none transition-transform active:scale-125"
          style={{ color: fav ? 'var(--demo-accent)' : 'var(--demo-muted)' }}
        >
          {fav ? '★' : '☆'}
        </button>
      </div>
    )
  }

  return (
    <div className="card !p-4">
      <div className="flex flex-wrap items-center justify-center gap-3 mb-3 text-xs font-semibold" style={{ color: 'var(--demo-muted)' }}>
        {p.zona && <span>Zona {p.zona}</span>}
        <span className="inline-flex items-center gap-1.5"><Clock size={13} style={{ color: 'var(--demo-accent)' }} /> {p.hora}</span>
        {p.cancha && <span className="inline-flex items-center gap-1.5"><MapPin size={13} style={{ color: 'var(--demo-accent)' }} /> {p.cancha}</span>}
      </div>
      <div className="flex items-start justify-between gap-2">
        <Lado nombre={p.local} lado="l" />
        <div
          className={`flex-shrink-0 mt-2 font-heading tabular-nums ${jugado ? 'text-3xl sm:text-4xl px-3 py-1' : 'text-lg'}`}
          style={jugado
            ? { backgroundColor: 'var(--demo-structural)', color: 'var(--demo-on-structural)', borderRadius: 'var(--demo-radius)' }
            : { color: 'var(--demo-muted)' }}
        >
          {jugado ? `${p.golesLocal} - ${p.golesVisitante}` : 'VS'}
        </div>
        <Lado nombre={p.visitante} lado="v" />
      </div>
    </div>
  )
}
