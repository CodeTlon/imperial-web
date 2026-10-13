'use client'

import { CalendarDays, MapPin } from 'lucide-react'
import { useDemo } from '@/lib/demo-store'
import { aplicarAFecha } from '@/lib/aplicar-datos'
import { fixturePorCategoria, type Categoria, type Fecha } from '@/lib/torneo-data'
import { categoriaDeEquipo, mismo, puntos, tablaCategoria } from '@/components/panel/datos'
import { K, Tabla } from '@/components/panel/ui'

// Fixture de una categoría con los resultados cargados desde el panel ya aplicados.
export function useFixture(cat: string | undefined): Fecha[] {
  const { datos } = useDemo()
  if (!cat) return []
  return (fixturePorCategoria[cat as Categoria] ?? []).map((f) => aplicarAFecha(f, datos.resultados, cat))
}

export function partidosDe(fixture: Fecha[], equipo: string) {
  return fixture.flatMap((f) =>
    f.partidos.filter((p) => mismo(p.local, equipo) || mismo(p.visitante, equipo)).map((p) => ({ fecha: f, p })),
  )
}

export function proximoPartidoDe(fixture: Fecha[], equipo: string) {
  return partidosDe(fixture, equipo).find((x) => x.p.golesLocal === undefined)
}

export function resultadoPara(p: { local: string; golesLocal?: number; golesVisitante?: number }, equipo: string): 'G' | 'E' | 'P' | null {
  if (p.golesLocal === undefined || p.golesVisitante === undefined) return null
  const propios = mismo(p.local, equipo) ? p.golesLocal : p.golesVisitante
  const rival = mismo(p.local, equipo) ? p.golesVisitante : p.golesLocal
  return propios > rival ? 'G' : propios < rival ? 'P' : 'E'
}

export function TarjetaProximoPartido({ equipo, titulo = 'Próximo partido' }: { equipo: string; titulo?: string }) {
  const fixture = useFixture(categoriaDeEquipo(equipo))
  const prox = proximoPartidoDe(fixture, equipo)
  if (!prox) return <p className={`text-sm ${K.suave}`}>No hay partidos próximos cargados para {equipo}.</p>
  const { fecha, p } = prox
  const local = mismo(p.local, equipo)
  return (
    <div className="rounded-xl p-4 text-white" style={{ background: 'linear-gradient(135deg, var(--p-navy), var(--p-profundo))' }}>
      <p className="text-xs uppercase tracking-[0.2em] font-bold" style={{ color: 'var(--p-oro)' }}>{titulo}</p>
      <p className="font-heading text-2xl sm:text-3xl mt-1 break-words">{p.local} <span className="text-white/60">vs</span> {p.visitante}</p>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-white/85">
        <span className="inline-flex items-center gap-1.5"><CalendarDays size={15} /> Fecha {fecha.numero} · {fecha.fechaLabel.toLowerCase()} · {p.hora}</span>
        {p.cancha && <span className="inline-flex items-center gap-1.5"><MapPin size={15} /> {p.cancha}</span>}
        <span>{local ? 'Juega de local' : 'Juega de visitante'}</span>
      </div>
    </div>
  )
}

export function TablaPosiciones({ categoria, resaltar, limite }: { categoria: string; resaltar?: string; limite?: number }) {
  const { datos } = useDemo()
  const toda = tablaCategoria(categoria, datos.resultados)
  const filas = limite ? toda.slice(0, limite) : toda
  return (
    <Tabla
      filas={filas}
      clave={(e) => e.nombre}
      columnas={[
        { titulo: '#', celda: (e) => toda.indexOf(e) + 1 },
        { titulo: 'Equipo', celda: (e) => <span className={resaltar && mismo(e.nombre, resaltar) ? 'font-bold text-[color:var(--p-profundo)]' : ''}>{e.nombre}</span> },
        { titulo: 'PJ', celda: (e) => e.pj },
        { titulo: 'G-E-P', celda: (e) => `${e.pg}-${e.pe}-${e.pp}` },
        { titulo: 'DG', celda: (e) => e.gf - e.gc },
        { titulo: 'Pts', celda: (e) => <span className="font-heading text-lg">{puntos(e)}</span> },
      ]}
      tarjeta={(e) => (
        <div className={`flex items-center justify-between gap-3 ${resaltar && mismo(e.nombre, resaltar) ? 'font-bold' : ''}`}>
          <span className="min-w-0 truncate"><span className="font-heading mr-2">{toda.indexOf(e) + 1}</span>{e.nombre}</span>
          <span className={`text-xs ${K.suave} whitespace-nowrap`}>PJ {e.pj} · DG {e.gf - e.gc} · <b className="font-heading text-base text-[color:var(--p-navy)]">{puntos(e)}</b></span>
        </div>
      )}
    />
  )
}
