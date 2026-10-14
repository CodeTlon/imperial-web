'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import CategoryTabs from '@/components/ui/CategoryTabs'
import { useCategoria } from '@/lib/category-context'
import { reglamentoCapitulos } from '@/lib/reglamento-ti'
import { categoriasConDatos, escudoPorEquipo, sanciones, type Categoria } from '@/lib/torneo-data'
import { fechasTxt } from '@/lib/utils'

const TEAL = '#0494a4'
const TEAL_OSCURO = '#04707c'
const heading = { color: 'var(--demo-heading)', fontFamily: 'var(--demo-font-heading)' } as const
const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim()

// Los datos escriben "Art 39 - Art 34 A": se separan en artículos y cada uno lleva al capítulo del reglamento donde se explica.
const articulosDe = (motivo: string) => motivo.split(/\s+-\s+/).map((c) => c.replace(/^Art\s/, 'Art. '))

// Reglas de sanciones: se toman tal cual del reglamento (reglamento-ti.ts), sin reescribirlas.
const ARTS_REGLAS = ['Art. 36', 'Art. 43 Bis', 'Art. 43', 'Art. 46', 'Art. 47', 'Art. 48']
const REGLAS = ARTS_REGLAS.flatMap((art) =>
  reglamentoCapitulos.flatMap((c) => c.puntos)
    .filter((p) => p.startsWith(`${art}:`))
    .map((p) => ({ art, texto: p.slice(art.length + 1).trim() }))
)
const CLAVES = /(-?\d+(?:\s(?:a|y)\s\d+)?\s?(?:puntos?|fechas?|partidos?|meses|amarillas|años?)|\bMARTES\b)/gi
const resaltar = (t: string) => t.split(CLAVES).map((x, i) => (i % 2 === 1 ? <strong key={i} style={{ color: TEAL_OSCURO }}>{x}</strong> : x))

function Dato({ valor, texto }: { valor: string | number; texto: string }) {
  return (
    <div>
      <p className="text-4xl sm:text-5xl font-bold leading-none" style={{ color: 'var(--demo-accent)', fontFamily: 'var(--demo-font-heading)' }}>{valor}</p>
      <p className="mt-2 text-sm leading-snug" style={{ color: 'var(--demo-text)' }}>{texto}</p>
    </div>
  )
}

function Avance({ sancion, porCumplir }: { sancion: number; porCumplir: number }) {
  const cumplidas = sancion - porCumplir
  return (
    <div className="min-w-[10.5rem]">
      <div className="flex items-baseline justify-between gap-3 whitespace-nowrap text-sm">
        <span className="font-bold" style={{ color: TEAL_OSCURO }}>{porCumplir} por cumplir</span>
        <span style={{ color: 'var(--demo-muted)' }}>de {sancion}</span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full" style={{ backgroundColor: 'var(--demo-border)' }} role="img" aria-label={`${cumplidas} de ${sancion} fechas cumplidas`}>
        <div className="h-full rounded-full" style={{ width: `${(cumplidas / sancion) * 100}%`, backgroundColor: TEAL }} />
      </div>
    </div>
  )
}

export default function SancionesVista() {
  const { categoria: cat, setCategoria } = useCategoria()
  const [q, setQ] = useState('')
  const lista = useMemo(() => {
    const nq = norm(q)
    return [...sanciones[cat]]
      .sort((a, b) => b.porCumplir - a.porCumplir || a.jugador.localeCompare(b.jugador, 'es'))
      .filter((s) => !nq || norm(`${s.jugador} ${s.equipo}`).includes(nq))
  }, [cat, q])
  const todas = sanciones[cat]
  const porCumplirTotal = todas.reduce((n, s) => n + s.porCumplir, 0)
  const mayor = todas.reduce((m, s) => Math.max(m, s.sancion), 0)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <CategoryTabs options={categoriasConDatos} value={cat} onChange={(c) => setCategoria(c as Categoria)} />

      {/* Resumen */}
      <dl className="mb-10 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3 border-y py-7" style={{ borderColor: 'var(--demo-border)' }}>
        <Dato valor={todas.length} texto={`jugadores suspendidos en ${cat}`} />
        <Dato valor={porCumplirTotal} texto="fechas de suspensión por cumplir entre todos" />
        <Dato valor={mayor || '—'} texto={mayor ? 'fechas: la sanción más larga de la categoría' : 'sin sanciones cargadas'} />
      </dl>

      {/* Listado */}
      <section aria-labelledby="titulo-suspendidos" className="mb-16">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <h2 id="titulo-suspendidos" className="text-3xl sm:text-4xl font-bold" style={heading}>Jugadores suspendidos</h2>
          {todas.length > 0 && (
            <label className="relative block w-full sm:w-72">
              <span className="sr-only">Buscar jugador o equipo</span>
              <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--demo-muted)' }} aria-hidden />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar jugador o equipo" className="input !pl-10" />
            </label>
          )}
        </div>

        {todas.length === 0 ? (
          <p className="py-10 text-center" style={{ color: 'var(--demo-muted)' }}>No hay jugadores suspendidos en {cat}.</p>
        ) : lista.length === 0 ? (
          <p className="py-10 text-center" style={{ color: 'var(--demo-muted)' }}>No hay resultados para &ldquo;{q}&rdquo;.</p>
        ) : (
          <>
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-sm sm:text-base">
                <thead>
                  <tr className="border-b-2" style={{ borderColor: TEAL }}>
                    {['Jugador', 'Equipo', 'Sanción', 'Avance', 'Artículos'].map((h) => (
                      <th key={h} scope="col" className="py-2.5 pr-4 text-xs font-bold uppercase tracking-wider" style={{ color: TEAL_OSCURO }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {lista.map((s) => {
                    const escudo = escudoPorEquipo[s.equipo]
                    return (
                      <tr key={`${s.jugador}-${s.equipo}`} className="border-b align-top" style={{ borderColor: 'var(--demo-border)' }}>
                        <th scope="row" className="py-3.5 pr-4 font-bold" style={{ color: 'var(--demo-heading)' }}>{s.jugador}</th>
                        <td className="py-3.5 pr-4 whitespace-nowrap" style={{ color: 'var(--demo-text)' }}>
                          <span className="flex items-center gap-2">
                            {escudo && <span className="relative h-5 w-5 shrink-0"><Image src={escudo} alt="" fill sizes="20px" className="object-contain" /></span>}
                            {s.equipo}
                          </span>
                        </td>
                        <td className="py-3.5 pr-4 whitespace-nowrap font-bold" style={{ color: '#b91c1c' }}>{fechasTxt(s.sancion)}</td>
                        <td className="py-3.5 pr-4"><Avance sancion={s.sancion} porCumplir={s.porCumplir} /></td>
                        <td className="py-3.5">
                          <ul className="grid gap-1">
                            {articulosDe(s.motivo).map((a) => (
                              <li key={a} className="text-sm leading-snug">
                                <Link href="/reglamento#jugadores" className="font-bold underline-offset-2 hover:underline" style={{ color: TEAL_OSCURO }}>{a}</Link>
                              </li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Celular: una fila por jugador, sin cards */}
            <ul className="sm:hidden divide-y" style={{ borderColor: 'var(--demo-border)' }}>
              {lista.map((s) => (
                <li key={`${s.jugador}-${s.equipo}`} className="py-4 border-t first:border-t-0" style={{ borderColor: 'var(--demo-border)' }}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-bold" style={{ color: 'var(--demo-heading)' }}>{s.jugador}</p>
                      <p className="text-sm" style={{ color: 'var(--demo-muted)' }}>{s.equipo}</p>
                    </div>
                    <p className="shrink-0 font-bold" style={{ color: '#b91c1c' }}>{fechasTxt(s.sancion)}</p>
                  </div>
                  <div className="mt-3"><Avance sancion={s.sancion} porCumplir={s.porCumplir} /></div>
                  <p className="mt-2 text-sm" style={{ color: 'var(--demo-text)' }}>
                    {articulosDe(s.motivo).map((a, i) => (
                      <span key={a}>{i > 0 && ' · '}<Link href="/reglamento#jugadores" className="font-bold underline underline-offset-2" style={{ color: TEAL_OSCURO }}>{a}</Link></span>
                    ))}
                  </p>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      {/* Lo que dice el reglamento */}
      <section aria-labelledby="titulo-como" className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-14">
        <div>
          <h2 id="titulo-como" className="text-3xl sm:text-4xl font-bold" style={heading}>Lo que dice el reglamento</h2>
          <p className="mt-3 leading-relaxed" style={{ color: 'var(--demo-text)' }}>
            Estas son las reglas de sanciones, tal como figuran en el reglamento oficial. Los capítulos completos están en el{' '}
            <Link href="/reglamento#jugadores" className="font-semibold underline underline-offset-2" style={{ color: TEAL_OSCURO }}>reglamento</Link>.
          </p>
        </div>
        <div className="grid gap-6">
          {REGLAS.map((r) => (
            <div key={`${r.art}-${r.texto.slice(0, 20)}`}>
              <h3 className="mb-1.5 text-xs sm:text-sm font-bold uppercase tracking-[0.14em]" style={{ color: TEAL }}>{r.art}</h3>
              <p className="leading-relaxed text-base sm:text-[17px]" style={{ color: 'var(--demo-text)' }}>{resaltar(r.texto)}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
