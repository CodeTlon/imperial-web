'use client'

import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PageHeader from '@/components/ui/PageHeader'
import CategoryTabs from '@/components/ui/CategoryTabs'
import Podio from '@/components/campeones/Podio'
import { CAMPEONES_TI, CATEGORIAS_CAMPEONES } from '@/lib/campeones-ti'

const COPA_COLOR: Record<string, string> = {
  Oro: '#f3a21c',
  Plata: '#9ca3af',
  Bronce: '#c2703d',
}

export default function CampeonesPage() {
  // Categoría local, no conectada al selector global (CategoryProvider): este filtro suma la opción "Todas"
  // y cambiarlo acá no debería mover la categoría de /posiciones, /fixture o /equipos.
  const [cat, setCat] = useState<(typeof CATEGORIAS_CAMPEONES)[number] | 'Todas'>('Todas')
  const [copa, setCopa] = useState<'Todas' | 'Oro' | 'Plata' | 'Bronce'>('Todas')
  const items = CAMPEONES_TI.filter((c) => (cat === 'Todas' || c.categoria === cat) && (copa === 'Todas' || c.copa === copa))

  return (
    <>
      <Navbar />
      <main className="min-h-screen" style={{ backgroundColor: 'var(--demo-bg)' }}>
        <PageHeader
          title="Campeones"
          subtitle="Copa de Oro, Plata y Bronce de cada categoría."
          backgroundImage="/images/hero-campeones.jpg"
          cta={false}
        />

        <section className="section-pad !pt-14">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

            <CategoryTabs
              options={['Todas', ...CATEGORIAS_CAMPEONES]}
              value={cat}
              onChange={(c) => setCat(c as (typeof CATEGORIAS_CAMPEONES)[number] | 'Todas')}
            />

            <div className="flex flex-wrap justify-center gap-2 mb-8" role="group" aria-label="Filtrar por copa">
              {(['Todas', 'Oro', 'Plata', 'Bronce'] as const).map((c) => (
                <button key={c} type="button" onClick={() => setCopa(c)} aria-pressed={copa === c}
                  className="px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-colors"
                  style={copa === c
                    ? { background: c === 'Todas' ? '#04707c' : COPA_COLOR[c], color: '#fff', borderColor: 'transparent' }
                    : { color: 'var(--demo-muted)', borderColor: 'var(--demo-border)' }}>
                  {c === 'Todas' ? 'Todas las copas' : c}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-8">
              {items.map((item) => <Podio key={`${item.categoria}-${item.copa}`} item={item} />)}
              {items.length === 0 && (
                <p className="text-center py-10" style={{ color: 'var(--demo-muted)' }}>No hay copas para esta combinación.</p>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
