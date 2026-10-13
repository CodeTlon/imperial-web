'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CalendarDays, Clock, MapPin, Trophy, ArrowRight } from 'lucide-react'
import CategoryTabs from '@/components/ui/CategoryTabs'
import {
  categoriasConDatos, fixturePorCategoria, proximaFechaDe, escudoPorEquipo, posiciones, goleadores,
  type Categoria,
} from '@/lib/torneo-data'
import { useCategoria } from '@/lib/category-context'
import { useDemo } from '@/lib/demo-store'
import { aplicarAFecha, aplicarGoles, aplicarResultados } from '@/lib/aplicar-datos'

const iniciales = (n: string) =>
  n.split(' ').filter((w) => w[0] === w[0].toUpperCase()).slice(0, 2).map((w) => w[0]).join('')

function Escudo({ nombre, size = 44 }: { nombre: string; size?: number }) {
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

// Info del torneo en el home: primero el fixture (con el selector de categoría arriba),
// debajo las posiciones y al costado los goleadores.
export default function TorneoHome() {
  const { categoria: cat, setCategoria } = useCategoria()
  const { datos } = useDemo()
  const [numero, setNumero] = useState(proximaFechaDe(cat).numero)
  useEffect(() => setNumero(proximaFechaDe(cat).numero), [cat])

  const fechas = fixturePorCategoria[cat]
  const fecha = aplicarAFecha(fechas.find((f) => f.numero === numero) ?? fechas[0], datos.resultados, cat)
  const tabla = aplicarResultados(posiciones[cat], datos.resultados, cat)
  const top = aplicarGoles(goleadores[cat], datos.goleadores, cat).slice(0, 5)
  const zonas = Array.from(new Set(tabla.map((e) => e.zona).filter(Boolean))) as string[]

  return (
    <section id="torneo" className="section-pad scroll-mt-16" style={{ backgroundColor: 'var(--demo-bg)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <p className="eyebrow">Clausura 2026</p>
          <h2 className="section-title">El torneo</h2>
        </div>

        <CategoryTabs options={categoriasConDatos} value={cat} onChange={(c) => setCategoria(c as Categoria)} />

        {/* Fixture */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-5">
            <h3 className="font-bold text-xl flex items-center justify-center gap-2" style={{ color: 'var(--demo-heading)' }}>
              <CalendarDays size={20} style={{ color: 'var(--demo-accent)' }} />
              {fecha.partidos.some((p) => p.golesLocal === undefined) ? 'El sábado que viene' : `Fecha ${fecha.numero}`}
            </h3>
            <p className="text-sm uppercase tracking-wide mt-1" style={{ color: 'var(--demo-muted)' }}>Fecha {fecha.numero} · {fecha.fechaLabel}</p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {fechas.map((f) => (
              <button
                key={f.numero}
                onClick={() => setNumero(f.numero)}
                aria-label={`Fecha ${f.numero}`}
                className="w-9 h-9 rounded-full text-sm font-bold transition-colors"
                style={{
                  backgroundColor: numero === f.numero ? 'var(--demo-accent)' : 'var(--demo-surface-alt)',
                  color: numero === f.numero ? 'var(--demo-on-accent)' : 'var(--demo-text)',
                  border: `1px solid ${numero === f.numero ? 'var(--demo-accent)' : 'var(--demo-border)'}`,
                }}
              >
                {f.numero}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {fecha.partidos.map((p, i) => {
              const jugado = p.golesLocal !== undefined && p.golesVisitante !== undefined
              return (
                <div key={i} className="card !p-4">
                  <div className="flex flex-wrap items-center justify-center gap-3 mb-3 text-xs font-semibold" style={{ color: 'var(--demo-muted)' }}>
                    {p.zona && <span>Zona {p.zona}</span>}
                    <span className="inline-flex items-center gap-1.5"><Clock size={13} style={{ color: 'var(--demo-accent)' }} /> {p.hora}</span>
                    {p.cancha && <span className="inline-flex items-center gap-1.5"><MapPin size={13} style={{ color: 'var(--demo-accent)' }} /> {p.cancha}</span>}
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 flex flex-col items-center gap-1.5 min-w-0">
                      <Escudo nombre={p.local} />
                      <p className="text-xs sm:text-sm font-semibold text-center" style={{ color: 'var(--demo-heading)' }}>{p.local}</p>
                    </div>
                    <div
                      className={`flex-shrink-0 font-heading tabular-nums ${jugado ? 'text-3xl sm:text-4xl px-3 py-1' : 'text-lg'}`}
                      style={jugado
                        ? { backgroundColor: 'var(--demo-structural)', color: 'var(--demo-on-structural)', borderRadius: 'var(--demo-radius)' }
                        : { color: 'var(--demo-muted)' }}
                    >
                      {jugado ? `${p.golesLocal} - ${p.golesVisitante}` : 'VS'}
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-1.5 min-w-0">
                      <Escudo nombre={p.visitante} />
                      <p className="text-xs sm:text-sm font-semibold text-center" style={{ color: 'var(--demo-heading)' }}>{p.visitante}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="text-center mt-5">
            <Link href="/fixture" className="inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: 'var(--demo-heading)' }}>
              Fixture completo <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Posiciones + goleadores */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-16">
          <div className="lg:col-span-2 space-y-6 min-w-0">
            {(zonas.length ? zonas : [null]).map((z) => {
              const filas = z ? tabla.filter((e) => e.zona === z) : tabla
              return (
                <div key={z ?? 'u'} className="card overflow-x-auto">
                  <p className="eyebrow !mb-3">Posiciones{z ? ` · Zona ${z}` : ''} · {cat}</p>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left border-b" style={{ borderColor: 'var(--demo-border)' }}>
                        {['#', 'Equipo', 'PJ', 'DG', 'Pts'].map((h) => (
                          <th key={h} className="py-2 px-2 font-semibold uppercase text-xs tracking-wider" style={{ color: 'var(--demo-muted)' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filas.map((e, i) => (
                        <tr key={e.nombre} className="border-b last:border-0" style={{ borderColor: 'var(--demo-border)' }}>
                          <td className="py-2.5 px-2 font-bold" style={{ color: i < 2 ? 'var(--demo-accent)' : 'var(--demo-muted)' }}>{i + 1}</td>
                          <td className="py-2.5 px-2 font-medium">
                            <span className="flex items-center gap-2 whitespace-nowrap" style={{ color: 'var(--demo-heading)' }}>
                              {e.escudo && <span className="relative w-6 h-6 flex-shrink-0"><Image src={e.escudo} alt="" fill className="object-contain" /></span>}
                              {e.nombre}
                            </span>
                          </td>
                          <td className="py-2.5 px-2">{e.pj}</td>
                          <td className="py-2.5 px-2">{e.gf - e.gc}</td>
                          <td className="py-2.5 px-2 font-bold" style={{ color: 'var(--demo-accent)' }}>{e.pg * 3 + e.pe}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            })}
            <Link href="/posiciones" className="inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: 'var(--demo-heading)' }}>
              Tabla completa <ArrowRight size={15} />
            </Link>
          </div>

          <div className="card self-start">
            <h3 className="font-bold text-lg mb-5 flex items-center gap-2" style={{ color: 'var(--demo-heading)' }}>
              <Trophy size={20} style={{ color: 'var(--demo-accent)' }} /> Goleadores
            </h3>
            <ol className="space-y-4">
              {top.map((g, i) => (
                <li key={g.jugador} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-7 h-7 flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ backgroundColor: 'var(--demo-surface-alt)', color: 'var(--demo-accent)', borderRadius: 'var(--demo-radius)' }}>{i + 1}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: 'var(--demo-heading)' }}>{g.jugador}</p>
                      <p className="text-xs truncate" style={{ color: 'var(--demo-muted)' }}>{g.equipo}</p>
                    </div>
                  </div>
                  <span className="font-bold" style={{ color: 'var(--demo-accent)' }}>{g.goles}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
