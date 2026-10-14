import Link from 'next/link'
import Marca from './Marca'
import { MapPin, Phone, Mail } from 'lucide-react'
import { InstagramIcon, FacebookIcon } from '@/components/icons/BrandIcons'
import Image from 'next/image'
import { demoConfig } from '@/lib/demo-config'

const sponsors = [
  { name: 'Gatorade', src: '/images/sponsors/gatorade-t.png' },
  { name: 'Quilmes', src: '/images/sponsors/quilmes-t.png' },
  { name: 'IFK Sports', src: '/images/sponsors/ifk-t.png' },
  { name: 'Speed Unlimited', src: '/images/sponsors/speed-t.png' },
  { name: 'Vidón Bar', src: '/images/sponsors/vidon-t.png' },
]

export default function Footer() {
  const { business, sitemap } = demoConfig

  return (
    <footer style={{ backgroundColor: 'var(--demo-structural)', color: 'var(--demo-on-structural)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className={`grid grid-cols-1 gap-10 ${sitemap.length > 0 ? 'md:grid-cols-4' : 'md:grid-cols-3'}`}>

          {/* Columna 1: Nombre + tagline */}
          <div>
            <Link href="/" className="inline-block mb-3"><Marca /></Link>
            <p className="text-sm opacity-60 leading-relaxed">{business.tagline}</p>
          </div>

          {/* Columna sitemap: solo si el demo tiene rutas propias además del home */}
          {sitemap.length > 0 && (
            <nav aria-label="Mapa del sitio">
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-widest opacity-50">
                Explorar
              </h4>
              <ul className="space-y-3 text-sm">
                {sitemap.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="opacity-80 hover:opacity-100 transition-opacity">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {/* Columna 2: Contacto */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-widest opacity-50">
              Contacto
            </h4>
            <ul className="space-y-3 text-sm">
              {business.address && (
                <li className="flex items-start gap-2 opacity-80">
                  <MapPin size={16} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--demo-accent)' }} />
                  {business.address}
                </li>
              )}
              {business.phone && (
                <li className="flex items-center gap-2 opacity-80">
                  <Phone size={16} style={{ color: 'var(--demo-accent)' }} />
                  {business.phone}
                </li>
              )}
              {business.email && (
                <li className="flex items-center gap-2 opacity-80">
                  <Mail size={16} style={{ color: 'var(--demo-accent)' }} />
                  {business.email}
                </li>
              )}
            </ul>
          </div>

          {/* Columna 3: Redes sociales */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-widest opacity-50">
              Seguinos
            </h4>
            <div className="flex flex-col gap-3">
              {business.instagram && (
                <a
                  href={`https://instagram.com/${business.instagram.replace('@', '')}`}
                  className="inline-flex items-center gap-2 text-sm opacity-80 hover:opacity-100 transition-opacity"
                >
                  <InstagramIcon size={18} style={{ color: 'var(--demo-accent)' }} />
                  {business.instagram}
                </a>
              )}
              {business.facebook && (
                <a
                  href={`https://facebook.com/${business.facebook}`}
                  className="inline-flex items-center gap-2 text-sm opacity-80 hover:opacity-100 transition-opacity"
                >
                  <FacebookIcon size={18} style={{ color: 'var(--demo-accent)' }} />
                  Facebook
                </a>
              )}
            </div>

            <p className="mt-6 mb-3 text-[10px] font-semibold uppercase tracking-widest opacity-50">Nos acompañan</p>
            <ul className="flex flex-wrap items-center gap-x-3 gap-y-3 max-w-[17rem] lg:max-w-none lg:flex-nowrap lg:gap-x-2.5 2xl:gap-x-5">
              {sponsors.map((s) => (
                <li key={s.name} className="relative h-8 w-14 lg:h-6 lg:w-10 2xl:h-8 2xl:w-14 opacity-85 transition-opacity hover:opacity-100">
                  <Image src={s.src} alt={s.name} fill sizes="80px" className="object-contain" />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="mt-8 pt-8 border-t text-center text-xs opacity-40"
          style={{ borderColor: 'var(--demo-border)' }}
        >
          © {new Date().getFullYear()} {business.name}. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
