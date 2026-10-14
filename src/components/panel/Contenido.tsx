'use client'

import { Check, RotateCcw } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useDemo, type ContenidoSitio } from '@/lib/demo-store'
import { demoConfig } from '@/lib/demo-config'
import { PORTADA_BASE, REQUISITOS_BASE, useSitio } from '@/lib/useSitio'
import { AreaTexto, Boton, Campo, Encabezado, K, MensajeError, Tarjeta } from '@/components/panel/ui'

// Contenido original del sitio (sin cambios del panel), para "Volver al texto original".
const ORIGINAL = demoConfig.content

// Pie común de cada bloque: guardar (con validación), volver al texto original y aviso de que el cambio ya está en el sitio.
function Pie({ clave, onGuardar, onRestablecer, errores, onIntento }: { clave: keyof ContenidoSitio; onGuardar: () => void; onRestablecer: () => void; errores: Record<string, string>; onIntento: (v: boolean) => void }) {
  const { datos } = useDemo()
  const [ok, setOk] = useState(false)
  const modificado = !!datos.contenido[clave]
  const cuantos = Object.keys(errores).length
  const [intentado, setIntentado] = useState(false)
  return (
    <div className="space-y-2 pt-1">
      <div className="flex flex-wrap items-center gap-2">
        <Boton onClick={() => {
          setIntentado(true); onIntento(true)
          if (cuantos) return
          onGuardar(); onIntento(false); setIntentado(false); setOk(true); setTimeout(() => setOk(false), 2500)
        }}>Guardar</Boton>
        {modificado && <Boton variante="suave" icono={RotateCcw} onClick={() => { onRestablecer(); onIntento(false); setIntentado(false); setOk(false) }}>Volver al texto original</Boton>}
        <span role="status" className={`inline-flex items-center gap-1 text-sm font-semibold ${ok ? 'text-[color:var(--p-verde)]' : 'sr-only'}`}>
          {ok && <><Check size={16} aria-hidden />Publicado en el sitio</>}
        </span>
      </div>
      {intentado && cuantos > 0 && <MensajeError>Revisá los campos marcados en rojo: no se guardó nada.</MensajeError>}
    </div>
  )
}

function Bloque({ titulo, descripcion, clave, children }: { titulo: string; descripcion: string; clave: keyof ContenidoSitio; children: ReactNode }) {
  const { datos } = useDemo()
  return (
    <Tarjeta titulo={titulo} descripcion={descripcion} derecha={datos.contenido[clave] ? <span className="rounded-full bg-[var(--p-oro)]/20 px-2.5 py-0.5 text-xs font-bold text-[color:var(--p-navy)]">Modificado</span> : undefined}>
      <div className="space-y-4 max-w-2xl">{children}</div>
    </Tarjeta>
  )
}

function Contacto() {
  const { guardarContenido, restablecerContenido } = useDemo()
  const { business } = useSitio()
  const [f, setF] = useState({ email: business.email, address: business.address, whatsapp: business.whatsapp, instagram: business.instagram })
  const [intento, setIntento] = useState(false)
  const errores: Record<string, string> = {}
  if (!f.email.trim()) errores.email = 'Ingresá el email de contacto.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) errores.email = 'El email no es válido. Ejemplo: torneo@correo.com'
  if (!f.address.trim()) errores.address = 'Ingresá la dirección de la sede.'
  else if (f.address.trim().length < 8) errores.address = 'La dirección es muy corta: incluí calle, número y ciudad.'
  else if (f.address.trim().length > 120) errores.address = 'La dirección es muy larga (máximo 120 caracteres).'
  if (!f.whatsapp) errores.whatsapp = 'Ingresá el WhatsApp con código de país, solo números.'
  else if (f.whatsapp.length < 10 || f.whatsapp.length > 15) errores.whatsapp = 'Tiene que tener entre 10 y 15 números, con código de país (ej. 5493510000000).'
  else if (!f.whatsapp.startsWith('54')) errores.whatsapp = 'Debe empezar con el código de Argentina: 54 (ej. 5493510000000).'
  if (!f.instagram.trim()) errores.instagram = 'Ingresá el usuario de Instagram.'
  else if (!/^@?[A-Za-z0-9._]{2,30}$/.test(f.instagram.trim())) errores.instagram = 'Usá de 2 a 30 letras, números, puntos o guiones bajos. Ejemplo: @torneoimperial'
  const err = (k: string) => (intento ? errores[k] : undefined)
  return (
    <Bloque clave="contacto" titulo="Datos de contacto" descripcion="Aparecen en el pie del sitio, en inscripción y en los botones de WhatsApp.">
      <Campo label="Email" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} placeholder="Ej: torneo@correo.com" error={err('email')} />
      <Campo label="Dirección de la sede" value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} placeholder="Ej: Colectora Variante Juárez Celman 500, Córdoba" error={err('address')} />
      <Campo label="WhatsApp (solo números, con código de país)" inputMode="numeric" value={f.whatsapp} onChange={(e) => setF({ ...f, whatsapp: e.target.value.replace(/\D/g, '') })} placeholder="Ej: 5493510000000" error={err('whatsapp')} />
      <Campo label="Instagram" value={f.instagram} onChange={(e) => setF({ ...f, instagram: e.target.value })} placeholder="Ej: @torneoimperial" error={err('instagram')} />
      <Pie clave="contacto" errores={errores} onIntento={setIntento} onGuardar={() => guardarContenido('contacto', { ...f, email: f.email.trim(), address: f.address.trim(), instagram: f.instagram.trim().startsWith('@') ? f.instagram.trim() : `@${f.instagram.trim()}` })}
        onRestablecer={() => { restablecerContenido('contacto'); const o = demoConfig.business; setF({ email: o.email, address: o.address, whatsapp: o.whatsapp, instagram: o.instagram }) }} />
    </Bloque>
  )
}

function Portada() {
  const { guardarContenido, restablecerContenido } = useDemo()
  const { portada } = useSitio()
  const [t, setT] = useState(portada.descripcion)
  const [intento, setIntento] = useState(false)
  const errores: Record<string, string> = {}
  if (t.trim().length < 10) errores.t = `Escribí al menos 10 caracteres (tenés ${t.trim().length}).`
  else if (t.trim().length > 200) errores.t = `Máximo 200 caracteres (tenés ${t.trim().length}).`
  return (
    <Bloque clave="portada" titulo="Portada del inicio" descripcion="El texto debajo del título Torneo Imperial en la primera pantalla.">
      <AreaTexto label="Descripción" rows={3} value={t} onChange={(e) => setT(e.target.value)} error={intento ? errores.t : undefined} />
      <p className={`text-right text-xs ${K.suave}`}>{t.trim().length}/200</p>
      <Pie clave="portada" errores={errores} onIntento={setIntento} onGuardar={() => guardarContenido('portada', { descripcion: t.trim() })} onRestablecer={() => { restablecerContenido('portada'); setT(PORTADA_BASE.descripcion) }} />
    </Bloque>
  )
}

function Llamado() {
  const { guardarContenido, restablecerContenido } = useDemo()
  const { content } = useSitio()
  const c = content.cta as { title: string; subtitle: string }
  const [f, setF] = useState({ title: c.title, subtitle: c.subtitle })
  const [intento, setIntento] = useState(false)
  const errores: Record<string, string> = {}
  if (f.title.trim().length < 5) errores.title = `El título necesita al menos 5 caracteres (tenés ${f.title.trim().length}).`
  else if (f.title.trim().length > 80) errores.title = `El título admite hasta 80 caracteres (tenés ${f.title.trim().length}).`
  if (f.subtitle.trim().length < 10) errores.subtitle = `El subtítulo necesita al menos 10 caracteres (tenés ${f.subtitle.trim().length}).`
  else if (f.subtitle.trim().length > 200) errores.subtitle = `El subtítulo admite hasta 200 caracteres (tenés ${f.subtitle.trim().length}).`
  return (
    <Bloque clave="cta" titulo="Llamado a inscribirse" descripcion="El bloque dorado antes del pie de página.">
      <Campo label="Título" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} error={intento ? errores.title : undefined} />
      <AreaTexto label="Subtítulo" rows={2} value={f.subtitle} onChange={(e) => setF({ ...f, subtitle: e.target.value })} error={intento ? errores.subtitle : undefined} />
      <Pie clave="cta" errores={errores} onIntento={setIntento} onGuardar={() => guardarContenido('cta', { title: f.title.trim(), subtitle: f.subtitle.trim() })}
        onRestablecer={() => { restablecerContenido('cta'); const o = ORIGINAL.cta as { title: string; subtitle: string }; setF({ title: o.title, subtitle: o.subtitle }) }} />
    </Bloque>
  )
}

function Requisitos() {
  const { guardarContenido, restablecerContenido } = useDemo()
  const { requisitos } = useSitio()
  const [t, setT] = useState(requisitos.join('\n'))
  const [intento, setIntento] = useState(false)
  const lineas = t.split('\n').map((x) => x.trim()).filter(Boolean)
  const errores: Record<string, string> = {}
  if (lineas.length === 0) errores.t = 'Escribí al menos un punto.'
  else if (lineas.length > 8) errores.t = `Máximo 8 puntos (tenés ${lineas.length}).`
  else if (lineas.some((x) => x.length > 90)) errores.t = 'Cada punto admite hasta 90 caracteres: acortá el que está marcado como muy largo.'
  else if (new Set(lineas.map((x) => x.toLowerCase())).size !== lineas.length) errores.t = 'Hay puntos repetidos.'
  return (
    <Bloque clave="requisitos" titulo="Cómo funciona la inscripción" descripcion="La tarjeta con los puntos clave en la página de inscripción.">
      <AreaTexto label="Puntos (uno por línea)" rows={5} value={t} onChange={(e) => setT(e.target.value)} error={intento ? errores.t : undefined} />
      <Pie clave="requisitos" errores={errores} onIntento={setIntento}
        onGuardar={() => guardarContenido('requisitos', t.split('\n').map((x) => x.trim()).filter(Boolean))}
        onRestablecer={() => { restablecerContenido('requisitos'); setT(REQUISITOS_BASE.join('\n')) }} />
    </Bloque>
  )
}

function FotoFecha() {
  const { datos, setFotoFecha } = useDemo()
  const [url, setUrl] = useState(datos.fotoFechaUrl)
  const [intento, setIntento] = useState(false)
  const [ok, setOk] = useState(false)
  const error = (() => {
    const t = url.trim()
    if (!t) return 'Pegá el enlace de la carpeta con las fotos.'
    let u: URL
    try { u = new URL(t) } catch { return 'El enlace no es válido. Tiene que empezar con https://' }
    if (u.protocol !== 'https:') return 'El enlace tiene que empezar con https://'
    if (!u.hostname.includes('.')) return 'El enlace no tiene un dominio válido.'
  })()
  return (
    <Tarjeta titulo="Foto de la fecha" descripcion="Enlace que se muestra en el inicio, en la sección de fotos de la fecha.">
      <form className="space-y-4 max-w-2xl" noValidate onSubmit={(e) => { e.preventDefault(); setIntento(true); if (error) return; setFotoFecha(url.trim()); setIntento(false); setOk(true); setTimeout(() => setOk(false), 2500) }}>
        <Campo label="Link del Drive con las fotos" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Ej: https://drive.google.com/drive/folders/…" error={intento ? error : undefined} />
        <div className="flex flex-wrap items-center gap-2">
          <Boton type="submit">Guardar</Boton>
          <span role="status" className={`inline-flex items-center gap-1 text-sm font-semibold ${ok ? 'text-[color:var(--p-verde)]' : 'sr-only'}`}>{ok && <><Check size={16} aria-hidden />Publicado en el sitio</>}</span>
        </div>
      </form>
    </Tarjeta>
  )
}

export default function Contenido() {
  return (
    <div className="space-y-6">
      <Encabezado titulo="Contenido" descripcion="Textos y datos del sitio público. Lo que guardes acá se ve al instante en el inicio, el pie de página y la inscripción." />
      <p className={`text-sm ${K.suave}`}>En esta demo los cambios se guardan solo en este navegador.</p>
      <div className="grid gap-6 xl:grid-cols-2 items-start">
        <div className="space-y-6 min-w-0">
          <Contacto />
          <Portada />
        </div>
        <div className="space-y-6 min-w-0">
          <Llamado />
          <Requisitos />
          <FotoFecha />
        </div>
      </div>
    </div>
  )
}
