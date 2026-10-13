'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { CalendarDays, Clock, MapPin } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PageHeader from '@/components/ui/PageHeader'
import CategoryTabs from '@/components/ui/CategoryTabs'
import { categoriasConDatos, fixturePorCategoria, proximaFechaDe, escudoPorEquipo, type Categoria } from '@/lib/torneo-data'
import { useCategoria } from '@/lib/category-context'
import { useDemo } from '@/lib/demo-store'
import { aplicarAFecha } from '@/lib/aplicar-datos'

const initials = (nombre: string) =>
  nombre.split(' ').filter((w) => w[0] === w[0].toUpperCase()).slice(0, 2).map((w) => w[0]).join('')

function Escudo({ nombre }: { nombre: string }) {
  const escudo = escudoPorEquipo[nombre]
  if (escudo) {
    return (
      <div className="relative w-14 h-14 flex-shrink-0">
        <Image src={escudo} alt="" fill className="object-contain" />
      </div>
    )
  }
  return (
    <div
      className="w-14 h-14 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
      style={{ backgroundColor: 'var(--demo-accent)', color: 'var(--demo-on-accent)' }}
    >
      {initials(nombre)}
    </div>
  )
}

export default function FixturePage() {
  const { categoria: cat, setCategoria: setCat } = useCategoria()
  const fechas = fixturePorCategoria[cat]
  const [numeroFecha, setNumeroFecha] = useState(proximaFechaDe(cat).numero)

  // Si cambia la categoría, la fecha seleccionada vuelve a la "próxima" de esa categoría.
  useEffect(() => {
    setNumeroFecha(proximaFechaDe(cat).numero)
  }, [cat])

  const { datos } = useDemo()
  const fecha = aplicarAFecha(fechas.find((f) => f.numero === numeroFecha) ?? fechas[0], datos.resultados, cat)

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen" style={{ backgroundColor: 'var(--demo-bg)' }}>
        <section className="section-pad">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <PageHeader
              eyebrow="Resultados y tablas"
              title="Fixture"
              subtitle="Elegí una categoría y una fecha para ver el fixture."
              pills={[{ label: 'Torneo', value: 'Clausura 2026' }, { label: 'Categoría', value: cat }]}
            />

            <CategoryTabs options={categoriasConDatos} value={cat} onChange={(c) => setCat(c as Categoria)} />

            {/* Selector de fecha (jornada) */}
            <div className="card mb-8">
              <p className="font-bold mb-1" style={{ color: 'var(--demo-heading)' }}>Fechas</p>
              <p className="text-xs mb-4" style={{ color: 'var(--demo-muted)' }}>Elegí una fecha para ver el fixture</p>
              <div className="flex flex-wrap gap-2">
                {fechas.map((f) => (
                  <button
                    key={f.numero}
                    onClick={() => setNumeroFecha(f.numero)}
                    className="w-9 h-9 flex items-center justify-center text-sm font-bold transition-all rounded-full"
                    style={{
                      backgroundColor: numeroFecha === f.numero ? 'var(--demo-accent)' : 'var(--demo-surface-alt)',
                      color: numeroFecha === f.numero ? 'var(--demo-on-accent)' : 'var(--demo-text)',
                      border: `1px solid ${numeroFecha === f.numero ? 'var(--demo-accent)' : 'var(--demo-border)'}`,
                    }}
                  >
                    {f.numero}
                  </button>
                ))}
              </div>
            </div>

            {fecha && (
              <div>
                <div className="text-center mb-6">
                  <h2 className="font-bold text-xl flex items-center justify-center gap-2" style={{ color: 'var(--demo-heading)' }}>
                    <CalendarDays size={20} style={{ color: 'var(--demo-accent)' }} /> Fecha {fecha.numero}
                  </h2>
                  <p className="text-sm uppercase tracking-wide mt-1" style={{ color: 'var(--demo-muted)' }}>{fecha.fechaLabel}</p>
                </div>

                {(['A', 'B'] as const).map((zona) => {
                  const delaZona = fecha.partidos.filter((p) => p.zona === zona)
                  if (delaZona.length === 0) return null
                  return (
                <div key={zona} className="space-y-4 mb-8">
                  <p className="eyebrow !mb-2 text-center">Zona {zona}</p>
                  {delaZona.map((p, i) => {
                    const jugado = p.golesLocal !== undefined && p.golesVisitante !== undefined
                    return (
                      <div key={i} className="card">
                        <div className="flex flex-wrap items-center justify-center gap-3 mb-4 text-xs font-semibold" style={{ color: 'var(--demo-muted)' }}>
                          <span className="inline-flex items-center gap-1.5">
                            <Clock size={14} style={{ color: 'var(--demo-accent)' }} /> {p.hora}
                          </span>
                          {p.cancha && (
                            <span className="inline-flex items-center gap-1.5">
                              <MapPin size={14} style={{ color: 'var(--demo-accent)' }} /> {p.cancha}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-center gap-4 sm:gap-8">
                          <div className="flex flex-col items-center gap-2 flex-1 max-w-[140px]">
                            <Escudo nombre={p.local} />
                            <p className="text-xs sm:text-sm font-semibold text-center" style={{ color: 'var(--demo-heading)' }}>{p.local}</p>
                          </div>
                          <div className={`flex-shrink-0 font-bold ${jugado ? 'text-2xl sm:text-3xl tabular-nums' : 'text-lg'}`} style={{ color: jugado ? 'var(--demo-heading)' : 'var(--demo-muted)' }}>
                            {jugado ? `${p.golesLocal} - ${p.golesVisitante}` : 'VS'}
                          </div>
                          <div className="flex flex-col items-center gap-2 flex-1 max-w-[140px]">
                            <Escudo nombre={p.visitante} />
                            <p className="text-xs sm:text-sm font-semibold text-center" style={{ color: 'var(--demo-heading)' }}>{p.visitante}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
