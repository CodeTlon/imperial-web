'use client'

import { ArrowLeft, Check, Eye, FileX2, Search as BuscarIcono, Shield, Trash2, TriangleAlert, Users } from 'lucide-react'
import { useMemo, useState } from 'react'
import { TOPE_PLANTEL, useDemo, type JugadorPlantel } from '@/lib/demo-store'
import { CATEGORIAS, categoriaDeEquipo, equiposDe } from '@/components/panel/datos'
import { Escudo } from '@/components/match/MatchCard'
import { Icono } from '@/components/panel/icono'
import { BarraFiltros, Boton, Buscador, Encabezado, Etiqueta, Filtro, K, Lateral, Paginador, Tabla, Tarjeta, Vacio, normalizar, useConfirmar, usePaginas } from '@/components/panel/ui'

type Resumen = { nombre: string; categoria: string; jugadores: JugadorPlantel[]; aprobados: number; pendientes: number; observados: number }

function Conteo({ n, etiqueta, color }: { n: number; etiqueta: string; color: string }) {
  return <span className="inline-flex items-center gap-1.5 text-sm"><span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} aria-hidden /><b>{n}</b><span className={K.suave}>{etiqueta}</span></span>
}

// Revisión de documentación: primero los equipos; al entrar a uno, sus jugadores y las acciones de revisión.
export default function Equipos() {
  const { datos, revisarDoc, quitarJugador } = useDemo()
  const { pedir, dialogo } = useConfirmar()
  const [q, setQ] = useState('')
  const [catF, setCatF] = useState('')
  const [elegido, setElegido] = useState<string | null>(null)
  const [estado, setEstado] = useState('')
  const [qJ, setQJ] = useState('')
  const [ver, setVer] = useState<JugadorPlantel | null>(null)

  const equipos: Resumen[] = useMemo(() => {
    const nombres = new Set<string>(CATEGORIAS.flatMap((c) => equiposDe(c)))
    datos.plantel.forEach((j) => nombres.add(j.equipo))
    return Array.from(nombres).map((nombre) => {
      const js = datos.plantel.filter((j) => j.equipo === nombre)
      return {
        nombre, categoria: categoriaDeEquipo(nombre) ?? '', jugadores: js,
        aprobados: js.filter((j) => j.estadoDoc === 'Aprobado').length,
        pendientes: js.filter((j) => j.estadoDoc === 'Pendiente').length,
        observados: js.filter((j) => j.estadoDoc === 'Observado').length,
      }
    }).sort((a, b) => (b.jugadores.length > 0 ? 1 : 0) - (a.jugadores.length > 0 ? 1 : 0) || a.nombre.localeCompare(b.nombre, 'es'))
  }, [datos.plantel])

  const listaEq = useMemo(() => {
    const nq = normalizar(q)
    return equipos.filter((e) => (!catF || e.categoria === catF) && (!nq || normalizar(e.nombre).includes(nq)))
  }, [equipos, q, catF])
  const pagEq = usePaginas(listaEq, 12)

  const actual = elegido ? equipos.find((e) => e.nombre === elegido) : undefined
  const jugadoresFiltrados = useMemo(() => {
    const nq = normalizar(qJ)
    return (actual?.jugadores ?? []).filter((j) => (!estado || j.estadoDoc === estado) && (!nq || normalizar(`${j.nombre} ${j.dni} ${j.posicion}`).includes(nq)))
  }, [actual, qJ, estado])
  const pagJ = usePaginas(jugadoresFiltrados, 10)

  const acciones = (j: JugadorPlantel) => (
    <span className="inline-flex flex-nowrap gap-1.5">
      <Boton variante="suave" icono={Eye} onClick={() => setVer(j)} aria-label={`Ver documentos de ${j.nombre}`} title="Ver documentos" className="!px-3 2xl:!px-4"><span className="hidden 2xl:inline">Ver documentos</span></Boton>
      <Boton variante="suave" icono={Check} disabled={j.estadoDoc === 'Aprobado'} onClick={() => revisarDoc(j.id, 'Aprobado')} aria-label={`Aprobar a ${j.nombre}`} title="Aprobar" className="!px-3 2xl:!px-4"><span className="hidden 2xl:inline">Aprobar</span></Boton>
      <Boton variante="peligro" icono={TriangleAlert} disabled={j.estadoDoc === 'Observado'} onClick={() => revisarDoc(j.id, 'Observado')} aria-label={`Observar a ${j.nombre}`} title="Observar" className="!px-3 2xl:!px-4"><span className="hidden 2xl:inline">Observar</span></Boton>
      <Boton variante="peligro" icono={Trash2} onClick={() => pedir({ titulo: `Borrar a ${j.nombre}`, texto: `Se quita del plantel de ${j.equipo}. No se puede deshacer.`, etiqueta: 'Borrar jugador' }, () => quitarJugador(j.id))} aria-label={`Borrar a ${j.nombre}`} title="Borrar" className="!px-3 2xl:!px-4"><span className="hidden 2xl:inline">Borrar</span></Boton>
    </span>
  )


  if (actual) {
    return (
      <div className="space-y-6">
        <Encabezado
          titulo={actual.nombre}
          descripcion={`${actual.categoria ? `Categoría ${actual.categoria} · ` : ''}${actual.jugadores.length} de ${TOPE_PLANTEL} jugadores. Revisá la documentación de cada uno.`}
          accion={<Boton variante="suave" icono={ArrowLeft} onClick={() => { setElegido(null); setQJ(''); setEstado('') }}>Volver a equipos</Boton>}
        />
        <Tarjeta titulo={`Jugadores (${jugadoresFiltrados.length})`}>
          <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-1">
            <Conteo n={actual.aprobados} etiqueta="aprobados" color="#16a34a" />
            <Conteo n={actual.pendientes} etiqueta="pendientes" color="#f3a21c" />
            <Conteo n={actual.observados} etiqueta="observados" color="#dc2626" />
          </div>
          <BarraFiltros>
            <Buscador value={qJ} onChange={setQJ} placeholder="Buscar por nombre, DNI o posición" />
            <Filtro label="Documentación" value={estado} onChange={setEstado} opciones={['Pendiente', 'Aprobado', 'Observado']} />
          </BarraFiltros>
          {actual.jugadores.length === 0 ? (
            <Vacio icono={Users}>Este equipo todavía no cargó jugadores. El delegado los agrega desde su panel.</Vacio>
          ) : (
            <Tabla
              filas={pagJ.items}
              clave={(j) => j.id}
              vacio="No hay jugadores con esos filtros."
              columnas={[
                { titulo: 'Jugador', celda: (j) => <Persona j={j} /> },
                { titulo: 'DNI', celda: (j) => j.dni },
                { titulo: 'Documentación', celda: (j) => <Etiqueta texto={j.estadoDoc} /> },
                { titulo: 'Acciones', className: 'text-right whitespace-nowrap', celda: acciones },
              ]}
              tarjeta={(j) => (
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2"><Persona j={j} /><Etiqueta texto={j.estadoDoc} /></div>
                  <p className={`text-sm ${K.suave}`}>DNI {j.dni}</p>
                  <div className="flex justify-end">{acciones(j)}</div>
                </div>
              )}
            />
          )}
          <Paginador {...pagJ} />
        </Tarjeta>
        <Lateral abierto={!!ver} titulo={ver ? `Documentos de ${ver.nombre}` : ''} onCerrar={() => setVer(null)}>
          {ver && (
            <div className="space-y-5">
              <div className="flex items-center gap-3"><Persona j={ver} /><Etiqueta texto={ver.estadoDoc} /></div>
              <div className="grid gap-4 sm:grid-cols-3">
                {([['Foto', ver.foto], ['DNI frente', ver.dniFrente], ['DNI dorso', ver.dniDorso]] as const).map(([t, src]) => (
                  <figure key={t}>
                    {src
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={src} alt={t} className="h-40 w-full rounded-lg object-cover" />
                      : <div className={`h-40 rounded-lg bg-[var(--p-fondo)] flex flex-col items-center justify-center gap-1 text-sm ${K.suave}`}><Icono i={FileX2} t="md" />Sin cargar</div>}
                    <figcaption className={`text-sm mt-1 ${K.suave}`}>{t}</figcaption>
                  </figure>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <Boton icono={Check} disabled={ver.estadoDoc === 'Aprobado'} onClick={() => { revisarDoc(ver.id, 'Aprobado'); setVer({ ...ver, estadoDoc: 'Aprobado' }) }}>Aprobar</Boton>
                <Boton variante="peligro" icono={TriangleAlert} disabled={ver.estadoDoc === 'Observado'} onClick={() => { revisarDoc(ver.id, 'Observado'); setVer({ ...ver, estadoDoc: 'Observado' }) }}>Observar</Boton>
              </div>
            </div>
          )}
        </Lateral>
        {dialogo}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Encabezado
        titulo="Equipos"
        descripcion="Entrá a un equipo para revisar la documentación de sus jugadores."
      />
      <Tarjeta titulo={`Equipos (${listaEq.length})`}>
        <BarraFiltros>
          <Buscador value={q} onChange={setQ} placeholder="Buscar equipo" />
          <Filtro label="Categoría" value={catF} onChange={setCatF} opciones={[...CATEGORIAS]} />
        </BarraFiltros>
        {listaEq.length === 0 && <Vacio icono={BuscarIcono}>No hay equipos con esos filtros.</Vacio>}
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {pagEq.items.map((e) => (
            <li key={e.nombre}>
              <button type="button" onClick={() => setElegido(e.nombre)} className={`w-full text-left rounded-xl border ${K.borde} p-4 space-y-3 hover:border-[color:var(--p-teal)] hover:shadow-sm transition`} aria-label={`Abrir ${e.nombre}`}>
                <span className="flex items-center gap-3 min-w-0">
                  <Escudo nombre={e.nombre} size={44} />
                  <span className="min-w-0">
                    <span className="block font-bold truncate">{e.nombre}</span>
                    <span className={`block text-sm ${K.suave}`}>{e.categoria ? `Categoría ${e.categoria}` : 'Sin categoría'}</span>
                  </span>
                  <Icono i={Shield} className="ml-auto text-[color:var(--p-borde)]" />
                </span>
                <span className="block">
                  <span className="flex justify-between text-sm"><span className={K.suave}>Plantel</span><b>{e.jugadores.length}/{TOPE_PLANTEL}</b></span>
                  <span className="mt-1 block h-2 rounded-full bg-[var(--p-fondo)] overflow-hidden"><span className="block h-full rounded-full bg-[var(--p-teal)]" style={{ width: `${Math.min(100, (e.jugadores.length / TOPE_PLANTEL) * 100)}%` }} /></span>
                </span>
                {e.jugadores.length === 0 ? <span className={`block text-sm ${K.suave}`}>Sin jugadores cargados</span> : (
                  <span className="flex flex-wrap gap-x-4 gap-y-1">
                    <Conteo n={e.aprobados} etiqueta="ok" color="#16a34a" />
                    <Conteo n={e.pendientes} etiqueta="pend." color="#f3a21c" />
                    <Conteo n={e.observados} etiqueta="obs." color="#dc2626" />
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
        <Paginador {...pagEq} />
      </Tarjeta>
    </div>
  )
}

export function Persona({ j }: { j: JugadorPlantel }) {
  return (
    <span className="flex items-center gap-3 min-w-0">
      {j.foto
        // eslint-disable-next-line @next/next/no-img-element
        ? <img src={j.foto} alt="" className="h-10 w-10 rounded-full object-cover shrink-0" />
        : <span className="h-10 w-10 rounded-full bg-[var(--p-teal)]/10 text-[color:var(--p-profundo)] flex items-center justify-center font-bold shrink-0">{j.nombre[0]}</span>}
      <span className="min-w-0"><span className="block font-bold truncate">{j.nombre}</span><span className={`block text-sm ${K.suave}`}>{j.posicion}</span></span>
    </span>
  )
}
