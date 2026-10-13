'use client'

import { Pencil, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { articulosDe, useDemo, type Sancion } from '@/lib/demo-store'
import { ARTICULOS, fechasSugeridas, tipoDeArticulo } from '@/lib/sugerir-articulos'
import { ArticulosSelector } from '@/components/panel/ArticulosSelector'
import { CATEGORIAS, categoriaDeEquipo, equiposDe, hoyCorto, jugadoresDe, partidosDeEquipo } from '@/components/panel/datos'
import {
  AreaTexto, BarraFiltros, Boton, Buscador, Campo, Chip, Combo, Etiqueta, Filtro, K, Paginador, Selector, Tabla, Tarjeta, usePaginas,
} from '@/components/panel/ui'
import { normalizar } from '@/components/panel/ui'

const TIPOS = Array.from(new Set(ARTICULOS.map((a) => a.tipo)))
const ESTADOS: Sancion['estado'][] = ['Firme', 'En revisión', 'Descargo aceptado', 'Descargo rechazado']

type Form = { categoria: string; equipo: string; jugador: string; partido: string; fecha: string; tipo: string; motivo: string; articulos: string[]; fechasSuspension: string }
const vacio = (categoria = '+30'): Form => ({ categoria, equipo: '', jugador: '', partido: '', fecha: hoyCorto(), tipo: 'Roja directa', motivo: '', articulos: [], fechasSuspension: '' })

export function ChipsArticulos({ s }: { s: Pick<Sancion, 'articulos' | 'articulo' | 'motivo'> }) {
  return (
    <span className="inline-flex flex-wrap gap-1.5">
      {articulosDe(s).map((a) => <Chip key={a} tono="oro">{a}</Chip>)}
    </span>
  )
}

export default function Sanciones() {
  const { datos, crearSancion, editarSancion, quitarSancion } = useDemo()
  const [f, setF] = useState<Form>(vacio())
  const [editando, setEditando] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const [estado, setEstado] = useState('')
  const [equipoF, setEquipoF] = useState('')
  const [catF, setCatF] = useState('')

  const equipos = useMemo(() => equiposDe(f.categoria), [f.categoria])
  const jugadores = useMemo(() => jugadoresDe(f.equipo, datos.plantel, datos.sanciones, datos.goleadores), [f.equipo, datos])
  const partidos = useMemo(() => partidosDeEquipo(f.equipo, f.categoria).map((p) => p.etiqueta), [f.equipo, f.categoria])
  const sug = fechasSugeridas(f.articulos)
  const fechasNum = Number(f.fechasSuspension)
  const valido = f.equipo.trim() && f.jugador.trim() && f.motivo.trim() && f.articulos.length > 0 && fechasNum >= 1

  const lista = useMemo(() => {
    const nq = normalizar(q)
    return datos.sanciones.filter((s) => {
      if (estado && s.estado !== estado) return false
      if (equipoF && s.equipo !== equipoF) return false
      if (catF && categoriaDeEquipo(s.equipo) !== catF) return false
      if (!nq) return true
      return normalizar(`${s.jugador} ${s.equipo} ${s.partido} ${s.motivo} ${articulosDe(s).join(' ')}`).includes(nq)
    })
  }, [datos.sanciones, q, estado, equipoF, catF])
  const pag = usePaginas(lista, 8)
  const equiposConSancion = Array.from(new Set(datos.sanciones.map((s) => s.equipo))).sort((a, b) => a.localeCompare(b, 'es'))

  function cambiarArticulos(articulos: string[]) {
    setF((p) => {
      const sig = { ...p, articulos }
      const t = articulos.length ? tipoDeArticulo(articulos[0]) : undefined
      if (t) sig.tipo = t
      const s = fechasSugeridas(articulos)
      if (s.fijas && !p.fechasSuspension) sig.fechasSuspension = String(s.fijas)
      return sig
    })
  }

  function editar(s: Sancion) {
    setEditando(s.id)
    setF({
      categoria: categoriaDeEquipo(s.equipo) ?? '+30', equipo: s.equipo, jugador: s.jugador, partido: s.partido, fecha: s.fecha,
      tipo: s.tipo, motivo: s.motivo, articulos: articulosDe(s), fechasSuspension: String(s.fechasSuspension),
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function guardar(e: React.FormEvent) {
    e.preventDefault()
    if (!valido) return
    const base = {
      jugador: f.jugador.trim(), equipo: f.equipo.trim(), partido: f.partido.trim() || 'Partido sin indicar', fecha: f.fecha.trim() || hoyCorto(),
      tipo: f.tipo, articulo: f.articulos.join(', '), articulos: f.articulos, fechasSuspension: fechasNum, motivo: f.motivo.trim(),
    }
    if (editando) editarSancion(editando, base)
    else crearSancion(base)
    setEditando(null)
    setF(vacio(f.categoria))
  }

  return (
    <div className="grid gap-6 2xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <Tarjeta titulo={editando ? 'Editar sanción' : 'Cargar sanción'} className="self-start">
        <form className="space-y-4" onSubmit={guardar}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Selector label="Categoría" value={f.categoria} onChange={(e) => setF({ ...f, categoria: e.target.value, equipo: '', jugador: '', partido: '' })} opciones={CATEGORIAS.map((c) => ({ valor: c, texto: c }))} />
            <Combo label="Equipo" value={f.equipo} onChange={(equipo) => setF({ ...f, equipo, jugador: '', partido: '' })} opciones={equipos} placeholder="Ej: Ankara +30" />
          </div>
          <Combo label="Jugador" value={f.jugador} onChange={(jugador) => setF({ ...f, jugador })} opciones={jugadores} placeholder="Ej: Juan Pérez" ayuda={f.equipo ? undefined : 'Elegí primero el equipo para ver sus jugadores.'} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Combo label="Partido" value={f.partido} onChange={(partido) => setF({ ...f, partido })} opciones={partidos} placeholder="Ej: vs. Los Ñoquis +30" />
            <Campo label="Fecha del partido" value={f.fecha} onChange={(e) => setF({ ...f, fecha: e.target.value })} placeholder="Ej: 10/10" />
          </div>
          <AreaTexto
            label="Informe de expulsión"
            rows={5}
            value={f.motivo}
            onChange={(e) => setF({ ...f, motivo: e.target.value })}
            placeholder="Describí lo ocurrido según el informe del árbitro. Ej: A los 35' del segundo tiempo el jugador golpeó a un rival sin la pelota y fue expulsado."
          />
          <ArticulosSelector informe={f.motivo} value={f.articulos} onChange={cambiarArticulos} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Selector label="Tipo de sanción" value={f.tipo} onChange={(e) => setF({ ...f, tipo: e.target.value })} opciones={TIPOS.map((t) => ({ valor: t, texto: t }))} />
            <Campo label="Fechas de suspensión" type="number" min={1} max={30} inputMode="numeric" value={f.fechasSuspension} onChange={(e) => setF({ ...f, fechasSuspension: e.target.value })} placeholder={sug.fijas ? `Sugerido: ${sug.fijas}` : 'Ej: 3'} />
          </div>
          {(sug.fijas || sug.rango) && (
            <p className={`text-xs ${K.suave}`}>{sug.fijas ? `El reglamento fija ${sug.fijas} fecha de suspensión para este artículo (podés editarla).` : sug.rango}</p>
          )}
          <div className="flex flex-wrap gap-2">
            <Boton type="submit" disabled={!valido}>{editando ? 'Guardar cambios' : 'Cargar sanción'}</Boton>
            {editando && <Boton variante="suave" onClick={() => { setEditando(null); setF(vacio(f.categoria)) }}>Cancelar</Boton>}
          </div>
          {!valido && <p className={`text-xs ${K.suave}`}>Completá equipo, jugador, informe, al menos un artículo y las fechas.</p>}
        </form>
      </Tarjeta>

      <Tarjeta titulo={`Sanciones (${lista.length})`} className="self-start">
        <BarraFiltros>
          <Buscador value={q} onChange={setQ} placeholder="Buscar jugador, equipo o artículo" />
          <Filtro label="Estado" value={estado} onChange={setEstado} opciones={ESTADOS} />
          <Filtro label="Categoría" value={catF} onChange={setCatF} opciones={[...CATEGORIAS]} />
          <Filtro label="Equipo" value={equipoF} onChange={setEquipoF} opciones={equiposConSancion} />
        </BarraFiltros>
        <Tabla
          filas={pag.items}
          clave={(s) => s.id}
          vacio="No hay sanciones con esos filtros."
          columnas={[
            { titulo: 'Jugador', celda: (s) => <><p className="font-bold">{s.jugador}</p><p className={`text-xs ${K.suave}`}>{s.equipo}</p></> },
            { titulo: 'Partido', celda: (s) => <><p>{s.partido}</p><p className={`text-xs ${K.suave}`}>{s.fecha}</p></> },
            { titulo: 'Artículos', celda: (s) => <ChipsArticulos s={s} /> },
            { titulo: 'Fechas', celda: (s) => <span className="font-heading text-lg">{s.fechasSuspension}</span> },
            { titulo: 'Estado', celda: (s) => <Etiqueta texto={s.estado} /> },
            { titulo: '', className: 'text-right whitespace-nowrap', celda: (s) => <Acciones s={s} onEditar={() => editar(s)} onQuitar={() => quitarSancion(s.id)} /> },
          ]}
          tarjeta={(s) => (
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0"><p className="font-bold">{s.jugador}</p><p className={`text-xs ${K.suave}`}>{s.equipo} · {s.partido} · {s.fecha}</p></div>
                <Etiqueta texto={s.estado} />
              </div>
              <ChipsArticulos s={s} />
              <p className="text-sm">{s.motivo}</p>
              <div className="flex items-center justify-between gap-2">
                <span className={`text-xs ${K.suave}`}>{s.fechasSuspension} fecha(s)</span>
                <Acciones s={s} onEditar={() => editar(s)} onQuitar={() => quitarSancion(s.id)} />
              </div>
            </div>
          )}
        />
        <Paginador {...pag} />
      </Tarjeta>
    </div>
  )
}

function Acciones({ s, onEditar, onQuitar }: { s: Sancion; onEditar: () => void; onQuitar: () => void }) {
  return (
    <span className="inline-flex gap-1.5">
      <Boton variante="suave" className="!px-3" onClick={onEditar} aria-label={`Editar sanción de ${s.jugador}`}><Pencil size={15} /></Boton>
      <Boton variante="peligro" className="!px-3" onClick={() => { if (window.confirm(`¿Borrar la sanción de ${s.jugador}?`)) onQuitar() }} aria-label={`Borrar sanción de ${s.jugador}`}><Trash2 size={15} /></Boton>
    </span>
  )
}
