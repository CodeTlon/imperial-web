'use client'

import Image from 'next/image'
import { useDemo } from '@/lib/demo-store'

const FOTOS = ['gallery-1', 'gallery-2', 'gallery-3', 'gallery-4']

// Las fotos de la fecha viven en un Drive; la organización cambia el link desde el panel.
export default function FotoFecha() {
  const { datos } = useDemo()
  return (
    <section id="fotos" className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--demo-bg)' }}>
      <div className="mx-auto max-w-6xl">
        <p className="text-xs uppercase tracking-[0.25em] font-bold text-[#c2972a]">Fotos de la fecha</p>
        <h2 className="font-heading text-4xl sm:text-5xl text-[#062f36] mt-2">Revivila en imágenes</h2>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
          {FOTOS.map((f, i) => (
            <a key={f} href={datos.fotoFechaUrl} target="_blank" rel="noopener noreferrer" className="relative aspect-[4/5] overflow-hidden rounded-2xl group">
              <Image src={`/images/${f}.jpg`} alt={`Foto de la fecha ${i + 1}`} fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
            </a>
          ))}
        </div>
        <a href={datos.fotoFechaUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-6 rounded-2xl bg-[#062f36] px-6 py-3.5 text-sm font-bold text-white hover:opacity-90">
          Ver todas las fotos en el Drive
        </a>
      </div>
    </section>
  )
}
