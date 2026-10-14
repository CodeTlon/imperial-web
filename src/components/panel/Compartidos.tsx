'use client'

import { CalendarDays, MapPin } from 'lucide-react'
import { useDemo } from '@/lib/demo-store'
import { aplicarAFecha } from '@/lib/aplicar-datos'
import { fixturePorCategoria, type Categoria, type Fecha } from '@/lib/torneo-data'
import { categoriaDeEquipo, mismo, puntos, tablaCategoria } from '@/components/panel/datos'
import { Equipo, Escudo } from '@/components/ui/Escudo'
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

// Lado de un equipo en el partido destacado: escudo grande sobre un círculo blanco (se ve igual sobre el fondo oscuro) y nombre.
function Lado({ equipo, propio }: { equipo: string; propio: boolean }) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-2 text-center">
      <span className={`flex h-16 w-16 items-center justify-center rounded-full bg-white sm:h-20 sm:w-20 ${propio ? 'ring-4 ring-[var(--p-oro)]' : ''}`}><Escudo equipo={equipo} size={52} className="sm:scale-110" /></span>
      <p className="font-heading text-base leading-tight sm:text-xl line-clamp-2">{equipo}</p>
    </div>
  )
}

export function TarjetaProximoPartido({ equipo, titulo = 'Próximo partido' }: { equipo: string; titulo?: string }) {
  const fixture = useFixture(categoriaDeEquipo(equipo))
  const prox = proximoPartidoDe(fixture, equipo)
  if (!prox) return <p className={`text-sm ${K.suave}`}>No hay partidos próximos cargados para {equipo}.</p>
  const { fecha, p } = prox
  const local = mismo(p.local, equipo)
  return (
    <div className="rounded-2xl p-5 text-white sm:p-7" style={{ background: 'linear-gradient(135deg, var(--p-navy), var(--p-profundo))' }}>
      <p className="text-center text-xs uppercase tracking-[0.2em] font-bold sm:text-left" style={{ color: 'var(--p-oro)' }}>{titulo}</p>
      <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 sm:gap-8">
        <Lado equipo={p.local} propio={local} />
        <span className="font-heading text-2xl text-white/60 sm:text-3xl">VS</span>
        <Lado equipo={p.visitante} propio={!local} />
      </div>
      <div className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-1.5 border-t border-white/15 pt-4 text-sm text-white/85">
        <span className="inline-flex items-center gap-1.5"><CalendarDays size={15} aria-hidden /> Fecha {fecha.numero} · {fecha.fechaLabel.toLowerCase()} · {p.hora}</span>
        {p.cancha && <span className="inline-flex items-center gap-1.5"><MapPin size={15} aria-hidden /> {p.cancha}</span>}
        <span>{local ? 'Juega de local' : 'Juega de visitante'}</span>
      </div>
    </div>
  )
}

export function TablaPosiciones({ categoria, resaltar, limite }: { categoria: string; resaltar?: string; limite?: number }) {
  const { datos } = useDemo()
  const toda = tablaCategoria(categoria, datos.resultados)
  // Con límite se muestran los primeros y, si el equipo resaltado quedó afuera, su fila al final (con su puesto real).
  const propio = resaltar ? toda.find((e) => mismo(e.nombre, resaltar)) : undefined
  const filas = limite ? [...toda.slice(0, limite), ...(propio && toda.indexOf(propio) >= limite ? [propio] : [])] : toda
  return (
    <Tabla
      denso
      claseFila={(e) => (resaltar && mismo(e.nombre, resaltar) ? 'bg-[var(--p-oro)]/15 hover:bg-[var(--p-oro)]/20' : '')}
      filas={filas}
      clave={(e) => e.nombre}
      columnas={[
        { titulo: '#', celda: (e) => toda.indexOf(e) + 1 },
        { titulo: 'Equipo', celda: (e) => <Equipo equipo={e.nombre} size={24} negrita={!!resaltar && mismo(e.nombre, resaltar)} className={resaltar && mismo(e.nombre, resaltar) ? 'text-[color:var(--p-profundo)]' : ''} /> },
        { titulo: 'PJ', celda: (e) => e.pj },
        { titulo: 'G-E-P', celda: (e) => `${e.pg}-${e.pe}-${e.pp}` },
        { titulo: 'DG', celda: (e) => e.gf - e.gc },
        { titulo: 'Pts', celda: (e) => <span className="font-heading text-lg">{puntos(e)}</span> },
      ]}
      tarjeta={(e) => (
        <div className={`flex items-center justify-between gap-3 ${resaltar && mismo(e.nombre, resaltar) ? 'font-bold' : ''}`}>
          <span className="flex min-w-0 items-center gap-2"><span className="font-heading w-6 shrink-0">{toda.indexOf(e) + 1}</span><Equipo equipo={e.nombre} size={22} /></span>
          <span className={`text-xs ${K.suave} whitespace-nowrap`}>PJ {e.pj} · DG {e.gf - e.gc} · <b className="font-heading text-base text-[color:var(--p-navy)]">{puntos(e)}</b></span>
        </div>
      )}
    />
  )
}

// Ganó / Empató / Perdió para el equipo del panel.
export function ResultadoChip({ r }: { r: 'G' | 'E' | 'P' | null }) {
  if (!r) return null
  const c = { G: ['Ganó', 'bg-[#16a34a]/10 text-[#16a34a]'], E: ['Empató', 'bg-[#f3a21c]/30 text-[#8a5a00]'], P: ['Perdió', 'bg-[#dc2626]/10 text-[#dc2626]'] }[r]
  return <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold whitespace-nowrap ${c[1]}`}>{c[0]}</span>
}

// Últimos partidos jugados del equipo: rival con escudo, marcador y si ganó, empató o perdió.
export function ListaResultados({ equipo, limite = 5 }: { equipo: string; limite?: number }) {
  const fixture = useFixture(categoriaDeEquipo(equipo))
  const jugados = partidosDe(fixture, equipo).filter((x) => x.p.golesLocal !== undefined).reverse().slice(0, limite)
  if (jugados.length === 0) return <p className={`text-sm ${K.suave}`}>Todavía no hay partidos jugados.</p>
  return (
    <ul className={`divide-y divide-[color:var(--p-borde)]`}>
      {jugados.map(({ fecha, p }) => {
        const local = mismo(p.local, equipo)
        const rival = local ? p.visitante : p.local
        return (
          <li key={`${fecha.numero}-${p.local}`} className="flex items-center gap-3 py-2.5">
            <span className={`w-9 shrink-0 text-xs font-bold ${K.suave}`}>F{fecha.numero}</span>
            <span className="flex min-w-0 flex-1 text-sm" title={`${local ? 'Local' : 'Visitante'} vs ${rival}`}><Equipo equipo={rival} size={22} /></span>
            <span className="font-heading text-lg whitespace-nowrap">{local ? `${p.golesLocal} - ${p.golesVisitante}` : `${p.golesVisitante} - ${p.golesLocal}`}</span>
            <ResultadoChip r={resultadoPara(p, equipo)} />
          </li>
        )
      })}
    </ul>
  )
}
