'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { demoConfig } from '@/lib/demo-config'

const DURACION_SPLASH = 1700
const CLAVE = 'imperial-splash-visto'

// Pantalla de arranque con el logo (una vez por sesión) + velo corto con el
// logo al cambiar de página. Solo CSS: sin librerías de animación.
export default function LoadingScreen() {
  const pathname = usePathname()
  const [pathInicial] = useState(pathname)
  // Arranca visible (también en el HTML del servidor) para que no haya un
  // destello del contenido antes de que cargue.
  const [fase, setFase] = useState<'visible' | 'saliendo' | 'oculta'>('visible')

  useEffect(() => {
    let visto = false
    try {
      visto = window.sessionStorage.getItem(CLAVE) === '1'
    } catch {}
    const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (visto || sinMovimiento) {
      setFase('oculta')
      return
    }
    try {
      window.sessionStorage.setItem(CLAVE, '1')
    } catch {}
    const salir = setTimeout(() => setFase('saliendo'), DURACION_SPLASH)
    const fin = setTimeout(() => setFase('oculta'), DURACION_SPLASH + 450)
    return () => {
      clearTimeout(salir)
      clearTimeout(fin)
    }
  }, [])

  return (
    <>
      {fase !== 'oculta' && (
        <div
          aria-hidden
          className={`splash ${fase === 'saliendo' ? 'splash-out' : ''}`}
          style={{ backgroundColor: 'var(--demo-structural)' }}
        >
          <div className="splash-logo-wrap">
            <span className="splash-ring" />
            <Image src="/images/logo-mark.png" alt="" width={180} height={320} priority className="splash-logo" />
          </div>
          <p className="splash-title" style={{ color: 'var(--demo-on-structural)' }}>{demoConfig.business.name}</p>
          <div className="splash-bar"><span style={{ animationDuration: `${DURACION_SPLASH}ms` }} /></div>
        </div>
      )}
      {pathname !== pathInicial && fase === 'oculta' && (
        <div key={pathname} aria-hidden className="route-veil" style={{ backgroundColor: 'var(--demo-structural)' }}>
          <Image src="/images/logo-mark.png" alt="" width={180} height={320} className="route-veil-logo" />
        </div>
      )}
    </>
  )
}
