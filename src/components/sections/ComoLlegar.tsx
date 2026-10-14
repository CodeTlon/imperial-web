'use client'

import Image from 'next/image'
import { useState, type ReactNode } from 'react'
import { MapPin } from 'lucide-react'
import { useSitio } from '@/lib/useSitio'

const EMBED =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3408.0446421216006!2d-64.18939730000001!3d-31.3301402!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x943299001d8f5791%3A0xff39eb6ee2ee737d!2sTorneo%20Imperial!5e0!3m2!1ses-419!2sar!4v1791832938795!5m2!1ses-419!2sar'

const TEAL = '#0494a4'
const heading = { color: 'var(--demo-heading)', fontFamily: 'var(--demo-font-heading)' } as const

// El mapa interactivo se carga recién al tocar la portada: la página abre rápido y no manda datos a Google hasta que se pide.
function Mapa({ direccion }: { direccion: string }) {
  const [abierto, setAbierto] = useState(false)
  return (
    <div className="relative h-[360px] sm:h-[440px] overflow-hidden" style={{ borderRadius: 'var(--demo-radius-lg)', backgroundColor: '#062f36' }}>
      {abierto ? (
        <iframe title="Mapa del predio del Torneo Imperial" src={EMBED} className="h-full w-full border-0" allowFullScreen referrerPolicy="no-referrer-when-downgrade" />
      ) : (
        <button
          type="button"
          onClick={() => setAbierto(true)}
          aria-label="Ver el mapa del predio"
          className="group absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center text-white"
          style={{ background: 'linear-gradient(135deg, #062f36 0%, #04707c 100%)' }}
        >
          {/* Líneas de cancha de fondo */}
          <svg aria-hidden className="absolute inset-0 h-full w-full opacity-[0.12]" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" fill="none" stroke="white" strokeWidth="1.5">
            <rect x="20" y="20" width="360" height="160" /><line x1="200" y1="20" x2="200" y2="180" /><circle cx="200" cy="100" r="30" /><rect x="20" y="60" width="50" height="80" /><rect x="330" y="60" width="50" height="80" />
          </svg>
          <span className="relative flex h-16 w-16 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110 group-active:scale-95" style={{ backgroundColor: 'var(--demo-accent)', color: '#062f36' }}>
            <MapPin size={30} aria-hidden />
          </span>
          <span className="relative">
            <span className="block text-3xl sm:text-4xl font-bold uppercase" style={{ fontFamily: 'var(--demo-font-heading)' }}>Ver el mapa</span>
            <span className="mt-1 block text-sm sm:text-base text-white/80">{direccion}</span>
          </span>
          <span className="relative inline-flex items-center rounded-full border border-white/30 px-4 py-1.5 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--demo-accent)' }}>Tocá para abrir</span>
        </button>
      )}
    </div>
  )
}

function Bloque({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section className="pt-6 border-t first:border-t-0 first:pt-0" style={{ borderColor: 'var(--demo-border)' }}>
      <h2 className="text-xs sm:text-sm font-bold uppercase tracking-[0.16em] mb-2" style={{ color: TEAL }}>{titulo}</h2>
      <div className="space-y-2 leading-relaxed" style={{ color: 'var(--demo-text)' }}>{children}</div>
    </section>
  )
}

export default function ComoLlegar() {
  const { business } = useSitio()
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,4fr)] lg:gap-14">
        <div className="space-y-12 min-w-0">
          <Mapa direccion={business.address} />

          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-2" style={heading}>El predio</h2>
            <p className="mb-4 max-w-2xl leading-relaxed" style={{ color: 'var(--demo-text)' }}>
              El plano muestra las 10 canchas de las categorías masculinas, las 2 canchas de femenino, los estacionamientos (E), los baños y duchas, el bar y el buffet.
            </p>
            <div className="overflow-hidden border" style={{ borderColor: 'var(--demo-border)', borderRadius: 'var(--demo-radius-lg)' }}>
              <Image src="/images/venue-map.jpg" alt="Plano del predio: ingreso por Portón 1, egreso por Portón 2, canchas numeradas del 1 al 10, canchas de femenino 1 y 2, estacionamientos, baños, duchas, bar y buffet" width={1600} height={614} sizes="(min-width: 1024px) 60vw, 100vw" className="h-auto w-full" />
            </div>
          </div>
        </div>

        <aside className="space-y-6 min-w-0 lg:pt-1">
          <Bloque titulo="Dónde queda">
            <p className="text-2xl font-bold leading-snug" style={heading}>{business.address}</p>
            <p>El predio tiene dos portones: el <strong style={{ color: '#04707c' }}>Portón 1</strong> es el ingreso y el <strong style={{ color: '#04707c' }}>Portón 2</strong>, el egreso.</p>
          </Bloque>
          <Bloque titulo="Antes de jugar">
            <p>Llegá con tiempo: la tolerancia es de <strong style={{ color: '#04707c' }}>15 minutos</strong> desde el horario pactado y después el rival puede pedir los puntos.</p>
            <p>Los horarios de cada fecha se publican los <strong style={{ color: '#04707c' }}>miércoles</strong> en la web.</p>
            <p>Llevá el DNI: todos los jugadores tienen que acreditar identidad ante el veedor antes del partido.</p>
          </Bloque>
          <Bloque titulo="En el predio">
            <p>Estacionamiento en distintos sectores del predio, baños y duchas.</p>
            <p>Bar y buffet para el tercer tiempo después del partido. La carta está en <a href="/carta" className="font-semibold underline underline-offset-2" style={{ color: '#04707c' }}>Carta del bar</a>.</p>
            <p>Cada partido tiene árbitro y veedor de la organización.</p>
          </Bloque>
          <Bloque titulo="Consultas">
            {business.email && <p>Mail: <a href={`mailto:${business.email}`} className="font-semibold underline underline-offset-2" style={{ color: '#04707c' }}>{business.email}</a></p>}
            {business.instagram && <p>Instagram: <a href={`https://instagram.com/${business.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-2" style={{ color: '#04707c' }}>{business.instagram}</a></p>}
          </Bloque>
        </aside>
      </div>
    </section>
  )
}
