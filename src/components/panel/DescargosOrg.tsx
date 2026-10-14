'use client'

import { Check, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useDemo, type Sancion } from '@/lib/demo-store'
import { CATEGORIAS, categoriaDeEquipo } from '@/components/panel/datos'
import { ArchivosSancion, HiloMensajes } from '@/components/panel/Adjuntos'
import { ChipsArticulos } from '@/components/panel/Sanciones'
import { BarraFiltros, Boton, Buscador, Etiqueta, Filtro, K, Paginador, Tarjeta, normalizar, usePaginas } from '@/components/panel/ui'

const ESTADOS: Sancion['estado'][] = ['En revisión', 'Descargo aceptado', 'Descargo rechazado', 'Firme']

export default function DescargosOrg() {
  const { datos, resolver } = useDemo()
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

  return (
    <Tarjeta titulo={`Descargos recibidos (${lista.length})`}>
      <BarraFiltros>
        <Buscador value={q} onChange={setQ} placeholder="Buscar por jugador, equipo o texto del descargo" />
        <Filtro label="Estado" value={estado} onChange={setEstado} opciones={ESTADOS} />
        <Filtro label="Categoría" value={catF} onChange={setCatF} opciones={[...CATEGORIAS]} />
        <Filtro label="Equipo" value={equipoF} onChange={setEquipoF} opciones={equipos} />
      </BarraFiltros>
      {lista.length === 0 && <p className={`text-sm ${K.suave}`}>No hay descargos con esos filtros.</p>}
      <div className="grid gap-4 xl:grid-cols-2">
        {pag.items.map((s) => (
          <article key={s.id} className={`rounded-xl border ${K.borde} p-4 space-y-3 min-w-0`}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-bold">{s.jugador} · {s.equipo}</p>
                <p className={`text-xs ${K.suave}`}>{s.partido} · {s.fecha} · {s.tipo} · {s.fechasSuspension} fecha(s)</p>
              </div>
              <Etiqueta texto={s.estado} />
            </div>
            <ChipsArticulos s={s} />
            <div className="text-sm"><span className={`block text-xs font-bold uppercase ${K.suave}`}>Informe de expulsión</span>{s.motivo}</div>
            <div className="rounded-lg bg-[var(--p-fondo)] p-3 text-sm"><span className="font-bold">Descargo del equipo: </span>{s.descargo}</div>
            {s.estado === 'En revisión' && (
              <div className="flex flex-wrap gap-2">
                <Boton onClick={() => resolver(s.id, true)}><Check size={15} className="inline mr-1" />Aceptar descargo</Boton>
                <Boton variante="peligro" onClick={() => resolver(s.id, false)}><X size={15} className="inline mr-1" />Rechazar descargo</Boton>
              </div>
            )}
            <ArchivosSancion mensajes={s.mensajes} />
            <HiloMensajes s={s} quien="organizacion" placeholder="Escribile al delegado. Ej: ¿Tienen video de la jugada?" />
          </article>
        ))}
      </div>
      <Paginador {...pag} />
    </Tarjeta>
  )
}
