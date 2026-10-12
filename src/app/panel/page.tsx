'use client'

import { useState } from 'react'
import { CATEGORIAS } from '@/lib/categorias-mock'
import { useDemo } from '@/lib/demo-store'
import { posiciones, type Categoria } from '@/lib/torneo-data'
import { Boton, Campo, Etiqueta, Paginador, PanelShell, Tarjeta, usePaginas } from '@/components/panel/ui'

const TABS = ['Resumen', 'Descargos', 'Sanciones', 'Jugadores', 'Resultados', 'Goleadores', 'Contenido']

export default function PanelPage() {
  const [tab, setTab] = useState('Resumen')
  return (
    <PanelShell rol="organizacion" titulo="Panel de administración" tabs={TABS} tab={tab} setTab={setTab}>
      {tab === 'Resumen' && <Resumen irA={setTab} />}
      {tab === 'Descargos' && <Descargos />}
      {tab === 'Sanciones' && <Sanciones />}
      {tab === 'Jugadores' && <Jugadores />}
      {tab === 'Resultados' && <Resultados />}
      {tab === 'Goleadores' && <Goleadores />}
      {tab === 'Contenido' && <Contenido />}
    </PanelShell>
  )
}

function Resumen({ irA }: { irA: (t: string) => void }) {
  const { datos } = useDemo()
  const datosResumen = [
    ['Descargos en revisión', datos.sanciones.filter((s) => s.estado === 'En revisión').length, 'Descargos'],
    ['Sanciones firmes', datos.sanciones.filter((s) => s.estado === 'Firme').length, 'Sanciones'],
    ['Documentación pendiente', datos.plantel.filter((j) => j.estadoDoc !== 'Aprobado').length, 'Jugadores'],
    ['Resultados cargados', datos.resultados.length, 'Resultados'],
  ] as const
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {datosResumen.map(([t, n, destino]) => (
        <button key={t} onClick={() => irA(destino)} className="bg-white rounded-2xl border border-[#e3e7ee] p-5 text-left hover:border-[#0c1d3d]">
          <p className="font-heading text-4xl text-[#0c1d3d]">{n}</p>
          <p className="text-sm text-[#6b7685] mt-1">{t}</p>
        </button>
      ))}
    </div>
  )
}

function Descargos() {
  const { datos, resolver, mensaje } = useDemo()
  const lista = datos.sanciones.filter((s) => s.descargo)
  const pag = usePaginas(lista, 4)
  const [msg, setMsg] = useState<Record<string, string>>({})
  return (
    <Tarjeta titulo="Descargos recibidos">
      {lista.length === 0 && <p className="text-sm text-[#6b7685]">No hay descargos.</p>}
      <div className="space-y-4">
        {pag.items.map((s) => (
          <article key={s.id} className="rounded-xl border border-[#e3e7ee] p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-bold">{s.jugador} · {s.equipo}</p>
                <p className="text-xs text-[#6b7685]">{s.partido} · {s.fecha} · {s.tipo} · {s.articulo}</p>
              </div>
              <Etiqueta texto={s.estado} />
            </div>
            <p className="text-sm"><span className="font-bold">Sanción: </span>{s.motivo}</p>
            <p className="text-sm rounded-lg bg-[#f2f4f8] p-3"><span className="font-bold">Descargo: </span>{s.descargo}</p>
            {s.mensajes.map((m, i) => (
              <p key={i} className={`text-sm rounded-lg px-3 py-2 ${m.de === 'organizacion' ? 'bg-[#0c1d3d] text-white' : 'bg-[#ffc72c]/30'}`}>
                <span className="font-bold">{m.de === 'organizacion' ? 'Organización' : 'Delegado'} · {m.fecha}: </span>{m.texto}
              </p>
            ))}
            <div className="flex gap-2">
              <input value={msg[s.id] ?? ''} onChange={(e) => setMsg({ ...msg, [s.id]: e.target.value })} placeholder="Responder al delegado"
                className="flex-1 min-w-0 rounded-xl border border-[#e3e7ee] bg-[#f2f4f8] px-4 py-2.5 text-sm outline-none focus:border-[#0c1d3d]" />
              <Boton variante="suave" disabled={!(msg[s.id] ?? '').trim()} onClick={() => { mensaje(s.id, msg[s.id].trim()); setMsg({ ...msg, [s.id]: '' }) }}>Enviar</Boton>
            </div>
            {s.estado === 'En revisión' && (
              <div className="flex gap-2">
                <Boton onClick={() => resolver(s.id, true)}>Aceptar descargo</Boton>
                <Boton variante="peligro" onClick={() => resolver(s.id, false)}>Rechazar</Boton>
              </div>
            )}
          </article>
        ))}
      </div>
      <Paginador {...pag} />
    </Tarjeta>
  )
}

function Sanciones() {
  const { datos, crearSancion } = useDemo()
  const vacio = { jugador: '', equipo: '', partido: '', fecha: '', articulo: 'Art. 39', fechasSuspension: 1, motivo: '' }
  const [f, setF] = useState(vacio)
  const [tipo, setTipo] = useState<'Roja directa' | 'Doble amarilla'>('Roja directa')
  const pag = usePaginas(datos.sanciones, 6)
  const ok = f.jugador.trim() && f.equipo.trim() && f.partido.trim() && f.motivo.trim()
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <Tarjeta titulo="Cargar sanción">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); if (!ok) return; crearSancion({ ...f, tipo, fecha: f.fecha || new Date().toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' }) }); setF(vacio) }}>
          <Campo label="Jugador" value={f.jugador} onChange={(e) => setF({ ...f, jugador: e.target.value })} />
          <Campo label="Equipo" value={f.equipo} onChange={(e) => setF({ ...f, equipo: e.target.value })} />
          <Campo label="Partido" value={f.partido} onChange={(e) => setF({ ...f, partido: e.target.value })} placeholder="vs. Rival +30" />
          <div className="grid grid-cols-3 gap-3">
            <Campo label="Fecha" value={f.fecha} onChange={(e) => setF({ ...f, fecha: e.target.value })} placeholder="13/07" />
            <Campo label="Artículo" value={f.articulo} onChange={(e) => setF({ ...f, articulo: e.target.value })} />
            <Campo label="Fechas" type="number" min={1} value={f.fechasSuspension} onChange={(e) => setF({ ...f, fechasSuspension: Number(e.target.value) || 1 })} />
          </div>
          <div className="flex gap-2">
            {(['Roja directa', 'Doble amarilla'] as const).map((t) => (
              <button type="button" key={t} onClick={() => setTipo(t)} className={`rounded-full px-4 py-2 text-sm font-semibold ${tipo === t ? 'bg-[#0c1d3d] text-white' : 'bg-[#f2f4f8] text-[#6b7685]'}`}>{t}</button>
            ))}
          </div>
          <Campo label="Motivo" value={f.motivo} onChange={(e) => setF({ ...f, motivo: e.target.value })} />
          <Boton type="submit" disabled={!ok}>Cargar sanción</Boton>
        </form>
      </Tarjeta>
      <Tarjeta titulo={`Sanciones (${datos.sanciones.length})`}>
        <ul className="divide-y divide-[#e3e7ee]">
          {pag.items.map((s) => (
            <li key={s.id} className="py-3 flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-bold">{s.jugador} · {s.equipo}</p>
                <p className="text-xs text-[#6b7685]">{s.tipo} · {s.articulo} · {s.fechasSuspension} fecha(s) · {s.fecha}</p>
              </div>
              <Etiqueta texto={s.estado} />
            </li>
          ))}
        </ul>
        <Paginador {...pag} />
      </Tarjeta>
    </div>
  )
}

function Jugadores() {
  const { datos, revisarDoc, quitarJugador } = useDemo()
  const pag = usePaginas(datos.plantel, 5)
  const [ver, setVer] = useState<string | null>(null)
  return (
    <Tarjeta titulo={`Jugadores y documentación (${datos.plantel.length})`}>
      <ul className="divide-y divide-[#e3e7ee]">
        {pag.items.map((j) => (
          <li key={j.id} className="py-3 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[180px]">
                <p className="font-bold">{j.nombre}</p>
                <p className="text-xs text-[#6b7685]">{j.equipo} · {j.posicion} · DNI {j.dni}</p>
              </div>
              <Etiqueta texto={j.estadoDoc} />
              <Boton variante="suave" onClick={() => setVer(ver === j.id ? null : j.id)}>{ver === j.id ? 'Ocultar' : 'Ver documentos'}</Boton>
              <Boton onClick={() => revisarDoc(j.id, 'Aprobado')}>Aprobar</Boton>
              <Boton variante="suave" onClick={() => revisarDoc(j.id, 'Observado')}>Observar</Boton>
              <Boton variante="peligro" onClick={() => quitarJugador(j.id)}>Dar de baja</Boton>
            </div>
            {ver === j.id && (
              <div className="grid grid-cols-3 gap-3">
                {([['Foto', j.foto], ['DNI frente', j.dniFrente], ['DNI dorso', j.dniDorso]] as const).map(([t, src]) => (
                  <figure key={t} className="rounded-xl bg-[#f2f4f8] overflow-hidden">
                    {src ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={src} alt={`${t} de ${j.nombre}`} className="h-32 w-full object-cover" />
                    ) : (
                      <div className="h-32 flex items-center justify-center text-xs text-[#6b7685]">Sin cargar</div>
                    )}
                    <figcaption className="text-xs text-center py-1 text-[#6b7685]">{t}</figcaption>
                  </figure>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
      <Paginador {...pag} />
    </Tarjeta>
  )
}

function Resultados() {
  const { datos, cargarResultado } = useDemo()
  const vacio = { categoria: '+30', fecha: 1, local: '', visitante: '', golesLocal: 0, golesVisitante: 0 }
  const [f, setF] = useState(vacio)
  const pag = usePaginas(datos.resultados, 6)
  const ok = f.local.trim() && f.visitante.trim()
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <Tarjeta titulo="Cargar resultado">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); if (!ok) return; cargarResultado(f); setF({ ...vacio, categoria: f.categoria, fecha: f.fecha }) }}>
          <Selector valor={f.categoria} onChange={(categoria) => setF({ ...f, categoria })} />
          <EquiposLista categoria={f.categoria} id="eq-res" />
          <Campo label="Fecha número" type="number" min={1} value={f.fecha} onChange={(e) => setF({ ...f, fecha: Number(e.target.value) || 1 })} />
          <div className="grid grid-cols-[1fr_72px] gap-3">
            <Campo label="Local" list="eq-res" value={f.local} onChange={(e) => setF({ ...f, local: e.target.value })} />
            <Campo label="Goles" type="number" min={0} value={f.golesLocal} onChange={(e) => setF({ ...f, golesLocal: Number(e.target.value) || 0 })} />
            <Campo label="Visitante" list="eq-res" value={f.visitante} onChange={(e) => setF({ ...f, visitante: e.target.value })} />
            <Campo label="Goles" type="number" min={0} value={f.golesVisitante} onChange={(e) => setF({ ...f, golesVisitante: Number(e.target.value) || 0 })} />
          </div>
          <Boton type="submit" disabled={!ok}>Cargar resultado</Boton>
        </form>
      </Tarjeta>
      <Tarjeta titulo={`Resultados cargados (${datos.resultados.length})`}>
        {datos.resultados.length === 0 && <p className="text-sm text-[#6b7685]">Todavía no cargaste resultados.</p>}
        <ul className="divide-y divide-[#e3e7ee]">
          {pag.items.map((r) => (
            <li key={r.id} className="py-3 space-y-1 text-sm">
              <p className="text-xs text-[#6b7685]">{r.categoria} · Fecha {r.fecha}</p>
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                <span className="text-right font-semibold">{r.local}</span>
                <span className="font-heading text-lg px-2 whitespace-nowrap">{r.golesLocal} - {r.golesVisitante}</span>
                <span className="font-semibold">{r.visitante}</span>
              </div>
            </li>
          ))}
        </ul>
        <Paginador {...pag} />
      </Tarjeta>
    </div>
  )
}

function Goleadores() {
  const { datos, cargarGoles } = useDemo()
  const vacio = { categoria: '+30', jugador: '', equipo: '', goles: 1 }
  const [f, setF] = useState(vacio)
  const pag = usePaginas(datos.goleadores, 6)
  const ok = f.jugador.trim() && f.equipo.trim()
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <Tarjeta titulo="Cargar goles">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); if (!ok) return; cargarGoles(f); setF({ ...vacio, categoria: f.categoria }) }}>
          <Selector valor={f.categoria} onChange={(categoria) => setF({ ...f, categoria })} />
          <Campo label="Jugador" value={f.jugador} onChange={(e) => setF({ ...f, jugador: e.target.value })} />
          <Campo label="Equipo" list="eq-gol" value={f.equipo} onChange={(e) => setF({ ...f, equipo: e.target.value })} />
          <EquiposLista categoria={f.categoria} id="eq-gol" />
          <Campo label="Goles" type="number" min={1} value={f.goles} onChange={(e) => setF({ ...f, goles: Number(e.target.value) || 1 })} />
          <Boton type="submit" disabled={!ok}>Sumar goles</Boton>
        </form>
      </Tarjeta>
      <Tarjeta titulo="Goles cargados">
        {datos.goleadores.length === 0 && <p className="text-sm text-[#6b7685]">Todavía no cargaste goles.</p>}
        <ul className="divide-y divide-[#e3e7ee]">
          {pag.items.map((g) => (
            <li key={g.id} className="py-3 flex justify-between text-sm">
              <span><span className="font-bold">{g.jugador}</span> · {g.equipo} <span className="text-[#6b7685]">({g.categoria})</span></span>
              <span className="font-heading text-lg">{g.goles}</span>
            </li>
          ))}
        </ul>
        <Paginador {...pag} />
      </Tarjeta>
    </div>
  )
}

function Contenido() {
  const { datos, setFotoFecha } = useDemo()
  const [url, setUrl] = useState(datos.fotoFechaUrl)
  return (
    <Tarjeta titulo="Foto de la fecha">
      <form className="space-y-4 max-w-xl" onSubmit={(e) => { e.preventDefault(); setFotoFecha(url.trim()) }}>
        <Campo label="Link del Drive con las fotos" value={url} onChange={(e) => setUrl(e.target.value)} />
        <Boton type="submit" disabled={!/^https?:\/\//.test(url)}>Guardar</Boton>
      </form>
    </Tarjeta>
  )
}

// Lista de equipos de la categoría para autocompletar (los resultados solo suman si el nombre coincide).
function EquiposLista({ categoria, id }: { categoria: string; id: string }) {
  const equipos = posiciones[categoria as Categoria] ?? []
  return <datalist id={id}>{equipos.map((e) => <option key={e.nombre} value={e.nombre} />)}</datalist>
}

function Selector({ valor, onChange }: { valor: string; onChange: (c: string) => void }) {
  return (
    <div>
      <span className="block text-xs font-bold uppercase tracking-wide mb-1.5 text-[#0c1d3d]">Categoría</span>
      <div className="flex flex-wrap gap-2">
        {CATEGORIAS.map((c) => (
          <button type="button" key={c} onClick={() => onChange(c)} className={`rounded-full px-4 py-2 text-sm font-semibold ${valor === c ? 'bg-[#0c1d3d] text-white' : 'bg-[#f2f4f8] text-[#6b7685]'}`}>{c}</button>
        ))}
      </div>
    </div>
  )
}
