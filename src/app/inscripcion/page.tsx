'use client'

import { useState, type FormEvent } from 'react'
import Image from 'next/image'
import { CheckCircle2, ShieldCheck, Users, CalendarCheck } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { demoConfig } from '@/lib/demo-config'
import { categorias } from '@/lib/torneo-data'
import { waLink } from '@/lib/utils'

// ponytail: no hay backend en esta demo — "inscribirse" arma el mensaje de
// WhatsApp con todos los datos del formulario y lo abre, igual que el resto
// de los CTA del sitio (waLink real, sin servidor propio).
function armarMensaje(datos: Record<string, string>) {
  return [
    'Hola! Quiero inscribir un equipo en el Torneo Imperial.',
    `Equipo: ${datos.equipo}`,
    `Categoría: ${datos.categoria}`,
    `Delegado: ${datos.delegado}`,
    `WhatsApp de contacto: ${datos.telefono}`,
    datos.jugadores && `Jugadores aproximados: ${datos.jugadores}`,
    datos.mensaje && `Mensaje: ${datos.mensaje}`,
  ].filter(Boolean).join('\n')
}

const requisitos = [
  { icon: CheckCircle2, text: 'Seña como parte de la inscripción' },
  { icon: Users, text: 'Lista de buena fe: hasta 25 jugadores' },
  { icon: CalendarCheck, text: 'Se completa antes de la segunda fecha' },
  { icon: ShieldCheck, text: 'Árbitro y veedor en cada partido' },
]

export default function InscripcionPage() {
  const { business } = demoConfig
  const [enviado, setEnviado] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const datos = Object.fromEntries(form.entries()) as Record<string, string>

    // Validación mínima antes de abrir WhatsApp (el formulario no guarda nada en servidor).
    const digitos = (datos.telefono ?? '').replace(/\D/g, '')
    const jugadores = datos.jugadores ? Number(datos.jugadores) : null
    if (digitos.length < 10 || digitos.length > 13) {
      setError('Ingresá un WhatsApp válido, con código de área (ej. 351 123 4567).')
      return
    }
    if (jugadores !== null && (!Number.isInteger(jugadores) || jugadores < 1 || jugadores > 25)) {
      setError('La lista de buena fe es de hasta 25 jugadores.')
      return
    }
    setError(null)
    const link = waLink(business.whatsapp, armarMensaje(datos))
    setEnviado(link)
    window.open(link, '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen" style={{ backgroundColor: 'var(--demo-bg)' }}>
        <section className="section-pad">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="eyebrow">Sumate al torneo</p>
              <h1 className="section-title">Inscribí tu equipo</h1>
              <p className="section-subtitle mt-4">
                Completá los datos de tu equipo y te contactamos por WhatsApp para confirmar la inscripción.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
              {/* Banner + requisitos reales del reglamento */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                <div className="relative w-full aspect-[4/5] overflow-hidden" style={{ borderRadius: 'var(--demo-radius-lg)' }}>
                  <Image src="/images/hero-inscripcion.jpg" alt="Torneo Imperial" fill className="object-cover" style={{ objectPosition: '50% 15%' }} />
                </div>
                <div className="card">
                  <h3 className="font-bold text-lg mb-4" style={{ color: 'var(--demo-heading)' }}>Cómo funciona</h3>
                  <ul className="space-y-3">
                    {requisitos.map(({ icon: Icon, text }) => (
                      <li key={text} className="flex items-center gap-3 text-sm" style={{ color: 'var(--demo-text)' }}>
                        <Icon size={18} style={{ color: 'var(--demo-accent)' }} className="flex-shrink-0" />
                        {text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Formulario */}
              <div className="lg:col-span-3 card">
                {enviado ? (
                  <div className="text-center py-10 px-4">
                    <CheckCircle2 size={48} style={{ color: 'var(--demo-accent)' }} className="mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--demo-heading)' }}>¡Ya casi!</h3>
                    <p className="text-sm mb-6" style={{ color: 'var(--demo-muted)' }}>
                      Abrimos WhatsApp con los datos de tu equipo. Si no se abrió, tocá el botón de abajo para enviarlo.
                    </p>
                    <a href={enviado} target="_blank" rel="noopener noreferrer" className="btn-primary">
                      Abrir WhatsApp
                    </a>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate={false} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {error && (
                <p role="alert" className="sm:col-span-2 text-sm font-semibold" style={{ color: '#dc2626' }}>
                  {error}
                </p>
              )}
                    <div className="sm:col-span-2">
                      <label htmlFor="equipo" className="block text-sm font-semibold mb-2" style={{ color: 'var(--demo-heading)' }}>Nombre del equipo</label>
                      <input id="equipo" name="equipo" required placeholder="Ej: Atlético Guiñazú" className="input" />
                    </div>
                    <div>
                      <label htmlFor="categoria" className="block text-sm font-semibold mb-2" style={{ color: 'var(--demo-heading)' }}>Categoría</label>
                      <select id="categoria" name="categoria" required defaultValue="" className="input">
                        <option value="" disabled>Elegí una categoría</option>
                        {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="jugadores" className="block text-sm font-semibold mb-2" style={{ color: 'var(--demo-heading)' }}>Jugadores aprox.</label>
                      <input id="jugadores" name="jugadores" type="number" min={1} max={25} placeholder="Hasta 25" className="input" />
                    </div>
                    <div>
                      <label htmlFor="delegado" className="block text-sm font-semibold mb-2" style={{ color: 'var(--demo-heading)' }}>Nombre del delegado</label>
                      <input id="delegado" name="delegado" required placeholder="Quién representa al equipo" className="input" />
                    </div>
                    <div>
                      <label htmlFor="telefono" className="block text-sm font-semibold mb-2" style={{ color: 'var(--demo-heading)' }}>WhatsApp de contacto</label>
                      <input id="telefono" name="telefono" type="tel" required placeholder="351 000 0000" className="input" />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="mensaje" className="block text-sm font-semibold mb-2" style={{ color: 'var(--demo-heading)' }}>Mensaje (opcional)</label>
                      <textarea id="mensaje" name="mensaje" rows={3} placeholder="Contanos algo más de tu equipo" className="input resize-none" />
                    </div>
                    <div className="sm:col-span-2">
                      <button type="submit" className="btn-primary w-full">
                        Enviar inscripción por WhatsApp
                      </button>
                      <p className="text-xs mt-3 text-center" style={{ color: 'var(--demo-muted)' }}>
                        Te va a abrir WhatsApp con el mensaje ya cargado — no guardamos estos datos en ningún servidor.
                      </p>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
