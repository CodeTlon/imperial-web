'use client'

import { Pencil, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useDemo, type Gol } from '@/lib/demo-store'
import { CATEGORIAS, equiposDe, goleadoresCategoria, jugadoresDe } from '@/components/panel/datos'
import { BarraFiltros, Boton, Buscador, Campo, Combo, Filtro, K, Paginador, MensajeError, Selector, Tabla, Tarjeta, normalizar, usePaginas, Encabezado, useConfirmar } from '@/components/panel/ui'
import { BarrasH } from '@/components/panel/graficos'

type Form = { categoria: string; equipo: string; jugador: string; goles: string }
const vacio = (categoria = '+30'): Form => ({ categoria, equipo: '', jugador: '', goles: '' })

export default function Goleadores() {
  const { pedir, dialogo } = useConfirmar()
  const { datos, cargarGoles, editarGol, quitarGol } = useDemo()
  const [f, setF] = useState<Form>(vacio())
  const [editando, setEditando] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const [catF, setCatF] = useState('')
  const [intento, setIntento] = useState(false)

  const equipos = useMemo(() => equiposDe(f.categoria), [f.categoria])
  const jugadores = useMemo(() => jugadoresDe(f.equipo, datos.plantel, datos.sanciones, datos.goleadores), [f.equipo, datos])
  const errores = useMemo(() => {
    const e: Record<string, string> = {}
    const equipo = equipos.find((x) => normalizar(x) === normalizar(f.equipo))
    if (!f.equipo.trim()) e.equipo = 'Elegí el equipo del jugador.'
    else if (!equipo) e.equipo = `Ese equipo no está en ${f.categoria}. Elegilo de la lista.`
    if (!f.jugador.trim()) e.jugador = 'Elegí o escribí el jugador.'
    else if (f.jugador.trim().length < 3) e.jugador = 'El nombre del jugador es muy corto.'
    else if (equipo && jugadores.length > 0 && !jugadores.some((j) => normalizar(j) === normalizar(f.jugador))) e.jugador = `No figura en el plantel de ${equipo}. Elegilo de la lista.`
    if (!f.goles.trim()) e.goles = 'Indicá cuántos goles sumar.'
    else if (!/^\d+$/.test(f.goles.trim()) || Number(f.goles) < 1) e.goles = 'Tiene que ser un número entero desde 1.'
    else if (Number(f.goles) > 30) e.goles = 'El máximo por carga es 30 goles.'
    return e
  }, [f, equipos, jugadores])
  const err = (k: string) => (intento ? errores[k] : undefined)
  const ranking = useMemo(() => goleadoresCategoria(f.categoria, datos.goleadores).slice(0, 8), [f.categoria, datos.goleadores])

  const lista = useMemo(() => {
    const nq = normalizar(q)
    return datos.goleadores.filter((g) => (!catF || g.categoria === catF) && (!nq || normalizar(`${g.jugador} ${g.equipo}`).includes(nq)))
  }, [datos.goleadores, q, catF])
  const pag = usePaginas(lista, 8)

  function guardar(e: React.FormEvent) {
    e.preventDefault()
    setIntento(true)
    if (Object.keys(errores).length) {
      requestAnimationFrame(() => document.querySelector<HTMLElement>('form [aria-invalid="true"]')?.focus())
      return
    }
    const g = { categoria: f.categoria, jugador: f.jugador.trim(), equipo: f.equipo.trim(), goles: Number(f.goles) }
    if (editando) editarGol(editando, g)
    else cargarGoles(g)
    setEditando(null)
    setIntento(false)
    setF({ ...vacio(f.categoria), equipo: f.equipo })
  }
  function editar(g: Gol) {
    setEditando(g.id)
    setIntento(false)
    setF({ categoria: g.categoria, equipo: g.equipo, jugador: g.jugador, goles: String(g.goles) })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const acciones = (g: Gol) => (
    <span className="inline-flex gap-1.5">
      <Boton variante="suave" icono={Pencil} onClick={() => editar(g)} aria-label={`Editar goles de ${g.jugador}`}>Editar</Boton>
      <Boton variante="peligro" icono={Trash2} onClick={() => pedir({ titulo: `¿Borrar los goles de ${g.jugador}?`, texto: 'No se puede deshacer.', etiqueta: 'Borrar' }, () => quitarGol(g.id))} aria-label={`Borrar goles de ${g.jugador}`}>Borrar</Boton>
    </span>
  )

  return (
    <div className="space-y-6">
      <Encabezado titulo="Goleadores" descripcion="Sumá los goles por jugador. Alimentan la tabla de goleadores del sitio." />
    <div className="grid gap-6 2xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <div className="space-y-6 self-start min-w-0">
        <Tarjeta titulo={editando ? 'Editar goles' : 'Cargar goles'}>
          <form className="space-y-4" onSubmit={guardar} noValidate>
            <Selector label="Categoría" value={f.categoria} onChange={(e) => setF({ ...vacio(e.target.value) })} opciones={CATEGORIAS.map((c) => ({ valor: c, texto: c }))} />
            <Combo label="Equipo" value={f.equipo} onChange={(equipo) => setF({ ...f, equipo, jugador: '' })} opciones={equipos} placeholder="Ej: Ankara +30" error={err('equipo')} />
            <Combo label="Jugador" value={f.jugador} onChange={(jugador) => setF({ ...f, jugador })} opciones={jugadores} placeholder="Ej: Juan Pérez" ayuda={f.equipo ? undefined : 'Elegí primero el equipo para ver sus jugadores.'} error={err('jugador')} />
            <Campo label="Goles a sumar" type="number" min={1} inputMode="numeric" value={f.goles} onChange={(e) => setF({ ...f, goles: e.target.value })} placeholder="Ej: 2" error={err('goles')} />
            <div className="flex flex-wrap gap-2">
              <Boton type="submit">{editando ? 'Guardar cambios' : 'Sumar goles'}</Boton>
              {editando && <Boton variante="suave" onClick={() => { setEditando(null); setIntento(false); setF(vacio(f.categoria)) }}>Cancelar</Boton>}
            </div>
            {intento && Object.keys(errores).length > 0 && <MensajeError>Revisá los campos marcados en rojo para poder guardar.</MensajeError>}
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
      {dialogo}
    </div>
  )
}
