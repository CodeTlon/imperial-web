'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { EVENTO_NAVEGAR, type NavegarDetalle } from '@/lib/navegar'

// inicio: cortina al abrir el sitio · entra: sube sobre la página actual · tapa: cubre mientras llega la nueva · sale: se va
type Fase = 'inicio' | 'idle' | 'entra' | 'tapa' | 'sale'

const INICIO_MS = 600    // mínimo que se ve la pantalla de carga al abrir el sitio (después dura lo que tarde en cargar)
const TOPE_INICIO_MS = 4000   // si algún recurso se cuelga, al abrir el sitio no se espera más que esto
const TOPE_PAGINA_MS = 4000   // ídem al cambiar de página
const ENTRA_MS = 450
const TAPA_MS = 300     // mínimo que se ve el logo al cambiar de página; después dura lo que tarden en cargar las imágenes de esa página
const SALE_MS = 600


// Un solo efecto: cortina que sube. Entra desde abajo y sale hacia arriba, siempre en la misma dirección,
// y se anima con transform (compuesto por la GPU), que es lo más fluido.
const ENTRADA: [string, string] = ['transform:translate3d(0,100%,0)', 'transform:translate3d(0,0,0)']
const SALIDA: [string, string] = ['transform:translate3d(0,0,0)', 'transform:translate3d(0,-100%,0)']

const EASE = 'cubic-bezier(.83,0,.17,1)'
const CSS = [
  `@keyframes pt-in{from{${ENTRADA[0]}}to{${ENTRADA[1]}}}.pt-in{animation:pt-in ${ENTRA_MS}ms ${EASE} both}`,
  `@keyframes pt-out{from{${SALIDA[0]}}to{${SALIDA[1]}}}.pt-out{animation:pt-out ${SALE_MS}ms ${EASE} both}`,
  `.pt-logo{animation:pt-logo .45s .05s cubic-bezier(.22,1,.36,1) both}`,
  `.pt-aro{animation:pt-giro .9s linear infinite;will-change:transform}`,
  `.pt-in,.pt-out{will-change:transform}.pt-out .pt-logo{animation:pt-logo-out .3s ease-in both}`,
  `@keyframes pt-logo-out{from{opacity:1;transform:none}to{opacity:0;transform:scale(1.18)}}`,
  `@keyframes pt-logo{from{opacity:0;transform:scale(.7)}to{opacity:1;transform:none}}`,
  `@keyframes pt-giro{to{transform:rotate(360deg)}}`,
].join('')

// Espera a lo que la página nueva necesita para verse completa: fuentes, imágenes que están en pantalla (o casi)
// y el póster del video. Las imágenes más abajo no se esperan: se cargan mientras se scrollea. `tope` evita colgarse.
function esperarRecursos(tope: number): Promise<void> {
  return new Promise((resolve) => {
    const corte = setTimeout(resolve, tope)
    // Dos cuadros de espera: así React ya pintó la página nueva y se pueden contar sus imágenes.
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const limite = window.innerHeight * 1.25
      const pendientes: Promise<unknown>[] = []
      document.querySelectorAll('img').forEach((img) => {
        if (img.complete || !(img.currentSrc || img.src)) return
        const r = img.getBoundingClientRect()
        if (r.bottom < 0 || r.top > limite) return
        pendientes.push(new Promise((ok) => { img.addEventListener('load', ok, { once: true }); img.addEventListener('error', ok, { once: true }) }))
      })
      document.querySelectorAll<HTMLVideoElement>('video[poster]').forEach((v) => {
        const im = new window.Image()
        pendientes.push(new Promise((ok) => { im.onload = im.onerror = () => ok(null); im.src = v.poster }))
      })
      if (document.fonts?.ready) pendientes.push(document.fonts.ready)
      Promise.all(pendientes).then(() => { clearTimeout(corte); resolve() })
    }))
  })
}

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

  // Al abrir el sitio: dura lo que tarde en cargar todo (mínimo INICIO_MS, máximo TOPE_INICIO_MS) y se va.
  useEffect(() => {
    const t0 = Date.now()
    let fin: ReturnType<typeof setTimeout>
    let saliendo = false
    const salir = () => {
      if (saliendo) return
      saliendo = true
      fin = setTimeout(() => {
        setFase('sale')
        fin = setTimeout(() => setFase('idle'), SALE_MS + 50)
      }, Math.max(0, INICIO_MS - (Date.now() - t0)))
    }
    const tope = setTimeout(salir, TOPE_INICIO_MS)
    if (document.readyState === 'complete') salir()
    else window.addEventListener('load', salir, { once: true })
    return () => { window.removeEventListener('load', salir); clearTimeout(tope); clearTimeout(fin) }
  }, [])

  useEffect(() => {
    // Fase de captura: corre antes que el onClick de next/link (que navega al instante y marca el evento como
    // prevenido). Así la cortina entra primero y recién después se cambia de página.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as HTMLElement).closest('a')
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return
      const url = new URL(a.href, window.location.href)
      if (url.origin !== window.location.origin) return
      if (url.pathname === window.location.pathname) return   // mismo path o solo ancla: navegación normal
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      e.preventDefault()
      e.stopPropagation()
      destino.current = url.pathname + url.search + url.hash
      setFase('entra')
      setTimeout(() => {
        setFase(f => (f === 'entra' ? 'tapa' : f))
        if (destino.current) router.push(destino.current)
      }, ENTRA_MS)
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [router])

  // Navegación pedida por código (ej. botón "Salir"): la cortina cubre primero y recién ahí corre `antes`
  // (borrar la sesión) y se cambia de página, así no se ve ni un cuadro del destino ni del panel vaciándose.
  useEffect(() => {
    const onNavegar = (e: Event) => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return   // navegarConCortina navega directo
      const { href, antes } = (e as CustomEvent<NavegarDetalle>).detail
      e.preventDefault()   // avisa que alguien lo escucha
      destino.current = href
      setFase('entra')
      setTimeout(() => {
        antes?.()
        setFase(f => (f === 'entra' ? 'tapa' : f))
        router.replace(href)
      }, ENTRA_MS)
    }
    window.addEventListener(EVENTO_NAVEGAR, onNavegar)
    return () => window.removeEventListener(EVENTO_NAVEGAR, onNavegar)
  }, [router])

  // Llegó la página nueva: se queda tapada un rato con el logo y se va con una animación al azar.
  useEffect(() => {
    if (pathname === actual.current) return
    actual.current = pathname
    destino.current = null
    window.scrollTo(0, 0)
    setFase('tapa')
    // La cortina queda hasta que carguen las imágenes de esta página (mínimo TAPA_MS) y recién ahí sale.
    let vivo = true
    let fin: ReturnType<typeof setTimeout>
    const t0 = Date.now()
    esperarRecursos(TOPE_PAGINA_MS).then(() => {
      if (!vivo) return
      fin = setTimeout(() => {
        setFase('sale')
        fin = setTimeout(() => setFase('idle'), SALE_MS + 50)
      }, Math.max(0, TAPA_MS - (Date.now() - t0)))
    })
    return () => { vivo = false; clearTimeout(fin) }
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
          <svg className="absolute inset-0" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
          </svg>
          {/* arco que gira: solo transform (compositor), sin progreso que pueda saltar */}
          <svg className="absolute inset-0 pt-aro" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" fill="none" stroke="#f3a21c" strokeWidth="2.5" strokeLinecap="round" pathLength="100" strokeDasharray="30 70" />
          </svg>
          <Image src="/images/logo-mark.png" alt="" width={150} height={150} priority className="h-20 w-20 object-contain" />
        </div>
      </div>
      <style>{CSS}</style>
    </div>
  )
}
