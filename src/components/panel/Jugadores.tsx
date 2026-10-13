'use client'

import { Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { TOPE_PLANTEL, useDemo, type JugadorPlantel } from '@/lib/demo-store'
import { estadoPlantel } from '@/components/panel/datos'
import { Semaforo } from '@/components/panel/graficos'
import { BarraFiltros, Boton, Buscador, Etiqueta, Filtro, K, Paginador, Tabla, Tarjeta, normalizar, usePaginas } from '@/components/panel/ui'

// Revisión de documentación de los planteles que cargan los delegados.
export default function Jugadores() {
  const { datos, revisarDoc, quitarJugador } = useDemo()
  const [q, setQ] = useState('')
  const [estado, setEstado] = useState('')
  const [equipoF, setEquipoF] = useState('')
  const [ver, setVer] = useState<JugadorPlantel | null>(null)

  const equipos = useMemo(() => Array.from(new Set(datos.plantel.map((j) => j.equipo))).sort((a, b) => a.localeCompare(b, 'es')), [datos.plantel])
  const lista = useMemo(() => {
    const nq = normalizar(q)
    return datos.plantel.filter((j) => {
      if (estado && j.estadoDoc !== estado) return false
      if (equipoF && j.equipo !== equipoF) return false
      return !nq || normalizar(`${j.nombre} ${j.dni} ${j.equipo} ${j.posicion}`).includes(nq)
    })
  }, [datos.plantel, q, estado, equipoF])
  const pag = usePaginas(lista, 8)

  const acciones = (j: JugadorPlantel) => (
    <span className="inline-flex flex-wrap gap-1.5">
      <Boton variante="suave" onClick={() => setVer(j)}>Ver documentos</Boton>
      <Boton variante="suave" disabled={j.estadoDoc === 'Aprobado'} onClick={() => revisarDoc(j.id, 'Aprobado')}>Aprobar</Boton>
      <Boton variante="peligro" disabled={j.estadoDoc === 'Observado'} onClick={() => revisarDoc(j.id, 'Observado')}>Observar</Boton>
      <Boton variante="peligro" className="!px-3" aria-label={`Borrar a ${j.nombre}`} onClick={() => { if (window.confirm(`¿Borrar a ${j.nombre} del plantel?`)) quitarJugador(j.id) }}><Trash2 size={15} /></Boton>
    </span>
  )

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <Tarjeta titulo={`Jugadores y documentación (${lista.length})`}>
        <BarraFiltros>
          <Buscador value={q} onChange={setQ} placeholder="Buscar por nombre, DNI o equipo" />
          <Filtro label="Estado" value={estado} onChange={setEstado} opciones={['Pendiente', 'Aprobado', 'Observado']} />
          <Filtro label="Equipo" value={equipoF} onChange={setEquipoF} opciones={equipos} />
        </BarraFiltros>
        <Tabla
          filas={pag.items}
          clave={(j) => j.id}
          vacio="No hay jugadores con esos filtros."
          columnas={[
            { titulo: 'Jugador', celda: (j) => <Persona j={j} /> },
            { titulo: 'Equipo', celda: (j) => j.equipo },
            { titulo: 'DNI', celda: (j) => j.dni },
            { titulo: 'Documentación', celda: (j) => <Etiqueta texto={j.estadoDoc} /> },
            { titulo: '', className: 'text-right', celda: acciones },
          ]}
          tarjeta={(j) => (
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2"><Persona j={j} /><Etiqueta texto={j.estadoDoc} /></div>
              <p className={`text-xs ${K.suave}`}>{j.equipo} · DNI {j.dni}</p>
              {acciones(j)}
            </div>
          )}
        />
        <Paginador {...pag} />
      </Tarjeta>
      <div className="space-y-6 self-start">
        <Tarjeta titulo="Estado general">
          <Semaforo {...estadoPlantel(datos.plantel)} />
          <p className={`text-xs mt-3 ${K.suave}`}>Tope por equipo: {TOPE_PLANTEL} jugadores.</p>
        </Tarjeta>
        {ver && (
          <Tarjeta titulo={`Documentos de ${ver.nombre}`} derecha={<Boton variante="suave" onClick={() => setVer(null)}>Cerrar</Boton>}>
            <div className="grid grid-cols-3 gap-2">
              {([['Foto', ver.foto], ['DNI frente', ver.dniFrente], ['DNI dorso', ver.dniDorso]] as const).map(([t, src]) => (
                <figure key={t} className="text-center">
                  {src
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={src} alt={t} className="h-24 w-full rounded-lg object-cover" />
                    : <div className={`h-24 rounded-lg bg-[var(--p-fondo)] flex items-center justify-center text-xs ${K.suave}`}>Sin cargar</div>}
                  <figcaption className={`text-xs mt-1 ${K.suave}`}>{t}</figcaption>
                </figure>
              ))}
            </div>
          </Tarjeta>
        )}
      </div>
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
      <span className="min-w-0"><span className="block font-bold truncate">{j.nombre}</span><span className={`block text-xs ${K.suave}`}>{j.posicion}</span></span>
    </span>
  )
}
