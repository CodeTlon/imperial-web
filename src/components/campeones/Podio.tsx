'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Trophy } from 'lucide-react'
import { escudoPorEquipo } from '@/lib/torneo-data'
import type { CampeonEntry } from '@/lib/campeones-data'

const COPA: Record<CampeonEntry['copa'], { color: string; fondo: string }> = {
  Oro: { color: '#f3a21c', fondo: 'rgba(243,162,28,0.10)' },
  Plata: { color: '#9aa3ad', fondo: 'rgba(154,163,173,0.12)' },
  Bronce: { color: '#b86f3a', fondo: 'rgba(184,111,58,0.10)' },
}

const norm = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/\bfc\b/g, '').replace(/[^a-z0-9+]+/g, ' ').trim()

// Escudos reales (hoy solo +30): se busca por nombre dentro de la misma categoría.
const ESCUDOS = new Map<string, string>(
  Object.entries(escudoPorEquipo).map(([nombre, src]) => [norm(nombre), src as string])
)
const escudoDe = (equipo: string, categoria: string) => ESCUDOS.get(norm(`${equipo} ${categoria}`))

function iniciales(n: string) {
  const p = n.replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).filter(Boolean)
  return (p.length > 1 ? p[0][0] + p[1][0] : (p[0] ?? '?').slice(0, 2)).toUpperCase()
}

function Escudo({ nombre, categoria, size }: { nombre: string; categoria: string; size: number }) {
  const src = escudoDe(nombre, categoria)
  const [roto, setRoto] = useState(false)
  if (src && !roto) {
    return (
      <span className="relative block shrink-0 rounded-full bg-white overflow-hidden ring-2 ring-white/80 shadow-md"
        style={{ width: size, height: size }}>
        <Image src={src} alt={`Escudo de ${nombre}`} fill sizes={`${size}px`} className="object-contain p-1" onError={() => setRoto(true)} />
      </span>
    )
  }
  return (
    <span aria-hidden className="shrink-0 rounded-full flex items-center justify-center text-white font-bold ring-2 ring-white/80 shadow-md"
      style={{ width: size, height: size, fontSize: size * 0.34, background: 'linear-gradient(135deg,#0494a4,#062f36)', fontFamily: 'var(--demo-font-heading)' }}>
      {iniciales(nombre)}
    </span>
  )
}

type Puesto = { pos: 1 | 2 | 3; equipo: string; alto: string }

export default function Podio({ item }: { item: CampeonEntry }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visto, setVisto] = useState(false)
  const copa = COPA[item.copa]

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') { setVisto(true); return }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisto(true); io.disconnect() } }, { threshold: 0.2 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const puestos: Puesto[] = [
    { pos: 2, equipo: item.subcampeon, alto: 'h-16 sm:h-20' },
    { pos: 1, equipo: item.campeon, alto: 'h-24 sm:h-32' },
    ...(item.tercero ? [{ pos: 3 as const, equipo: item.tercero, alto: 'h-12 sm:h-14' }] : []),
  ]
  const medalla: Record<number, string> = { 1: copa.color, 2: '#9aa3ad', 3: '#b86f3a' }

  return (
    <section className="w-full rounded-2xl overflow-hidden border" style={{ borderColor: 'var(--demo-border)', background: 'var(--demo-surface)' }}>
      <style>{`
        @keyframes podio-sube { from { transform: scaleY(0); opacity: .4 } to { transform: scaleY(1); opacity: 1 } }
        @keyframes podio-aparece { from { transform: translateY(14px); opacity: 0 } to { transform: none; opacity: 1 } }
        .podio-escalon { transform-origin: bottom; transform: scaleY(0); }
        .podio-eq { opacity: 0; }
        .podio-on .podio-escalon { animation: podio-sube .6s cubic-bezier(.2,.8,.2,1) forwards; }
        .podio-on .podio-eq { animation: podio-aparece .5s ease-out forwards; }
        @media (prefers-reduced-motion: reduce) {
          .podio-escalon { transform: none; animation: none !important }
          .podio-eq { opacity: 1; animation: none !important }
        }
      `}</style>

      <header className="flex items-center gap-3 px-4 sm:px-6 py-3.5" style={{ background: 'linear-gradient(90deg,#062f36,#04707c)' }}>
        <Trophy size={22} style={{ color: copa.color }} aria-hidden />
        <h2 className="text-white text-lg sm:text-2xl uppercase tracking-wide leading-none" style={{ fontFamily: 'var(--demo-font-heading)', fontWeight: 600 }}>
          {item.categoria}
        </h2>
        <span className="ml-auto text-[11px] sm:text-xs font-bold uppercase tracking-widest rounded-full px-3 py-1"
          style={{ color: item.copa === 'Plata' ? '#d5dae0' : item.copa === 'Bronce' ? '#e0a074' : copa.color, background: 'rgba(255,255,255,0.1)', border: '1px solid currentColor' }}>
          Copa {item.copa}
        </span>
      </header>

      <div ref={ref} className={`px-2 sm:px-8 pt-8 ${visto ? 'podio-on' : ''}`} style={{ background: `linear-gradient(180deg, ${copa.fondo}, transparent 70%)` }}>
        <div className={`mx-auto max-w-3xl grid grid-cols-3 items-end gap-1.5 sm:gap-3`}>
          {puestos.map((p, i) => {
            const campeon = p.pos === 1
            return (
              <div key={p.pos} className="flex flex-col items-center min-w-0">
                <div className="podio-eq flex flex-col items-center text-center w-full px-0.5 pb-3 min-w-0" style={{ animationDelay: `${0.25 + i * 0.12}s` }}>
                  {campeon && <Trophy size={22} className="mb-1" style={{ color: copa.color }} aria-hidden />}
                  <div className="sm:hidden"><Escudo nombre={p.equipo} categoria={item.categoria} size={campeon ? 60 : 46} /></div>
                  <div className="hidden sm:block"><Escudo nombre={p.equipo} categoria={item.categoria} size={campeon ? 96 : 72} /></div>
                  <p className={`mt-2 w-full leading-tight line-clamp-2 break-words ${campeon ? 'text-[13px] sm:text-xl font-bold' : 'text-xs sm:text-base font-semibold'}`}
                    style={{ color: 'var(--demo-heading)', fontFamily: 'var(--demo-font-heading)' }} title={p.equipo}>
                    {p.equipo}
                  </p>
                  <p className="text-[10px] sm:text-xs uppercase tracking-wider mt-0.5" style={{ color: 'var(--demo-muted)' }}>
                    {p.pos === 1 ? 'Campeón' : p.pos === 2 ? 'Subcampeón' : 'Tercero'}
                  </p>
                </div>
                <div className={`podio-escalon ${p.alto} w-full rounded-t-lg flex items-start justify-center pt-2`}
                  style={{ background: `linear-gradient(180deg, ${medalla[p.pos]}, ${medalla[p.pos]}99)`, animationDelay: `${i * 0.12}s`,
                    boxShadow: 'inset 0 2px 0 rgba(255,255,255,.35)' }}>
                  <span className="text-white text-2xl sm:text-4xl font-bold leading-none drop-shadow" style={{ fontFamily: 'var(--demo-font-heading)' }}>{p.pos}°</span>
                </div>
              </div>
            )
          })}
          {!item.tercero && <div aria-hidden />}
        </div>
      </div>
    </section>
  )
}
