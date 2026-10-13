'use client'

import { useEffect, useState } from 'react'
import { proximaFechaDe } from '@/lib/torneo-data'
import { useCategoria } from '@/lib/category-context'
import { fechaDelPartido } from '@/components/match/MiProximoPartido'

// Home a media pantalla: video de la cancha bajo una capa navy (misma identidad que la app),
// título con brillo (idea de react-bits/ShinyText, en CSS) y cuenta regresiva a la próxima fecha.
export default function Hero() {
  const { categoria } = useCategoria()

  // Cuenta regresiva a la próxima fecha de la categoría elegida (solo si la fecha es futura).
  const [ahora, setAhora] = useState<number | null>(null)
  useEffect(() => { setAhora(Date.now()); const t = setInterval(() => setAhora(Date.now()), 60000); return () => clearInterval(t) }, [])
  const prox = proximaFechaDe(categoria)
  const inicio = fechaDelPartido(prox.fechaLabel, prox.partidos[0]?.hora ?? '')
  const falta = ahora && inicio ? inicio.getTime() - ahora : 0
  const dias = Math.floor(falta / 86400000), horas = Math.floor((falta % 86400000) / 3600000)

  return (
    <section id="hero" className="relative h-[50svh] min-h-[380px] overflow-hidden flex flex-col text-white" style={{ backgroundColor: '#062f36' }}>
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/video/home.mp4"
        poster="/images/home-poster.jpg"
        autoPlay muted loop playsInline preload="metadata"
      />
      <div className="absolute inset-0 bg-[#062f36]/80" />
      <div className="absolute inset-x-0 bottom-0 h-1/2" style={{ background: 'linear-gradient(180deg, transparent, rgba(6,47,54,0.95))' }} />

      <div className="relative flex-1 flex flex-col items-center justify-center text-center px-4 pt-16 pb-4">
        {falta > 0 && (
          <p className="hero-in mb-3 px-3 py-1 text-xs sm:text-sm font-semibold border border-white/25 bg-white/10 backdrop-blur-sm rounded-full" style={{ ['--d' as string]: '60ms' }}>
            {categoria} · Fecha {prox.numero} · faltan {dias > 0 ? `${dias} d ` : ''}{horas} h
          </p>
        )}
        <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl xl:text-8xl 2xl:text-9xl leading-[1.02] uppercase">
          <span className="hero-in block" style={{ ['--d' as string]: '120ms' }}>Torneo</span>
          <span className="hero-in block hero-shine" style={{ ['--d' as string]: '240ms' }}>Imperial</span>
        </h1>
        <p className="hero-in mt-6 sm:mt-8 xl:mt-10 max-w-xl 2xl:max-w-3xl text-sm sm:text-base xl:text-lg 2xl:text-2xl text-white/80" style={{ ['--d' as string]: '380ms' }}>
          Fixture, posiciones, goleadores y sanciones de las seis categorías, siempre al día.
        </p>
      </div>

      <style>{`
        .hero-in{opacity:0;animation:hero-up .8s var(--d,0ms) ease-out forwards}
        .hero-shine{background:linear-gradient(110deg,#f3a21c 35%,#fff3c4 50%,#f3a21c 65%) 0 0/250% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:hero-up .8s var(--d,0ms) ease-out forwards,hero-brillo 4s 1.2s linear infinite}
        @keyframes hero-up{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}
        @keyframes hero-brillo{from{background-position:150% 0}to{background-position:-100% 0}}
        @media (prefers-reduced-motion: reduce){.hero-in,.hero-shine{animation:none;opacity:1}}
      `}</style>
    </section>
  )
}
