'use client'

import { useState, type FormEvent } from 'react'
import Image from 'next/image'
import PageHeader from '@/components/ui/PageHeader'
import { CheckCircle2, ShieldCheck, Users, CalendarCheck, ClipboardList, MessageCircle, Wallet, CreditCard, MapPin, ChevronDown } from 'lucide-react'
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

const pasos = [
  { icon: ClipboardList, titulo: 'Completá el formulario', texto: 'Equipo, categoría, delegado y un WhatsApp de contacto. Tarda un minuto.' },
  { icon: MessageCircle, titulo: 'Te contactamos', texto: 'Te escribimos por WhatsApp para confirmar la inscripción y resolver dudas.' },
  { icon: Wallet, titulo: 'Seña', texto: 'La seña forma parte de la inscripción. Te confirmamos por WhatsApp cómo abonarla.' },
  { icon: Users, titulo: 'Lista de buena fe', texto: 'Cargás hasta 25 jugadores antes de la segunda fecha, desde el panel del delegado.' },
]

const necesitas = [
  'Un delegado responsable, con WhatsApp de contacto',
  'De cada jugador: nombre, DNI (frente y dorso) y una foto',
  'Elegir la categoría en la que querés jugar',
]

const preguntas = [
  { q: '¿Cuántos jugadores puede tener mi equipo?', a: 'La lista de buena fe es de hasta 25 jugadores por equipo.' },
  { q: '¿Hasta cuándo puedo completar la lista?', a: 'Se completa antes de la segunda fecha del torneo.' },
  { q: '¿Cómo cargo a los jugadores?', a: 'Una vez inscripto, el delegado ingresa a su panel y carga a cada jugador con su DNI (frente y dorso) y su foto. La organización revisa la documentación.' },
  { q: '¿Quién dirige los partidos?', a: 'Cada partido cuenta con árbitro y veedor.' },
  { q: '¿Cómo se paga la seña?', a: 'La seña es parte de la inscripción. Cuando te contactemos por WhatsApp te indicamos cómo abonarla.' },
  { q: '¿Dónde se juega?', a: 'En el predio de Colectora Variante Juárez Celman 500, Córdoba.' },
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
      <main className="min-h-screen" style={{ backgroundColor: 'var(--demo-bg)' }}>
        <PageHeader
          backgroundImage="/images/hero-inscripcion.jpg"
          objectPosition="50% 15%"
          title="Inscribí tu equipo"
          subtitle="Completá los datos de tu equipo y te contactamos por WhatsApp para confirmar la inscripción."
          cta={false}
        />
        <section className="section-pad">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:items-stretch">
              {/* Banner + requisitos reales del reglamento */}
              <div className="lg:col-span-2 flex flex-col gap-6 lg:gap-5">
                <div className="card lg:flex-1">
                  <h2 className="font-heading text-2xl mb-5" style={{ color: 'var(--demo-heading)' }}>Cómo funciona</h2>
                  <ul className="space-y-3">
                    {requisitos.map(({ icon: Icon, text }) => (
                      <li key={text} className="flex items-center gap-3 text-sm" style={{ color: 'var(--demo-text)' }}>
                        <Icon size={18} style={{ color: 'var(--demo-accent)' }} className="flex-shrink-0" />
                        {text}
                      </li>
                    ))}
                  </ul>
                </div>
          <div className="card lg:flex-1">
            <h2 className="font-heading text-2xl mb-5 flex items-center gap-2" style={{ color: 'var(--demo-heading)' }}>
              <CreditCard size={22} style={{ color: 'var(--demo-accent)' }} /> Qué necesitás para inscribirte
            </h2>
            <ul className="space-y-3">
              {necesitas.map((t) => (
                <li key={t} className="flex items-start gap-3 text-sm leading-relaxed" style={{ color: 'var(--demo-text)' }}>
                  <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--demo-accent)' }} />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="card lg:flex-1">
            <h2 className="font-heading text-2xl mb-5 flex items-center gap-2" style={{ color: 'var(--demo-heading)' }}>
              <MapPin size={22} style={{ color: 'var(--demo-accent)' }} /> Sede
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--demo-text)' }}>
              Los partidos se juegan en {business.address}. Cada partido tiene árbitro y veedor.
            </p>
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


      <section className="section-pad" style={{ backgroundColor: 'var(--demo-surface)' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-center mb-8">Preguntas frecuentes</h2>
          <div className="space-y-3">
            {preguntas.map((f) => (
              <details key={f.q} className="faq card group !p-0 overflow-hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold" style={{ color: 'var(--demo-heading)' }}>
                  {f.q}
                  <ChevronDown size={18} className="flex-shrink-0 transition-transform duration-300 group-open:rotate-180" style={{ color: 'var(--demo-accent)' }} />
                </summary>
                <p className="px-5 pb-5 text-sm leading-relaxed" style={{ color: 'var(--demo-muted)' }}>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      </main>
      <Footer />
    </>
  )
}
