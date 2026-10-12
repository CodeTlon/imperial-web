import { ListOrdered, Target, ShieldAlert, BookOpen, Trophy, Smartphone } from 'lucide-react'
import { WhatsAppIcon } from '@/components/icons/BrandIcons'
import { demoConfig } from '@/lib/demo-config'
import { waLink } from '@/lib/utils'

// Mismo patrón que el grid de "accesos rápidos" de la app mobile
// (torneo-imperial-app/src/app/(tabs)/inicio.tsx) — se porta acá el layout,
// no el código: card clara + chip de ícono oscuro sobre fondo estructural.
const accesos = [
  { icon: ListOrdered, label: 'Tabla de posiciones', href: '/posiciones' },
  { icon: Target,      label: 'Goleadores',          href: '/posiciones' },
  { icon: ShieldAlert, label: 'Sanciones y descargos', href: '/sanciones' },
  { icon: BookOpen,    label: 'Reglamento',           href: '/reglamento' },
  { icon: Trophy,      label: 'Campeones',            href: '/campeones' },
]

const roles = ['Jugador', 'Delegado', 'Organización', 'Hincha']

// Esquema de la app (app.json → scheme). Si la app está instalada abre directo; si no, no pasa nada.
const APP_LINK = 'torneoimperial://'

export default function AppShowcase() {
  const { business } = demoConfig

  return (
    <section
      id="app"
      className="section-pad"
      style={{ backgroundColor: 'color-mix(in srgb, var(--demo-structural) 92%, black)' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] mb-3" style={{ color: 'var(--demo-accent)' }}>
            El combo completo
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--demo-on-structural)' }}>
            El torneo, también en tu bolsillo
          </h2>
          <p className="text-lg max-w-2xl mx-auto opacity-80" style={{ color: 'var(--demo-on-structural)' }}>
            Además de este sitio, Torneo Imperial tiene una app con un rol distinto para cada uno:
            jugadores, delegados, hinchas y organización: tablas y resultados de todas las categorías apenas se cargan, sin esperar al lunes.
          </p>
        </div>

        {/* Grid de accesos, mismo patrón visual que la app */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
          {accesos.map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              className="flex flex-col gap-3 p-4 transition-transform hover:-translate-y-1"
              style={{ backgroundColor: 'var(--demo-on-structural)', borderRadius: 'var(--demo-radius-lg)' }}
            >
              <div
                className="w-10 h-10 flex items-center justify-center"
                style={{ backgroundColor: 'var(--demo-structural)', borderRadius: 'var(--demo-radius)' }}
              >
                <Icon size={18} style={{ color: 'var(--demo-accent)' }} />
              </div>
              <span className="text-sm font-bold" style={{ color: 'var(--demo-heading)' }}>{label}</span>
            </a>
          ))}
        </div>

        {/* Roles + CTA */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6" style={{ backgroundColor: 'color-mix(in srgb, var(--demo-structural) 55%, black)', borderRadius: 'var(--demo-radius-lg)' }}>
          <div className="flex flex-wrap justify-center gap-2">
            {roles.map((r) => (
              <span
                key={r}
                className="px-3 py-1.5 text-xs font-bold uppercase tracking-wide"
                style={{ backgroundColor: 'color-mix(in srgb, white 12%, transparent)', color: 'var(--demo-on-structural)', borderRadius: 'var(--demo-radius)' }}
              >
                {r}
              </span>
            ))}
          </div>
          <a
            href={waLink(business.whatsapp, 'Hola! Quiero conocer más sobre la app de Torneo Imperial.')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 font-semibold whitespace-nowrap transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--demo-accent)', color: 'var(--demo-on-accent)', borderRadius: 'var(--demo-radius)' }}
          >
            <WhatsAppIcon size={18} />
            Quiero conocer la app
          </a>
          <a
            href={APP_LINK}
            className="inline-flex items-center gap-2 px-6 py-3 font-semibold whitespace-nowrap transition-opacity hover:opacity-90"
            style={{ border: '1px solid var(--demo-on-structural)', color: 'var(--demo-on-structural)', borderRadius: 'var(--demo-radius)' }}
          >
            <Smartphone size={18} />
            Abrir en la app
          </a>
        </div>
      </div>
    </section>
  )
}
