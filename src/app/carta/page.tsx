import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PageHeader from '@/components/ui/PageHeader'
import { CARTA, formatoPrecio } from '@/lib/carta'

export const metadata: Metadata = {
  title: 'Carta del bar | Torneo Imperial',
  description: 'Carta de Coronados Bar & Fernet Branca en el predio del Torneo Imperial: bebidas, tragos y más.',
}

export default function CartaPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen" style={{ backgroundColor: 'var(--demo-bg)' }}>
        <PageHeader eyebrow="Coronados Bar & Fernet Branca" title="Carta del bar" backgroundImage="/images/hero.jpg" />
        <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 grid gap-6 md:grid-cols-2">
          {CARTA.map((sec) => (
            <article key={sec.titulo} className="rounded-3xl border border-[#e3e7ee] bg-white p-6">
              <h2 className="font-heading text-2xl text-[#0c1d3d] mb-4">{sec.titulo}</h2>
              <ul className="space-y-3">
                {sec.items.map((it) => (
                  <li key={it.nombre} className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-[#233240]">{it.nombre}</p>
                      {it.detalle && <p className="text-xs text-[#6b7685]">{it.detalle}</p>}
                    </div>
                    {it.precio != null ? (
                      <p className="text-sm font-bold text-[#0c1d3d] whitespace-nowrap">{formatoPrecio(it.precio)}</p>
                    ) : (
                      <p className="text-xs italic text-[#6b7685]">Consultar</p>
                    )}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </>
  )
}
