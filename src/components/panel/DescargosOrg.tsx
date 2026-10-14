'use client'

import { ArrowLeft, Check, CheckCheck, Eye, Gavel, RotateCcw, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDemo, type Sancion } from '@/lib/demo-store'
import { CATEGORIAS, categoriaDeEquipo } from '@/components/panel/datos'
import { ArchivosSancion, HiloMensajes } from '@/components/panel/Adjuntos'
import { ChipsArticulos } from '@/components/panel/Sanciones'
import { BarraFiltros, Boton, Buscador, Encabezado, Etiqueta, Filtro, K, Paginador, Tabla, Tarjeta, Vacio, normalizar, useConfirmar, usePaginas } from '@/components/panel/ui'

const ESTADOS: Sancion['estado'][] = ['En revisión', 'Descargo aceptado', 'Descargo rechazado', 'Firme']
const PASOS = ['Cargada', 'Con descargo', 'Resuelta']

// Paso alcanzado: 0 cargada, 1 con descargo del equipo, 2 resuelta por la organización.
const pasoDe = (s: Sancion) => (s.estado === 'Descargo aceptado' || s.estado === 'Descargo rechazado' ? 2 : s.descargo ? 1 : 0)

// Avance en una sola línea horizontal, de punta a punta.
function LineaDeTiempo({ s }: { s: Sancion }) {
  const paso = pasoDe(s)
  return (
    <ol className="flex w-full items-center" aria-label="Avance de la sanción">
      {PASOS.map((p, i) => (
        <li key={p} className={`flex min-w-0 items-center gap-2 sm:gap-3 ${i < PASOS.length - 1 ? 'flex-1' : ''}`}>
          <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${i <= paso ? 'bg-[var(--p-teal)] text-white' : 'bg-[var(--p-fondo)] text-[color:var(--p-suave)] border border-[color:var(--p-borde)]'}`}>
            {i < paso ? <Check size={14} aria-hidden /> : i + 1}
          </span>
          <span className={`text-xs sm:text-sm whitespace-nowrap ${i <= paso ? 'font-bold text-[color:var(--p-navy)]' : K.suave}`}>{p}</span>
          {i < PASOS.length - 1 && <span className={`h-0.5 min-w-3 flex-1 rounded-full ${i < paso ? 'bg-[var(--p-teal)]' : 'bg-[var(--p-borde)]'}`} aria-hidden />}
        </li>
      ))}
    </ol>
  )
}

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3 border-t border-[color:var(--p-borde)] pt-5">
      <h4 className={`text-xs font-bold uppercase tracking-wider ${K.suave}`}>{titulo}</h4>
      {children}
    </section>
  )
}

function Dato({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className={`text-xs font-bold uppercase tracking-wide ${K.suave}`}>{titulo}</dt>
      <dd className="mt-1 text-sm font-semibold text-[color:var(--p-navy)]">{children}</dd>
    </div>
  )
}

// El descargo abierto va en la URL (?tab=descargos&d=ID): se puede compartir el enlace y "atrás" vuelve a la tabla.
function useDescargoUrl(): [string | null, (id: string | null) => void] {
  const [id, setId] = useState<string | null>(null)
  useEffect(() => {
    const leer = () => setId(new URLSearchParams(window.location.search).get('d'))
    leer()
    window.addEventListener('popstate', leer)
    return () => window.removeEventListener('popstate', leer)
  }, [])
  const abrir = useCallback((v: string | null) => {
    setId(v)
    const url = new URL(window.location.href)
    if (v) url.searchParams.set('d', v); else url.searchParams.delete('d')
    window.history.pushState(null, '', url.pathname + url.search)
    window.scrollTo({ top: 0 })
  }, [])
  return [id, abrir]
}

export default function DescargosOrg() {
  const { datos, resolver, reabrir, marcarCumplida } = useDemo()
  const { pedir, dialogo } = useConfirmar()
  const [abierto, abrir] = useDescargoUrl()
  const [q, setQ] = useState('')
  const [estado, setEstado] = useState('')
  const [catF, setCatF] = useState('')
  const [equipoF, setEquipoF] = useState('')

  const base = datos.sanciones.filter((s) => s.descargo)
  const lista = useMemo(() => {
    const nq = normalizar(q)
    return base
      .filter((s) => {
        if (estado && s.estado !== estado) return false
        if (equipoF && s.equipo !== equipoF) return false
        if (catF && categoriaDeEquipo(s.equipo) !== catF) return false
        return !nq || normalizar(`${s.jugador} ${s.equipo} ${s.descargo} ${s.motivo}`).includes(nq)
      })
      // Primero los que esperan resolución.
      .sort((a, b) => Number(b.estado === 'En revisión') - Number(a.estado === 'En revisión'))
  }, [base, q, estado, equipoF, catF])
  const pag = usePaginas(lista, 8)
  const equipos = Array.from(new Set(base.map((s) => s.equipo))).sort((a, b) => a.localeCompare(b, 'es'))
  const pendientes = base.filter((s) => s.estado === 'En revisión').length
  const s = abierto ? base.find((x) => x.id === abierto) : undefined

  // ── Detalle de un descargo: información y resolución a la izquierda, conversación a la derecha ──
  if (s) {
    const resuelta = pasoDe(s) === 2
    const hayArchivos = s.mensajes.some((m) => m.adjuntos?.length)
    return (
      <div className="space-y-6">
        <button type="button" onClick={() => abrir(null)} className="inline-flex items-center gap-2 rounded-xl py-1.5 pr-2 text-sm font-bold text-[color:var(--p-navy)] hover:text-[color:var(--p-teal)]">
          <ArrowLeft size={18} aria-hidden />Volver a descargos
        </button>
        <Encabezado titulo={s.jugador} descripcion={`${s.equipo} · ${s.partido} · ${s.fecha}`} accion={<Etiqueta texto={s.cumplida ? 'Cumplida' : s.estado} />} />
        <div className={`rounded-2xl border ${K.borde} bg-white px-5 py-4 sm:px-7`}><LineaDeTiempo s={s} /></div>
        <div className="grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-2 items-start">
          <article className={`space-y-5 rounded-2xl border ${K.borde} bg-white p-5 sm:p-7 min-w-0`}>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 rounded-xl bg-[var(--p-fondo)] p-4 sm:grid-cols-4">
              <Dato titulo="Tipo">{s.tipo}</Dato>
              <Dato titulo="Suspensión">{s.fechasSuspension} fecha(s)</Dato>
              <Dato titulo="Fecha">{s.fecha}</Dato>
              <Dato titulo="Partido">{s.partido}</Dato>
              <div className="col-span-2 min-w-0 sm:col-span-4">
                <dt className={`text-xs font-bold uppercase tracking-wide ${K.suave}`}>Artículos</dt>
                <dd className="mt-1"><ChipsArticulos s={s} max={6} /></dd>
              </div>
            </dl>

            <Seccion titulo="Informe de expulsión"><p className="text-[15px] leading-relaxed">{s.motivo}</p></Seccion>

            <Seccion titulo="Descargo del equipo">
              <blockquote className="rounded-xl border-l-4 bg-[var(--p-fondo)] px-4 py-3.5 text-[15px] leading-relaxed" style={{ borderColor: '#f3a21c' }}>{s.descargo}</blockquote>
            </Seccion>

            {hayArchivos && <Seccion titulo="Archivos"><ArchivosSancion mensajes={s.mensajes} /></Seccion>}

            <Seccion titulo="Resolución">
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                {s.estado === 'En revisión' && (
                  <>
                    <Boton icono={Check} className="sm:min-w-44" onClick={() => resolver(s.id, true)}>Aceptar descargo</Boton>
                    <Boton variante="peligro" icono={X} className="sm:min-w-44" onClick={() => resolver(s.id, false)}>Rechazar descargo</Boton>
                  </>
                )}
                {resuelta && (
                  <Boton variante="suave" icono={RotateCcw} onClick={() => pedir({ titulo: 'Reabrir la resolución', texto: `La sanción de ${s.jugador} vuelve a "En revisión" para que puedas resolverla de nuevo.`, etiqueta: 'Reabrir', peligro: false }, () => reabrir(s.id))}>Reabrir resolución</Boton>
                )}
                {s.estado !== 'Descargo aceptado' && (
                  <Boton variante="suave" icono={CheckCheck} onClick={() => marcarCumplida(s.id, !s.cumplida)}>{s.cumplida ? 'Marcar como no cumplida' : 'Marcar cumplida'}</Boton>
                )}
              </div>
            </Seccion>
          </article>

          {/* Chat: ocupa todo el alto de la pantalla; los mensajes se desplazan y el campo queda siempre abajo */}
          <section aria-label="Conversación con el delegado" className={`flex h-[78svh] min-h-[480px] min-w-0 flex-col rounded-2xl border ${K.borde} bg-white p-5 sm:p-6 xl:sticky xl:top-6 xl:h-[calc(100svh-3rem)]`}>
            <div className="mb-2 border-b border-[color:var(--p-borde)] pb-3">
              <h2 className="font-heading text-xl text-[color:var(--p-navy)]">Conversación con el delegado</h2>
              <p className={`mt-0.5 text-sm ${K.suave}`}>Lo que escribas lo ve el delegado de {s.equipo}.</p>
            </div>
            <div className="min-h-0 flex-1">
              <HiloMensajes variante="chat" s={s} quien="organizacion" placeholder="Escribile al delegado. Ej: ¿Tienen video de la jugada?" />
            </div>
          </section>
        </div>
        {dialogo}
      </div>
    )
  }

  // ── Tabla de descargos recibidos ──
  const ver = (x: Sancion) => (
    <Boton variante="suave" icono={Eye} onClick={() => abrir(x.id)} aria-label={`Ver el descargo de ${x.jugador}`}>Ver descargo</Boton>
  )
  return (
    <div className="space-y-6">
      <Encabezado
        titulo="Descargos"
        descripcion={pendientes ? `${pendientes} descargo(s) esperan tu resolución. Entrá a uno para revisar los archivos, conversar con el delegado y resolver.` : 'Acá llegan los descargos que presentan los delegados. Por ahora no hay ninguno esperando resolución.'}
      />
      <Tarjeta titulo={`Recibidos (${lista.length})`}>
        <BarraFiltros>
          <Buscador value={q} onChange={setQ} placeholder="Buscar por jugador, equipo o texto del descargo" />
          <Filtro label="Estado" value={estado} onChange={setEstado} opciones={ESTADOS} />
          <Filtro label="Categoría" value={catF} onChange={setCatF} opciones={[...CATEGORIAS]} />
          <Filtro label="Equipo" value={equipoF} onChange={setEquipoF} opciones={equipos} />
        </BarraFiltros>
        {lista.length === 0 && <Vacio icono={Gavel}>{base.length === 0 ? 'Ningún delegado presentó descargo todavía.' : 'No hay descargos con esos filtros.'}</Vacio>}
        {lista.length > 0 && (
          <Tabla
            filas={pag.items}
            clave={(x) => x.id}
            columnas={[
              { titulo: 'Jugador', celda: (x) => <button type="button" onClick={() => abrir(x.id)} className="text-left font-bold text-[color:var(--p-navy)] hover:text-[color:var(--p-teal)] hover:underline">{x.jugador}</button> },
              { titulo: 'Equipo', celda: (x) => x.equipo },
              { titulo: 'Partido', celda: (x) => <>{x.partido}<span className={`block text-xs ${K.suave}`}>{x.fecha}</span></> },
              { titulo: 'Suspensión', celda: (x) => `${x.fechasSuspension} fecha(s)` },
              { titulo: 'Estado', celda: (x) => <Etiqueta texto={x.cumplida ? 'Cumplida' : x.estado} /> },
              { titulo: '', className: 'text-right', celda: ver },
            ]}
            tarjeta={(x) => (
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-bold text-[color:var(--p-navy)]">{x.jugador}</p>
                    <p className={`text-sm ${K.suave}`}>{x.equipo} · {x.fecha}</p>
                  </div>
                  <Etiqueta texto={x.cumplida ? 'Cumplida' : x.estado} />
                </div>
                <p className="text-sm">{x.partido} · {x.fechasSuspension} fecha(s)</p>
                <Boton variante="suave" icono={Eye} className="w-full" onClick={() => abrir(x.id)}>Ver descargo</Boton>
              </div>
            )}
          />
        )}
        <Paginador {...pag} />
      </Tarjeta>
      {dialogo}
    </div>
  )
}
