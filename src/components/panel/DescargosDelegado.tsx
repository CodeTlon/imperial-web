'use client'

import { ArrowLeft, Eye, FilePenLine, Gavel, Send } from 'lucide-react'
import { fechasTxt } from '@/lib/utils'
import { useMemo, useState } from 'react'
import { admiteDescargo, useDemo, type Sancion } from '@/lib/demo-store'
import { ArchivosSancion, HiloMensajes } from '@/components/panel/Adjuntos'
import { Dato, LineaDeTiempo, Seccion, useDescargoUrl } from '@/components/panel/DescargosOrg'
import { ChipsArticulos } from '@/components/panel/Sanciones'
import { AreaTexto, BarraFiltros, Boton, Buscador, Encabezado, Etiqueta, Filtro, K, Paginador, Tabla, Tarjeta, Vacio, normalizar, usePaginas } from '@/components/panel/ui'

const ESTADOS: Sancion['estado'][] = ['Firme', 'En revisión', 'Descargo aceptado', 'Descargo rechazado']
const MIN = 30
const MAX = 1500

// Sanciones del equipo del delegado: tabla y, al entrar a una, su página con el descargo y el chat con la organización.
export default function DescargosDelegado() {
  const { sesion, datos, enviarDescargo } = useDemo()
  const [abierto, abrir] = useDescargoUrl()
  const [estado, setEstado] = useState('')
  const [q, setQ] = useState('')
  const [texto, setTexto] = useState('')
  const [intento, setIntento] = useState(false)
  const [enviado, setEnviado] = useState(false)

  const base = datos.sanciones.filter((s) => s.equipo === sesion?.equipo)
  const lista = useMemo(() => {
    const nq = normalizar(q)
    return base
      .filter((s) => (!estado || s.estado === estado) && (!nq || normalizar(`${s.jugador} ${s.partido} ${s.motivo}`).includes(nq)))
      // Primero las que todavía admiten descargo.
      .sort((a, b) => Number(admiteDescargo(b)) - Number(admiteDescargo(a)))
  }, [base, estado, q])
  const pag = usePaginas(lista, 8)
  const s = abierto ? base.find((x) => x.id === abierto) : undefined
  const pendientes = base.filter((x) => admiteDescargo(x) && !x.descargo).length

  const errorDescargo = (t: string) => {
    const n = t.trim().length
    if (n === 0) return 'Escribí el descargo del equipo.'
    if (n < MIN) return `Explicá lo ocurrido con más detalle (mínimo ${MIN} caracteres, tenés ${n}).`
    if (n > MAX) return `El descargo es muy largo: máximo ${MAX} caracteres (tenés ${n}).`
    return undefined
  }
  const abrirSancion = (id: string | null) => { setTexto(''); setIntento(false); setEnviado(false); abrir(id) }

  // ── Detalle ──
  if (s) {
    const abierta = admiteDescargo(s)
    const hayArchivos = s.mensajes.some((m) => m.adjuntos?.length)
    const error = intento ? errorDescargo(texto) : undefined
    return (
      <div className="space-y-6">
        <button type="button" onClick={() => abrirSancion(null)} className="inline-flex items-center gap-2 rounded-xl py-1.5 pr-2 text-sm font-bold text-[color:var(--p-navy)] hover:text-[color:var(--p-teal)]">
          <ArrowLeft size={18} aria-hidden />Volver a descargos
        </button>
        <Encabezado titulo={s.jugador} descripcion={`${s.equipo} · ${s.partido} · ${s.fecha}`} accion={<Etiqueta texto={s.cumplida && s.estado === 'Firme' ? 'Cumplida' : s.estado} />} />
        <div className={`rounded-2xl border ${K.borde} bg-white px-5 py-4 sm:px-7`}><LineaDeTiempo s={s} /></div>
        <div className="grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-2 items-start">
          <article className={`space-y-5 rounded-2xl border ${K.borde} bg-white p-5 sm:p-7 min-w-0`}>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 rounded-xl bg-[var(--p-fondo)] p-4 sm:grid-cols-4">
              <Dato titulo="Tipo">{s.tipo}</Dato>
              <Dato titulo="Suspensión">{fechasTxt(s.fechasSuspension)}</Dato>
              <Dato titulo="Fecha">{s.fecha}</Dato>
              <Dato titulo="Partido">{s.partido}</Dato>
              <div className="col-span-2 min-w-0 sm:col-span-4">
                <dt className={`text-xs font-bold uppercase tracking-wide ${K.suave}`}>Artículos</dt>
                <dd className="mt-1"><ChipsArticulos s={s} max={6} /></dd>
              </div>
            </dl>

            <Seccion titulo="Informe de expulsión"><p className="text-[15px] leading-relaxed">{s.motivo}</p></Seccion>

            {s.descargo && (
              <Seccion titulo="Descargo enviado">
                <blockquote className="rounded-xl border-l-4 bg-[var(--p-fondo)] px-4 py-3.5 text-[15px] leading-relaxed" style={{ borderColor: '#f3a21c' }}>{s.descargo}</blockquote>
              </Seccion>
            )}

            <Seccion titulo={s.descargo ? 'Actualizar el descargo' : 'Presentar descargo'}>
              {abierta ? (
                <form
                  className="space-y-3"
                  noValidate
                  onSubmit={(e) => {
                    e.preventDefault()
                    setIntento(true)
                    if (errorDescargo(texto)) return
                    enviarDescargo(s.id, texto.trim()); setTexto(''); setIntento(false); setEnviado(true)
                  }}
                >
                  <AreaTexto
                    aria-label="Texto del descargo"
                    rows={5}
                    value={texto}
                    onChange={(e) => { setTexto(e.target.value); setEnviado(false) }}
                    error={error}
                    placeholder="Explicá lo ocurrido desde la mirada del equipo. Ej: El contacto fue accidental, el jugador disputaba la pelota."
                  />
                  <p className={`text-right text-xs ${K.suave}`}>{texto.trim().length}/{MAX}</p>
                  <Boton type="submit" icono={Send}>{s.descargo ? 'Actualizar descargo' : 'Enviar descargo'}</Boton>
                  {enviado && <p role="status" className="text-sm font-semibold text-[color:var(--p-verde)]">Descargo enviado: la organización ya lo puede revisar.</p>}
                  <p className={`text-xs ${K.suave}`}>Podés sumar fotos, videos o PDFs de la jugada desde el chat.</p>
                </form>
              ) : (
                <p className={`text-sm ${K.suave}`}>Esta sanción ya está {s.cumplida && s.estado === 'Firme' ? 'cumplida' : 'resuelta'}: no admite descargo.</p>
              )}
            </Seccion>

            {hayArchivos && <Seccion titulo="Archivos"><ArchivosSancion mensajes={s.mensajes} /></Seccion>}
          </article>

          <section aria-label="Conversación con la organización" className={`flex h-[78svh] min-h-[480px] min-w-0 flex-col rounded-2xl border ${K.borde} bg-white p-5 sm:p-6 xl:sticky xl:top-6 xl:h-[calc(100svh-3rem)]`}>
            <div className="mb-2 border-b border-[color:var(--p-borde)] pb-3">
              <h2 className="font-heading text-xl text-[color:var(--p-navy)]">Conversación con la organización</h2>
              <p className={`mt-0.5 text-sm ${K.suave}`}>Lo que escribas lo ve el Tribunal de Disciplina.</p>
            </div>
            <div className="min-h-0 flex-1">
              <HiloMensajes variante="chat" s={s} quien="delegado" placeholder="Mensaje a la organización. Ej: Adjuntamos el video de la jugada" />
            </div>
          </section>
        </div>
      </div>
    )
  }

  // ── Tabla ──
  const accion = (x: Sancion) => {
    const presentar = admiteDescargo(x) && !x.descargo
    return (
      <Boton variante={presentar ? 'primario' : 'suave'} icono={presentar ? FilePenLine : Eye} onClick={() => abrirSancion(x.id)} aria-label={`${presentar ? 'Presentar descargo de' : 'Ver sanción de'} ${x.jugador}`}>
        {presentar ? 'Presentar descargo' : 'Ver detalle'}
      </Boton>
    )
  }
  return (
    <div className="space-y-6">
      <Encabezado
        titulo="Descargos"
        descripcion={pendientes ? `${pendientes} sanción(es) de ${sesion?.equipo} todavía no tienen descargo. Entrá a una para presentarlo.` : `Sanciones de ${sesion?.equipo}. Entrá a una para ver el detalle o conversar con la organización.`}
      />
      <Tarjeta titulo={`Sanciones de ${sesion?.equipo} (${lista.length})`}>
        <BarraFiltros>
          <Buscador value={q} onChange={setQ} placeholder="Buscar jugador, partido o texto del informe" />
          <Filtro label="Estado" value={estado} onChange={setEstado} opciones={ESTADOS} />
        </BarraFiltros>
        {lista.length === 0 && <Vacio icono={Gavel}>{base.length === 0 ? 'Tu equipo no tiene sanciones.' : 'No hay sanciones con esos filtros.'}</Vacio>}
        {lista.length > 0 && (
          <Tabla
            filas={pag.items}
            clave={(x) => x.id}
            columnas={[
              { titulo: 'Jugador', celda: (x) => <button type="button" onClick={() => abrirSancion(x.id)} className="text-left font-bold text-[color:var(--p-navy)] hover:text-[color:var(--p-teal)] hover:underline">{x.jugador}</button> },
              { titulo: 'Partido', celda: (x) => <>{x.partido}<span className={`block text-xs ${K.suave}`}>{x.fecha}</span></> },
              { titulo: 'Artículos', celda: (x) => <ChipsArticulos s={x} max={2} /> },
              { titulo: 'Suspensión', celda: (x) => `${fechasTxt(x.fechasSuspension)}` },
              { titulo: 'Estado', celda: (x) => <Etiqueta texto={x.cumplida && x.estado === 'Firme' ? 'Cumplida' : x.estado} /> },
              { titulo: '', className: 'text-right', celda: accion },
            ]}
            tarjeta={(x) => (
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-bold text-[color:var(--p-navy)]">{x.jugador}</p>
                    <p className={`text-sm ${K.suave}`}>{x.partido} · {x.fecha}</p>
                  </div>
                  <Etiqueta texto={x.cumplida && x.estado === 'Firme' ? 'Cumplida' : x.estado} />
                </div>
                <p className="text-sm">{fechasTxt(x.fechasSuspension)} de suspensión</p>
                <div className="[&>button]:w-full">{accion(x)}</div>
              </div>
            )}
          />
        )}
        <Paginador {...pag} />
      </Tarjeta>
    </div>
  )
}
