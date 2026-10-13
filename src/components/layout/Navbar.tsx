'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { demoConfig } from '@/lib/demo-config'

// Sobre el home (video a pantalla completa) arranca transparente y pasa a navy al scrollear.
export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const esHome = usePathname() === '/'
  const { business, cta, sitemap } = demoConfig
  const links = [...sitemap, { label: 'Ingresar', href: '/ingresar' }]
  const solido = !esHome || scrolled || open

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 mr-6">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white p-1 flex items-center justify-center">
              <Image src="/images/logo-mark.png" alt="" width={180} height={320} className="w-full h-full object-contain" />
            </span>
            <span className="text-xl font-bold tracking-tight whitespace-nowrap" style={{ color: 'var(--demo-on-structural)' }}>
              {business.name}
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-5">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="text-sm font-medium whitespace-nowrap transition-opacity hover:opacity-70" style={{ color: 'var(--demo-on-structural)' }}>
                {l.label}
              </Link>
            ))}
            <Link
              href="/inscripcion"
              className="px-4 py-2 text-sm font-semibold whitespace-nowrap transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--demo-accent)', color: 'var(--demo-on-accent)', borderRadius: 'var(--demo-radius)' }}
            >
              {cta.label}
            </Link>
          </nav>

          <button className="md:hidden p-2" onClick={() => setOpen(!open)} style={{ color: 'var(--demo-on-structural)' }} aria-label="Menú">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t px-4 py-4 flex flex-col gap-3" style={{ backgroundColor: 'var(--demo-structural)', borderColor: 'var(--demo-border)' }}>
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm font-medium py-2" style={{ color: 'var(--demo-on-structural)' }} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <Link
            href="/inscripcion"
            className="mt-2 px-4 py-2 text-sm font-semibold text-center"
            style={{ backgroundColor: 'var(--demo-accent)', color: 'var(--demo-on-accent)', borderRadius: 'var(--demo-radius)' }}
            onClick={() => setOpen(false)}
          >
            {cta.label}
          </Link>
        </div>
      )}
    </header>
  )
}
