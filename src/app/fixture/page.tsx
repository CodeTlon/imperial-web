'use client'

import { useState, useEffect } from 'react'
import { CalendarDays } from 'lucide-react'
import MatchCard from '@/components/match/MatchCard'
import ShareButton from '@/components/share/ShareButton'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PageHeader from '@/components/ui/PageHeader'
import CategoryTabs from '@/components/ui/CategoryTabs'
import { categoriasConDatos, fixturePorCategoria, proximaFechaDe, type Categoria } from '@/lib/torneo-data'
import { useCategoria } from '@/lib/category-context'
import { useDemo } from '@/lib/demo-store'
import { aplicarAFecha } from '@/lib/aplicar-datos'

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
      <main className="min-h-screen" style={{ backgroundColor: 'var(--demo-bg)' }}>
      <PageHeader
        backgroundImage="/images/gallery-1.jpg"
        title="Fixture"
        subtitle="Elegí una categoría y una fecha para ver el fixture."
        cta={false}
      />

        <section className="section-pad">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

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
                  {delaZona.map((p, i) => <MatchCard key={i} p={p} categoria={cat} />)}
                </div>
                  )
                })}
                <div className="flex justify-center">
                  <ShareButton
                    texto={`Torneo Imperial ${cat} · Fecha ${fecha.numero} (${fecha.fechaLabel})\n` + fecha.partidos.map((p) => `${p.hora} ${p.local} ${p.golesLocal !== undefined ? `${p.golesLocal}-${p.golesVisitante}` : 'vs'} ${p.visitante}`).join('\n')}
                    categoria={cat}
                  />
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
