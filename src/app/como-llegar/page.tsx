import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PageHeader from '@/components/ui/PageHeader'
import ComoLlegar from '@/components/sections/ComoLlegar'

export const metadata: Metadata = {
  title: 'Cómo llegar | Torneo Imperial',
  description: 'Ubicación del predio del Torneo Imperial en Córdoba: mapa, plano de las canchas, ingreso, estacionamiento y consejos para el día del partido.',
}

export default function ComoLlegarPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen" style={{ backgroundColor: 'var(--demo-bg)' }}>
        <PageHeader title="Cómo llegar" subtitle="Ubicación del predio y todo lo que necesitás saber para el día de tu partido." backgroundImage="/images/about.jpg" cta={false} />
        <ComoLlegar />
      </main>
      <Footer />
    </>
  )
}
