import { demoConfig } from '@/lib/demo-config'
import CountUp from '@/components/ui/CountUp'

// A diferencia de la v1 (franja de stats de ancho completo, en flujo normal),
// acá el bloque "flota" superpuesto sobre el borde inferior del Hero — patrón
// de tarjeta elevada que se ve en sitios de torneos/eventos premium.
export default function Stats() {
  const { content } = demoConfig

  return (
    <section id="stats" className="relative z-20 -mt-14 md:-mt-16 px-4">
      <div
        className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 px-6 py-8 md:px-10 md:py-10"
        style={{
          backgroundColor: 'var(--demo-structural)',
          borderRadius: 'var(--demo-radius-lg)',
          boxShadow: '0 20px 50px -12px rgba(0,0,0,0.35)',
        }}
      >
        {content.stats.map((stat, i) => (
          <div key={i} className="text-center transition-transform duration-300 hover:-translate-y-1">
            <div className="text-4xl md:text-5xl font-bold mb-2" style={{ color: 'var(--demo-accent)' }}>
              <CountUp value={stat.value} />
            </div>
            <div
              className="text-sm uppercase tracking-widest font-medium"
              style={{ color: 'var(--demo-on-structural)', opacity: 0.6 }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
