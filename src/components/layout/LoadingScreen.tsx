'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

const CLAVE = 'ti-splash-visto'
const DURACION = 2600

// Pantalla de carga con la misma identidad que la app: video de la cancha bajo una capa navy,
// escudo en fundido (sin rebotes) y el wordmark. Se muestra una vez por sesión y respeta reduced-motion.
export default function LoadingScreen() {
  const [visible, setVisible] = useState(false)
  const [saliendo, setSaliendo] = useState(false)

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(CLAVE) === '1') return
      window.sessionStorage.setItem(CLAVE, '1')
    } catch {}
    const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setVisible(true)
    const a = setTimeout(() => setSaliendo(true), reducido ? 600 : DURACION)
    const b = setTimeout(() => setVisible(false), (reducido ? 600 : DURACION) + 600)
    return () => { clearTimeout(a); clearTimeout(b) }
  }, [])

  if (!visible) return null
  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] overflow-hidden bg-[#0c1d3d] transition-opacity duration-500 ${saliendo ? 'opacity-0' : 'opacity-100'}`}
    >
      <video className="absolute inset-0 h-full w-full object-cover" src="/video/splash.mp4" autoPlay muted loop playsInline />
      <div className="absolute inset-0 bg-[#0c1d3d]/90" />
      <div className="absolute inset-0 flex items-center justify-center pb-40">
        <Image src="/images/logo-mark.png" alt="" width={150} height={150} priority className="h-36 w-36 object-contain animate-[ti-fade_0.9s_ease-out_both]" />
      </div>
      <div className="absolute left-7 right-7 bottom-24 text-white">
        <p className="font-heading text-6xl sm:text-7xl leading-[1.05] animate-[ti-up_0.8s_0.5s_ease-out_both]">TORNEO</p>
        <p className="font-heading text-6xl sm:text-7xl leading-[1.05] animate-[ti-up_0.8s_0.7s_ease-out_both]">IMPERIAL</p>
        <div className="mt-4 flex items-center gap-3 animate-[ti-fade_0.8s_1.2s_ease-out_both]">
          <span className="h-0.5 w-8 bg-[#ffc72c]" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#ffc72c]">Coronado de Gloria</span>
        </div>
      </div>
      <div className="absolute left-7 right-7 bottom-14 h-0.5 rounded bg-white/15 overflow-hidden">
        <div className="h-full bg-[#ffc72c] animate-[ti-barra_2.4s_0.3s_ease-in-out_both]" />
      </div>
      <style>{`
        @keyframes ti-fade{from{opacity:0}to{opacity:1}}
        @keyframes ti-up{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}
        @keyframes ti-barra{from{width:0}to{width:100%}}
        @media (prefers-reduced-motion: reduce){*{animation:none!important}}
      `}</style>
    </div>
  )
}
