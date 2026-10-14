'use client'

import { ShieldAlert } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PageHeader from '@/components/ui/PageHeader'
import CategoryTabs from '@/components/ui/CategoryTabs'
import { NotaAjustes, TablaPosiciones, TarjetaGoleadores } from '@/components/ui/TablasTorneo'
import { categoriasConDatos, posiciones, goleadores, sanciones, type Categoria } from '@/lib/torneo-data'
import { useCategoria } from '@/lib/category-context'
import { useDemo } from '@/lib/demo-store'
import { aplicarGoles, aplicarResultados } from '@/lib/aplicar-datos'

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
      <main className="min-h-screen" style={{ backgroundColor: 'var(--demo-bg)' }}>
      <PageHeader
        backgroundImage="/images/gallery-2.jpg"
        title="Posiciones"
        subtitle="Tabla acumulada de la temporada, categoría por categoría."
        cta={false}
      />

        <section className="section-pad">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <CategoryTabs options={categoriasConDatos} value={cat} onChange={(c) => setCat(c as Categoria)} />

            <div className="space-y-8">
              {/* Tabla(s) de posiciones */}
              <div className={`grid grid-cols-1 gap-8 `}>
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
              </div>
                {conAjustes && <NotaAjustes />}

              {/* Goleadores y suspendidos */}
              <div className={`grid grid-cols-1 gap-8`}>
              <TarjetaGoleadores top={top} categoria={cat} />

            {sancionados.length > 0 && (
              <div className="card overflow-x-auto">
                <p className="eyebrow !mb-4 flex items-center gap-2"><ShieldAlert size={16} aria-hidden /> Jugadores suspendidos · {cat}</p>
                <ul className="sm:hidden space-y-3">
                  {sancionados.map((s) => (
                    <li key={`${s.jugador}-${s.equipo}`} className="p-3 text-sm" style={{ backgroundColor: 'var(--demo-surface-alt)', borderRadius: 'var(--demo-radius)' }}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-semibold" style={{ color: 'var(--demo-heading)' }}>{s.jugador}</p>
                          <p className="text-xs" style={{ color: 'var(--demo-muted)' }}>{s.equipo}</p>
                        </div>
                        <span className="text-xs font-bold whitespace-nowrap" style={{ color: 'var(--demo-accent)' }}>{s.porCumplir} por cumplir</span>
                      </div>
                      <p className="text-xs mt-1.5" style={{ color: 'var(--demo-text)' }}>{s.sancion} {s.sancion === 1 ? 'fecha' : 'fechas'} · {s.motivo}</p>
                    </li>
                  ))}
                </ul>
                <table className="hidden sm:table w-full text-xs lg:text-sm">
                  <thead>
                    <tr className="text-left border-b" style={{ borderColor: 'var(--demo-border)' }}>
                      {['Jugador', 'Equipo', 'Sanción', 'Por cumplir', 'Motivo'].map((h) => (
                        <th key={h} className="py-2.5 px-1.5 font-semibold uppercase text-[10px] tracking-wider" style={{ color: 'var(--demo-muted)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sancionados.map((s) => (
                      <tr key={`${s.jugador}-${s.equipo}`} className="border-b last:border-0 align-top" style={{ borderColor: 'var(--demo-border)' }}>
                        <td className="py-2 px-1.5 font-medium" style={{ color: 'var(--demo-heading)' }}>{s.jugador}</td>
                        <td className="py-2 px-1.5" style={{ color: 'var(--demo-text)' }}>{s.equipo}</td>
                        <td className="py-2 px-1.5 whitespace-nowrap" style={{ color: 'var(--demo-text)' }}>{s.sancion} {s.sancion === 1 ? 'fecha' : 'fechas'}</td>
                        <td className="py-2 px-1.5 font-bold" style={{ color: 'var(--demo-accent)' }}>{s.porCumplir}</td>
                        <td className="py-2 px-1.5" style={{ color: 'var(--demo-muted)' }}>{s.motivo}</td>
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
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
