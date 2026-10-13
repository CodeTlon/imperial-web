import Link from 'next/link'
import Marca from './Marca'
import { MapPin, Phone, Mail } from 'lucide-react'
import { InstagramIcon, FacebookIcon } from '@/components/icons/BrandIcons'
import Image from 'next/image'
import { demoConfig } from '@/lib/demo-config'

const sponsors = [
  { name: 'Gatorade', src: '/images/sponsors/gatorade.png' },
  { name: 'Quilmes', src: '/images/sponsors/quilmes.png' },
  { name: 'IFK Sports', src: '/images/sponsors/ifk.jpeg' },
  { name: 'Speed Unlimited', src: '/images/sponsors/speed.png' },
  { name: 'Vidón Bar', src: '/images/sponsors/vidon.png' },
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
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center" style={{ borderColor: 'var(--demo-border)' }}>
          <p className="text-xs font-semibold uppercase tracking-widest opacity-50 mb-5">Nos acompañan</p>
          <ul className="flex flex-wrap items-center justify-center gap-4 2xl:gap-6">
            {sponsors.map((s) => (
              <li key={s.name} className="relative h-16 w-16 sm:h-20 sm:w-20 2xl:h-24 2xl:w-24 overflow-hidden rounded-xl grayscale opacity-80 transition hover:grayscale-0 hover:opacity-100">
                <Image src={s.src} alt={s.name} fill sizes="96px" className="object-cover" />
              </li>
            ))}
          </ul>
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
