'use client'

import Image from 'next/image'
import { Trophy, ShieldAlert } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PageHeader from '@/components/ui/PageHeader'
import CategoryTabs from '@/components/ui/CategoryTabs'
import { categoriasConDatos, posiciones, goleadores, sanciones, type Categoria } from '@/lib/torneo-data'
import { useCategoria } from '@/lib/category-context'
import { useDemo } from '@/lib/demo-store'
import { aplicarGoles, aplicarResultados } from '@/lib/aplicar-datos'

type Equipo = (typeof posiciones)[Categoria][number]

function TablaPosiciones({ equipos, conAjustes }: { equipos: Equipo[]; conAjustes: boolean }) {
  return (
    <table className="w-full text-xs sm:text-sm 2xl:text-base">
      <thead>
        <tr className="text-left border-b" style={{ borderColor: 'var(--demo-border)' }}>
          {['#', 'Equipo', 'PJ', 'PG', 'PE', 'PP', 'GF', 'GC', 'DG', ...(conAjustes ? ['AP', 'QP'] : []), 'Pts'].map((h) => (
            <th key={h} className={`${['GF', 'GC', 'AP', 'QP'].includes(h) ? 'hidden sm:table-cell ' : ''}py-3 px-1 sm:px-2 font-semibold uppercase text-[10px] sm:text-xs tracking-wider whitespace-nowrap`} style={{ color: 'var(--demo-muted)' }}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {equipos.map((e, i) => (
          <tr key={e.nombre} className="border-b last:border-0 fila-in" style={{ borderColor: 'var(--demo-border)', ['--i' as string]: i } as React.CSSProperties}>
            <td className="py-2.5 px-1 sm:py-3 sm:px-2 font-bold" style={{ color: i < 2 ? 'var(--demo-accent)' : 'var(--demo-muted)' }}>{i + 1}</td>
            <td className="py-2.5 px-1 sm:py-3 sm:px-2 font-medium">
              <div className="flex items-center gap-1.5 sm:gap-2 sm:whitespace-nowrap">
                {e.escudo && (
                  <span className="relative w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0">
                    <Image src={e.escudo} alt="" fill className="object-contain" />
                  </span>
                )}
                <span style={{ color: 'var(--demo-heading)' }}>{e.nombre}</span>
              </div>
            </td>
            <td className="py-2.5 px-1 sm:py-3 sm:px-2" style={{ color: 'var(--demo-text)' }}>{e.pj}</td>
            <td className="py-2.5 px-1 sm:py-3 sm:px-2" style={{ color: 'var(--demo-text)' }}>{e.pg}</td>
            <td className="py-2.5 px-1 sm:py-3 sm:px-2" style={{ color: 'var(--demo-text)' }}>{e.pe}</td>
            <td className="py-2.5 px-1 sm:py-3 sm:px-2" style={{ color: 'var(--demo-text)' }}>{e.pp}</td>
            <td className="hidden sm:table-cell py-2.5 px-1 sm:py-3 sm:px-2" style={{ color: 'var(--demo-text)' }}>{e.gf}</td>
            <td className="hidden sm:table-cell py-2.5 px-1 sm:py-3 sm:px-2" style={{ color: 'var(--demo-text)' }}>{e.gc}</td>
            <td className="py-2.5 px-1 sm:py-3 sm:px-2" style={{ color: 'var(--demo-text)' }}>{e.gf - e.gc}</td>
            {conAjustes && (
              <>
                <td className="hidden sm:table-cell py-2.5 px-1 sm:py-3 sm:px-2" style={{ color: 'var(--demo-muted)' }}>{e.ap ?? '–'}</td>
                <td className="hidden sm:table-cell py-2.5 px-1 sm:py-3 sm:px-2" style={{ color: 'var(--demo-muted)' }}>{e.qp ?? '–'}</td>
              </>
            )}
            <td className="py-2.5 px-1 sm:py-3 sm:px-2 font-bold" style={{ color: 'var(--demo-accent)' }}>{e.pg * 3 + e.pe}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default function PosicionesPage() {
  const { categoria: cat, setCategoria: setCat } = useCategoria()
  const { datos } = useDemo()
  const tabla = aplicarResultados(posiciones[cat], datos.resultados, cat)
  const top = aplicarGoles(goleadores[cat], datos.goleadores, cat)
  const sancionados = sanciones[cat]

  const conAjustes = tabla.some((e) => e.ap || e.qp)
  const zonas = Array.from(new Set(tabla.map((e) => e.zona).filter(Boolean))) as string[]

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen" style={{ backgroundColor: 'var(--demo-bg)' }}>
        <section className="section-pad">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <PageHeader
              eyebrow="Resultados y tablas"
              title="Posiciones"
              subtitle="Tabla acumulada de la temporada, categoría por categoría."
              pills={[{ label: 'Torneo', value: 'Clausura 2026' }, { label: 'Categoría', value: cat }]}
            />

            <CategoryTabs options={categoriasConDatos} value={cat} onChange={(c) => setCat(c as Categoria)} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Tabla(s) de posiciones */}
              <div className="lg:col-span-2 space-y-8">
                {zonas.length > 0 ? (
                  zonas.map((z) => (
                    <div key={z} className="card overflow-x-auto">
                      <p className="eyebrow !mb-4">Zona {z}</p>
                      <TablaPosiciones equipos={tabla.filter((e) => e.zona === z)} conAjustes={conAjustes} />
                    </div>
                  ))
                ) : (
                  <div className="card overflow-x-auto">
                    <TablaPosiciones equipos={tabla} conAjustes={conAjustes} />
                  </div>
                )}
                {conAjustes && (
                  <p className="text-xs px-1" style={{ color: 'var(--demo-muted)' }}>
                    AP: adición de puntos administrativa · QP: quita de puntos pendiente de aplicar (Art. 26 del reglamento).
                  </p>
                )}
              </div>

              {/* Goleadores */}
              <div className="card self-start">
                <h3 className="font-bold text-lg mb-5 flex items-center gap-2" style={{ color: 'var(--demo-heading)' }}>
                  <Trophy size={20} style={{ color: 'var(--demo-accent)' }} /> Goleadores — {cat}
                </h3>
                <ol className="space-y-4">
                  {top.map((g, i) => (
                    <li key={g.jugador} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ backgroundColor: 'var(--demo-surface-alt)', color: 'var(--demo-accent)', borderRadius: 'var(--demo-radius)' }}>
                          {i + 1}
                        </span>
                        <div>
                          <p className="text-sm font-semibold" style={{ color: 'var(--demo-heading)' }}>{g.jugador}</p>
                          <p className="text-xs" style={{ color: 'var(--demo-muted)' }}>{g.equipo}</p>
                        </div>
                      </div>
                      <span className="font-bold" style={{ color: 'var(--demo-accent)' }}>{g.goles}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Sancionados */}
            {sancionados.length > 0 && (
              <div className="card overflow-x-auto mt-8">
                <h3 className="font-bold text-lg mb-5 flex items-center gap-2" style={{ color: 'var(--demo-heading)' }}>
                  <ShieldAlert size={20} style={{ color: 'var(--demo-accent)' }} /> Jugadores suspendidos — {cat}
                </h3>
                <table className="w-full text-xs sm:text-sm 2xl:text-base">
                  <thead>
                    <tr className="text-left border-b" style={{ borderColor: 'var(--demo-border)' }}>
                      {['Jugador', 'Equipo', 'Sanción', 'Por cumplir', 'Motivo'].map((h) => (
                        <th key={h} className="py-3 px-1 sm:px-2 font-semibold uppercase text-[10px] sm:text-xs tracking-wider whitespace-nowrap" style={{ color: 'var(--demo-muted)' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sancionados.map((s) => (
                      <tr key={`${s.jugador}-${s.equipo}`} className="border-b last:border-0" style={{ borderColor: 'var(--demo-border)' }}>
                        <td className="py-2.5 px-1 sm:py-3 sm:px-2 font-medium whitespace-nowrap" style={{ color: 'var(--demo-heading)' }}>{s.jugador}</td>
                        <td className="py-2.5 px-1 sm:py-3 sm:px-2 whitespace-nowrap" style={{ color: 'var(--demo-text)' }}>{s.equipo}</td>
                        <td className="py-2.5 px-1 sm:py-3 sm:px-2" style={{ color: 'var(--demo-text)' }}>{s.sancion} {s.sancion === 1 ? 'fecha' : 'fechas'}</td>
                        <td className="py-2.5 px-1 sm:py-3 sm:px-2 font-bold" style={{ color: 'var(--demo-accent)' }}>{s.porCumplir}</td>
                        <td className="py-2.5 px-1 sm:py-3 sm:px-2 whitespace-nowrap" style={{ color: 'var(--demo-muted)' }}>{s.motivo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-xs mt-4 px-1" style={{ color: 'var(--demo-muted)' }}>
                  Artículos citados: ver <a href="/reglamento" className="underline">reglamento completo</a>, Capítulo 6 — Sanciones disciplinarias individuales.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
