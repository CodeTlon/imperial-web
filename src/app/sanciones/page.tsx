import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PageHeader from '@/components/ui/PageHeader'
import SancionesVista from '@/components/sections/SancionesVista'

export const metadata: Metadata = {
  title: 'Sanciones',
  description: 'Jugadores suspendidos del Torneo Imperial, fechas por cumplir y cómo funcionan las sanciones del Tribunal de Disciplina.',
}

// Vista pública (igual que el rol "hincha" de la app: sin informe detallado ni descargos).
export default function SancionesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen" style={{ backgroundColor: 'var(--demo-bg)' }}>
        <PageHeader
          backgroundImage="/images/gallery-4.jpg"
          title="Sanciones"
          subtitle="Jugadores suspendidos, fechas que les faltan cumplir y cómo funcionan las sanciones."
          cta={false}
        />
        <SancionesVista />
      </main>
      <Footer />
    </>
  )
}
