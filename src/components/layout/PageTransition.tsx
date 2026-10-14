'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'

// inicio: cortina al abrir el sitio · entra: sube sobre la página actual · tapa: cubre mientras llega la nueva · sale: se va
type Fase = 'inicio' | 'idle' | 'entra' | 'tapa' | 'sale'

const INICIO_MS = 1700   // mínimo que se ve la pantalla de carga al abrir el sitio
const ENTRA_MS = 1000
const TAPA_MS = 800     // mínimo que se ve el logo al cambiar de página, ya con la página nueva cargada
const SALE_MS = 1300


// Un solo efecto: cortina que sube. Entra desde abajo y sale hacia arriba, siempre en la misma dirección,
// y se anima con transform (compuesto por la GPU), que es lo más fluido.
const ENTRADA: [string, string] = ['transform:translate3d(0,100%,0)', 'transform:translate3d(0,0,0)']
const SALIDA: [string, string] = ['transform:translate3d(0,0,0)', 'transform:translate3d(0,-100%,0)']

const EASE = 'cubic-bezier(.83,0,.17,1)'
const CSS = [
  `@keyframes pt-in{from{${ENTRADA[0]}}to{${ENTRADA[1]}}}.pt-in{animation:pt-in ${ENTRA_MS}ms ${EASE} both}`,
  `@keyframes pt-out{from{${SALIDA[0]}}to{${SALIDA[1]}}}.pt-out{animation:pt-out ${SALE_MS}ms ${EASE} both}`,
  `.pt-logo{animation:pt-logo .8s .1s cubic-bezier(.22,1,.36,1) both}`,
  `.pt-aro{stroke-dasharray:100;stroke-dashoffset:100;animation:pt-aro 1.3s .2s cubic-bezier(.65,0,.35,1) forwards}`,
  `.pt-in,.pt-out{will-change:transform}.pt-out .pt-logo{animation:pt-logo-out .55s ease-in both}`,
  `.pt-out .pt-aro{animation:none;stroke-dashoffset:0}`,
  `@keyframes pt-logo-out{from{opacity:1;transform:none}to{opacity:0;transform:scale(1.18)}}`,
  `@keyframes pt-logo{from{opacity:0;transform:scale(.7)}to{opacity:1;transform:none}}`,
  `@keyframes pt-aro{to{stroke-dashoffset:0}}`,
].join('')

// Pantalla de carga con el escudo: cubre todo al abrir el sitio (ya viene en el HTML del servidor, así que se ve
// antes que la página) y también al cambiar de página interceptando los links internos. Entrada y salida usan siempre la cortina que sube.
export default function PageTransition() {
  const router = useRouter()
  const pathname = usePathname()
  const [fase, setFase] = useState<Fase>('inicio')
  const destino = useRef<string | null>(null)
  const actual = useRef(pathname)

  // Mientras la cortina está puesta no se puede scrollear la página de abajo.
  useEffect(() => {
    document.documentElement.style.overflow = fase === 'idle' ? '' : 'hidden'
    return () => { document.documentElement.style.overflow = '' }
  }, [fase])

  // Al abrir el sitio: espera a que cargue todo (mínimo INICIO_MS) y se va con una animación al azar.
  useEffect(() => {
    const t0 = Date.now()
    let fin: ReturnType<typeof setTimeout>
    const salir = () => {
      fin = setTimeout(() => {
        setFase('sale')
        fin = setTimeout(() => setFase('idle'), SALE_MS + 50)
      }, Math.max(0, INICIO_MS - (Date.now() - t0)))
    }
    if (document.readyState === 'complete') salir()
    else window.addEventListener('load', salir, { once: true })
    return () => { window.removeEventListener('load', salir); clearTimeout(fin) }
  }, [])

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
      setTimeout(() => {
        setFase(f => (f === 'entra' ? 'tapa' : f))
        if (destino.current) router.push(destino.current)
      }, ENTRA_MS)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [router])

  // Llegó la página nueva: se queda tapada un rato con el logo y se va con una animación al azar.
  useEffect(() => {
    if (pathname === actual.current) return
    actual.current = pathname
    destino.current = null
    window.scrollTo(0, 0)
    setFase('tapa')
    const a = setTimeout(() => { setFase('sale') }, TAPA_MS)
    const b = setTimeout(() => setFase('idle'), TAPA_MS + SALE_MS + 50)
    return () => { clearTimeout(a); clearTimeout(b) }
  }, [pathname])

  if (fase === 'idle') return null
  const clase = fase === 'entra' ? 'pt-in' : fase === 'sale' ? 'pt-out' : ''
  return (
    <div
      aria-hidden="true"
      className={clase}
      // Estilos en línea para que cubra desde el primer pintado, aunque el CSS todavía no haya cargado.
      style={{ position: 'fixed', inset: 0, zIndex: 100, background: '#062f36', pointerEvents: 'auto' }}
    >
      <div className="absolute inset-x-0 top-0 h-1.5 bg-[#f3a21c]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative flex items-center justify-center h-40 w-40 pt-logo">
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
            <circle cx="50" cy="50" r="46" fill="none" stroke="#f3a21c" strokeWidth="2.5" strokeLinecap="round" pathLength="100" className="pt-aro" />
          </svg>
          <Image src="/images/logo-mark.png" alt="" width={150} height={150} priority className="h-20 w-20 object-contain" />
        </div>
      </div>
      <style>{CSS}</style>
    </div>
  )
}
