import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PageHeader from '@/components/ui/PageHeader'
import { sanciones } from '@/lib/torneo-data'

export const metadata: Metadata = {
  title: 'Sanciones',
  description: 'Listado público de jugadores sancionados del Torneo Imperial, con fechas por cumplir.',
}

// Vista pública (igual que el rol "hincha" de la app: sin motivo detallado ni descargos).
export default function SancionesPage() {
  const lista = sanciones['+30']
  return (
    <>
      <Navbar />
      <main className="min-h-screen" style={{ backgroundColor: 'var(--demo-bg)' }}>
      <PageHeader
        backgroundImage="/images/gallery-4.jpg"
        eyebrow="Tribunal de Disciplina"
        title="Sanciones"
        subtitle="Jugadores sancionados y fechas que les faltan cumplir. Los delegados presentan descargos desde la app."
        pills={[{ label: 'Torneo', value: 'Clausura 2026' }, { label: 'Categoría', value: '+30' }]}
      />

        <section className="section-pad">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-3">
              {lista.map((s, i) => (
                <div
                  key={`${s.jugador}-${i}`}
                  className="p-4 flex items-center justify-between gap-4"
                  style={{ backgroundColor: 'var(--demo-surface)', border: '1px solid var(--demo-border)', borderRadius: 'var(--demo-radius-lg)' }}
                >
                  <p className="font-semibold" style={{ color: 'var(--demo-heading)' }}>{s.jugador}</p>
                  <p className="text-sm text-right" style={{ color: 'var(--demo-muted)' }}>
                    {s.sancion} {s.sancion === 1 ? 'fecha' : 'fechas'} · <span style={{ color: 'var(--demo-text)', fontWeight: 600 }}>{s.porCumplir} por cumplir</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
