'use client'

import { useState, type FormEvent } from 'react'
import Image from 'next/image'
import PageHeader from '@/components/ui/PageHeader'
import { CheckCircle2, ShieldCheck, Users, CalendarCheck, ClipboardList, MessageCircle, Wallet, CreditCard, MapPin } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useSitio } from '@/lib/useSitio'
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

const ICONOS_REQUISITOS = [CheckCircle2, Users, CalendarCheck, ShieldCheck]

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

export default function InscripcionPage() {
  const { business, requisitos } = useSitio()
  const [enviado, setEnviado] = useState<string | null>(null)
  const [errores, setErrores] = useState<Record<string, string>>({})

  // Reglas de cada campo: devuelven el mensaje de error o undefined si está bien.
  const reglas: Record<string, (v: string) => string | undefined> = {
    equipo: (v) => {
      const t = v.trim()
      if (!t) return 'Ingresá el nombre del equipo.'
      if (t.length < 3) return 'El nombre del equipo es muy corto (mínimo 3 caracteres).'
      if (t.length > 40) return 'El nombre del equipo es muy largo (máximo 40 caracteres).'
      if (!/\p{L}/u.test(t)) return 'El nombre del equipo tiene que incluir letras.'
    },
    categoria: (v) => (categorias.includes(v as never) ? undefined : 'Elegí la categoría en la que querés jugar.'),
    jugadores: (v) => {
      if (!v.trim()) return undefined
      if (!/^\d+$/.test(v.trim())) return 'Ingresá un número entero, sin signos ni decimales.'
      if (Number(v) < 1 || Number(v) > 25) return 'La lista de buena fe es de 1 a 25 jugadores.'
    },
    delegado: (v) => {
      const t = v.trim().replace(/\s+/g, ' ')
      if (!t) return 'Ingresá el nombre del delegado.'
      if (!/^[\p{L}][\p{L}\s'.-]*$/u.test(t)) return 'El nombre solo puede tener letras y espacios.'
      if (t.split(' ').length < 2 || t.length < 5) return 'Ingresá nombre y apellido (por ejemplo: Juan Pérez).'
      if (t.length > 60) return 'El nombre es muy largo (máximo 60 caracteres).'
    },
    telefono: (v) => {
      const t = v.trim()
      if (!t) return 'Ingresá un WhatsApp de contacto.'
      if (!/^[+\d\s()-]+$/.test(t)) return 'El teléfono solo puede tener números, espacios, guiones y +.'
      const d = t.replace(/\D/g, '')
      if (d.length < 10) return 'Faltan números: incluí el código de área (ej. 351 123 4567).'
      if (d.length > 13) return 'Sobran números: revisá el teléfono.'
    },
    mensaje: (v) => (v.length > 500 ? `El mensaje es muy largo: máximo 500 caracteres (tenés ${v.length}).` : undefined),
  }
  const validarCampo = (nombre: string, valor: string) => setErrores((e) => {
    const m = reglas[nombre]?.(valor)
    const { [nombre]: _quitar, ...resto } = e
    return m ? { ...resto, [nombre]: m } : resto
  })
  // Atributos comunes de cada campo: estado inválido, vínculo con su mensaje y validación al salir del campo.
  const campo = (nombre: string) => ({
    id: nombre, name: nombre,
    'aria-invalid': errores[nombre] ? (true as const) : undefined,
    'aria-describedby': errores[nombre] ? `${nombre}-error` : undefined,
    onBlur: (e: { target: { value: string } }) => validarCampo(nombre, e.target.value),
    onChange: (e: { target: { value: string } }) => { if (errores[nombre]) validarCampo(nombre, e.target.value) },
  })
  const mensaje = (nombre: string) => errores[nombre] && (
    <p id={`${nombre}-error`} role="alert" className="mt-1.5 text-xs font-semibold" style={{ color: '#dc2626' }}>{errores[nombre]}</p>
  )

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const datos = Object.fromEntries(form.entries()) as Record<string, string>
    const nuevos: Record<string, string> = {}
    for (const k of Object.keys(reglas)) {
      const m = reglas[k](datos[k] ?? '')
      if (m) nuevos[k] = m
    }
    setErrores(nuevos)
    if (Object.keys(nuevos).length) {
      // Lleva el foco al primer campo con problema.
      const primero = Object.keys(reglas).find((k) => nuevos[k])
      if (primero) requestAnimationFrame(() => document.getElementById(primero)?.focus())
      return
    }
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
              <div className="lg:col-span-2 flex flex-col gap-5 lg:gap-4">
                <div className="card lg:flex-1 !p-5">
                  <h2 className="font-heading text-xl mb-3" style={{ color: 'var(--demo-heading)' }}>Cómo funciona</h2>
                  <ul className="space-y-2">
                    {requisitos.map((text, i) => { const Icon = ICONOS_REQUISITOS[i % ICONOS_REQUISITOS.length]; return (
                      <li key={text} className="flex items-center gap-3 text-sm" style={{ color: 'var(--demo-text)' }}>
                        <Icon size={18} style={{ color: 'var(--demo-accent)' }} className="flex-shrink-0" />
                        {text}
                      </li>
                    ) })}
                  </ul>
                </div>
          <div className="card lg:flex-1 !p-5">
            <h2 className="font-heading text-xl mb-3 flex items-center gap-2" style={{ color: 'var(--demo-heading)' }}>
              <CreditCard size={20} style={{ color: 'var(--demo-accent)' }} /> Qué necesitás para inscribirte
            </h2>
            <ul className="space-y-2">
              {necesitas.map((t) => (
                <li key={t} className="flex items-start gap-3 text-sm leading-relaxed" style={{ color: 'var(--demo-text)' }}>
                  <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--demo-accent)' }} />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="card lg:flex-1 !p-5">
            <h2 className="font-heading text-xl mb-3 flex items-center gap-2" style={{ color: 'var(--demo-heading)' }}>
              <MapPin size={20} style={{ color: 'var(--demo-accent)' }} /> Sede
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
                  <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {Object.keys(errores).length > 0 && (
                <p role="alert" className="sm:col-span-2 text-sm font-semibold" style={{ color: '#dc2626' }}>
                  Revisá los {Object.keys(errores).length} campo(s) marcados en rojo para poder enviar.
                </p>
              )}
                    <div className="sm:col-span-2">
                      <label htmlFor="equipo" className="block text-sm font-semibold mb-2" style={{ color: 'var(--demo-heading)' }}>Nombre del equipo</label>
                      <input {...campo('equipo')} required maxLength={60} placeholder="Ej: Atlético Guiñazú" className="input" />
                      {mensaje('equipo')}
                    </div>
                    <div>
                      <label htmlFor="categoria" className="block text-sm font-semibold mb-2" style={{ color: 'var(--demo-heading)' }}>Categoría</label>
                      <select {...campo('categoria')} required defaultValue="" className="input">
                        <option value="" disabled>Elegí una categoría</option>
                        {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                      {mensaje('categoria')}
                    </div>
                    <div>
                      <label htmlFor="jugadores" className="block text-sm font-semibold mb-2" style={{ color: 'var(--demo-heading)' }}>Jugadores aprox.</label>
                      <input {...campo('jugadores')} type="number" min={1} max={25} inputMode="numeric" placeholder="Hasta 25" className="input" />
                      {mensaje('jugadores')}
                    </div>
                    <div>
                      <label htmlFor="delegado" className="block text-sm font-semibold mb-2" style={{ color: 'var(--demo-heading)' }}>Nombre del delegado</label>
                      <input {...campo('delegado')} required maxLength={80} placeholder="Quién representa al equipo" className="input" />
                      {mensaje('delegado')}
                    </div>
                    <div>
                      <label htmlFor="telefono" className="block text-sm font-semibold mb-2" style={{ color: 'var(--demo-heading)' }}>WhatsApp de contacto</label>
                      <input {...campo('telefono')} type="tel" required inputMode="tel" autoComplete="tel" placeholder="351 000 0000" className="input" />
                      {mensaje('telefono')}
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="mensaje" className="block text-sm font-semibold mb-2" style={{ color: 'var(--demo-heading)' }}>Mensaje (opcional)</label>
                      <textarea {...campo('mensaje')} rows={3} placeholder="Contanos algo más de tu equipo" className="input resize-none" />
                      {mensaje('mensaje')}
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
