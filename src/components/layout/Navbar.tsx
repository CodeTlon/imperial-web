'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { demoConfig } from '@/lib/demo-config'

const navLinks = [
  { label: 'Inicio',         href: '#hero' },
  { label: 'Nosotros',       href: '#about',    show: 'about' },
  { label: 'Nuestras Ligas', href: '#services', show: 'services' },
  { label: 'Instalaciones',  href: '#gallery',  show: 'gallery' },
  { label: 'Reglamento',     href: '#faq',      show: 'faq' },
  { label: 'Contacto',       href: '#contact',  show: 'contact' },
] as const

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { sections, business, cta, sitemap } = demoConfig

  const visibleLinks = [
    ...sitemap,
    ...navLinks.filter((l) => !('show' in l) || sections[l.show as keyof typeof sections]),
  ]

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b"
      style={{ backgroundColor: 'var(--demo-structural)', borderColor: 'var(--demo-border)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Nombre */}
          <a href="#hero" className="flex items-center gap-2.5 flex-shrink-0 mr-6">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white p-1 flex items-center justify-center">
              <Image src="/images/logo-mark.png" alt="" width={180} height={320} className="w-full h-full object-contain" />
            </span>
            <span className="text-xl font-bold tracking-tight whitespace-nowrap" style={{ color: 'var(--demo-on-structural)' }}>
              {business.name}
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-5">
            {visibleLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium whitespace-nowrap transition-opacity hover:opacity-70"
                style={{ color: 'var(--demo-on-structural)' }}
              >
                {link.label}
              </a>
            ))}
            <a
              href="/inscripcion"
              className="px-4 py-2 text-sm font-semibold whitespace-nowrap flex-shrink-0 transition-opacity hover:opacity-90"
              style={{
                backgroundColor: 'var(--demo-accent)',
                color: 'var(--demo-on-accent)',
                borderRadius: 'var(--demo-radius)',
              }}
            >
              {cta.label}
            </a>
          </nav>

          {/* Mobile burger */}
          <button
            className="md:hidden p-2"
            onClick={() => setOpen(!open)}
            style={{ color: 'var(--demo-on-structural)' }}
            aria-label="Menú"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden border-t px-4 py-4 flex flex-col gap-3"
          style={{ backgroundColor: 'var(--demo-structural)', borderColor: 'var(--demo-border)' }}
        >
          {visibleLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium py-2 transition-opacity hover:opacity-70"
              style={{ color: 'var(--demo-on-structural)' }}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="/inscripcion"
            className="mt-2 px-4 py-2 text-sm font-semibold text-center"
            style={{
              backgroundColor: 'var(--demo-accent)',
              color: 'var(--demo-on-accent)',
              borderRadius: 'var(--demo-radius)',
            }}
            onClick={() => setOpen(false)}
          >
            {cta.label}
          </a>
        </div>
      )}
    </header>
  )
}
