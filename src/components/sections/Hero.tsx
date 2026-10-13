'use client'

import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import CountUp from '@/components/ui/CountUp'
import { categorias, posiciones, proximaFechaDe, type Categoria } from '@/lib/torneo-data'
import { useCategoria } from '@/lib/category-context'

// Home a pantalla completa: video de la cancha bajo una capa navy (misma identidad que la app),
// título con brillo (idea de react-bits/ShinyText, en CSS) y las 6 categorías como stats clicables.
export default function Hero() {
  const { categoria, setCategoria } = useCategoria()

  const elegir = (c: Categoria) => {
    setCategoria(c)
    document.getElementById('torneo')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="hero" className="relative min-h-[100svh] overflow-hidden flex flex-col text-white" style={{ backgroundColor: '#0c1d3d' }}>
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/video/home.mp4"
        poster="/images/home-poster.jpg"
        autoPlay muted loop playsInline preload="metadata"
      />
      <div className="absolute inset-0 bg-[#0c1d3d]/80" />
      <div className="absolute inset-x-0 bottom-0 h-1/2" style={{ background: 'linear-gradient(180deg, transparent, rgba(12,29,61,0.95))' }} />

      <div className="relative flex-1 flex flex-col items-center justify-center text-center px-4 pt-28 pb-8">
        <p className="hero-in text-xs font-bold uppercase tracking-[0.25em] text-[#ffc72c] mb-5" style={{ ['--d' as string]: '0ms' }}>
          Coronado de Gloria · Córdoba
        </p>
        <h1 className="font-heading text-6xl sm:text-7xl md:text-8xl leading-[1.02] uppercase">
          <span className="hero-in block" style={{ ['--d' as string]: '120ms' }}>Torneo</span>
          <span className="hero-in block hero-shine" style={{ ['--d' as string]: '240ms' }}>Imperial</span>
        </h1>
        <p className="hero-in mt-5 max-w-xl text-base sm:text-lg text-white/80" style={{ ['--d' as string]: '380ms' }}>
          Fútbol amateur con la info del torneo al toque: fixture, posiciones y goleadores de todas las categorías.
        </p>
        <div className="hero-in mt-8 flex flex-wrap justify-center gap-3" style={{ ['--d' as string]: '500ms' }}>
          <Link
            href="/inscripcion"
            className="px-7 py-3.5 font-semibold transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--demo-accent)', color: 'var(--demo-on-accent)', borderRadius: 'var(--demo-radius)' }}
          >
            Inscribí a tu equipo
          </Link>
          <a
            href="#torneo"
            className="px-7 py-3.5 font-semibold border border-white/40 backdrop-blur-sm transition-colors hover:bg-white/10"
            style={{ borderRadius: 'var(--demo-radius)' }}
          >
            Ver el fixture
          </a>
        </div>
      </div>

      {/* Stats de las 6 categorías */}
      <div className="relative max-w-6xl w-full mx-auto px-4 sm:px-6 pb-8">
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
          {categorias.map((c, i) => {
            const activa = c === categoria
            return (
              <button
                key={c}
                onClick={() => elegir(c)}
                className="hero-in text-left p-3 sm:p-4 backdrop-blur-md border transition-colors"
                style={{
                  ['--d' as string]: `${600 + i * 70}ms`,
                  borderRadius: 'var(--demo-radius-lg)',
                  backgroundColor: activa ? 'rgba(255,199,44,0.18)' : 'rgba(255,255,255,0.08)',
                  borderColor: activa ? '#ffc72c' : 'rgba(255,255,255,0.18)',
                }}
              >
                <p className="font-heading text-base min-[400px]:text-lg sm:text-3xl leading-none truncate" style={{ color: activa ? '#ffc72c' : '#fff' }}>{c}</p>
                <p className="mt-2 text-xl sm:text-2xl font-bold tabular-nums leading-none">
                  <CountUp value={String(posiciones[c].length)} />
                </p>
                <p className="text-[10px] sm:text-xs uppercase tracking-wider text-white/70 mt-1">equipos · fecha {proximaFechaDe(c).numero}</p>
              </button>
            )
          })}
        </div>
        <a href="#torneo" aria-label="Bajar" className="mt-5 flex justify-center text-white/70 animate-bounce">
          <ChevronDown size={26} />
        </a>
      </div>

      <style>{`
        .hero-in{opacity:0;animation:hero-up .8s var(--d,0ms) ease-out forwards}
        .hero-shine{background:linear-gradient(110deg,#ffc72c 35%,#fff3c4 50%,#ffc72c 65%) 0 0/250% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:hero-up .8s var(--d,0ms) ease-out forwards,hero-brillo 4s 1.2s linear infinite}
        @keyframes hero-up{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}
        @keyframes hero-brillo{from{background-position:150% 0}to{background-position:-100% 0}}
        @media (prefers-reduced-motion: reduce){.hero-in,.hero-shine{animation:none;opacity:1}}
      `}</style>
    </section>
  )
}
