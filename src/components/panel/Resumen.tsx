'use client'

import { useMemo, useState } from 'react'
import { articulosDe, useDemo } from '@/lib/demo-store'
import { fixturePorCategoria, type Categoria } from '@/lib/torneo-data'
import { CATEGORIAS, estadoPlantel, goleadoresCategoria, puntos, tablaCategoria } from '@/components/panel/datos'
import { BarrasH, BarrasV, Dona, Linea } from '@/components/panel/graficos'
import { C, COLOR_ESTADO, Encabezado, K, Selector, Tabla, Tarjeta } from '@/components/panel/ui'

type Mov = { clave: string; tipo: string; texto: string; detalle: string }

export default function Resumen({ irA }: { irA: (t: string) => void }) {
  const { datos } = useDemo()
  const [cat, setCat] = useState('+30')

  const doc = estadoPlantel(datos.plantel)

  const golesPorCat = useMemo(
    () => CATEGORIAS.map((c) => ({ etiqueta: c, valor: goleadoresCategoria(c, datos.goleadores).reduce((a, g) => a + g.goles, 0) })),
    [datos.goleadores],
  )
  const estadosSanc = (['Firme', 'En revisión', 'Descargo aceptado', 'Descargo rechazado'] as const).map((e) => ({
    etiqueta: e, valor: datos.sanciones.filter((s) => s.estado === e).length, color: COLOR_ESTADO[e],
  }))
  const docDona = [
    { etiqueta: 'Aprobada', valor: doc.aprobados, color: C.verde },
    { etiqueta: 'Pendiente', valor: doc.pendientes, color: C.oro },
    { etiqueta: 'Observada', valor: doc.observados, color: C.rojo },
  ]
  // Goles por fecha jugada de la categoría elegida (fixture + resultados cargados) y resultados cargados por fecha.
  const golesFecha = useMemo(() => {
    const fx = fixturePorCategoria[cat as Categoria] ?? []
    return fx.filter((f) => f.partidos.some((p) => p.golesLocal !== undefined)).slice(-8).map((f) => ({
      etiqueta: `F${f.numero}`,
      valor: f.partidos.reduce((a, p) => a + (p.golesLocal ?? 0) + (p.golesVisitante ?? 0), 0),
    }))
  }, [cat])
  const cargadosPorFecha = useMemo(() => {
    const m = new Map<number, number>()
    datos.resultados.forEach((r) => m.set(r.fecha, (m.get(r.fecha) ?? 0) + 1))
    return Array.from(m.entries()).sort((a, b) => a[0] - b[0]).map(([f, n]) => ({ etiqueta: `F${f}`, valor: n }))
  }, [datos.resultados])

  const tabla = tablaCategoria(cat, datos.resultados).slice(0, 5)
  const goleadores = goleadoresCategoria(cat, datos.goleadores).slice(0, 5)

  const movimientos: Mov[] = useMemo(() => {
    const m: Mov[] = []
    datos.resultados.slice(0, 5).forEach((r) => m.push({ clave: r.id, tipo: 'Resultado', texto: `${r.local} ${r.golesLocal} - ${r.golesVisitante} ${r.visitante}`, detalle: `${r.categoria} · Fecha ${r.fecha}` }))
    datos.goleadores.slice(0, 5).forEach((g) => m.push({ clave: g.id, tipo: 'Goles', texto: `${g.jugador} suma ${g.goles}`, detalle: `${g.equipo} · ${g.categoria}` }))
    datos.sanciones.forEach((s) => {
      s.mensajes.slice(-1).forEach((x, i) => m.push({ clave: `${s.id}-m${i}`, tipo: 'Mensaje', texto: `${x.de === 'organizacion' ? 'Organización' : 'Delegado'}: ${x.texto}`, detalle: `${s.jugador} · ${x.fecha}` }))
      if (s.descargo) m.push({ clave: `${s.id}-d`, tipo: 'Descargo', texto: `Descargo de ${s.jugador}`, detalle: `${s.equipo} · ${s.estado} · ${articulosDe(s).join(', ')}` })
    })
    return m.slice(0, 8)
  }, [datos])

  return (
    <div className="space-y-6">
      <Encabezado
        titulo="Resumen"
        descripcion="Lo que necesita tu atención hoy y cómo viene el torneo."
        accion={
          <div className="flex flex-wrap items-end gap-3">
            <button type="button" onClick={() => irA('Resultados')} className={`flex items-center gap-3 rounded-xl border ${K.borde} bg-white px-4 py-2 text-left transition hover:border-[color:var(--p-teal)]`}>
              <span className="font-heading text-3xl leading-none text-[color:var(--p-navy)]">{datos.resultados.length}</span>
              <span className="text-xs font-semibold leading-tight text-[color:var(--p-navy)]">Resultados<br />cargados</span>
            </button>
            <div className="w-44"><Selector label="Categoría" className="!bg-white shadow-sm" value={cat} onChange={(e) => setCat(e.target.value)} opciones={CATEGORIAS.map((c) => ({ valor: c, texto: c }))} /></div>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <Tarjeta titulo="Goles por categoría"><BarrasV datos={golesPorCat} /></Tarjeta>
        <Tarjeta titulo="Sanciones por estado"><Dona datos={estadosSanc} centro="sanciones" /></Tarjeta>
        <Tarjeta titulo="Documentación de jugadores" className="lg:col-span-2 xl:col-span-1"><Dona datos={docDona} centro="jugadores" /></Tarjeta>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <Tarjeta titulo={`Goles por fecha · ${cat}`}><Linea datos={golesFecha} color={C.teal} /></Tarjeta>
        <Tarjeta titulo="Resultados cargados por fecha"><BarrasV datos={cargadosPorFecha} color={C.oro} vacio="Todavía no cargaste resultados desde el panel." /></Tarjeta>
        <Tarjeta titulo={`Goleadores · ${cat}`} className="lg:col-span-2 xl:col-span-1">
          <BarrasH datos={goleadores.map((g) => ({ etiqueta: g.jugador, valor: g.goles }))} color={C.oro} />
        </Tarjeta>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Tarjeta titulo={`Posiciones · ${cat} (top 5)`}>
          <Tabla
            filas={tabla}
            clave={(e) => e.nombre}
            columnas={[
              { titulo: '#', celda: (e) => tabla.indexOf(e) + 1 },
              { titulo: 'Equipo', celda: (e) => <span className="font-bold">{e.nombre}</span> },
              { titulo: 'PJ', celda: (e) => e.pj },
              { titulo: 'DG', celda: (e) => e.gf - e.gc },
              { titulo: 'Pts', celda: (e) => <span className="font-heading text-lg">{puntos(e)}</span> },
            ]}
            tarjeta={(e) => (
              <div className="flex items-center justify-between gap-3">
                <span className="min-w-0 truncate"><span className="font-heading mr-2">{tabla.indexOf(e) + 1}</span><span className="font-bold">{e.nombre}</span></span>
                <span className={`text-xs ${K.suave} whitespace-nowrap`}>PJ {e.pj} · DG {e.gf - e.gc} · <b className="font-heading text-base text-[color:var(--p-navy)]">{puntos(e)}</b> pts</span>
              </div>
            )}
          />
        </Tarjeta>
        <Tarjeta titulo="Últimos movimientos">
          <Tabla
            filas={movimientos}
            clave={(m) => m.clave}
            vacio="Todavía no hay movimientos."
            columnas={[
              { titulo: 'Tipo', celda: (m) => <span className="font-bold text-[color:var(--p-profundo)]">{m.tipo}</span> },
              { titulo: 'Detalle', celda: (m) => <><p>{m.texto}</p><p className={`text-xs ${K.suave}`}>{m.detalle}</p></> },
            ]}
            tarjeta={(m) => (<><p className="text-xs font-bold text-[color:var(--p-profundo)]">{m.tipo}</p><p className="text-sm">{m.texto}</p><p className={`text-xs ${K.suave}`}>{m.detalle}</p></>)}
          />
        </Tarjeta>
      </div>
    </div>
  )
}
