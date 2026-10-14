import { PLANTEL_APP } from '@/lib/datos-app'
import { PLANTEL_30 } from '@/lib/plantel-app'
import { categorias, posiciones } from '@/lib/torneo-data'
import type { JugadorPlantel } from '@/lib/demo-store'

// Planteles de demostración para los 100 equipos. Es el mismo criterio que usa la app
// (torneo-imperial-app/src/lib/plantilla-mock.ts), así que ambas muestran los mismos jugadores:
//  - los equipos de +30 con jugadores cargados en la app los conservan (PLANTEL_30 / PLANTEL_APP),
//  - el resto se completa hasta TAMANO con nombres inventados y determinísticos (el mismo equipo siempre
//    genera los mismos nombres; se sortean de un flujo aparte para que app y sitio coincidan),
//  - los DNI son inventados y no vienen de la app.
const TAMANO = 16

const NOMBRES = ['Juan', 'Martín', 'Lucas', 'Matías', 'Nicolás', 'Facundo', 'Franco', 'Ezequiel', 'Gonzalo', 'Diego', 'Sebastián', 'Maximiliano', 'Agustín', 'Santiago', 'Federico', 'Leandro', 'Cristian', 'Pablo', 'Marcos', 'Ramiro', 'Julián', 'Emiliano', 'Rodrigo', 'Hernán', 'Gastón', 'Joaquín', 'Mauro', 'Damián', 'Walter', 'Claudio', 'Ariel', 'Esteban', 'Bruno', 'Iván', 'Axel', 'Tomás']
const APELLIDOS = ['Gómez', 'Rodríguez', 'Fernández', 'López', 'Díaz', 'Martínez', 'Pérez', 'García', 'Sánchez', 'Romero', 'Sosa', 'Álvarez', 'Torres', 'Ruiz', 'Ramírez', 'Flores', 'Acosta', 'Benítez', 'Medina', 'Herrera', 'Suárez', 'Aguirre', 'Giménez', 'Gutiérrez', 'Peralta', 'Molina', 'Castro', 'Ortiz', 'Silva', 'Rojas', 'Núñez', 'Luna', 'Juárez', 'Cabrera', 'Ríos', 'Morales', 'Domínguez', 'Vega', 'Ponce', 'Funes']
// Un plantel típico: 2 arqueros, 5 defensores, 5 mediocampistas y 4 delanteros.
const POSICIONES = ['Arquero', 'Arquero', 'Defensor', 'Defensor', 'Defensor', 'Defensor', 'Defensor', 'Mediocampista', 'Mediocampista', 'Mediocampista', 'Mediocampista', 'Mediocampista', 'Delantero', 'Delantero', 'Delantero', 'Delantero']

function semilla(texto: string) {
  let h = 2166136261
  for (let i = 0; i < texto.length; i++) { h ^= texto.charCodeAt(i); h = Math.imul(h, 16777619) }
  return h >>> 0
}
function azar(seed: number) {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const dniFormato = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
const estadoDe = (rnd: () => number): JugadorPlantel['estadoDoc'] => { const r = rnd(); return r < 0.7 ? 'Aprobado' : r < 0.9 ? 'Pendiente' : 'Observado' }

function generar(): JugadorPlantel[] {
  const sal: JugadorPlantel[] = []
  const equipos = Array.from(new Set(categorias.flatMap((c) => posiciones[c].map((e) => e.nombre))))
  for (const equipo of equipos) {
    const slug = equipo.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const rndDni = azar(semilla(`${equipo}|dni`)), rndDoc = azar(semilla(`${equipo}|doc`)), rndNom = azar(semilla(`${equipo}|nombres`))
    const dnis = new Set<string>()
    const nuevoDni = () => { let d = ''; do { d = dniFormato(24000000 + Math.floor(rndDni() * 18000000)) } while (dnis.has(d)); dnis.add(d); return d }

    // 1) los que ya existen: jugadores completos de la app (con DNI y estado) o, si no, solo los de +30 de la app
    const completos = PLANTEL_APP.filter((j) => j.equipo === equipo)
    const base: JugadorPlantel[] = completos.length
      ? completos.map((j) => ({ ...j }))
      : (PLANTEL_30[equipo] ?? []).map((j, i) => ({ id: `a-${slug}-${i + 1}`, equipo, nombre: j.nombre, dni: nuevoDni(), posicion: j.posicion, estadoDoc: estadoDe(rndDoc) }))
    base.forEach((j) => dnis.add(j.dni))
    sal.push(...base)

    // 2) se completa hasta TAMANO con nombres inventados
    const nombres = new Set((PLANTEL_30[equipo] ?? base).map((j) => j.nombre))
    base.forEach((j) => nombres.add(j.nombre))
    for (let i = base.length; i < TAMANO; i++) {
      let nombre = ''
      do { nombre = `${NOMBRES[Math.floor(rndNom() * NOMBRES.length)]} ${APELLIDOS[Math.floor(rndNom() * APELLIDOS.length)]}` } while (nombres.has(nombre))
      nombres.add(nombre)
      sal.push({ id: `m-${slug}-${i + 1}`, equipo, nombre, dni: nuevoDni(), posicion: POSICIONES[i % POSICIONES.length], estadoDoc: estadoDe(rndDoc) })
    }
  }
  return sal
}

export const PLANTEL_DEMO: JugadorPlantel[] = generar()
