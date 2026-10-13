'use client'

import { Pencil, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useDemo, type Gol } from '@/lib/demo-store'
import { CATEGORIAS, equiposDe, goleadoresCategoria, jugadoresDe } from '@/components/panel/datos'
import { BarraFiltros, Boton, Buscador, Campo, Combo, Filtro, K, Paginador, Selector, Tabla, Tarjeta, normalizar, usePaginas } from '@/components/panel/ui'
import { BarrasH } from '@/components/panel/graficos'

type Form = { categoria: string; equipo: string; jugador: string; goles: string }
const vacio = (categoria = '+30'): Form => ({ categoria, equipo: '', jugador: '', goles: '' })

export default function Goleadores() {
  const { datos, cargarGoles, editarGol, quitarGol } = useDemo()
  const [f, setF] = useState<Form>(vacio())
  const [editando, setEditando] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const [catF, setCatF] = useState('')

  const equipos = useMemo(() => equiposDe(f.categoria), [f.categoria])
  const jugadores = useMemo(() => jugadoresDe(f.equipo, datos.plantel, datos.sanciones, datos.goleadores), [f.equipo, datos])
  const valido = f.equipo.trim() && f.jugador.trim() && Number(f.goles) >= 1
  const ranking = useMemo(() => goleadoresCategoria(f.categoria, datos.goleadores).slice(0, 8), [f.categoria, datos.goleadores])

  const lista = useMemo(() => {
    const nq = normalizar(q)
    return datos.goleadores.filter((g) => (!catF || g.categoria === catF) && (!nq || normalizar(`${g.jugador} ${g.equipo}`).includes(nq)))
  }, [datos.goleadores, q, catF])
  const pag = usePaginas(lista, 8)

  function guardar(e: React.FormEvent) {
    e.preventDefault()
    if (!valido) return
    const g = { categoria: f.categoria, jugador: f.jugador.trim(), equipo: f.equipo.trim(), goles: Number(f.goles) }
    if (editando) editarGol(editando, g)
    else cargarGoles(g)
    setEditando(null)
    setF({ ...vacio(f.categoria), equipo: f.equipo })
  }
  function editar(g: Gol) {
    setEditando(g.id)
    setF({ categoria: g.categoria, equipo: g.equipo, jugador: g.jugador, goles: String(g.goles) })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const acciones = (g: Gol) => (
    <span className="inline-flex gap-1.5">
      <Boton variante="suave" className="!px-3" onClick={() => editar(g)} aria-label={`Editar goles de ${g.jugador}`}><Pencil size={15} /></Boton>
      <Boton variante="peligro" className="!px-3" onClick={() => { if (window.confirm(`¿Borrar los goles de ${g.jugador}?`)) quitarGol(g.id) }} aria-label={`Borrar goles de ${g.jugador}`}><Trash2 size={15} /></Boton>
    </span>
  )

  return (
    <div className="grid gap-6 2xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <div className="space-y-6 self-start min-w-0">
        <Tarjeta titulo={editando ? 'Editar goles' : 'Cargar goles'}>
          <form className="space-y-4" onSubmit={guardar}>
            <Selector label="Categoría" value={f.categoria} onChange={(e) => setF({ ...vacio(e.target.value) })} opciones={CATEGORIAS.map((c) => ({ valor: c, texto: c }))} />
            <Combo label="Equipo" value={f.equipo} onChange={(equipo) => setF({ ...f, equipo, jugador: '' })} opciones={equipos} placeholder="Ej: Ankara +30" />
            <Combo label="Jugador" value={f.jugador} onChange={(jugador) => setF({ ...f, jugador })} opciones={jugadores} placeholder="Ej: Juan Pérez" ayuda={f.equipo ? undefined : 'Elegí primero el equipo para ver sus jugadores.'} />
            <Campo label="Goles a sumar" type="number" min={1} inputMode="numeric" value={f.goles} onChange={(e) => setF({ ...f, goles: e.target.value })} placeholder="Ej: 2" />
            <div className="flex flex-wrap gap-2">
              <Boton type="submit" disabled={!valido}>{editando ? 'Guardar cambios' : 'Sumar goles'}</Boton>
              {editando && <Boton variante="suave" onClick={() => { setEditando(null); setF(vacio(f.categoria)) }}>Cancelar</Boton>}
            </div>
          </form>
        </Tarjeta>
        <Tarjeta titulo={`Tabla de goleadores ${f.categoria}`}>
          <BarrasH datos={ranking.map((g) => ({ etiqueta: `${g.jugador} (${g.equipo})`, valor: g.goles }))} color="#f3a21c" />
        </Tarjeta>
      </div>
      <Tarjeta titulo={`Goles cargados (${lista.length})`} className="self-start">
        <BarraFiltros>
          <Buscador value={q} onChange={setQ} placeholder="Buscar por jugador o equipo" />
          <Filtro label="Categoría" value={catF} onChange={setCatF} opciones={[...CATEGORIAS]} />
        </BarraFiltros>
        <Tabla
          filas={pag.items}
          clave={(g) => g.id}
          vacio="Todavía no cargaste goles."
          columnas={[
            { titulo: 'Jugador', celda: (g) => <span className="font-bold">{g.jugador}</span> },
            { titulo: 'Equipo', celda: (g) => g.equipo },
            { titulo: 'Categoría', celda: (g) => g.categoria },
            { titulo: 'Goles', celda: (g) => <span className="font-heading text-lg">{g.goles}</span> },
            { titulo: '', className: 'text-right', celda: acciones },
          ]}
          tarjeta={(g) => (
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0"><p className="font-bold truncate">{g.jugador}</p><p className={`text-xs ${K.suave}`}>{g.equipo} · {g.categoria}</p></div>
              <span className="font-heading text-xl">{g.goles}</span>
              {acciones(g)}
            </div>
          )}
        />
        <Paginador {...pag} />
      </Tarjeta>
    </div>
  )
}
