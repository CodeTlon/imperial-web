import Image from 'next/image'
import { CheckCircle2 } from 'lucide-react'
import { demoConfig } from '@/lib/demo-config'

// Defaults editables vía content.about en demo-config.ts (por negocio).
const DEFAULTS = {
  eyebrow: 'Quiénes somos',
  title: 'Más que un servicio, una experiencia',
  body: 'Nuestro equipo combina técnica, experiencia y pasión para ofrecerte resultados que superan tus expectativas.',
  bullets: [
    'Profesionales con años de experiencia',
    'Calidad certificada en cada detalle',
    'Atención personalizada',
  ],
}

export default function About() {
  const { business, images, content } = demoConfig
  const about = { ...DEFAULTS, ...(content as { about?: Partial<typeof DEFAULTS> }).about }

  return (
    <section id="about" className="section-pad" style={{ backgroundColor: 'var(--demo-surface)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Texto — a la izquierda en esta v2 (en la v1 el orden era imagen→texto) */}
          <div className="lg:order-1">
            <p className="eyebrow">{about.eyebrow}</p>
            <h2 className="section-title mb-6">{about.title}</h2>
            <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--demo-muted)' }}>
              {about.body}
            </p>
            <ul className="space-y-4">
              {about.bullets.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--demo-accent)' }} />
                  <span className="text-sm" style={{ color: 'var(--demo-text)' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Imagen — a la derecha en esta v2, con marco escalonado hacia abajo-derecha
              (en la v1 el acento del marco quedaba arriba-izquierda). */}
          <div className="relative lg:order-2">
            <div
              className="absolute -bottom-4 -right-4 w-full h-full"
              style={{ backgroundColor: 'var(--demo-accent)', opacity: 0.2, borderRadius: 'var(--demo-radius-lg)' }}
            />
            <div className="relative overflow-hidden aspect-[4/3] transition-transform duration-500 hover:-translate-y-1" style={{ borderRadius: 'var(--demo-radius-lg)' }}>
              <Image
                src={images.about}
                alt={`Sobre ${business.name}`}
                fill
                className="object-cover"
                unoptimized={images.about.startsWith('http')}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
