'use client'

import { useState, type ChangeEvent, type FormEvent } from 'react'
import Image from 'next/image'
import { MapPin, Phone, Mail, Clock, Check } from 'lucide-react'
import { WhatsAppIcon } from '@/components/icons/BrandIcons'
import { demoConfig } from '@/lib/demo-config'
import { waLink } from '@/lib/utils'

const inputStyle = {
  borderColor: 'var(--demo-border)',
  backgroundColor: 'var(--demo-surface)',
  color: 'var(--demo-text)',
  borderRadius: 'var(--demo-radius)',
} as const

const empty = { nombre: '', telefono: '', email: '', servicio: '', mensaje: '' }

export default function Contact() {
  const { business } = demoConfig
  const [form, setForm] = useState(empty)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const set =
    (k: keyof typeof form) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [k]: e.target.value }))
      setError('')
    }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    // Validación de verdad (no rompe: nunca recarga, siempre da feedback).
    if (!form.nombre.trim()) return setError('Decinos tu nombre.')
    if (!form.telefono.trim() && !form.email.trim())
      return setError('Dejanos un teléfono o un email para responderte.')
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return setError('Revisá el email, parece incompleto.')

    const msg =
      `Hola ${business.name}! Soy ${form.nombre}.` +
      (form.servicio ? ` Me interesa: ${form.servicio}.` : '') +
      (form.mensaje ? ` ${form.mensaje}` : '') +
      (form.telefono ? ` Mi teléfono: ${form.telefono}.` : '')
    window.open(waLink(business.whatsapp, msg), '_blank', 'noopener,noreferrer')
    setSent(true)
  }

  return (
    <section id="contact" className="section-pad" style={{ backgroundColor: 'var(--demo-surface)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="eyebrow">Escribinos</p>
          <h2 className="section-title">Contacto</h2>
          <p className="section-subtitle mt-4">
            Anotá a tu equipo o consultanos lo que necesites.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Formulario interactivo */}
          <div className="card p-8" style={{ backgroundColor: 'var(--demo-surface-alt)' }}>
            {sent ? (
              <div className="text-center py-10">
                <div
                  className="w-16 h-16 mx-auto mb-5 flex items-center justify-center"
                  style={{ backgroundColor: 'var(--demo-accent)', borderRadius: 'var(--demo-radius)' }}
                >
                  <Check size={32} style={{ color: 'var(--demo-on-accent)' }} />
                </div>
                <h3 className="font-bold text-xl mb-2" style={{ color: 'var(--demo-heading)' }}>
                  ¡Listo, {form.nombre.split(' ')[0]}!
                </h3>
                <p className="text-sm mb-6" style={{ color: 'var(--demo-muted)' }}>
                  Te abrimos WhatsApp con tu consulta cargada. Si no se abrió, tocá el botón.
                </p>
                <a
                  href={waLink(business.whatsapp, `Hola ${business.name}! Soy ${form.nombre}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 font-semibold"
                  style={{ backgroundColor: 'var(--demo-accent)', color: 'var(--demo-on-accent)', borderRadius: 'var(--demo-radius)' }}
                >
                  <WhatsAppIcon size={18} /> Abrir WhatsApp
                </a>
                <button
                  type="button"
                  onClick={() => { setSent(false); setForm(empty) }}
                  className="block mx-auto mt-4 text-sm underline"
                  style={{ color: 'var(--demo-muted)' }}
                >
                  Enviar otra consulta
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <h3 className="font-bold text-xl mb-6" style={{ color: 'var(--demo-heading)' }}>
                  Envianos un mensaje
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--demo-muted)' }}>Nombre</label>
                      <input type="text" placeholder="Tu nombre" value={form.nombre} onChange={set('nombre')}
                        className="w-full px-4 py-3 border text-sm outline-none transition-shadow focus:ring-2 focus:ring-[var(--demo-accent)]" style={inputStyle} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--demo-muted)' }}>Teléfono</label>
                      <input type="tel" placeholder="+54 9 351 000-0000" value={form.telefono} onChange={set('telefono')}
                        className="w-full px-4 py-3 border text-sm outline-none transition-shadow focus:ring-2 focus:ring-[var(--demo-accent)]" style={inputStyle} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--demo-muted)' }}>Email</label>
                    <input type="email" placeholder="tu@email.com" value={form.email} onChange={set('email')}
                      className="w-full px-4 py-3 border text-sm outline-none transition-shadow focus:ring-2 focus:ring-[var(--demo-accent)]" style={inputStyle} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--demo-muted)' }}>Categoría de interés</label>
                    <input type="text" placeholder="Libre, +30, +35, +40, +45 o Femenino" value={form.servicio} onChange={set('servicio')}
                      className="w-full px-4 py-3 border text-sm outline-none transition-shadow focus:ring-2 focus:ring-[var(--demo-accent)]" style={inputStyle} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--demo-muted)' }}>Mensaje</label>
                    <textarea placeholder="Contanos en qué podemos ayudarte..." rows={4} value={form.mensaje} onChange={set('mensaje')}
                      className="w-full px-4 py-3 border text-sm outline-none transition-shadow focus:ring-2 focus:ring-[var(--demo-accent)] resize-none" style={{ ...inputStyle, borderRadius: 'var(--demo-radius-lg)' }} />
                  </div>
                  {error && (
                    <p className="text-sm font-medium" style={{ color: '#dc2626' }} role="alert">{error}</p>
                  )}
                  <button
                    type="submit"
                    className="w-full py-4 font-semibold transition-opacity hover:opacity-90 inline-flex items-center justify-center gap-2"
                    style={{ backgroundColor: 'var(--demo-accent)', color: 'var(--demo-on-accent)', borderRadius: 'var(--demo-radius)' }}
                  >
                    <WhatsAppIcon size={18} /> Enviar por WhatsApp
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Info de contacto */}
          <div className="space-y-8">
            <div>
              <h3 className="font-bold text-xl mb-6" style={{ color: 'var(--demo-heading)' }}>
                Información de contacto
              </h3>
              <ul className="space-y-5">
                {[
                  { icon: MapPin,  text: business.address },
                  { icon: Phone,   text: business.phone },
                  { icon: Mail,    text: business.email },
                  { icon: Clock,   text: 'Partidos: sábados y domingos' },
                ].map(({ icon: Icon, text }) => text && (
                  <li key={text} className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: 'var(--demo-accent)', borderRadius: 'var(--demo-radius)' }}
                    >
                      <Icon size={18} style={{ color: 'var(--demo-on-accent)' }} />
                    </div>
                    <span className="text-sm mt-2" style={{ color: 'var(--demo-text)' }}>{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Plano real del predio */}
            <div
              className="overflow-hidden border"
              style={{ borderColor: 'var(--demo-border)', borderRadius: 'var(--demo-radius-lg)' }}
            >
              <div className="relative w-full aspect-[8/5]">
                <Image
                  src="/images/venue-map.jpg"
                  alt={`Plano del predio de ${business.name}`}
                  fill
                  className="object-cover"
                />
              </div>
              <p
                className="text-xs text-center py-2 px-3"
                style={{ backgroundColor: 'var(--demo-surface-alt)', color: 'var(--demo-muted)' }}
              >
                {business.address}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
