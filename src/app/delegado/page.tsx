'use client'

import { Pencil, Trash2 } from 'lucide-react'
import { fechasTxt } from '@/lib/utils'
import { useMemo, useState } from 'react'
import { admiteDescargo, TOPE_PLANTEL, useDemo, type JugadorPlantel } from '@/lib/demo-store'
import { categoriaDeEquipo, estadoPlantel, mismo } from '@/components/panel/datos'
import { ListaResultados, ResultadoChip, TablaPosiciones, TarjetaProximoPartido, partidosDe, resultadoPara, useFixture } from '@/components/panel/Compartidos'
import { Equipo } from '@/components/ui/Escudo'
import DescargosDelegado from '@/components/panel/DescargosDelegado'
import { ChipsArticulos } from '@/components/panel/Sanciones'
import { BarrasH, Kpi, Semaforo } from '@/components/panel/graficos'
import {
  BarraFiltros, Boton, Buscador, C, Campo, Etiqueta, Filtro, K, MensajeError, Paginador, PanelShell, SubirFoto, Tabla, Tarjeta, normalizar, usePaginas, usePestanaUrl,
} from '@/components/panel/ui'

const POSICIONES = ['Arquero', 'Defensor', 'Mediocampista', 'Delantero']
type FormJ = { id?: string; nombre: string; dni: string; posicion: string; foto?: string; dniFrente?: string; dniDorso?: string }
const VACIO: FormJ = { nombre: '', dni: '', posicion: 'Mediocampista' }
const TABS = ['Inicio', 'Fixture y posiciones', 'Descargos', 'Plantel']

export default function DelegadoPage() {
  const [tab, setTab] = usePestanaUrl(TABS, 'Inicio')
  return (
    <PanelShell rol="delegado" titulo="Panel del delegado" tabs={TABS} tab={tab} setTab={setTab}>
      {tab === 'Inicio' && <Inicio irA={setTab} />}
      {tab === 'Fixture y posiciones' && <FixturePosiciones />}
      {tab === 'Descargos' && <DescargosDelegado />}
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
        <Tarjeta titulo="Descargos abiertos">
          {abiertos.length === 0 && <p className={`text-sm ${K.suave}`}>No tenés sanciones pendientes de descargo.</p>}
          <ul className="divide-y divide-[color:var(--p-borde)]">
            {abiertos.map((s) => (
              <li key={s.id} className="py-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                <div className="min-w-0"><p className="font-bold">{s.jugador}</p><p className={`text-xs ${K.suave}`}>{s.partido} · {s.fecha} · {fechasTxt(s.fechasSuspension)}</p></div>
                <ChipsArticulos s={s} />
                <Boton variante="oro" onClick={() => irA('Descargos')}>Presentar descargo</Boton>
              </li>
            ))}
          </ul>
          {enRevision.length > 0 && (
            <>
              <h3 className={`mt-5 mb-1 text-xs font-bold uppercase tracking-wide ${K.suave}`}>En revisión por la organización</h3>
              <ul className="divide-y divide-[color:var(--p-borde)]">
                {enRevision.map((s) => (
                  <li key={s.id} className="flex items-center justify-between gap-3 py-2.5">
                    <div className="min-w-0"><p className="truncate text-sm font-bold">{s.jugador}</p><p className={`text-xs ${K.suave}`}>{s.partido} · {s.fecha} · {fechasTxt(s.fechasSuspension)}</p></div>
                    <Etiqueta texto="En revisión" />
                  </li>
                ))}
              </ul>
            </>
          )}
        </Tarjeta>
        <Tarjeta titulo="Últimos resultados"><ListaResultados equipo={equipo} /></Tarjeta>
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
  const cruce = (local: string, visitante: string, centro: React.ReactNode) => (
    <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-semibold">
      <Equipo equipo={local} size={22} negrita={mismo(local, equipo)} />
      {centro}
      <Equipo equipo={visitante} size={22} negrita={mismo(visitante, equipo)} />
    </span>
  )
  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-2 items-start">
        <Tarjeta titulo="Próximos partidos">
          <Tabla
            filas={pag.items.map(fila)}
            clave={(x) => x.id}
            vacio="No hay partidos próximos."
            columnas={[
              { titulo: 'Fecha', celda: (x) => <span className="whitespace-nowrap">Fecha {x.fecha.numero}<span className={`block text-xs ${K.suave}`}>{x.fecha.fechaLabel.toLowerCase()}</span></span> },
              { titulo: 'Partido', celda: (x) => cruce(x.p.local, x.p.visitante, <span className={`text-xs ${K.suave}`}>vs</span>) },
              { titulo: 'Hora', celda: (x) => <span className="whitespace-nowrap">{x.p.hora}<span className={`block text-xs ${K.suave}`}>{x.p.cancha}</span></span> },
            ]}
            tarjeta={(x) => (
              <div className="space-y-1.5">
                <p className={`text-xs ${K.suave}`}>Fecha {x.fecha.numero} · {x.fecha.fechaLabel.toLowerCase()} · {x.p.hora}{x.p.cancha ? ` · ${x.p.cancha}` : ''}</p>
                {cruce(x.p.local, x.p.visitante, <span className={`text-xs ${K.suave}`}>vs</span>)}
              </div>
            )}
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
              { titulo: 'Partido', celda: (x) => cruce(x.p.local, x.p.visitante, <span className="font-heading text-lg">{x.p.golesLocal} - {x.p.golesVisitante}</span>) },
              { titulo: '', className: 'text-right', celda: (x) => <ResultadoChip r={resultadoPara(x.p, equipo)} /> },
            ]}
            tarjeta={(x) => (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2"><span className={`text-xs ${K.suave}`}>Fecha {x.fecha.numero}</span><ResultadoChip r={resultadoPara(x.p, equipo)} /></div>
                {cruce(x.p.local, x.p.visitante, <span className="font-heading text-lg">{x.p.golesLocal} - {x.p.golesVisitante}</span>)}
              </div>
            )}
          />
          <Paginador {...pagJ} />
        </Tarjeta>
      </div>
      <Tarjeta titulo={`Posiciones ${cat ?? ''}`}>
        {cat ? <TablaPosiciones categoria={cat} resaltar={equipo} /> : <p className={`text-sm ${K.suave}`}>No se encontró la categoría de tu equipo.</p>}
      </Tarjeta>
    </div>
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
  const [intento, setIntento] = useState(false)
  const errores = useMemo(() => {
    const e: Record<string, string> = {}
    const nombre = form.nombre.trim().replace(/\s+/g, ' ')
    if (!nombre) e.nombre = 'Ingresá el nombre y apellido.'
    else if (!/^[\p{L}][\p{L}\s'.-]*$/u.test(nombre)) e.nombre = 'El nombre solo puede tener letras y espacios.'
    else if (nombre.split(' ').length < 2 || nombre.length < 5) e.nombre = 'Ingresá nombre y apellido (por ejemplo: Juan Pérez).'
    const digitos = form.dni.replace(/[.\s]/g, '')
    if (!form.dni.trim()) e.dni = 'Ingresá el DNI.'
    else if (!/^\d+$/.test(digitos)) e.dni = 'El DNI solo lleva números (con o sin puntos).'
    else if (digitos.length < 7 || digitos.length > 8) e.dni = 'El DNI tiene 7 u 8 números.'
    else {
      const otro = datos.plantel.find((j) => j.id !== form.id && j.dni.replace(/[.\s]/g, '') === digitos)
      if (otro) e.dni = otro.equipo === sesion?.equipo ? `Ya cargaste este DNI (${otro.nombre}).` : `Este DNI ya está cargado en ${otro.equipo}.`
    }
    if (!form.foto) e.foto = 'Falta la foto del jugador.'
    if (!form.dniFrente) e.dniFrente = 'Falta el frente del DNI.'
    if (!form.dniDorso) e.dniDorso = 'Falta el dorso del DNI.'
    if (lleno) e.plantel = `El plantel está completo (${TOPE_PLANTEL} jugadores). Quitá a alguien para sumar otro.`
    return e
  }, [form, datos.plantel, sesion?.equipo, lleno])
  const err = (k: string) => (intento ? errores[k] : undefined)
  const doc = estadoPlantel(propios)

  function editar(j: JugadorPlantel) {
    setIntento(false)
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
    <div className="grid gap-6 xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <div className="space-y-6 self-start min-w-0">
        <Tarjeta titulo={form.id ? 'Editar jugador' : 'Agregar jugador'}>
          <form
            className="space-y-4"
            noValidate
            onSubmit={(e) => {
              e.preventDefault()
              setIntento(true)
              if (Object.keys(errores).length || !sesion?.equipo) {
                requestAnimationFrame(() => document.querySelector<HTMLElement>('form [aria-invalid="true"]')?.focus())
                return
              }
              guardarJugador({ ...form, equipo: sesion.equipo, nombre: form.nombre.trim().replace(/\s+/g, ' '), dni: form.dni.trim() })
              setIntento(false)
              setForm(VACIO)
            }}
          >
            <Campo label="Nombre y apellido" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Ej: Juan Pérez" error={err('nombre')} />
            <Campo label="DNI" inputMode="numeric" value={form.dni} onChange={(e) => setForm({ ...form, dni: e.target.value })} placeholder="Ej: 32.456.789" error={err('dni')} />
            <div>
              <span className={K.etiqueta}>Posición</span>
              <div className="flex flex-wrap gap-2">
                {POSICIONES.map((p) => (
                  <button key={p} type="button" onClick={() => setForm({ ...form, posicion: p })}
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${form.posicion === p ? 'bg-[var(--p-navy)] text-white' : 'bg-[var(--p-fondo)] text-[color:var(--p-suave)]'}`}>{p}</button>
                ))}
              </div>
            </div>
            <SubirFoto label="Foto del jugador" valor={form.foto} onChange={(v) => setForm({ ...form, foto: v })} ayuda="Foto carnet o de frente (JPG o PNG)" error={err('foto')} />
            <div className="grid grid-cols-2 gap-3">
              <SubirFoto label="DNI frente" valor={form.dniFrente} onChange={(v) => setForm({ ...form, dniFrente: v })} ayuda="Foto del frente del DNI" error={err('dniFrente')} />
              <SubirFoto label="DNI dorso" valor={form.dniDorso} onChange={(v) => setForm({ ...form, dniDorso: v })} ayuda="Foto del dorso del DNI" error={err('dniDorso')} />
            </div>
            <div className="flex flex-wrap gap-2">
              <Boton type="submit">{form.id ? 'Guardar cambios' : 'Agregar al plantel'}</Boton>
              {form.id && <Boton type="button" variante="suave" onClick={() => { setIntento(false); setForm(VACIO) }}>Cancelar</Boton>}
            </div>
            {intento && Object.keys(errores).length > 0 && <MensajeError>{errores.plantel ?? `Revisá los ${Object.keys(errores).length} campo(s) marcados en rojo para poder guardar.`}</MensajeError>}
            {!intento && <p className={`text-xs ${K.suave}`}>Cargá nombre, DNI y las tres fotos.{form.id ? ' Si solo cambiás nombre o posición, la documentación no vuelve a revisión.' : ''}</p>}
          </form>
        </Tarjeta>
      </div>
      <div className="space-y-6 self-start min-w-0">
        <Tarjeta titulo={`Plantel ${propios.length}/${TOPE_PLANTEL}`}>
          <div className="h-2 rounded-full bg-[var(--p-fondo)] overflow-hidden mb-4"><div className="h-full rounded-full" style={{ width: `${Math.min(100, (propios.length / TOPE_PLANTEL) * 100)}%`, background: C.teal }} /></div>
          <Semaforo aprobados={doc.aprobados} pendientes={doc.pendientes} observados={doc.observados} />
        </Tarjeta>
        <Tarjeta titulo={`Jugadores de ${sesion?.equipo} (${lista.length})`}>
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
    </div>
  )
}
