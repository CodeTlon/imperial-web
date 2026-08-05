'use client'

import { useState } from 'react'
import Image from 'next/image'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/layout/WhatsAppButton'
import PageHeader from '@/components/ui/PageHeader'
import CategoryTabs from '@/components/ui/CategoryTabs'
import { categorias, posiciones, type Categoria } from '@/lib/torneo-data'
import { useCategoria } from '@/lib/category-context'

const initials = (nombre: string) =>
  nombre.split(' ').filter((w) => w[0] === w[0].toUpperCase()).slice(0, 2).map((w) => w[0]).join('')

export default function EquiposPage() {
  const { setCategoria } = useCategoria()
  const [cat, setCat] = useState<Categoria | 'Todas'>('Todas')

  const equipos = (cat === 'Todas' ? categorias : [cat]).flatMap((c) =>
    posiciones[c].map((e) => ({ ...e, categoria: c }))
  )

  const handleChange = (c: string) => {
    setCat(c as Categoria | 'Todas')
    // "Todas" es un filtro local de esta página — solo una categoría real
    // actualiza la selección global compartida con /posiciones y /fixture.
    if (c !== 'Todas') setCategoria(c as Categoria)
  }

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen" style={{ backgroundColor: 'var(--demo-bg)' }}>
        <section className="section-pad">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <PageHeader
              eyebrow="La competencia"
              title="Equipos"
              subtitle="Todos los equipos inscriptos en Torneo Imperial, por categoría."
              pills={[{ label: 'Torneo', value: 'Apertura 2026' }, { label: 'Categoría', value: cat }]}
            />

            <CategoryTabs options={['Todas', ...categorias]} value={cat} onChange={handleChange} />

            <div className="card mb-6 flex items-center justify-between">
              <div>
                <p className="font-bold" style={{ color: 'var(--demo-heading)' }}>Listado de equipos</p>
                <p className="text-xs" style={{ color: 'var(--demo-muted)' }}>Escudos y nombres por categoría</p>
              </div>
              <span
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold"
                style={{ borderRadius: 'var(--demo-radius)', backgroundColor: 'var(--demo-surface-alt)', color: 'var(--demo-text)' }}
              >
                <span style={{ color: 'var(--demo-muted)' }}>Total:</span>
                <span style={{ color: 'var(--demo-accent)' }}>{equipos.length}</span>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {equipos.map((e) => (
                <div key={`${e.categoria}-${e.nombre}`} className="card flex flex-col items-center text-center gap-3">
                  {e.escudo ? (
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image src={e.escudo} alt="" fill className="object-contain" />
                    </div>
                  ) : (
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold"
                      style={{ backgroundColor: 'var(--demo-accent)', color: 'var(--demo-on-accent)' }}
                    >
                      {initials(e.nombre)}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-sm" style={{ color: 'var(--demo-heading)' }}>{e.nombre}</p>
                    <p className="text-xs uppercase tracking-wide mt-1" style={{ color: 'var(--demo-muted)' }}>{e.categoria}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
