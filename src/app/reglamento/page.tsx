import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/layout/WhatsAppButton'
import PageHeader from '@/components/ui/PageHeader'
import reglamento from '@/lib/reglamento.json'

export const metadata: Metadata = {
  title: 'Reglamento',
  description: 'Formato del torneo, categorías, sanciones por tarjetas y reglas de juego del Torneo Imperial.',
}

// Mismo texto que la pestaña Reglamento de la app (fuente: torneo-imperial-shared/reglamento.json).
export default function ReglamentoPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen" style={{ backgroundColor: 'var(--demo-bg)' }}>
        <section className="section-pad">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <PageHeader
              eyebrow="Reglas de juego"
              title="Reglamento"
              subtitle="Resumen del reglamento oficial: lo que un jugador o delegado consulta todas las fechas."
              pills={[{ label: 'Torneo', value: 'Clausura 2026' }]}
            />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-10">
              {reglamento.categorias.map((c) => (
                <div
                  key={c.nombre}
                  className="p-5"
                  style={{ backgroundColor: 'var(--demo-surface)', border: '1px solid var(--demo-border)', borderRadius: 'var(--demo-radius-lg)' }}
                >
                  <p className="text-2xl font-bold" style={{ color: 'var(--demo-heading)', fontFamily: 'var(--demo-font-heading)' }}>{c.nombre}</p>
                  <p className="text-sm mt-1" style={{ color: 'var(--demo-muted)' }}>{c.edad}</p>
                  <p className="text-sm mt-3" style={{ color: 'var(--demo-text)' }}>{c.minutos} · {c.cambios} cambios</p>
                </div>
              ))}
            </div>

            <div className="grid gap-6">
              {reglamento.capitulos.map((cap) => (
                <article
                  key={cap.id}
                  id={cap.id}
                  className="p-6"
                  style={{ backgroundColor: 'var(--demo-surface)', border: '1px solid var(--demo-border)', borderRadius: 'var(--demo-radius-lg)' }}
                >
                  <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--demo-heading)', fontFamily: 'var(--demo-font-heading)' }}>{cap.titulo}</h2>
                  <ul className="grid gap-2 list-disc pl-5" style={{ color: 'var(--demo-text)' }}>
                    {cap.puntos.map((p) => (
                      <li key={p} className="text-sm leading-relaxed">{p}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
