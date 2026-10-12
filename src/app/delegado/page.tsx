'use client'

import { useState } from 'react'
import { useDemo, type JugadorPlantel } from '@/lib/demo-store'
import { Boton, Campo, Etiqueta, Paginador, PanelShell, SubirFoto, Tarjeta, usePaginas } from '@/components/panel/ui'

const POSICIONES = ['Arquero', 'Defensor', 'Mediocampista', 'Delantero']
const VACIO = { nombre: '', dni: '', posicion: 'Mediocampista', foto: undefined as string | undefined, dniFrente: undefined as string | undefined, dniDorso: undefined as string | undefined }

export default function DelegadoPage() {
  const [tab, setTab] = useState('Descargos')
  return (
    <PanelShell rol="delegado" titulo="Panel del delegado" tabs={['Descargos', 'Plantel']} tab={tab} setTab={setTab}>
      {tab === 'Descargos' ? <Descargos /> : <Plantel />}
    </PanelShell>
  )
}

function Descargos() {
  const { sesion, datos, enviarDescargo, mensaje } = useDemo()
  const propias = datos.sanciones.filter((s) => s.equipo === sesion?.equipo)
  const pag = usePaginas(propias, 4)
  const [texto, setTexto] = useState<Record<string, string>>({})
  const [msg, setMsg] = useState<Record<string, string>>({})
  return (
    <Tarjeta titulo={`Sanciones de ${sesion?.equipo}`}>
      {propias.length === 0 && <p className="text-sm text-[#6b7685]">Tu equipo no tiene sanciones.</p>}
      <div className="space-y-4">
        {pag.items.map((s) => (
          <article key={s.id} className="rounded-xl border border-[#e3e7ee] p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-bold">{s.jugador}</p>
                <p className="text-xs text-[#6b7685]">{s.partido} · {s.fecha} · {s.tipo} · {s.articulo} · {s.fechasSuspension} fecha(s)</p>
              </div>
              <Etiqueta texto={s.estado} />
            </div>
            <p className="text-sm">{s.motivo}</p>
            {s.descargo ? (
              <div className="rounded-lg bg-[#f2f4f8] p-3 text-sm"><span className="font-bold">Descargo enviado: </span>{s.descargo}</div>
            ) : null}
            {s.estado !== 'Descargo aceptado' && (
              <div className="space-y-2">
                <textarea
                  value={texto[s.id] ?? ''}
                  onChange={(e) => setTexto({ ...texto, [s.id]: e.target.value })}
                  rows={2}
                  placeholder={s.descargo ? 'Actualizar descargo' : 'Escribí el descargo del equipo'}
                  className="w-full rounded-xl border border-[#e3e7ee] bg-[#f2f4f8] px-4 py-3 text-sm outline-none focus:border-[#0c1d3d]"
                />
                <Boton disabled={!(texto[s.id] ?? '').trim()} onClick={() => { enviarDescargo(s.id, texto[s.id].trim()); setTexto({ ...texto, [s.id]: '' }) }}>
                  {s.descargo ? 'Actualizar descargo' : 'Enviar descargo'}
                </Boton>
              </div>
            )}
            <div className="space-y-1">
              {s.mensajes.map((m, i) => (
                <p key={i} className={`text-sm rounded-lg px-3 py-2 ${m.de === 'organizacion' ? 'bg-[#0c1d3d] text-white' : 'bg-[#ffc72c]/30'}`}>
                  <span className="font-bold">{m.de === 'organizacion' ? 'Organización' : 'Vos'} · {m.fecha}: </span>{m.texto}
                </p>
              ))}
              <div className="flex gap-2">
                <input
                  value={msg[s.id] ?? ''}
                  onChange={(e) => setMsg({ ...msg, [s.id]: e.target.value })}
                  placeholder="Mensaje a la organización"
                  className="flex-1 rounded-xl border border-[#e3e7ee] bg-[#f2f4f8] px-4 py-2.5 text-sm outline-none focus:border-[#0c1d3d]"
                />
                <Boton variante="suave" disabled={!(msg[s.id] ?? '').trim()} onClick={() => { mensaje(s.id, msg[s.id].trim()); setMsg({ ...msg, [s.id]: '' }) }}>Enviar</Boton>
              </div>
            </div>
          </article>
        ))}
      </div>
      <Paginador {...pag} />
    </Tarjeta>
  )
}

function Plantel() {
  const { sesion, datos, guardarJugador, quitarJugador } = useDemo()
  const [form, setForm] = useState<typeof VACIO & { id?: string }>(VACIO)
  const propios = datos.plantel.filter((j) => j.equipo === sesion?.equipo)
  const pag = usePaginas(propios, 5)
  const valido = form.nombre.trim() && form.dni.trim() && form.foto && form.dniFrente && form.dniDorso

  function editar(j: JugadorPlantel) {
    setForm({ id: j.id, nombre: j.nombre, dni: j.dni, posicion: j.posicion, foto: j.foto, dniFrente: j.dniFrente, dniDorso: j.dniDorso })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
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
          <Campo label="Nombre y apellido" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
          <Campo label="DNI" inputMode="numeric" value={form.dni} onChange={(e) => setForm({ ...form, dni: e.target.value })} placeholder="12.345.678" />
          <div>
            <span className="block text-xs font-bold uppercase tracking-wide mb-1.5 text-[#0c1d3d]">Posición</span>
            <div className="flex flex-wrap gap-2">
              {POSICIONES.map((p) => (
                <button key={p} type="button" onClick={() => setForm({ ...form, posicion: p })}
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${form.posicion === p ? 'bg-[#0c1d3d] text-white' : 'bg-[#f2f4f8] text-[#6b7685]'}`}>{p}</button>
              ))}
            </div>
          </div>
          <SubirFoto label="Foto del jugador" valor={form.foto} onChange={(v) => setForm({ ...form, foto: v })} />
          <div className="grid grid-cols-2 gap-3">
            <SubirFoto label="DNI frente" valor={form.dniFrente} onChange={(v) => setForm({ ...form, dniFrente: v })} />
            <SubirFoto label="DNI dorso" valor={form.dniDorso} onChange={(v) => setForm({ ...form, dniDorso: v })} />
          </div>
          <div className="flex gap-2">
            <Boton type="submit" disabled={!valido}>{form.id ? 'Guardar cambios' : 'Agregar al plantel'}</Boton>
            {form.id && <Boton type="button" variante="suave" onClick={() => setForm(VACIO)}>Cancelar</Boton>}
          </div>
          {!valido && <p className="text-xs text-[#6b7685]">Completá nombre, DNI y las tres fotos.</p>}
        </form>
      </Tarjeta>

      <Tarjeta titulo={`Plantel de ${sesion?.equipo} (${propios.length})`}>
        <ul className="divide-y divide-[#e3e7ee]">
          {pag.items.map((j) => (
            <li key={j.id} className="py-3 flex items-center gap-3">
              {j.foto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={j.foto} alt={j.nombre} className="h-12 w-12 rounded-full object-cover" />
              ) : (
                <div className="h-12 w-12 rounded-full bg-[#f2f4f8] flex items-center justify-center text-[#6b7685] font-bold">{j.nombre[0]}</div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-bold truncate">{j.nombre}</p>
                <p className="text-xs text-[#6b7685]">{j.posicion} · DNI {j.dni}</p>
              </div>
              <Etiqueta texto={j.estadoDoc} />
              <Boton variante="suave" onClick={() => editar(j)}>Editar</Boton>
              <Boton variante="peligro" onClick={() => quitarJugador(j.id)} aria-label={`Quitar a ${j.nombre}`}>Quitar</Boton>
            </li>
          ))}
        </ul>
        <Paginador {...pag} />
      </Tarjeta>
    </div>
  )
}
