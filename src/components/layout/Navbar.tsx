'use client'

import { useEffect, useState } from 'react'
import Marca from './Marca'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSitio } from '@/lib/useSitio'

// Sobre las páginas con mini hero oscuro arranca transparente y pasa a sólido al scrollear.
export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const ruta = usePathname()
  const activo = (href: string) => (href === '/' ? ruta === '/' : ruta === href || ruta.startsWith(href + '/'))
  const sobreHero = !['/ingresar', '/panel', '/delegado', '/jugador'].some((r) => ruta.startsWith(r))
  const { business, cta, sitemap } = useSitio()
  const links = [...sitemap, { label: 'Ingresar', href: '/ingresar' }]
  const solido = !sobreHero || scrolled || open

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // El menú móvil se cierra con Esc, al cambiar de página y si la pantalla pasa a escritorio.
  useEffect(() => { setOpen(false) }, [ruta])
  useEffect(() => {
    if (!open) return
    const tecla = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    const ancho = () => { if (window.innerWidth >= 768) setOpen(false) }
    document.addEventListener('keydown', tecla)
    window.addEventListener('resize', ancho)
    return () => { document.removeEventListener('keydown', tecla); window.removeEventListener('resize', ancho) }
  }, [open])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-300"
      style={{
        backgroundColor: solido ? 'var(--demo-structural)' : 'transparent',
        borderColor: solido ? 'var(--demo-border)' : 'transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex-shrink-0 mr-6">
            <Marca />
          </Link>

          <nav className="hidden md:flex items-center gap-5">
            {links.map((l) => (
              <Link
              key={l.href}
              href={l.href}
              aria-current={activo(l.href) ? 'page' : undefined}
              className={`relative py-1 text-sm whitespace-nowrap transition-opacity hover:opacity-100 ${activo(l.href) ? 'font-bold opacity-100' : 'font-medium opacity-80'} after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-[var(--demo-accent)] after:origin-left after:transition-transform after:duration-300 ${activo(l.href) ? 'after:scale-x-100' : 'after:scale-x-0'}`}
              style={{ color: 'var(--demo-on-structural)' }}
            >
                {l.label}
              </Link>
            ))}
            <Link
              href="/inscripcion"
              className="inline-flex items-center h-10 px-5 text-sm font-bold whitespace-nowrap transition-all hover:brightness-110"
              style={{ backgroundColor: 'var(--demo-accent)', color: 'var(--demo-on-accent)', borderRadius: '0.5rem' }}
            >
              {cta.label}
            </Link>
          </nav>

          <button
            className="md:hidden relative h-11 w-11 -mr-2 flex items-center justify-center active:scale-90 transition-transform duration-150"
            onClick={() => setOpen(!open)}
            style={{ color: 'var(--demo-on-structural)' }}
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
            aria-controls="menu-movil"
          >
            <span className="hamburguesa" data-open={open} aria-hidden><i /><i /><i /></span>
          </button>
        </div>
      </div>

      {/* Fondo que atenúa la página y cierra el menú al tocarlo */}
      <div className="menu-fondo md:hidden" data-open={open} onClick={() => setOpen(false)} aria-hidden />
      <div id="menu-movil" className="menu-movil md:hidden" data-open={open}>
        <div className="border-t" style={{ backgroundColor: 'var(--demo-structural)', borderColor: 'var(--demo-border)' }}>
          <div className="px-4 py-4 flex flex-col gap-1">
            {links.map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={activo(l.href) ? 'page' : undefined}
                className={`menu-item text-base py-3 pl-3 border-l-2 active:bg-white/10 transition-colors ${activo(l.href) ? 'font-bold border-[var(--demo-accent)]' : 'font-medium border-transparent opacity-90'}`}
                style={{ color: 'var(--demo-on-structural)', ['--i' as string]: i } as React.CSSProperties}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/inscripcion"
              className="menu-item mt-3 px-5 py-3.5 text-sm font-bold text-center active:scale-[0.98]"
              style={{ backgroundColor: 'var(--demo-accent)', color: 'var(--demo-on-accent)', borderRadius: '0.5rem', ['--i' as string]: links.length } as React.CSSProperties}
              onClick={() => setOpen(false)}
            >
              {cta.label}
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
