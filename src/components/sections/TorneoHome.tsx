'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import MatchCard from '@/components/match/MatchCard'
import ShareButton from '@/components/share/ShareButton'
import CarruselFechas from '@/components/ui/CarruselFechas'
import CategoryTabs from '@/components/ui/CategoryTabs'
import { NotaAjustes, TablaPosiciones, TarjetaGoleadores } from '@/components/ui/TablasTorneo'
import {
  categoriasConDatos, fixturePorCategoria, proximaFechaDe, posiciones, goleadores,
  type Categoria,
} from '@/lib/torneo-data'
import { useCategoria } from '@/lib/category-context'
import { useDemo } from '@/lib/demo-store'
import { aplicarAFecha, aplicarGoles, aplicarResultados } from '@/lib/aplicar-datos'

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
  const top = aplicarGoles(goleadores[cat], datos.goleadores, cat)
  const conAjustes = tabla.some((e) => e.ap || e.qp)
  const zonas = Array.from(new Set(tabla.map((e) => e.zona).filter(Boolean))) as string[]

  return (
    <section id="torneo" className="section-pad scroll-mt-16" style={{ backgroundColor: 'var(--demo-bg)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="section-title !mb-2">Fixture y posiciones</h2>
          <p className="section-subtitle !text-base">Clausura 2026 · resultados y tabla al día, fecha por fecha.</p>
        </div>

        {/* Fixture */}
        <div className="max-w-3xl mx-auto">
          <div className="[&>div]:!mb-5">
            <CategoryTabs options={categoriasConDatos} value={cat} onChange={(c) => setCategoria(c as Categoria)} />
          </div>
          <div className="card mb-5">
            <CarruselFechas fechas={fechas} numero={numero} onChange={setNumero} />
          </div>

          <div className="space-y-3">
            {fecha.partidos.map((p, i) => <div key={`${cat}-${fecha.numero}-${i}`} className="fila-in" style={{ ['--i' as string]: i } as React.CSSProperties}><MatchCard p={p} categoria={cat} /></div>)}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-5">
            <ShareButton
              texto={`Torneo Imperial ${cat} · Fecha ${fecha.numero} (${fecha.fechaLabel})\n` +
                fecha.partidos.map((p) => `${p.hora} ${p.local} ${p.golesLocal !== undefined ? `${p.golesLocal}-${p.golesVisitante}` : 'vs'} ${p.visitante}`).join('\n')}
              categoria={cat}
            />
          </div>
          <div className="text-center mt-3">
            <Link href="/fixture" className="inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: 'var(--demo-heading)' }}>
              Fixture completo <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Posiciones + goleadores: mismas tablas que /posiciones */}
        <div className="space-y-8 mt-16">
          {(zonas.length ? zonas : [null]).map((z) => (
            <div key={z ?? 'u'} className="card overflow-x-auto">
              {z && <p className="eyebrow !mb-4">Zona {z}</p>}
              <TablaPosiciones equipos={z ? tabla.filter((e) => e.zona === z) : tabla} conAjustes={conAjustes} />
            </div>
          ))}
          {conAjustes && <NotaAjustes />}
          <TarjetaGoleadores top={top} categoria={cat} />
          <Link href="/posiciones" className="inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: 'var(--demo-heading)' }}>
            Posiciones completas <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  )
}
