'use client'

import { Check, RotateCcw } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useDemo, type ContenidoSitio } from '@/lib/demo-store'
import { demoConfig } from '@/lib/demo-config'
import { PORTADA_BASE, REQUISITOS_BASE, useSitio } from '@/lib/useSitio'
import { AreaTexto, Boton, Campo, Encabezado, K, Tarjeta } from '@/components/panel/ui'

// Contenido original del sitio (sin cambios del panel), para "Volver al texto original".
const ORIGINAL = demoConfig.content

// Pie común de cada bloque: guardar, volver al texto original y aviso de que el cambio ya está en el sitio.
function Pie({ clave, onGuardar, onRestablecer, valido = true }: { clave: keyof ContenidoSitio; onGuardar: () => void; onRestablecer: () => void; valido?: boolean }) {
  const { datos } = useDemo()
  const [ok, setOk] = useState(false)
  const modificado = !!datos.contenido[clave]
  return (
    <div className="flex flex-wrap items-center gap-2 pt-1">
      <Boton disabled={!valido} onClick={() => { onGuardar(); setOk(true); setTimeout(() => setOk(false), 2500) }}>Guardar</Boton>
      {modificado && <Boton variante="suave" icono={RotateCcw} onClick={() => { onRestablecer(); setOk(false) }}>Volver al texto original</Boton>}
      <span role="status" className={`inline-flex items-center gap-1 text-sm font-semibold ${ok ? 'text-[color:var(--p-verde)]' : 'sr-only'}`}>
        {ok && <><Check size={16} aria-hidden />Publicado en el sitio</>}
      </span>
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
  const valido = /^\S+@\S+\.\S+$/.test(f.email) && f.address.trim().length > 3 && /^\d{10,15}$/.test(f.whatsapp) && /^@?[\w.]{2,30}$/.test(f.instagram)
  return (
    <Bloque clave="contacto" titulo="Datos de contacto" descripcion="Aparecen en el pie del sitio, en inscripción y en los botones de WhatsApp.">
      <Campo label="Email" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} placeholder="Ej: torneo@correo.com" />
      <Campo label="Dirección de la sede" value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} placeholder="Ej: Colectora Variante Juárez Celman 500, Córdoba" />
      <Campo label="WhatsApp (solo números, con código de país)" inputMode="numeric" value={f.whatsapp} onChange={(e) => setF({ ...f, whatsapp: e.target.value.replace(/\D/g, '') })} placeholder="Ej: 5493510000000" />
      <Campo label="Instagram" value={f.instagram} onChange={(e) => setF({ ...f, instagram: e.target.value })} placeholder="Ej: @torneoimperial" />
      <Pie clave="contacto" valido={valido} onGuardar={() => guardarContenido('contacto', { ...f, instagram: f.instagram.startsWith('@') ? f.instagram : `@${f.instagram}` })}
        onRestablecer={() => { restablecerContenido('contacto'); const o = demoConfig.business; setF({ email: o.email, address: o.address, whatsapp: o.whatsapp, instagram: o.instagram }) }} />
    </Bloque>
  )
}

function Portada() {
  const { guardarContenido, restablecerContenido } = useDemo()
  const { portada } = useSitio()
  const [t, setT] = useState(portada.descripcion)
  return (
    <Bloque clave="portada" titulo="Portada del inicio" descripcion="El texto debajo del título Torneo Imperial en la primera pantalla.">
      <AreaTexto label="Descripción" rows={3} value={t} onChange={(e) => setT(e.target.value)} />
      <Pie clave="portada" valido={t.trim().length > 5} onGuardar={() => guardarContenido('portada', { descripcion: t.trim() })} onRestablecer={() => { restablecerContenido('portada'); setT(PORTADA_BASE.descripcion) }} />
    </Bloque>
  )
}

function Llamado() {
  const { guardarContenido, restablecerContenido } = useDemo()
  const { content } = useSitio()
  const c = content.cta as { title: string; subtitle: string }
  const [f, setF] = useState({ title: c.title, subtitle: c.subtitle })
  return (
    <Bloque clave="cta" titulo="Llamado a inscribirse" descripcion="El bloque dorado antes del pie de página.">
      <Campo label="Título" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
      <AreaTexto label="Subtítulo" rows={2} value={f.subtitle} onChange={(e) => setF({ ...f, subtitle: e.target.value })} />
      <Pie clave="cta" valido={f.title.trim().length > 2} onGuardar={() => guardarContenido('cta', { title: f.title.trim(), subtitle: f.subtitle.trim() })}
        onRestablecer={() => { restablecerContenido('cta'); const o = ORIGINAL.cta as { title: string; subtitle: string }; setF({ title: o.title, subtitle: o.subtitle }) }} />
    </Bloque>
  )
}

function Requisitos() {
  const { guardarContenido, restablecerContenido } = useDemo()
  const { requisitos } = useSitio()
  const [t, setT] = useState(requisitos.join('\n'))
  return (
    <Bloque clave="requisitos" titulo="Cómo funciona la inscripción" descripcion="La tarjeta con los puntos clave en la página de inscripción.">
      <AreaTexto label="Puntos (uno por línea)" rows={5} value={t} onChange={(e) => setT(e.target.value)} />
      <Pie clave="requisitos" valido={t.split('\n').some((x) => x.trim())}
        onGuardar={() => guardarContenido('requisitos', t.split('\n').map((x) => x.trim()).filter(Boolean))}
        onRestablecer={() => { restablecerContenido('requisitos'); setT(REQUISITOS_BASE.join('\n')) }} />
    </Bloque>
  )
}

function FotoFecha() {
  const { datos, setFotoFecha } = useDemo()
  const [url, setUrl] = useState(datos.fotoFechaUrl)
  return (
    <Tarjeta titulo="Foto de la fecha" descripcion="Enlace que se muestra en el inicio, en la sección de fotos de la fecha.">
      <form className="space-y-4 max-w-2xl" onSubmit={(e) => { e.preventDefault(); setFotoFecha(url.trim()) }}>
        <Campo label="Link del Drive con las fotos" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Ej: https://drive.google.com/drive/folders/…" />
        <Boton type="submit" disabled={!/^https?:\/\//.test(url)}>Guardar</Boton>
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
