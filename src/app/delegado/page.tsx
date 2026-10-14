'use client'

import { Pencil, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { admiteDescargo, TOPE_PLANTEL, useDemo, type JugadorPlantel } from '@/lib/demo-store'
import { categoriaDeEquipo, estadoPlantel, mismo } from '@/components/panel/datos'
import { TablaPosiciones, TarjetaProximoPartido, partidosDe, resultadoPara, useFixture } from '@/components/panel/Compartidos'
import { ArchivosSancion, HiloMensajes } from '@/components/panel/Adjuntos'
import { ChipsArticulos } from '@/components/panel/Sanciones'
import { BarrasH, Kpi, Semaforo } from '@/components/panel/graficos'
import {
  AreaTexto, BarraFiltros, Boton, Buscador, C, Campo, Etiqueta, Filtro, K, Paginador, PanelShell, SubirFoto, Tabla, Tarjeta, normalizar, usePaginas,
} from '@/components/panel/ui'

const POSICIONES = ['Arquero', 'Defensor', 'Mediocampista', 'Delantero']
type FormJ = { id?: string; nombre: string; dni: string; posicion: string; foto?: string; dniFrente?: string; dniDorso?: string }
const VACIO: FormJ = { nombre: '', dni: '', posicion: 'Mediocampista' }
const TABS = ['Inicio', 'Fixture y posiciones', 'Descargos', 'Plantel']

export default function DelegadoPage() {
  const [tab, setTab] = useState('Inicio')
  return (
    <PanelShell rol="delegado" titulo="Panel del delegado" tabs={TABS} tab={tab} setTab={setTab}>
      {tab === 'Inicio' && <Inicio irA={setTab} />}
      {tab === 'Fixture y posiciones' && <FixturePosiciones />}
      {tab === 'Descargos' && <Descargos />}
      {tab === 'Plantel' && <Plantel />}
    </PanelShell>
  )
}

function Inicio({ irA }: { irA: (t: string) => void }) {
  const { sesion, datos } = useDemo()
  const equipo = sesion?.equipo ?? ''
  const plantel = datos.plantel.filter((j) => mismo(j.equipo, equipo))
  const doc = estadoPlantel(plantel)
  const abiertos = datos.sanciones.filter((s) => mismo(s.equipo, equipo) && admiteDescargo(s) && !s.descargo)
  const enRevision = datos.sanciones.filter((s) => mismo(s.equipo, equipo) && s.estado === 'En revisión')
  const porPos = POSICIONES.map((p) => ({ etiqueta: p, valor: plantel.filter((j) => j.posicion === p || (p === 'Arquero' && j.posicion === 'Portero')).length }))
  return (
    <div className="space-y-6">
      <TarjetaProximoPartido equipo={equipo} />
      <div className="grid gap-4 grid-cols-2 xl:grid-cols-4">
        <Kpi titulo="Jugadores en el plantel" valor={`${plantel.length}/${TOPE_PLANTEL}`} detalle={plantel.length >= TOPE_PLANTEL ? 'Plantel completo' : `Quedan ${TOPE_PLANTEL - plantel.length} lugares`} onClick={() => irA('Plantel')} />
        <Kpi titulo="Documentación al día" valor={doc.aprobados} color={C.verde} detalle={`${doc.pendientes} pendientes · ${doc.observados} observados`} onClick={() => irA('Plantel')} />
        <Kpi titulo="Sanciones para descargo" valor={abiertos.length} color={C.oro} detalle="Podés presentar descargo" onClick={() => irA('Descargos')} />
        <Kpi titulo="Descargos en revisión" valor={enRevision.length} color={C.profundo} detalle="Esperando a la organización" onClick={() => irA('Descargos')} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Tarjeta titulo="Estado de la documentación">
          <Semaforo aprobados={doc.aprobados} pendientes={doc.pendientes} observados={doc.observados} />
          <div className="mt-4 h-2 rounded-full bg-[var(--p-fondo)] overflow-hidden" aria-label="Ocupación del plantel">
            <div className="h-full rounded-full" style={{ width: `${Math.min(100, (plantel.length / TOPE_PLANTEL) * 100)}%`, background: C.teal }} />
          </div>
          <p className={`text-xs mt-1.5 ${K.suave}`}>{plantel.length} de {TOPE_PLANTEL} lugares ocupados</p>
        </Tarjeta>
        <Tarjeta titulo="Jugadores por posición"><BarrasH datos={porPos} /></Tarjeta>
        <Tarjeta titulo="Descargos abiertos" className="lg:col-span-2">
          {abiertos.length === 0 && <p className={`text-sm ${K.suave}`}>No tenés sanciones pendientes de descargo.</p>}
          <ul className="divide-y divide-[color:var(--p-borde)]">
            {abiertos.map((s) => (
              <li key={s.id} className="py-3 flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0"><p className="font-bold">{s.jugador}</p><p className={`text-xs ${K.suave}`}>{s.partido} · {s.fecha} · {s.fechasSuspension} fecha(s)</p></div>
                <ChipsArticulos s={s} />
                <Boton variante="oro" onClick={() => irA('Descargos')}>Presentar descargo</Boton>
              </li>
            ))}
          </ul>
        </Tarjeta>
      </div>
    </div>
  )
}

function FixturePosiciones() {
  const { sesion } = useDemo()
  const equipo = sesion?.equipo ?? ''
  const cat = categoriaDeEquipo(equipo)
  const fixture = useFixture(cat)
  const mios = partidosDe(fixture, equipo)
  const pag = usePaginas(mios.filter((x) => x.p.golesLocal === undefined), 6)
  const jugados = mios.filter((x) => x.p.golesLocal !== undefined).reverse()
  const pagJ = usePaginas(jugados, 6)
  const fila = (x: (typeof mios)[number]) => ({ ...x, id: `${x.fecha.numero}-${x.p.local}-${x.p.visitante}` })
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <div className="space-y-6 min-w-0">
        <Tarjeta titulo="Próximos partidos">
          <Tabla
            filas={pag.items.map(fila)}
            clave={(x) => x.id}
            vacio="No hay partidos próximos."
            columnas={[
              { titulo: 'Fecha', celda: (x) => <>Fecha {x.fecha.numero}<span className={`block text-xs ${K.suave}`}>{x.fecha.fechaLabel.toLowerCase()}</span></> },
              { titulo: 'Partido', celda: (x) => <span className="font-semibold">{x.p.local} vs {x.p.visitante}</span> },
              { titulo: 'Hora', celda: (x) => `${x.p.hora}${x.p.cancha ? ` · ${x.p.cancha}` : ''}` },
            ]}
            tarjeta={(x) => (<><p className={`text-xs ${K.suave}`}>Fecha {x.fecha.numero} · {x.fecha.fechaLabel.toLowerCase()}</p><p className="font-semibold">{x.p.local} vs {x.p.visitante}</p><p className="text-sm">{x.p.hora}{x.p.cancha ? ` · ${x.p.cancha}` : ''}</p></>)}
          />
          <Paginador {...pag} />
        </Tarjeta>
        <Tarjeta titulo="Resultados">
          <Tabla
            filas={pagJ.items.map(fila)}
            clave={(x) => x.id}
            vacio="Todavía no hay partidos jugados."
            columnas={[
              { titulo: 'Fecha', celda: (x) => x.fecha.numero },
              { titulo: 'Partido', celda: (x) => <span className="font-semibold">{x.p.local} <span className="font-heading text-base mx-1">{x.p.golesLocal} - {x.p.golesVisitante}</span> {x.p.visitante}</span> },
              { titulo: '', celda: (x) => <Resul r={resultadoPara(x.p, equipo)} /> },
            ]}
            tarjeta={(x) => (
              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="min-w-0"><span className={`block text-xs ${K.suave}`}>Fecha {x.fecha.numero}</span><span className="font-semibold">{x.p.local} {x.p.golesLocal} - {x.p.golesVisitante} {x.p.visitante}</span></span>
                <Resul r={resultadoPara(x.p, equipo)} />
              </div>
            )}
          />
          <Paginador {...pagJ} />
        </Tarjeta>
      </div>
      <Tarjeta titulo={`Posiciones ${cat ?? ''}`} className="self-start">
        {cat ? <TablaPosiciones categoria={cat} resaltar={equipo} /> : <p className={`text-sm ${K.suave}`}>No se encontró la categoría de tu equipo.</p>}
      </Tarjeta>
    </div>
  )
}

function Resul({ r }: { r: 'G' | 'E' | 'P' | null }) {
  if (!r) return null
  const c = { G: ['Ganó', 'bg-[#16a34a]/10 text-[#16a34a]'], E: ['Empató', 'bg-[#f3a21c]/30 text-[#8a5a00]'], P: ['Perdió', 'bg-[#dc2626]/10 text-[#dc2626]'] }[r]
  return <span className={`rounded-full px-3 py-1 text-xs font-bold ${c[1]}`}>{c[0]}</span>
}

function Descargos() {
  const { sesion, datos, enviarDescargo } = useDemo()
  const [estado, setEstado] = useState('')
  const [q, setQ] = useState('')
  const base = datos.sanciones.filter((s) => s.equipo === sesion?.equipo)
  const propias = base.filter((s) => (!estado || s.estado === estado) && (!q || normalizar(`${s.jugador} ${s.partido} ${s.motivo}`).includes(normalizar(q))))
  const pag = usePaginas(propias, 4)
  const [texto, setTexto] = useState<Record<string, string>>({})
  return (
    <Tarjeta titulo={`Sanciones de ${sesion?.equipo}`}>
      <BarraFiltros>
        <Buscador value={q} onChange={setQ} placeholder="Buscar jugador, partido o texto del informe" />
        <Filtro label="Estado" value={estado} onChange={setEstado} opciones={['Firme', 'En revisión', 'Descargo aceptado', 'Descargo rechazado']} />
      </BarraFiltros>
      {propias.length === 0 && <p className={`text-sm ${K.suave}`}>{base.length === 0 ? 'Tu equipo no tiene sanciones.' : 'No hay sanciones con esos filtros.'}</p>}
      <div className="grid gap-4 xl:grid-cols-2">
        {pag.items.map((s) => {
          const abierta = admiteDescargo(s)
          return (
            <article key={s.id} className={`rounded-xl border ${K.borde} p-4 space-y-3 min-w-0`}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-bold">{s.jugador}</p>
                  <p className={`text-xs ${K.suave}`}>{s.partido} · {s.fecha} · {s.tipo} · {s.fechasSuspension} fecha(s)</p>
                </div>
                <Etiqueta texto={s.cumplida && s.estado === 'Firme' ? 'Cumplida' : s.estado} />
              </div>
              <ChipsArticulos s={s} />
              <div className="text-sm"><span className={`block text-xs font-bold uppercase ${K.suave}`}>Informe de expulsión</span>{s.motivo}</div>
              {s.descargo && <div className="rounded-lg bg-[var(--p-fondo)] p-3 text-sm"><span className="font-bold">Descargo enviado: </span>{s.descargo}</div>}
              {abierta ? (
                <div className="space-y-2">
                  <AreaTexto
                    value={texto[s.id] ?? ''}
                    onChange={(e) => setTexto({ ...texto, [s.id]: e.target.value })}
                    rows={3}
                    placeholder={s.descargo ? 'Actualizá el descargo del equipo' : 'Escribí el descargo del equipo. Ej: El contacto fue accidental, el jugador disputaba la pelota.'}
                  />
                  <Boton disabled={!(texto[s.id] ?? '').trim()} onClick={() => { enviarDescargo(s.id, texto[s.id].trim()); setTexto({ ...texto, [s.id]: '' }) }}>
                    {s.descargo ? 'Actualizar descargo' : 'Enviar descargo'}
                  </Boton>
                </div>
              ) : (
                <p className={`text-xs ${K.suave}`}>Esta sanción ya está {s.cumplida && s.estado === 'Firme' ? 'cumplida' : 'resuelta'}: no admite descargo.</p>
              )}
              <ArchivosSancion mensajes={s.mensajes} />
              <HiloMensajes s={s} quien="delegado" placeholder="Mensaje a la organización. Ej: Adjuntamos el video de la jugada" />
            </article>
          )
        })}
      </div>
      <Paginador {...pag} />
    </Tarjeta>
  )
}

function Plantel() {
  const { sesion, datos, guardarJugador, quitarJugador } = useDemo()
  const [form, setForm] = useState<FormJ>(VACIO)
  const [q, setQ] = useState('')
  const [estado, setEstado] = useState('')
  const propios = datos.plantel.filter((j) => j.equipo === sesion?.equipo)
  const lista = useMemo(() => {
    const nq = normalizar(q)
    return propios.filter((j) => (!estado || j.estadoDoc === estado) && (!nq || normalizar(`${j.nombre} ${j.dni} ${j.posicion}`).includes(nq)))
  }, [propios, q, estado])
  const pag = usePaginas(lista, 8)
  const lleno = propios.length >= TOPE_PLANTEL && !form.id
  const valido = form.nombre.trim() && form.dni.trim() && form.foto && form.dniFrente && form.dniDorso && !lleno
  const doc = estadoPlantel(propios)

  function editar(j: JugadorPlantel) {
    setForm({ id: j.id, nombre: j.nombre, dni: j.dni, posicion: j.posicion, foto: j.foto, dniFrente: j.dniFrente, dniDorso: j.dniDorso })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const acciones = (j: JugadorPlantel) => (
    <span className="inline-flex gap-1.5">
      <Boton variante="suave" className="!px-3" onClick={() => editar(j)} aria-label={`Editar a ${j.nombre}`}><Pencil size={15} /></Boton>
      <Boton variante="peligro" className="!px-3" onClick={() => { if (window.confirm(`¿Quitar a ${j.nombre} del plantel?`)) quitarJugador(j.id) }} aria-label={`Quitar a ${j.nombre}`}><Trash2 size={15} /></Boton>
    </span>
  )
  const persona = (j: JugadorPlantel) => (
    <span className="flex items-center gap-3 min-w-0">
      {j.foto
        // eslint-disable-next-line @next/next/no-img-element
        ? <img src={j.foto} alt="" className="h-10 w-10 rounded-full object-cover shrink-0" />
        : <span className="h-10 w-10 rounded-full bg-[var(--p-teal)]/10 text-[color:var(--p-profundo)] flex items-center justify-center font-bold shrink-0">{j.nombre[0]}</span>}
      <span className="min-w-0"><span className="block font-bold truncate">{j.nombre}</span><span className={`block text-xs ${K.suave}`}>{j.posicion} · DNI {j.dni}</span></span>
    </span>
  )

  return (
    <div className="grid gap-6 2xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <div className="space-y-6 self-start min-w-0">
        <Tarjeta titulo={form.id ? 'Editar jugador' : 'Agregar jugador'}>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              if (!valido || !sesion?.equipo) return
              guardarJugador({ ...form, equipo: sesion.equipo, nombre: form.nombre.trim(), dni: form.dni.trim() })
              setForm(VACIO)
            }}
          >
            <Campo label="Nombre y apellido" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Ej: Juan Pérez" />
            <Campo label="DNI" inputMode="numeric" value={form.dni} onChange={(e) => setForm({ ...form, dni: e.target.value })} placeholder="Ej: 32.456.789" />
            <div>
              <span className={K.etiqueta}>Posición</span>
              <div className="flex flex-wrap gap-2">
                {POSICIONES.map((p) => (
                  <button key={p} type="button" onClick={() => setForm({ ...form, posicion: p })}
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${form.posicion === p ? 'bg-[var(--p-navy)] text-white' : 'bg-[var(--p-fondo)] text-[color:var(--p-suave)]'}`}>{p}</button>
                ))}
              </div>
            </div>
            <SubirFoto label="Foto del jugador" valor={form.foto} onChange={(v) => setForm({ ...form, foto: v })} ayuda="Foto carnet o de frente (JPG o PNG)" />
            <div className="grid grid-cols-2 gap-3">
              <SubirFoto label="DNI frente" valor={form.dniFrente} onChange={(v) => setForm({ ...form, dniFrente: v })} ayuda="Foto del frente del DNI" />
              <SubirFoto label="DNI dorso" valor={form.dniDorso} onChange={(v) => setForm({ ...form, dniDorso: v })} ayuda="Foto del dorso del DNI" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Boton type="submit" disabled={!valido}>{form.id ? 'Guardar cambios' : 'Agregar al plantel'}</Boton>
              {form.id && <Boton type="button" variante="suave" onClick={() => setForm(VACIO)}>Cancelar</Boton>}
            </div>
            {lleno && <p className="text-xs text-[#dc2626]">El plantel está completo ({TOPE_PLANTEL} jugadores). Quitá a alguien para sumar otro.</p>}
            {!valido && !lleno && <p className={`text-xs ${K.suave}`}>Completá nombre, DNI y las tres fotos.{form.id ? ' Si solo cambiás nombre o posición, la documentación no vuelve a revisión.' : ''}</p>}
          </form>
        </Tarjeta>
        <Tarjeta titulo={`Plantel ${propios.length}/${TOPE_PLANTEL}`}>
          <div className="h-2 rounded-full bg-[var(--p-fondo)] overflow-hidden mb-4"><div className="h-full rounded-full" style={{ width: `${Math.min(100, (propios.length / TOPE_PLANTEL) * 100)}%`, background: C.teal }} /></div>
          <Semaforo aprobados={doc.aprobados} pendientes={doc.pendientes} observados={doc.observados} />
        </Tarjeta>
      </div>
      <Tarjeta titulo={`Jugadores de ${sesion?.equipo} (${lista.length})`} className="self-start">
        <BarraFiltros>
          <Buscador value={q} onChange={setQ} placeholder="Buscar por nombre, DNI o posición" />
          <Filtro label="Documentación" value={estado} onChange={setEstado} opciones={['Aprobado', 'Pendiente', 'Observado']} />
        </BarraFiltros>
        <Tabla
          filas={pag.items}
          clave={(j) => j.id}
          vacio="No hay jugadores con esos filtros."
          columnas={[
            { titulo: 'Jugador', celda: persona },
            { titulo: 'Documentación', celda: (j) => <Etiqueta texto={j.estadoDoc} /> },
            { titulo: '', className: 'text-right', celda: acciones },
          ]}
          tarjeta={(j) => (
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">{persona(j)}<Etiqueta texto={j.estadoDoc} /></div>
              <div className="text-right">{acciones(j)}</div>
            </div>
          )}
        />
        <Paginador {...pag} />
      </Tarjeta>
    </div>
  )
}
