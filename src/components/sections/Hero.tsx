'use client'

import { useEffect, useState } from 'react'
import { proximaFechaDe } from '@/lib/torneo-data'
import { useSitio } from '@/lib/useSitio'
import { useCategoria } from '@/lib/category-context'
import { fechaDelPartido } from '@/components/match/MiProximoPartido'

// Home a media pantalla: video de la cancha bajo una capa navy (misma identidad que la app),
// título con brillo (idea de react-bits/ShinyText, en CSS) y cuenta regresiva a la próxima fecha.
export default function Hero() {
  // Video vertical (720x1280) en celular y horizontal en pantallas grandes; null hasta saber el ancho.
  const [movil, setMovil] = useState<boolean | null>(null)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const f = () => setMovil(mq.matches)
    f(); mq.addEventListener('change', f)
    return () => mq.removeEventListener('change', f)
  }, [])

  const { categoria } = useCategoria()
  const { portada } = useSitio()

  // Cuenta regresiva a la próxima fecha de la categoría elegida (solo si la fecha es futura).
  const [ahora, setAhora] = useState<number | null>(null)
  useEffect(() => { setAhora(Date.now()); const t = setInterval(() => setAhora(Date.now()), 60000); return () => clearInterval(t) }, [])
  const prox = proximaFechaDe(categoria)
  const inicio = fechaDelPartido(prox.fechaLabel, prox.partidos[0]?.hora ?? '')
  const falta = ahora && inicio ? inicio.getTime() - ahora : 0
  const dias = Math.floor(falta / 86400000), horas = Math.floor((falta % 86400000) / 3600000)

  return (
    <section id="hero" className="relative h-[50svh] min-h-[460px] xl:min-h-[520px] 2xl:min-h-[680px] overflow-hidden flex flex-col text-white" style={{ backgroundColor: '#062f36' }}>
      {movil !== null && (
        <video
          key={movil ? 'm' : 'd'}
          className="absolute inset-0 h-full w-full object-cover"
          src={movil ? '/video/home-mobile.mp4' : '/video/home.mp4'}
          poster={movil ? '/images/home-poster-mobile.jpg' : '/images/home-poster.jpg'}
          autoPlay muted loop playsInline preload="metadata"
        />
      )}
      <div className="absolute inset-0 bg-[#062f36]/80" />
      <div className="absolute inset-x-0 bottom-0 h-1/2" style={{ background: 'linear-gradient(180deg, transparent, rgba(6,47,54,0.95))' }} />

      <div className="relative flex-1 flex flex-col items-center justify-center text-center px-4 pt-28 sm:pt-32 pb-14 sm:pb-16">
        {falta > 0 && (
          <p className="hero-in mb-3 px-3 py-1 text-xs sm:text-sm font-semibold border border-white/25 bg-white/10 backdrop-blur-sm rounded-full" style={{ ['--d' as string]: '60ms' }}>
            {categoria} · Fecha {prox.numero} · faltan {dias > 0 ? `${dias} d ` : ''}{horas} h
          </p>
        )}
        <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl xl:text-8xl 2xl:text-9xl leading-[1.02] uppercase">
          <span className="hero-in block" style={{ ['--d' as string]: '120ms' }}>Torneo</span>
          <span className="hero-in block hero-shine" style={{ ['--d' as string]: '240ms' }}>Imperial</span>
        </h1>
        <p className="hero-in mt-1 max-w-xl sm:max-w-2xl 2xl:max-w-4xl text-base sm:text-lg xl:text-xl 2xl:text-3xl text-white/85" style={{ ['--d' as string]: '380ms' }}>
          {portada.descripcion}
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
