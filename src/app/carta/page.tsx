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
        <PageHeader title="Carta del bar" subtitle="Tragos, picadas y algo para comer después del partido." backgroundImage="/images/gallery-6.jpg" cta={false} />
        <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 grid gap-6 md:grid-cols-2">
          {CARTA.map((sec, i) => {
            // Con una cantidad impar de secciones, la última ocupa las dos columnas.
            const ancha = i === CARTA.length - 1 && CARTA.length % 2 === 1
            return (
            <article key={sec.titulo} className={`rounded-3xl border border-[#d9e8ea] bg-white p-6 ${ancha ? 'md:col-span-2' : ''}`}>
              <h2 className="font-heading text-2xl text-[#062f36] mb-4">{sec.titulo}</h2>
              <ul className={ancha ? 'grid gap-x-10 gap-y-3 md:grid-cols-2' : 'space-y-3'}>
                {sec.items.map((it) => (
                  <li key={it.nombre} className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-[#1f3a40]">{it.nombre}</p>
                      {it.detalle && <p className="text-xs text-[#5b7479]">{it.detalle}</p>}
                    </div>
                    {it.precio != null ? (
                      <p className="text-sm font-bold text-[#062f36] whitespace-nowrap">{formatoPrecio(it.precio)}</p>
                    ) : (
                      <p className="text-xs italic text-[#5b7479]">Consultar</p>
                    )}
                  </li>
                ))}
              </ul>
            </article>
            )
          })}
        </section>
      </main>
      <Footer />
    </>
  )
}
