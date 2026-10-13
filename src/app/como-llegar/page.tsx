import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PageHeader from '@/components/ui/PageHeader'

export const metadata: Metadata = {
  title: 'Cómo llegar | Torneo Imperial',
  description: 'Ubicación del predio del Torneo Imperial en Córdoba, con mapa y enlaces a Google Maps y Apple Maps.',
}

const EMBED =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3408.0446421216006!2d-64.18939730000001!3d-31.3301402!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x943299001d8f5791%3A0xff39eb6ee2ee737d!2sTorneo%20Imperial!5e0!3m2!1ses-419!2sar!4v1791832938795!5m2!1ses-419!2sar'
const GOOGLE = 'https://www.google.com/maps/search/?api=1&query=-31.3301402,-64.1893973'
const APPLE = 'https://maps.apple.com/?ll=-31.3301402,-64.1893973&q=Torneo%20Imperial'

export default function ComoLlegarPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen" style={{ backgroundColor: 'var(--demo-bg)' }}>
        <PageHeader eyebrow="Predio del torneo" title="Cómo llegar" backgroundImage="/images/hero.jpg" />
        <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 space-y-6">
          <div className="rounded-3xl overflow-hidden border border-[#d9e8ea] bg-[#eef6f7] h-[420px]">
            <iframe title="Mapa del predio del Torneo Imperial" src={EMBED} loading="lazy" className="h-full w-full border-0" allowFullScreen referrerPolicy="no-referrer-when-downgrade" />
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={GOOGLE} target="_blank" rel="noopener noreferrer" className="rounded-2xl bg-[#062f36] px-6 py-3.5 text-sm font-bold text-white hover:opacity-90">Abrir en Google Maps</a>
            <a href={APPLE} target="_blank" rel="noopener noreferrer" className="rounded-2xl border border-[#d9e8ea] bg-white px-6 py-3.5 text-sm font-bold text-[#062f36] hover:bg-[#eef6f7]">Abrir en Apple Maps</a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
