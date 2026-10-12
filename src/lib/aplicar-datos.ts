import type { Gol, Resultado } from '@/lib/demo-store'

type Fila = { nombre: string; pj: number; pg: number; pe: number; pp: number; gf: number; gc: number }

const clave = (s: string) => s.trim().toLowerCase()

// Suma a la tabla base los resultados cargados desde el panel (solo equipos que existan en la categoría).
export function aplicarResultados<T extends Fila>(base: T[], resultados: Resultado[], categoria: string): T[] {
  const delCat = resultados.filter((r) => r.categoria === categoria)
  if (delCat.length === 0) return base
  const filas = base.map((e) => ({ ...e }))
  const buscar = (n: string) => filas.find((e) => clave(e.nombre) === clave(n))
  let aplico = false
  for (const r of delCat) {
    const l = buscar(r.local)
    const v = buscar(r.visitante)
    if (!l || !v) continue
    aplico = true
    l.pj++; v.pj++
    l.gf += r.golesLocal; l.gc += r.golesVisitante
    v.gf += r.golesVisitante; v.gc += r.golesLocal
    if (r.golesLocal > r.golesVisitante) { l.pg++; v.pp++ }
    else if (r.golesLocal < r.golesVisitante) { v.pg++; l.pp++ }
    else { l.pe++; v.pe++ }
  }
  if (!aplico) return base
  const pts = (e: Fila) => e.pg * 3 + e.pe
  return filas.sort((a, b) => pts(b) - pts(a) || b.gf - b.gc - (a.gf - a.gc) || b.gf - a.gf)
}

type Goleador = { jugador: string; equipo: string; goles: number }

// Suma los goles cargados a la tabla de goleadores y la reordena.
export function aplicarGoles(base: Goleador[], goles: Gol[], categoria: string): Goleador[] {
  const delCat = goles.filter((g) => g.categoria === categoria)
  if (delCat.length === 0) return base
  const lista = base.map((g) => ({ ...g }))
  for (const g of delCat) {
    const ya = lista.find((x) => clave(x.jugador) === clave(g.jugador) && clave(x.equipo) === clave(g.equipo))
    if (ya) ya.goles += g.goles
    else lista.push({ jugador: g.jugador.trim(), equipo: g.equipo.trim(), goles: g.goles })
  }
  return lista.sort((a, b) => b.goles - a.goles)
}
