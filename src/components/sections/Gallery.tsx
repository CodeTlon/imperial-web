'use client'

import Image from 'next/image'
import { useSitio } from '@/lib/useSitio'

export default function Gallery() {
  const { images, business } = useSitio()

  return (
    <section id="gallery" className="section-pad" style={{ backgroundColor: 'var(--demo-surface)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="eyebrow">Así se vive</p>
          <h2 className="section-title">Cada fecha, en la cancha</h2>
          <p className="section-subtitle mt-4">
            Fotos reales de nuestros partidos — atajadas, gambetas y la garra de cada fin de semana.
          </p>
        </div>

        {/* Grid de fotos tipo bento (la primera foto ocupa 2x2) — en la v1 era
            una grilla pareja de cuadrados todos del mismo tamaño. */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[140px] md:auto-rows-[160px]">
          {images.gallery.map((src, i) => (
            <div
              key={i}
              className={`relative overflow-hidden group cursor-pointer transition-transform duration-300 hover:-translate-y-1 ${i === 0 ? 'col-span-2 row-span-2' : ''}`}
              style={{ borderRadius: 'var(--demo-radius-lg)' }}
            >
              <Image
                src={src}
                alt={`${business.name} — instalación ${i + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                unoptimized={src.startsWith('http')}
              />
              {/* Overlay hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-60 transition-opacity duration-300"
                style={{ backgroundColor: 'var(--demo-structural)' }}
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'var(--demo-accent)' }}
                >
                  <span style={{ color: 'var(--demo-on-accent)', fontSize: 20 }}>+</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
