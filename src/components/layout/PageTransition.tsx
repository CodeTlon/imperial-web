'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'

type Fase = 'idle' | 'entra' | 'sale'

// Transición entre páginas: una cortina navy sube con un filo amarillo, el escudo aparece con un aro
// de progreso, y cuando carga la página nueva la cortina se va hacia arriba. Intercepta los links internos.
export default function PageTransition() {
  const router = useRouter()
  const pathname = usePathname()
  const [fase, setFase] = useState<Fase>('idle')
  const destino = useRef<string | null>(null)
  const actual = useRef(pathname)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as HTMLElement).closest('a')
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return
      const url = new URL(a.href, window.location.href)
      if (url.origin !== window.location.origin) return
      if (url.pathname === window.location.pathname) return   // mismo path o solo ancla: navegación normal
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      e.preventDefault()
      destino.current = url.pathname + url.search + url.hash
      setFase('entra')
      setTimeout(() => destino.current && router.push(destino.current), 550)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [router])

  // Llegó la página nueva: se levanta la cortina.
  useEffect(() => {
    if (pathname === actual.current) return
    actual.current = pathname
    destino.current = null
    window.scrollTo(0, 0)
    const a = setTimeout(() => setFase('sale'), 350)
    const b = setTimeout(() => setFase('idle'), 350 + 700)
    return () => { clearTimeout(a); clearTimeout(b) }
  }, [pathname])

  if (fase === 'idle') return null
  return (
    <div aria-hidden="true" className={`fixed inset-0 z-[100] pointer-events-auto ${fase === 'entra' ? 'pt-entra' : 'pt-sale'}`}>
      <div className="absolute inset-0 bg-[#0c1d3d]" />
      <div className="absolute inset-x-0 top-0 h-1.5 bg-[#ffc72c]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative flex items-center justify-center h-40 w-40 pt-logo">
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
            <circle cx="50" cy="50" r="46" fill="none" stroke="#ffc72c" strokeWidth="2.5" strokeLinecap="round" pathLength="100" className="pt-aro" />
          </svg>
          <Image src="/images/logo-mark.png" alt="" width={150} height={150} priority className="h-20 w-20 object-contain" />
        </div>
      </div>
      <style>{`
        .pt-entra{animation:pt-sube .55s cubic-bezier(.76,0,.24,1) both}
        .pt-sale{animation:pt-va .7s cubic-bezier(.76,0,.24,1) both}
        .pt-logo{animation:pt-logo .5s .15s ease-out both}
        .pt-aro{stroke-dasharray:100;stroke-dashoffset:100;animation:pt-aro .9s .2s ease-in-out forwards}
        .pt-sale .pt-logo{animation:none;opacity:1}
        .pt-sale .pt-aro{animation:none;stroke-dashoffset:0}
        @keyframes pt-sube{from{transform:translateY(100%)}to{transform:none}}
        @keyframes pt-va{from{transform:none}to{transform:translateY(-100%)}}
        @keyframes pt-logo{from{opacity:0;transform:scale(.7)}to{opacity:1;transform:none}}
        @keyframes pt-aro{to{stroke-dashoffset:0}}
      `}</style>
    </div>
  )
}
