import Image from 'next/image'
import { Star } from 'lucide-react'
import { demoConfig } from '@/lib/demo-config'
import Reveal from '@/components/Reveal'

export default function Testimonials() {
  const { content } = demoConfig

  return (
    <section id="testimonials" className="section-pad" style={{ backgroundColor: 'var(--demo-surface)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="eyebrow">Lo que dicen los equipos</p>
          <h2 className="section-title">Los que ya juegan cada fecha</h2>
        </div>

        {/* Cards — la del medio queda destacada (borde de acento + badge en
            cualquier ancho; más grande y elevada además a partir de md) en vez
            de la fila pareja de 3 columnas idénticas que tenía la v1. */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:items-center">
          {content.testimonials.map((t, idx) => (
            <Reveal key={t.name} delay={idx * 100} className={idx === 1 ? 'relative md:scale-105 md:-translate-y-2' : 'relative'}>
              {idx === 1 && (
                <span
                  className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide whitespace-nowrap"
                  style={{ backgroundColor: 'var(--demo-accent)', color: 'var(--demo-on-accent)', borderRadius: '9999px' }}
                >
                  Destacado
                </span>
              )}
              <div
                className="card h-full flex flex-col gap-5 transition-transform duration-300 hover:-translate-y-1"
                style={{
                  backgroundColor: 'var(--demo-surface-alt)',
                  border: idx === 1 ? '2px solid var(--demo-accent)' : undefined,
                  boxShadow: idx === 1 ? '0 16px 40px -12px rgba(0,0,0,0.18)' : undefined,
                }}
              >
              {/* Estrellas */}
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < t.rating ? 'var(--demo-accent)' : 'transparent'}
                    style={{ color: 'var(--demo-accent)' }}
                  />
                ))}
              </div>

              {/* Texto */}
              <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--demo-text)' }}>
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Avatar + nombre */}
              <div className="flex items-center gap-3 pt-2 border-t" style={{ borderColor: 'var(--demo-border)' }}>
                {t.avatar ? (
                  <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={t.avatar}
                      alt={t.name}
                      fill
                      className="object-cover"
                      unoptimized={t.avatar.startsWith('http')}
                    />
                  </div>
                ) : (
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
                    style={{ backgroundColor: 'var(--demo-accent)', color: 'var(--demo-on-accent)' }}
                  >
                    {t.name[0]}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-sm" style={{ color: 'var(--demo-heading)' }}>{t.name}</p>
                  {t.role && <p className="text-xs" style={{ color: 'var(--demo-muted)' }}>{t.role}</p>}
                </div>
              </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
