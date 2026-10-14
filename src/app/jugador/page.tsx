'use client'

import { useMemo } from 'react'
import { fechasTxt } from '@/lib/utils'
import { admiteDescargo, useDemo } from '@/lib/demo-store'
import { categoriaDeEquipo, goleadoresCategoria, mismo } from '@/components/panel/datos'
import { ListaResultados, TablaPosiciones, TarjetaProximoPartido, partidosDe, resultadoPara, useFixture } from '@/components/panel/Compartidos'
import { Escudo } from '@/components/ui/Escudo'
import { tablaCategoria, puntos } from '@/components/panel/datos'
import { ChipsArticulos } from '@/components/panel/Sanciones'
import { BarrasH, BarrasV, Dona, Kpi } from '@/components/panel/graficos'
import { C, COLOR_ESTADO, Etiqueta, K, PanelShell, Tarjeta, usePestanaUrl } from '@/components/panel/ui'

const TABS = ['Inicio', 'Mis sanciones', 'Posiciones']

export default function JugadorPage() {
  const [tab, setTab] = usePestanaUrl(TABS, 'Inicio')
  return (
    <PanelShell rol="jugador" titulo="Mi panel de jugador" tabs={TABS} tab={tab} setTab={setTab}>
      {tab === 'Inicio' && <Inicio irA={setTab} />}
      {tab === 'Mis sanciones' && <MisSanciones />}
      {tab === 'Posiciones' && <Posiciones />}
    </PanelShell>
  )
}

// Datos del jugador en sesión: goles (tabla de goleadores + cargados), sanciones y rendimiento del equipo.
function useMisDatos() {
  const { sesion, datos } = useDemo()
  const nombre = sesion?.nombre ?? ''
  const equipo = sesion?.equipo ?? ''
  const cat = categoriaDeEquipo(equipo)
  const sanciones = datos.sanciones.filter((s) => mismo(s.jugador, nombre))
  const goles = useMemo(
    () => (cat ? goleadoresCategoria(cat, datos.goleadores).filter((g) => mismo(g.jugador, nombre) && mismo(g.equipo, equipo)).reduce((a, g) => a + g.goles, 0) : 0),
    [cat, datos.goleadores, nombre, equipo],
  )
  const fixture = useFixture(cat)
  const jugados = partidosDe(fixture, equipo).filter((x) => x.p.golesLocal !== undefined)
  return { nombre, equipo, cat, sanciones, goles, jugados, posicion: datos.plantel.find((j) => mismo(j.nombre, nombre))?.posicion }
}

function Inicio({ irA }: { irA: (t: string) => void }) {
  const { nombre, equipo, cat, sanciones, goles, jugados, posicion } = useMisDatos()
  const rojas = sanciones.filter((s) => s.tipo === 'Roja directa' && s.estado !== 'Descargo aceptado').length
  const porCumplir = sanciones.filter((s) => (s.estado === 'Firme' || s.estado === 'En revisión') && !s.cumplida)
  const racha = jugados.slice(-6).map(({ fecha, p }) => ({
    etiqueta: `F${fecha.numero}`,
    valor: (mismo(p.local, equipo) ? p.golesLocal : p.golesVisitante) ?? 0,
    color: { G: C.verde, E: C.oro, P: C.rojo }[resultadoPara(p, equipo) ?? 'E'],
  }))
  const recientes = [...sanciones].sort((a, b) => Number(a.cumplida ?? false) - Number(b.cumplida ?? false)).slice(0, 4)
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white border border-[color:var(--p-borde)]"><Escudo equipo={equipo} size={48} /></span>
        <div className="min-w-0">
          <p className="font-heading text-2xl sm:text-3xl text-[color:var(--p-navy)]">Hola, {nombre.split(' ')[0]}</p>
          <p className={`text-sm ${K.suave}`}>{equipo}{cat && !equipo.includes(cat) ? ` · ${cat}` : ''}{posicion ? ` · ${posicion}` : ''}</p>
        </div>
      </div>
      <TarjetaProximoPartido equipo={equipo} titulo="Mi próximo partido" />
      <div className="grid gap-4 grid-cols-2 xl:grid-cols-4">
        <Kpi titulo="Goles en el torneo" valor={goles} color={C.oro} detalle="Tabla de goleadores" />
        <Kpi titulo="Partidos del equipo" valor={jugados.length} color={C.teal} detalle="Jugados hasta ahora" />
        <Kpi titulo="Rojas directas" valor={rojas} color={C.rojo} onClick={() => irA('Mis sanciones')} detalle="Sin contar descargos aceptados" />
        <Kpi titulo="Fechas por cumplir" valor={porCumplir.length} color={C.profundo} onClick={() => irA('Mis sanciones')} detalle="Sanciones vigentes" />
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        <Tarjeta titulo="Goles de mi equipo">
          <BarrasV datos={racha} vacio="Todavía no hay partidos jugados." />
          <p className={`text-xs mt-2 ${K.suave}`}>Verde: ganó · Dorado: empató · Rojo: perdió.</p>
        </Tarjeta>
        <Tarjeta titulo="Últimos resultados"><ListaResultados equipo={equipo} limite={5} /></Tarjeta>
        <Tarjeta titulo="Mis sanciones" className="flex flex-col" derecha={sanciones.length > 0 ? <button type="button" onClick={() => irA('Mis sanciones')} className="text-sm font-bold text-[color:var(--p-profundo)] hover:underline">Ver todas</button> : undefined}>
          {recientes.length === 0 ? (
            <p className={`text-sm ${K.suave}`}>No tenés sanciones. ¡Seguí así!</p>
          ) : (
            <ul className="divide-y divide-[color:var(--p-borde)]">
              {recientes.map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0"><p className="truncate text-sm font-semibold">{s.partido}</p><p className={`text-xs ${K.suave}`}>{s.fecha} · {fechasTxt(s.fechasSuspension)}</p></div>
                  <Etiqueta texto={s.cumplida && s.estado === 'Firme' ? 'Cumplida' : s.estado} />
                </li>
              ))}
            </ul>
          )}
          <dl className="mt-auto grid grid-cols-3 gap-2 border-t border-[color:var(--p-borde)] pt-4 text-center">
            {([['Vigentes', porCumplir.length, C.rojo], ['Cumplidas', sanciones.filter((s) => s.cumplida).length, C.verde], ['Aceptadas', sanciones.filter((s) => s.estado === 'Descargo aceptado').length, C.teal]] as const).map(([t, n, c]) => (
              <div key={t}><dd className="font-heading text-3xl leading-none" style={{ color: c }}>{n}</dd><dt className={`mt-1 text-xs ${K.suave}`}>{t}</dt></div>
            ))}
          </dl>
        </Tarjeta>
      </div>
      {cat && (
        <Tarjeta titulo={`Posiciones ${cat}`} derecha={<button type="button" onClick={() => irA('Posiciones')} className="text-sm font-bold text-[color:var(--p-profundo)] hover:underline">Tabla completa</button>}>
          <TablaPosiciones categoria={cat} resaltar={equipo} limite={6} />
        </Tarjeta>
      )}
    </div>
  )
}

function MisSanciones() {
  const { sanciones } = useMisDatos()
  const fechas = sanciones.map((s) => ({ etiqueta: s.fecha, valor: s.fechasSuspension }))
  const estados = (['Firme', 'En revisión', 'Descargo aceptado', 'Descargo rechazado'] as const).map((e) => ({
    etiqueta: e, valor: sanciones.filter((s) => s.estado === e).length, color: COLOR_ESTADO[e],
  }))
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] items-start">
      <Tarjeta titulo={`Mis sanciones (${sanciones.length})`}>
        {sanciones.length === 0 && <p className={`text-sm ${K.suave}`}>No tenés sanciones registradas.</p>}
        <div className="space-y-4">
          {sanciones.map((s) => (
            <article key={s.id} className={`rounded-xl border ${K.borde} p-4 space-y-2`}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0"><p className="font-bold">{s.partido}</p><p className={`text-xs ${K.suave}`}>{s.fecha} · {s.tipo} · {fechasTxt(s.fechasSuspension)}</p></div>
                <Etiqueta texto={s.cumplida && s.estado === 'Firme' ? 'Cumplida' : s.estado} />
              </div>
              <ChipsArticulos s={s} />
              <p className="text-sm"><span className={`block text-xs font-bold uppercase ${K.suave}`}>Informe de expulsión</span>{s.motivo}</p>
              {s.descargo && <p className="text-sm rounded-lg bg-[var(--p-fondo)] p-3"><b>Descargo de tu equipo: </b>{s.descargo}</p>}
              <p className={`text-xs ${K.suave}`}>{admiteDescargo(s) && !s.descargo ? 'Tu delegado puede presentar un descargo.' : 'Cualquier consulta, hablala con tu delegado.'}</p>
            </article>
          ))}
        </div>
      </Tarjeta>
      <div className="space-y-6 min-w-0">
        <Tarjeta titulo="Por estado"><Dona datos={estados} centro="sanciones" vacio="Sin sanciones." /></Tarjeta>
        <Tarjeta titulo="Fechas de suspensión por sanción"><BarrasH datos={fechas} color={C.rojo} vacio="Sin sanciones." /></Tarjeta>
      </div>
    </div>
  )
}

function Posiciones() {
  const { equipo, cat } = useMisDatos()
  const { datos } = useDemo()
  const tabla = cat ? tablaCategoria(cat, datos.resultados) : []
  const idx = tabla.findIndex((e) => mismo(e.nombre, equipo))
  const mio = idx >= 0 ? tabla[idx] : undefined
  return (
    <div className="space-y-6">
      {mio && (
        <div className="grid gap-4 grid-cols-2 xl:grid-cols-4">
          <Kpi titulo="Puesto en la tabla" valor={`${idx + 1}°`} color={C.oro} detalle={`de ${tabla.length} equipos`} />
          <Kpi titulo="Puntos" valor={puntos(mio)} color={C.teal} detalle={`${mio.pj} partidos jugados`} />
          <Kpi titulo="Ganados · empatados · perdidos" valor={`${mio.pg}-${mio.pe}-${mio.pp}`} color={C.verde} detalle="Balance del equipo" />
          <Kpi titulo="Diferencia de gol" valor={mio.gf - mio.gc} color={C.profundo} detalle={`${mio.gf} a favor · ${mio.gc} en contra`} />
        </div>
      )}
      <Tarjeta titulo={`Posiciones ${cat ?? ''}`}>
        {cat ? <TablaPosiciones categoria={cat} resaltar={equipo} /> : <p className={`text-sm ${K.suave}`}>No se encontró tu categoría.</p>}
      </Tarjeta>
    </div>
  )
}
