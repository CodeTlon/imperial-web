'use client'

import { Check, CheckCheck, Gavel, RotateCcw, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useDemo, type Sancion } from '@/lib/demo-store'
import { CATEGORIAS, categoriaDeEquipo } from '@/components/panel/datos'
import { ArchivosSancion, HiloMensajes } from '@/components/panel/Adjuntos'
import { ChipsArticulos } from '@/components/panel/Sanciones'
import { BarraFiltros, Boton, Buscador, Encabezado, Etiqueta, Filtro, K, Paginador, Tarjeta, Vacio, normalizar, usePaginas, useConfirmar } from '@/components/panel/ui'

const ESTADOS: Sancion['estado'][] = ['En revisión', 'Descargo aceptado', 'Descargo rechazado', 'Firme']
const PASOS = ['Cargada', 'Con descargo', 'Resuelta']

// Paso alcanzado: 0 cargada, 1 con descargo del equipo, 2 resuelta por la organización.
const pasoDe = (s: Sancion) => (s.estado === 'Descargo aceptado' || s.estado === 'Descargo rechazado' ? 2 : s.descargo ? 1 : 0)

function LineaDeTiempo({ s }: { s: Sancion }) {
  const paso = pasoDe(s)
  return (
    <ol className="flex items-center gap-2" aria-label="Avance de la sanción">
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

export default function DescargosOrg() {
  const { datos, resolver, reabrir, marcarCumplida } = useDemo()
  const { pedir, dialogo } = useConfirmar()
  const [q, setQ] = useState('')
  const [estado, setEstado] = useState('')
  const [catF, setCatF] = useState('')
  const [equipoF, setEquipoF] = useState('')

  const base = datos.sanciones.filter((s) => s.descargo)
  const lista = useMemo(() => {
    const nq = normalizar(q)
    return base.filter((s) => {
      if (estado && s.estado !== estado) return false
      if (equipoF && s.equipo !== equipoF) return false
      if (catF && categoriaDeEquipo(s.equipo) !== catF) return false
      return !nq || normalizar(`${s.jugador} ${s.equipo} ${s.descargo} ${s.motivo}`).includes(nq)
    })
  }, [base, q, estado, equipoF, catF])
  const pag = usePaginas(lista, 4)
  const equipos = Array.from(new Set(base.map((s) => s.equipo))).sort((a, b) => a.localeCompare(b, 'es'))
  const pendientes = base.filter((s) => s.estado === 'En revisión').length

  return (
    <div className="space-y-6">
      <Encabezado
        titulo="Descargos"
        descripcion={pendientes ? `${pendientes} descargo(s) esperan tu resolución. Revisá los archivos, conversá con el delegado y resolvé.` : 'Acá llegan los descargos que presentan los delegados. Por ahora no hay ninguno esperando resolución.'}
      />
      <Tarjeta titulo={`Descargos recibidos (${lista.length})`}>
        <BarraFiltros>
          <Buscador value={q} onChange={setQ} placeholder="Buscar por jugador, equipo o texto del descargo" />
          <Filtro label="Estado" value={estado} onChange={setEstado} opciones={ESTADOS} />
          <Filtro label="Categoría" value={catF} onChange={setCatF} opciones={[...CATEGORIAS]} />
          <Filtro label="Equipo" value={equipoF} onChange={setEquipoF} opciones={equipos} />
        </BarraFiltros>
        {lista.length === 0 && <Vacio icono={Gavel}>{base.length === 0 ? 'Ningún delegado presentó descargo todavía.' : 'No hay descargos con esos filtros.'}</Vacio>}
        <div className="grid gap-4 xl:grid-cols-2">
          {pag.items.map((s) => {
            const resuelta = pasoDe(s) === 2
            return (
              <article key={s.id} className={`rounded-xl border ${K.borde} p-4 space-y-4 min-w-0`}>
                <header className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-heading text-lg text-[color:var(--p-navy)]">{s.jugador}</h3>
                    <p className={`text-sm ${K.suave}`}>{s.equipo} · {s.partido} · {s.fecha}</p>
                    <p className={`text-sm ${K.suave}`}>{s.tipo} · {s.fechasSuspension} fecha(s)</p>
                  </div>
                  <Etiqueta texto={s.cumplida ? 'Cumplida' : s.estado} />
                </header>
                <LineaDeTiempo s={s} />
                <ChipsArticulos s={s} max={4} />
                <div className="text-sm"><span className={`block text-xs font-bold uppercase ${K.suave}`}>Informe de expulsión</span>{s.motivo}</div>
                <div className="rounded-lg bg-[var(--p-fondo)] p-3 text-sm"><span className="font-bold">Descargo del equipo: </span>{s.descargo}</div>
                <div className="flex flex-wrap gap-2">
                  {s.estado === 'En revisión' && (
                    <>
                      <Boton icono={Check} onClick={() => resolver(s.id, true)}>Aceptar descargo</Boton>
                      <Boton variante="peligro" icono={X} onClick={() => resolver(s.id, false)}>Rechazar descargo</Boton>
                    </>
                  )}
                  {resuelta && (
                    <Boton variante="suave" icono={RotateCcw} onClick={() => pedir({ titulo: 'Reabrir la resolución', texto: `La sanción de ${s.jugador} vuelve a "En revisión" para que puedas resolverla de nuevo.`, etiqueta: 'Reabrir', peligro: false }, () => reabrir(s.id))}>Reabrir resolución</Boton>
                  )}
                  {s.estado !== 'Descargo aceptado' && (
                    <Boton variante="suave" icono={CheckCheck} onClick={() => marcarCumplida(s.id, !s.cumplida)}>{s.cumplida ? 'Marcar como no cumplida' : 'Marcar cumplida'}</Boton>
                  )}
                </div>
                <ArchivosSancion mensajes={s.mensajes} />
                <HiloMensajes s={s} quien="organizacion" placeholder="Escribile al delegado. Ej: ¿Tienen video de la jugada?" />
              </article>
            )
          })}
        </div>
        <Paginador {...pag} />
      </Tarjeta>
      {dialogo}
    </div>
  )
}
