'use client'

import Image from 'next/image'
import { Calendar } from 'lucide-react'
import { demoConfig } from '@/lib/demo-config'
import { categorias, proximaFechaDe } from '@/lib/torneo-data'
import { useCategoria } from '@/lib/category-context'

// Acento dorado local, solo para este Hero — inspirado en el look oscuro/premium
// de torneogolden.com.ar. El resto del sitio sigue usando var(--demo-accent)
// (amarillo #ffc72c) sin cambios; este tono ya se usa en /campeones para la
// Copa de Oro, así que no es un color inventado nuevo para el proyecto.
const GOLD = '#f2a01f'

export default function Hero() {
  const { business, images } = demoConfig
  const { categoria, setCategoria } = useCategoria()
  const proxima = proximaFechaDe(categoria)
  const proximo = proxima.partidos[0]

  return (
    <section id="hero" className="relative min-h-[760px] h-[92vh] max-h-[860px] flex items-end justify-center pt-24 pb-10 md:pb-12">
      {/* Imagen de fondo real (jugada de Torneo Imperial) */}
      <div className="absolute inset-0">
        <Image
          src={images.hero}
          alt={business.name}
          fill
          className="object-cover"
          style={{ objectPosition: '50% 20%' }}
          priority
          unoptimized={images.hero.startsWith('http')}
        />
        {/* Overlay casi negro (no navy) — es lo que más distingue este Hero del
            de la v1 de un vistazo, calcado del fondo oscuro tipo "noche de
            estadio" de torneogolden.com.ar. */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(8,8,10,0.45) 0%, rgba(8,8,10,0.7) 45%, rgba(6,6,8,0.96) 100%)' }}
        />
      </div>

      {/* Contenido — cada bloque entra con un fade-up en cascada al cargar
          (no depende de scroll, el Hero ya está visible en el primer render). */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Eyebrow tipo "ELEGÍ TU CATEGORÍA Y NAVEGÁ EN LA WEB" de Golden */}
        <p
          className="hero-in text-xs font-bold uppercase tracking-[0.25em] mb-4 md:mb-6"
          style={{ color: GOLD, '--hero-delay': '0ms' } as React.CSSProperties}
        >
          Temporada 2026 · Elegí tu categoría
        </p>

        {/* Medallón circular con el isologo real de Imperial — reemplaza el
            badge pill que había antes, es el elemento hero central tipo Golden.
            Pulso dorado sutil para que sea el foco visual del Hero. */}
        <div
          className="hero-in medallion-pulse mx-auto mb-4 md:mb-6 rounded-full flex items-center justify-center overflow-hidden"
          style={{
            width: 108,
            height: 108,
            backgroundColor: 'rgba(10,10,12,0.6)',
            border: `2px solid ${GOLD}`,
            '--hero-delay': '120ms',
          } as React.CSSProperties}
        >
          <div className="relative w-16 h-16">
            <Image src="/images/logo-mark.png" alt="" fill className="object-contain" />
          </div>
        </div>

        <h1
          className="hero-in text-4xl md:text-6xl font-bold leading-tight mb-4"
          style={{ color: '#ffffff', '--hero-delay': '220ms' } as React.CSSProperties}
        >
          {business.name}
        </h1>
        <p
          className="hero-in text-lg md:text-xl mb-7 opacity-90"
          style={{ color: '#ffffff', '--hero-delay': '320ms' } as React.CSSProperties}
        >
          {business.tagline}
        </p>
        <div
          className="hero-in flex flex-col sm:flex-row gap-4 justify-center mb-7"
          style={{ '--hero-delay': '420ms' } as React.CSSProperties}
        >
          <a
            href="/inscripcion"
            className="px-8 py-4 font-semibold text-lg transition-all hover:opacity-90 hover:-translate-y-0.5 hover:scale-[1.02]"
            style={{
              backgroundColor: GOLD,
              color: '#1a1204',
              borderRadius: 'var(--demo-radius)',
            }}
          >
            Inscribí tu equipo
          </a>
          <a
            href="/posiciones"
            className="px-8 py-4 font-semibold text-lg border-2 transition-all hover:opacity-90 hover:-translate-y-0.5 hover:scale-[1.02]"
            style={{
              borderColor: '#ffffff',
              color: '#ffffff',
              borderRadius: 'var(--demo-radius)',
            }}
          >
            Ver posiciones
          </a>
        </div>

        {/* Selector de categoría — estilo "Estás viendo: SILVER CL 26" de
            torneogolden.com.ar, con borde dorado en vez del blanco translúcido
            anterior. La elección queda guardada (CategoryProvider) y se
            refleja en /posiciones, /fixture, /equipos y en el chip de abajo. */}
        <label
          className="hero-in inline-flex items-center gap-3 px-5 py-3 mb-4 text-sm font-medium"
          style={{
            backgroundColor: 'rgba(10,10,12,0.6)',
            color: '#ffffff',
            borderRadius: 'var(--demo-radius)',
            border: `1px solid color-mix(in srgb, ${GOLD} 55%, transparent)`,
            '--hero-delay': '520ms',
          } as React.CSSProperties}
        >
          Estás viendo:
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value as typeof categoria)}
            className="bg-transparent font-bold uppercase tracking-wide focus:outline-none"
            style={{ color: GOLD }}
          >
            {categorias.map((c) => (
              <option key={c} value={c} style={{ color: 'var(--demo-heading)', backgroundColor: 'var(--demo-surface)' }}>
                {c}
              </option>
            ))}
          </select>
        </label>

        {/* Chip "próximo partido" — mismo lenguaje visual que la tarjeta de
            "Mi próximo partido" de la app (pill + ícono), ahora dependiente
            de la categoría elegida arriba. */}
        <a
          href="/fixture"
          className="hero-in flex items-center justify-center gap-3 px-5 py-3 text-sm font-medium transition-all hover:opacity-80 hover:scale-[1.02]"
          style={{
            backgroundColor: 'rgba(10,10,12,0.6)',
            color: '#ffffff',
            borderRadius: 'var(--demo-radius)',
            border: `1px solid color-mix(in srgb, ${GOLD} 55%, transparent)`,
            '--hero-delay': '620ms',
          } as React.CSSProperties}
        >
          <Calendar size={16} style={{ color: GOLD }} />
          Próxima fecha {categoria}: {proximo.local} vs {proximo.visitante} · {proximo.hora}
        </a>
      </div>
    </section>
  )
}
