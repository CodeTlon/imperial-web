import * as LucideIcons from 'lucide-react'
import { demoConfig } from '@/lib/demo-config'
import Reveal from '@/components/Reveal'

// ponytail: resolvemos el ícono por nombre contra todo lucide-react en vez de
// un mapa fijo de 20. Cualquier nombre PascalCase válido de Lucide funciona
// (Smartphone, Cpu, CircuitBoard, ...); ya no caen todos a Sparkles.
const resolveIcon = (name: string): React.ElementType =>
  (LucideIcons[name as keyof typeof LucideIcons] as React.ElementType) ?? LucideIcons.Sparkles

export default function Services() {
  const { content } = demoConfig

  return (
    <section id="services" className="section-pad" style={{ backgroundColor: 'var(--demo-bg)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="eyebrow">Elegí tu categoría</p>
          <h2 className="section-title">Nuestras Ligas</h2>
          <p className="section-subtitle mt-4">
            Seis categorías compitiendo cada fin de semana, todo el año.
          </p>
        </div>

        {/* Grid — tarjetas impares con layout horizontal (ícono a la izquierda)
            y pares en vertical, con offset y entrada escalonada. Esta
            alternancia es visible en CUALQUIER ancho (no depende de un
            breakpoint lg:/md:), a diferencia de la fila pareja de la v1. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {content.services.map((service, i) => {
            const Icon = resolveIcon(service.icon)
            const horizontal = i % 2 === 1
            return (
              <Reveal key={service.title} delay={i * 90} className={horizontal ? 'lg:translate-y-6' : ''}>
                <div
                  className={`card h-full group cursor-default transition-transform duration-300 hover:-translate-y-2 flex gap-4 ${horizontal ? 'flex-row items-center' : 'flex-col'}`}
                >
                  <div
                    className="w-12 h-12 flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
                    style={{
                      backgroundColor: 'var(--demo-accent)',
                      borderRadius: horizontal ? '9999px' : 'var(--demo-radius)',
                    }}
                  >
                    <Icon size={22} style={{ color: 'var(--demo-on-accent)' }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--demo-heading)' }}>
                      {service.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--demo-muted)' }}>
                      {service.description}
                    </p>
                    {service.price && (
                      <p className="text-lg font-bold mt-3" style={{ color: 'var(--demo-accent)' }}>
                        {service.price}
                      </p>
                    )}
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
