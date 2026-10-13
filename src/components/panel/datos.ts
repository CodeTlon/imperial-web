import { aplicarResultados } from '@/lib/aplicar-datos'
import type { Gol, JugadorPlantel, Resultado, Sancion } from '@/lib/demo-store'
import { categorias, fixturePorCategoria, goleadores as goleadoresBase, posiciones, type Categoria } from '@/lib/torneo-data'

// Datos derivados que comparten los paneles (organización, delegado y jugador).

export const CATEGORIAS: readonly Categoria[] = categorias
export const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim()
export const mismo = (a: string, b: string) => norm(a) === norm(b)

export const equiposDe = (cat: string): string[] => (posiciones[cat as Categoria] ?? []).map((e) => e.nombre).sort((a, b) => a.localeCompare(b, 'es'))

const catPorEquipo = new Map<string, Categoria>()
for (const c of categorias) for (const e of posiciones[c]) catPorEquipo.set(norm(e.nombre), c)
export const categoriaDeEquipo = (equipo: string): Categoria | undefined => catPorEquipo.get(norm(equipo))

export const todosLosEquipos = (): string[] => Array.from(new Set(categorias.flatMap((c) => posiciones[c].map((e) => e.nombre)))).sort((a, b) => a.localeCompare(b, 'es'))

// Partidos del fixture donde juega el equipo (con rival), para elegirlos en el formulario de sanciones.
export function partidosDeEquipo(equipo: string, categoria?: string): { etiqueta: string; fecha: number; rival: string; jugado: boolean }[] {
  const cat = (categoria ?? categoriaDeEquipo(equipo)) as Categoria | undefined
  if (!cat || !fixturePorCategoria[cat]) return []
  const sal: { etiqueta: string; fecha: number; rival: string; jugado: boolean }[] = []
  for (const f of fixturePorCategoria[cat]) {
    for (const p of f.partidos) {
      if (!mismo(p.local, equipo) && !mismo(p.visitante, equipo)) continue
      const rival = mismo(p.local, equipo) ? p.visitante : p.local
      sal.push({ etiqueta: `vs. ${rival}`, fecha: f.numero, rival, jugado: p.golesLocal !== undefined })
    }
  }
  return sal
}

// Jugadores conocidos de un equipo: plantel cargado, sancionados y goleadores.
export function jugadoresDe(equipo: string, plantel: JugadorPlantel[], sanciones: Sancion[], goles: Gol[]): string[] {
  const nombres = new Set<string>()
  plantel.filter((j) => mismo(j.equipo, equipo)).forEach((j) => nombres.add(j.nombre))
  sanciones.filter((s) => mismo(s.equipo, equipo)).forEach((s) => nombres.add(s.jugador))
  goles.filter((g) => mismo(g.equipo, equipo)).forEach((g) => nombres.add(g.jugador))
  const cat = categoriaDeEquipo(equipo)
  if (cat) goleadoresBase[cat].filter((g) => mismo(g.equipo, equipo)).forEach((g) => nombres.add(g.jugador))
  return Array.from(nombres).sort((a, b) => a.localeCompare(b, 'es'))
}

export function tablaCategoria(cat: string, resultados: Resultado[]) {
  const base = posiciones[cat as Categoria] ?? []
  return aplicarResultados(base, resultados, cat)
}

export const puntos = (e: { pg: number; pe: number }) => e.pg * 3 + e.pe

// Goleadores de la categoría (base + cargados desde el panel), ordenados.
export function goleadoresCategoria(cat: string, goles: Gol[]) {
  const lista = (goleadoresBase[cat as Categoria] ?? []).map((g) => ({ ...g }))
  for (const g of goles.filter((x) => x.categoria === cat)) {
    const ya = lista.find((x) => mismo(x.jugador, g.jugador) && mismo(x.equipo, g.equipo))
    if (ya) ya.goles += g.goles
    else lista.push({ jugador: g.jugador.trim(), equipo: g.equipo.trim(), goles: g.goles })
  }
  return lista.sort((a, b) => b.goles - a.goles)
}

export const hoyCorto = () => new Date().toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })

export function estadoPlantel(plantel: JugadorPlantel[]) {
  return {
    aprobados: plantel.filter((j) => j.estadoDoc === 'Aprobado').length,
    pendientes: plantel.filter((j) => j.estadoDoc === 'Pendiente').length,
    observados: plantel.filter((j) => j.estadoDoc === 'Observado').length,
  }
}
