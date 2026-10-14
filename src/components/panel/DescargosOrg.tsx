'use client'

import { ArrowLeft, Check, CheckCheck, ChevronRight, Gavel, RotateCcw, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useDemo, type Sancion } from '@/lib/demo-store'
import { CATEGORIAS, categoriaDeEquipo } from '@/components/panel/datos'
import { ArchivosSancion, HiloMensajes } from '@/components/panel/Adjuntos'
import { ChipsArticulos } from '@/components/panel/Sanciones'
import { BarraFiltros, Boton, Buscador, Encabezado, Etiqueta, Filtro, K, Tarjeta, Vacio, normalizar, useConfirmar } from '@/components/panel/ui'

const ESTADOS: Sancion['estado'][] = ['En revisión', 'Descargo aceptado', 'Descargo rechazado', 'Firme']
const PASOS = ['Cargada', 'Con descargo', 'Resuelta']

// Paso alcanzado: 0 cargada, 1 con descargo del equipo, 2 resuelta por la organización.
const pasoDe = (s: Sancion) => (s.estado === 'Descargo aceptado' || s.estado === 'Descargo rechazado' ? 2 : s.descargo ? 1 : 0)

function LineaDeTiempo({ s }: { s: Sancion }) {
  const paso = pasoDe(s)
  return (
    <ol className="flex flex-wrap items-center gap-x-2 gap-y-1" aria-label="Avance de la sanción">
      {PASOS.map((p, i) => (
        <li key={p} className="flex items-center gap-2 min-w-0">
          <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${i <= paso ? 'bg-[var(--p-teal)] text-white' : 'bg-[var(--p-fondo)] text-[color:var(--p-suave)] border border-[color:var(--p-borde)]'}`}>
            {i < paso ? <Check size={14} aria-hidden /> : i + 1}
          </span>
          <span className={`text-sm whitespace-nowrap ${i <= paso ? 'font-bold text-[color:var(--p-navy)]' : K.suave}`}>{p}</span>
          {i < PASOS.length - 1 && <span className={`h-px w-4 sm:w-8 ${i < paso ? 'bg-[var(--p-teal)]' : 'bg-[var(--p-borde)]'}`} aria-hidden />}
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

// Lista de descargos a la izquierda y el detalle del elegido a la derecha. En celular se ve una cosa por vez.
export default function DescargosOrg() {
  const { datos, resolver, reabrir, marcarCumplida } = useDemo()
  const { pedir, dialogo } = useConfirmar()
  const [q, setQ] = useState('')
  const [estado, setEstado] = useState('')
  const [catF, setCatF] = useState('')
  const [equipoF, setEquipoF] = useState('')
  const [sel, setSel] = useState<string | null>(null)
  const [detalleMovil, setDetalleMovil] = useState(false)

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
  const equipos = Array.from(new Set(base.map((s) => s.equipo))).sort((a, b) => a.localeCompare(b, 'es'))
  const pendientes = base.filter((s) => s.estado === 'En revisión').length
  const s = lista.find((x) => x.id === sel) ?? lista[0]
  const resuelta = s ? pasoDe(s) === 2 : false
  const hayArchivos = !!s?.mensajes.some((m) => m.adjuntos?.length)

  return (
    <div className="space-y-6">
      <Encabezado
        titulo="Descargos"
        descripcion={pendientes ? `${pendientes} descargo(s) esperan tu resolución. Revisá los archivos, conversá con el delegado y resolvé.` : 'Acá llegan los descargos que presentan los delegados. Por ahora no hay ninguno esperando resolución.'}
      />
      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(300px,380px)_minmax(0,1fr)] items-start">
        {/* Lista */}
        <div className={detalleMovil ? 'hidden lg:block' : ''}>
          <Tarjeta titulo={`Recibidos (${lista.length})`}>
            <BarraFiltros>
              <Buscador value={q} onChange={setQ} placeholder="Buscar jugador, equipo o texto" />
              <Filtro label="Estado" value={estado} onChange={setEstado} opciones={ESTADOS} />
              <Filtro label="Categoría" value={catF} onChange={setCatF} opciones={[...CATEGORIAS]} />
              <Filtro label="Equipo" value={equipoF} onChange={setEquipoF} opciones={equipos} />
            </BarraFiltros>
            {lista.length === 0 && <Vacio icono={Gavel}>{base.length === 0 ? 'Ningún delegado presentó descargo todavía.' : 'No hay descargos con esos filtros.'}</Vacio>}
            <ul className="-mx-1 space-y-1.5 lg:max-h-[calc(100vh-22rem)] lg:overflow-y-auto lg:px-1 lg:py-1">
              {lista.map((x) => {
                const activo = s?.id === x.id
                return (
                  <li key={x.id}>
                    <button
                      type="button"
                      onClick={() => { setSel(x.id); setDetalleMovil(true) }}
                      aria-current={activo ? 'true' : undefined}
                      className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition ${activo ? 'border-[color:var(--p-teal)] bg-[var(--p-teal)]/5 lg:ring-1 lg:ring-[color:var(--p-teal)]' : `${K.borde} bg-white hover:border-[color:var(--p-teal)]`}`}
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-bold text-[color:var(--p-navy)]">{x.jugador}</span>
                        <span className={`block truncate text-sm ${K.suave}`}>{x.equipo}</span>
                        <span className="mt-2 block"><Etiqueta texto={x.cumplida ? 'Cumplida' : x.estado} /></span>
                      </span>
                      <span className={`shrink-0 text-xs ${K.suave}`}>{x.fecha}</span>
                      <ChevronRight size={18} className="shrink-0 text-[color:var(--p-suave)] lg:hidden" aria-hidden />
                    </button>
                  </li>
                )
              })}
            </ul>
          </Tarjeta>
        </div>

        {/* Detalle */}
        {s && (
          <div className={detalleMovil ? '' : 'hidden lg:block'}>
            <button type="button" onClick={() => setDetalleMovil(false)} className="mb-3 inline-flex items-center gap-2 rounded-xl px-1 py-1.5 text-sm font-bold text-[color:var(--p-navy)] lg:hidden">
              <ArrowLeft size={18} aria-hidden />Volver a la lista
            </button>
            <article className={`space-y-5 rounded-2xl border ${K.borde} bg-white p-5 sm:p-7 min-w-0`}>
              <header className="space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-heading text-2xl sm:text-3xl text-[color:var(--p-navy)]">{s.jugador}</h3>
                    <p className={`mt-1 text-sm ${K.suave}`}>{s.equipo}</p>
                  </div>
                  <Etiqueta texto={s.cumplida ? 'Cumplida' : s.estado} />
                </div>
                <LineaDeTiempo s={s} />
              </header>

              <dl className="grid grid-cols-2 gap-x-6 gap-y-4 rounded-xl bg-[var(--p-fondo)] p-4 sm:grid-cols-3">
                <Dato titulo="Partido">{s.partido}</Dato>
                <Dato titulo="Fecha">{s.fecha}</Dato>
                <Dato titulo="Tipo">{s.tipo}</Dato>
                <Dato titulo="Suspensión">{s.fechasSuspension} fecha(s)</Dato>
                <div className="col-span-2 min-w-0 sm:col-span-2">
                  <dt className={`text-xs font-bold uppercase tracking-wide ${K.suave}`}>Artículos</dt>
                  <dd className="mt-1"><ChipsArticulos s={s} max={4} /></dd>
                </div>
              </dl>

              <Seccion titulo="Informe de expulsión"><p className="text-[15px] leading-relaxed">{s.motivo}</p></Seccion>

              <Seccion titulo="Descargo del equipo">
                <blockquote className="rounded-xl border-l-4 bg-[var(--p-fondo)] px-4 py-3.5 text-[15px] leading-relaxed" style={{ borderColor: '#f3a21c' }}>{s.descargo}</blockquote>
              </Seccion>

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

              {hayArchivos && <Seccion titulo="Archivos"><ArchivosSancion mensajes={s.mensajes} /></Seccion>}

              <Seccion titulo="Conversación con el delegado">
                <HiloMensajes s={s} quien="organizacion" placeholder="Escribile al delegado. Ej: ¿Tienen video de la jugada?" />
              </Seccion>
            </article>
          </div>
        )}
      </div>
      {dialogo}
    </div>
  )
}
