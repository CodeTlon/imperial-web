'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Trophy } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PageHeader from '@/components/ui/PageHeader'
import CategoryTabs from '@/components/ui/CategoryTabs'
import { campeonesData, categoriasCampeones } from '@/lib/campeones-data'

const COPA_COLOR: Record<string, string> = {
  Oro: '#f2a01f',
  Plata: '#9ca3af',
  Bronce: '#c2703d',
}

export default function CampeonesPage() {
  // Categoría local, NO conectada al selector global (CategoryProvider):
  // `categoriasCampeones` no mapea 1:1 con el tipo `Categoria` compartido
  // (ej. "Femenino Pro"/"Femenino Amateur" acá vs "Femenino" en el resto del
  // sitio), así que sincronizarla mostraría categorías inconsistentes en
  // /posiciones, /fixture o /equipos.
  const [cat, setCat] = useState<(typeof categoriasCampeones)[number] | 'Todas'>('Todas')
  const items = cat === 'Todas' ? campeonesData : campeonesData.filter((c) => c.categoria === cat)

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
              options={['Todas', ...categoriasCampeones]}
              value={cat}
              onChange={(c) => setCat(c as (typeof categoriasCampeones)[number] | 'Todas')}
            />

            {/* Grid de copas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <div key={`${item.categoria}-${item.copa}`} className="card overflow-hidden !p-0">
                  <div className="relative aspect-[4/5]">
                    <Image src={item.img} alt={`${item.categoria} — Copa ${item.copa}`} fill className="object-cover" />
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5" style={{ color: COPA_COLOR[item.copa] }}>
                      <Trophy size={13} /> {item.categoria} · Copa {item.copa}
                    </p>
                    <p className="font-bold" style={{ color: 'var(--demo-heading)' }}>🏆 {item.campeon}</p>
                    <p className="text-sm" style={{ color: 'var(--demo-muted)' }}>
                      2° {item.subcampeon}{item.tercero ? ` · 3° ${item.tercero}` : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
