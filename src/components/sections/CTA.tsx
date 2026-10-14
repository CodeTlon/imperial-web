import { ArrowRight } from 'lucide-react'
import { WhatsAppIcon } from '@/components/icons/BrandIcons'
import { demoConfig } from '@/lib/demo-config'
import { waLink } from '@/lib/utils'

export default function CTA() {
  const { business, content, cta } = demoConfig
  const copy = (content as { cta?: { title?: string; subtitle?: string } }).cta ?? {}
  const title = copy.title ?? '¿Listo para empezar?'
  const subtitle = copy.subtitle ?? `Escribinos hoy y coordinamos lo que necesites. Te esperamos en ${business.address}.`

  return (
    <section id="cta" className="section-pad" style={{ backgroundColor: 'var(--demo-accent)' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-[1.35] md:leading-[1.3]" style={{ color: 'var(--demo-on-accent)' }}>
          {title}
        </h2>
        <p className="text-lg mb-10 opacity-80" style={{ color: 'var(--demo-on-accent)' }}>
          {subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/inscripcion"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 font-bold text-lg transition-opacity hover:opacity-90"
            style={{
              backgroundColor: 'var(--demo-structural)',
              color: 'var(--demo-on-structural)',
              borderRadius: 'var(--demo-radius)',
            }}
          >
            Inscribí tu equipo
            <ArrowRight size={20} />
          </a>
          <a
            href={waLink(business.whatsapp, cta.whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 font-bold text-lg border-2 transition-all hover:opacity-80"
            style={{
              borderColor: 'var(--demo-on-accent)',
              color: 'var(--demo-on-accent)',
              borderRadius: 'var(--demo-radius)',
            }}
          >
            <WhatsAppIcon size={22} />
            Consultar por WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}
