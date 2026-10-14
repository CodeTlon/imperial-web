'use client'

import { Check, Pencil, Plus, Trash2, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useDemo, type GolDePartido, type Resultado } from '@/lib/demo-store'
import { fixturePorCategoria, type Categoria } from '@/lib/torneo-data'
import { CATEGORIAS, equiposDe, jugadoresDe } from '@/components/panel/datos'
import { BarraFiltros, Boton, Buscador, Campo, Combo, Filtro, K, MensajeError, Paginador, Selector, Tabla, Tarjeta, normalizar, usePaginas, Encabezado, useConfirmar } from '@/components/panel/ui'

type Fila = { jugador: string; goles: string }
type Form = { categoria: string; fecha: string; local: string; visitante: string; golesLocal: string; golesVisitante: string; filasL: Fila[]; filasV: Fila[] }
const vacio = (categoria = '+30'): Form => ({ categoria, fecha: '', local: '', visitante: '', golesLocal: '', golesVisitante: '', filasL: [], filasV: [] })
const entero = (v: string) => /^\d+$/.test(v.trim())
const MAX_GOLES = 30

export default function Resultados() {
  const { pedir, dialogo } = useConfirmar()
  const { datos, cargarResultado, editarResultado, quitarResultado } = useDemo()
  const [f, setF] = useState<Form>(vacio())
  const [editando, setEditando] = useState<string | null>(null)
  const [intento, setIntento] = useState(false)
  const [aviso, setAviso] = useState('')
  const [q, setQ] = useState('')
  const [catF, setCatF] = useState('')
  const [fechaF, setFechaF] = useState('')

  const equipos = useMemo(() => equiposDe(f.categoria), [f.categoria])
  const fechasCat = fixturePorCategoria[f.categoria as Categoria] ?? []
  const partidosFecha = useMemo(() => {
    const fx = fechasCat.find((x) => String(x.numero) === f.fecha)
    return fx ? fx.partidos.map((p) => `${p.local} vs ${p.visitante}`) : []
  }, [fechasCat, f.fecha])
  // Nombre exacto del equipo si lo escrito coincide (sin importar mayúsculas ni tildes).
  const equipoValido = (t: string) => equipos.find((e) => normalizar(e) === normalizar(t))

  // ── Validación: devuelve un mensaje por campo con problema ──
  const errores = useMemo(() => {
    const e: Record<string, string> = {}
    const maxFecha = fechasCat.length || 40
    if (!f.fecha.trim()) e.fecha = 'Ingresá el número de fecha.'
    else if (!entero(f.fecha) || Number(f.fecha) < 1) e.fecha = 'La fecha tiene que ser un número entero desde 1.'
    else if (Number(f.fecha) > maxFecha) e.fecha = `${f.categoria} tiene ${maxFecha} fechas: la máxima es la ${maxFecha}.`
    const local = equipoValido(f.local), visit = equipoValido(f.visitante)
    if (!f.local.trim()) e.local = 'Elegí el equipo local.'
    else if (!local) e.local = `Ese equipo no está en ${f.categoria}. Elegilo de la lista.`
    if (!f.visitante.trim()) e.visitante = 'Elegí el equipo visitante.'
    else if (!visit) e.visitante = `Ese equipo no está en ${f.categoria}. Elegilo de la lista.`
    else if (local && local === visit) e.visitante = 'El visitante tiene que ser distinto del local.'
    for (const [k, v] of [['golesLocal', f.golesLocal], ['golesVisitante', f.golesVisitante]] as const) {
      if (v.trim() === '') e[k] = 'Cargá los goles (0 si no hizo).'
      else if (!entero(v)) e[k] = 'Solo números enteros, sin signos.'
      else if (Number(v) > MAX_GOLES) e[k] = `Máximo ${MAX_GOLES} goles.`
    }
    // Un equipo no puede tener dos resultados en la misma fecha.
    if (!e.fecha && local && visit) {
      const rep = datos.resultados.find((r) => r.id !== editando && r.categoria === f.categoria && r.fecha === Number(f.fecha) && [r.local, r.visitante].some((t) => t === local || t === visit))
      if (rep) e.fecha = `Ya hay un resultado de la fecha ${rep.fecha} con ${rep.local} vs ${rep.visitante}. Editalo o borralo primero.`
    }
    // Goleadores: tienen que sumar los goles de cada equipo.
    const goleadoresDe = (filas: Fila[], goles: string, clave: 'filasL' | 'filasV') => {
      if (e[clave === 'filasL' ? 'golesLocal' : 'golesVisitante'] || !entero(goles)) return
      const total = Number(goles)
      if (total === 0) return
      if (filas.length === 0) { e[clave] = `Indicá quién hizo los ${total} gol(es).`; return }
      const vistos = new Set<string>()
      let suma = 0
      filas.forEach((fi, i) => {
        if (!fi.jugador.trim()) e[`${clave}.${i}.jugador`] = 'Elegí o escribí el jugador.'
        else if (fi.jugador.trim().length < 3) e[`${clave}.${i}.jugador`] = 'El nombre es muy corto.'
        else if (vistos.has(normalizar(fi.jugador))) e[`${clave}.${i}.jugador`] = 'Este jugador ya está en la lista: sumá sus goles en una sola fila.'
        vistos.add(normalizar(fi.jugador))
        if (!entero(fi.goles) || Number(fi.goles) < 1) e[`${clave}.${i}.goles`] = 'Mínimo 1.'
        else suma += Number(fi.goles)
      })
      if (!Object.keys(e).some((k) => k.startsWith(`${clave}.`)) && suma !== total) e[clave] = `Los goles de los jugadores suman ${suma} y el equipo hizo ${total}. Tienen que coincidir.`
    }
    goleadoresDe(f.filasL, f.golesLocal, 'filasL')
    goleadoresDe(f.filasV, f.golesVisitante, 'filasV')
    return e
  }, [f, fechasCat, datos.resultados, editando, equipos])
  const err = (k: string) => (intento ? errores[k] : undefined)

  const jugadoresLocal = useMemo(() => (equipoValido(f.local) ? jugadoresDe(equipoValido(f.local)!, datos.plantel, datos.sanciones, datos.goleadores) : []), [f.local, datos, equipos])
  const jugadoresVisit = useMemo(() => (equipoValido(f.visitante) ? jugadoresDe(equipoValido(f.visitante)!, datos.plantel, datos.sanciones, datos.goleadores) : []), [f.visitante, datos, equipos])

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

  const sumaFilas = (filas: Fila[]) => filas.reduce((a, x) => a + (entero(x.goles) ? Number(x.goles) : 0), 0)

  function guardar(e: React.FormEvent) {
    e.preventDefault()
    setIntento(true)
    setAviso('')
    if (Object.keys(errores).length) {
      // Lleva el foco al primer campo con problema.
      requestAnimationFrame(() => document.querySelector<HTMLElement>('form [aria-invalid="true"]')?.focus())
      return
    }
    const local = equipoValido(f.local)!, visitante = equipoValido(f.visitante)!
    const goleadores: GolDePartido[] = [
      ...f.filasL.map((x) => ({ equipo: local, jugador: x.jugador.trim(), goles: Number(x.goles) })),
      ...f.filasV.map((x) => ({ equipo: visitante, jugador: x.jugador.trim(), goles: Number(x.goles) })),
    ].filter((g) => g.goles > 0)
    const r = { categoria: f.categoria, fecha: Number(f.fecha), local, visitante, golesLocal: Number(f.golesLocal), golesVisitante: Number(f.golesVisitante), goleadores }
    if (editando) editarResultado(editando, r)
    else cargarResultado(r)
    setAviso(`${editando ? 'Resultado actualizado' : 'Resultado cargado'}: ${local} ${r.golesLocal} - ${r.golesVisitante} ${visitante}. ${goleadores.length ? 'Los goles ya suman en la tabla de goleadores.' : ''}`)
    setEditando(null)
    setIntento(false)
    setF(vacio(f.categoria))
  }
  function editar(r: Resultado) {
    setEditando(r.id)
    setIntento(false)
    setAviso('')
    const filas = (t: string) => (r.goleadores ?? []).filter((g) => g.equipo === t).map((g) => ({ jugador: g.jugador, goles: String(g.goles) }))
    setF({ categoria: r.categoria, fecha: String(r.fecha), local: r.local, visitante: r.visitante, golesLocal: String(r.golesLocal), golesVisitante: String(r.golesVisitante), filasL: filas(r.local), filasV: filas(r.visitante) })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const acciones = (r: Resultado) => (
    <span className="inline-flex gap-1.5">
      <Boton variante="suave" icono={Pencil} onClick={() => editar(r)} aria-label="Editar resultado">Editar</Boton>
      <Boton variante="peligro" icono={Trash2} onClick={() => pedir({ titulo: '¿Borrar este resultado?', texto: 'No se puede deshacer.', etiqueta: 'Borrar' }, () => quitarResultado(r.id))} aria-label="Borrar resultado">Borrar</Boton>
    </span>
  )

  return (
    <div className="space-y-6">
      <Encabezado titulo="Resultados" descripcion="Cargá los resultados de cada fecha. Se reflejan en las posiciones y el fixture del sitio." />
    <div className="grid gap-6 2xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <Tarjeta titulo={editando ? 'Editar resultado' : 'Cargar resultado'} className="self-start">
        <form className="space-y-4" onSubmit={guardar} noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <Selector label="Categoría" value={f.categoria} onChange={(e) => { setF({ ...vacio(e.target.value) }); setIntento(false) }} opciones={CATEGORIAS.map((c) => ({ valor: c, texto: c }))} />
            <Campo label="Número de fecha" type="number" min={1} max={fechasCat.length || undefined} inputMode="numeric" value={f.fecha} onChange={(e) => setF({ ...f, fecha: e.target.value })} error={err('fecha')} placeholder={`Ej: ${Math.max(1, fechasCat.findIndex((x) => x.partidos.some((p) => p.golesLocal === undefined)) + 1)}`} />
          </div>
          {partidosFecha.length > 0 && (
            <Selector
              label="Partido del fixture"
              value=""
              onChange={(e) => {
                const [local, visitante] = e.target.value.split(' vs ')
                if (local && visitante) setF({ ...f, local, visitante, filasL: [], filasV: [] })
              }}
              opciones={[{ valor: '', texto: 'Elegí un partido de esta fecha (completa los equipos)' }, ...partidosFecha.map((p) => ({ valor: p, texto: p }))]}
            />
          )}
          <div className="grid gap-4 sm:grid-cols-[1fr_5.5rem]">
            <Combo label="Equipo local" value={f.local} onChange={(local) => setF({ ...f, local, filasL: [] })} opciones={equipos} placeholder="Ej: Ankara +30" error={err('local')} />
            <Campo label="Goles" type="number" min={0} max={MAX_GOLES} inputMode="numeric" value={f.golesLocal} onChange={(e) => setF({ ...f, golesLocal: e.target.value })} error={err('golesLocal')} placeholder="0" />
          </div>
          <div className="grid gap-4 sm:grid-cols-[1fr_5.5rem]">
            <Combo label="Equipo visitante" value={f.visitante} onChange={(visitante) => setF({ ...f, visitante, filasV: [] })} opciones={equipos} placeholder="Ej: Alianza +30" error={err('visitante')} />
            <Campo label="Goles" type="number" min={0} max={MAX_GOLES} inputMode="numeric" value={f.golesVisitante} onChange={(e) => setF({ ...f, golesVisitante: e.target.value })} error={err('golesVisitante')} placeholder="0" />
          </div>

          {/* Quién hizo los goles de cada equipo: tienen que sumar el resultado */}
          {([['filasL', f.local, f.golesLocal, jugadoresLocal], ['filasV', f.visitante, f.golesVisitante, jugadoresVisit]] as const).map(([clave, equipo, goles, jugadores]) => {
            const total = entero(goles) ? Number(goles) : 0
            if (total < 1 || !equipoValido(equipo)) return null
            const filas = f[clave]
            const asignados = sumaFilas(filas)
            return (
              <fieldset key={clave} className={`space-y-3 rounded-xl border p-3.5 ${intento && errores[clave] ? 'border-[#dc2626]' : K.borde}`}>
                <legend className="px-1 text-sm font-bold text-[color:var(--p-navy)]">Goleadores de {equipoValido(equipo)}</legend>
                <p className={`text-xs ${asignados === total ? 'font-bold text-[color:var(--p-verde)]' : K.suave}`} aria-live="polite">
                  {asignados === total ? <span className="inline-flex items-center gap-1"><Check size={13} aria-hidden />Los {total} gol(es) están asignados</span> : `Asignaste ${asignados} de ${total} gol(es)`}
                </p>
                {filas.map((fi, i) => (
                  <div key={i} className="grid grid-cols-[minmax(0,1fr)_4.5rem_auto] items-start gap-2">
                    <Combo label={i === 0 ? 'Jugador' : `Jugador ${i + 1}`} value={fi.jugador} opciones={jugadores} placeholder="Ej: Juan Pérez" error={err(`${clave}.${i}.jugador`)}
                      onChange={(v) => setF({ ...f, [clave]: filas.map((x, n) => (n === i ? { ...x, jugador: v } : x)) })} />
                    <Campo label="Goles" type="number" min={1} inputMode="numeric" value={fi.goles} placeholder="1" error={err(`${clave}.${i}.goles`)}
                      onChange={(e) => setF({ ...f, [clave]: filas.map((x, n) => (n === i ? { ...x, goles: e.target.value } : x)) })} />
                    <button type="button" aria-label={`Quitar goleador ${i + 1}`} onClick={() => setF({ ...f, [clave]: filas.filter((_, n) => n !== i) })} className="mt-6 flex h-11 w-11 items-center justify-center rounded-xl text-[color:var(--p-suave)] hover:bg-[#dc2626]/10 hover:text-[#dc2626]"><X size={18} aria-hidden /></button>
                  </div>
                ))}
                <Boton variante="suave" icono={Plus} onClick={() => setF({ ...f, [clave]: [...filas, { jugador: '', goles: filas.length === 0 ? String(total) : '1' }] })}>Agregar goleador</Boton>
                <MensajeError>{err(clave)}</MensajeError>
              </fieldset>
            )
          })}

          <div className="flex flex-wrap gap-2">
            <Boton type="submit">{editando ? 'Guardar cambios' : 'Cargar resultado'}</Boton>
            {editando && <Boton variante="suave" onClick={() => { setEditando(null); setIntento(false); setF(vacio(f.categoria)) }}>Cancelar</Boton>}
          </div>
          {intento && Object.keys(errores).length > 0 && <MensajeError>Revisá los {Object.keys(errores).length} campo(s) marcados en rojo para poder guardar.</MensajeError>}
          {aviso && <p role="status" className="flex items-start gap-1.5 rounded-xl bg-[#16a34a]/10 px-3 py-2.5 text-sm font-semibold text-[#15803d]"><Check size={16} className="mt-0.5 shrink-0" aria-hidden />{aviso}</p>}
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
      {dialogo}
    </div>
  )
}
