'use client'

import { Pencil, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useDemo, type Resultado } from '@/lib/demo-store'
import { fixturePorCategoria, type Categoria } from '@/lib/torneo-data'
import { CATEGORIAS, equiposDe } from '@/components/panel/datos'
import { BarraFiltros, Boton, Buscador, Campo, Combo, Filtro, K, Paginador, Selector, Tabla, Tarjeta, normalizar, usePaginas } from '@/components/panel/ui'

type Form = { categoria: string; fecha: string; local: string; visitante: string; golesLocal: string; golesVisitante: string }
const vacio = (categoria = '+30'): Form => ({ categoria, fecha: '', local: '', visitante: '', golesLocal: '', golesVisitante: '' })

export default function Resultados() {
  const { datos, cargarResultado, editarResultado, quitarResultado } = useDemo()
  const [f, setF] = useState<Form>(vacio())
  const [editando, setEditando] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const [catF, setCatF] = useState('')
  const [fechaF, setFechaF] = useState('')

  const equipos = useMemo(() => equiposDe(f.categoria), [f.categoria])
  const fechasCat = fixturePorCategoria[f.categoria as Categoria] ?? []
  const partidosFecha = useMemo(() => {
    const fx = fechasCat.find((x) => String(x.numero) === f.fecha)
    return fx ? fx.partidos.map((p) => `${p.local} vs ${p.visitante}`) : []
  }, [fechasCat, f.fecha])

  const valido = f.fecha && Number(f.fecha) >= 1 && f.local.trim() && f.visitante.trim() && f.local.trim() !== f.visitante.trim() && f.golesLocal !== '' && f.golesVisitante !== ''

  const lista = useMemo(() => {
    const nq = normalizar(q)
    return datos.resultados.filter((r) => {
      if (catF && r.categoria !== catF) return false
      if (fechaF && String(r.fecha) !== fechaF) return false
      return !nq || normalizar(`${r.local} ${r.visitante}`).includes(nq)
    })
  }, [datos.resultados, q, catF, fechaF])
  const pag = usePaginas(lista, 8)
  const fechasCargadas = Array.from(new Set(datos.resultados.map((r) => r.fecha))).sort((a, b) => a - b).map(String)

  function guardar(e: React.FormEvent) {
    e.preventDefault()
    if (!valido) return
    const r = { categoria: f.categoria, fecha: Number(f.fecha), local: f.local.trim(), visitante: f.visitante.trim(), golesLocal: Number(f.golesLocal), golesVisitante: Number(f.golesVisitante) }
    if (editando) editarResultado(editando, r)
    else cargarResultado(r)
    setEditando(null)
    setF(vacio(f.categoria))
  }
  function editar(r: Resultado) {
    setEditando(r.id)
    setF({ categoria: r.categoria, fecha: String(r.fecha), local: r.local, visitante: r.visitante, golesLocal: String(r.golesLocal), golesVisitante: String(r.golesVisitante) })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const acciones = (r: Resultado) => (
    <span className="inline-flex gap-1.5">
      <Boton variante="suave" className="!px-3" onClick={() => editar(r)} aria-label="Editar resultado"><Pencil size={15} /></Boton>
      <Boton variante="peligro" className="!px-3" onClick={() => { if (window.confirm('¿Borrar este resultado?')) quitarResultado(r.id) }} aria-label="Borrar resultado"><Trash2 size={15} /></Boton>
    </span>
  )

  return (
    <div className="grid gap-6 2xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <Tarjeta titulo={editando ? 'Editar resultado' : 'Cargar resultado'} className="self-start">
        <form className="space-y-4" onSubmit={guardar}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Selector label="Categoría" value={f.categoria} onChange={(e) => setF({ ...vacio(e.target.value) })} opciones={CATEGORIAS.map((c) => ({ valor: c, texto: c }))} />
            <Campo label="Número de fecha" type="number" min={1} max={fechasCat.length || undefined} inputMode="numeric" value={f.fecha} onChange={(e) => setF({ ...f, fecha: e.target.value })} placeholder={`Ej: ${Math.max(1, fechasCat.findIndex((x) => x.partidos.some((p) => p.golesLocal === undefined)) + 1)}`} />
          </div>
          {partidosFecha.length > 0 && (
            <Selector
              label="Partido del fixture"
              value=""
              onChange={(e) => {
                const [local, visitante] = e.target.value.split(' vs ')
                if (local && visitante) setF({ ...f, local, visitante })
              }}
              opciones={[{ valor: '', texto: 'Elegí un partido de esta fecha (completa los equipos)' }, ...partidosFecha.map((p) => ({ valor: p, texto: p }))]}
            />
          )}
          <div className="grid gap-4 sm:grid-cols-[1fr_5.5rem]">
            <Combo label="Equipo local" value={f.local} onChange={(local) => setF({ ...f, local })} opciones={equipos} placeholder="Ej: Ankara +30" />
            <Campo label="Goles" type="number" min={0} inputMode="numeric" value={f.golesLocal} onChange={(e) => setF({ ...f, golesLocal: e.target.value })} placeholder="0" />
          </div>
          <div className="grid gap-4 sm:grid-cols-[1fr_5.5rem]">
            <Combo label="Equipo visitante" value={f.visitante} onChange={(visitante) => setF({ ...f, visitante })} opciones={equipos} placeholder="Ej: Alianza +30" />
            <Campo label="Goles" type="number" min={0} inputMode="numeric" value={f.golesVisitante} onChange={(e) => setF({ ...f, golesVisitante: e.target.value })} placeholder="0" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Boton type="submit" disabled={!valido}>{editando ? 'Guardar cambios' : 'Cargar resultado'}</Boton>
            {editando && <Boton variante="suave" onClick={() => { setEditando(null); setF(vacio(f.categoria)) }}>Cancelar</Boton>}
          </div>
          {!valido && <p className={`text-xs ${K.suave}`}>Completá la fecha, los dos equipos (distintos) y los goles.</p>}
        </form>
      </Tarjeta>
      <Tarjeta titulo={`Resultados cargados (${lista.length})`} className="self-start">
        <BarraFiltros>
          <Buscador value={q} onChange={setQ} placeholder="Buscar por equipo" />
          <Filtro label="Categoría" value={catF} onChange={setCatF} opciones={[...CATEGORIAS]} />
          <Filtro label="Fecha" value={fechaF} onChange={setFechaF} opciones={fechasCargadas} />
        </BarraFiltros>
        <Tabla
          filas={pag.items}
          clave={(r) => r.id}
          vacio="Todavía no cargaste resultados."
          columnas={[
            { titulo: 'Categoría', celda: (r) => r.categoria },
            { titulo: 'Fecha', celda: (r) => r.fecha },
            { titulo: 'Partido', celda: (r) => <span className="font-semibold">{r.local} <span className="font-heading text-base mx-1">{r.golesLocal} - {r.golesVisitante}</span> {r.visitante}</span> },
            { titulo: '', className: 'text-right', celda: acciones },
          ]}
          tarjeta={(r) => (
            <div className="space-y-2">
              <p className={`text-xs ${K.suave}`}>{r.categoria} · Fecha {r.fecha}</p>
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-sm">
                <span className="text-right font-semibold">{r.local}</span>
                <span className="font-heading text-lg whitespace-nowrap">{r.golesLocal} - {r.golesVisitante}</span>
                <span className="font-semibold">{r.visitante}</span>
              </div>
              <div className="text-right">{acciones(r)}</div>
            </div>
          )}
        />
        <Paginador {...pag} />
      </Tarjeta>
    </div>
  )
}
