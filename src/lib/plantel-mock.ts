import { PLANTEL_APP } from '@/lib/datos-app'
import { categorias, posiciones } from '@/lib/torneo-data'
import type { JugadorPlantel } from '@/lib/demo-store'

// Planteles de demostración para todos los equipos de todas las categorías (nombres y DNI inventados, sin fotos).
// Es determinístico: el mismo equipo siempre genera los mismos jugadores. Los equipos con jugadores reales
// cargados en datos-app.ts los conservan y solo se completan hasta TAMANO.
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

function generar(): JugadorPlantel[] {
  const sal: JugadorPlantel[] = []
  const equipos = Array.from(new Set(categorias.flatMap((c) => posiciones[c].map((e) => e.nombre))))
  for (const equipo of equipos) {
    const existentes = PLANTEL_APP.filter((j) => j.equipo === equipo)
    if (existentes.length >= TAMANO) continue
    const rnd = azar(semilla(equipo))
    const nombres = new Set(existentes.map((j) => j.nombre))
    const dnis = new Set(existentes.map((j) => j.dni))
    const slug = equipo.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    for (let i = existentes.length; i < TAMANO; i++) {
      let nombre = ''
      do { nombre = `${NOMBRES[Math.floor(rnd() * NOMBRES.length)]} ${APELLIDOS[Math.floor(rnd() * APELLIDOS.length)]}` } while (nombres.has(nombre))
      nombres.add(nombre)
      let dni = ''
      do { dni = dniFormato(24000000 + Math.floor(rnd() * 18000000)) } while (dnis.has(dni))
      dnis.add(dni)
      const r = rnd()
      sal.push({ id: `m-${slug}-${i + 1}`, equipo, nombre, dni, posicion: POSICIONES[i % POSICIONES.length], estadoDoc: r < 0.7 ? 'Aprobado' : r < 0.9 ? 'Pendiente' : 'Observado' })
    }
  }
  return sal
}

// Ankara +30 (el equipo del delegado de prueba) viene con 26 jugadores, por encima del tope de 25: se deja en 24
// para que se pueda probar agregar y editar jugadores.
const PLANTEL_BASE = [...PLANTEL_APP.filter((j) => j.equipo !== 'Ankara +30'), ...PLANTEL_APP.filter((j) => j.equipo === 'Ankara +30').slice(0, 24)]

export const PLANTEL_DEMO: JugadorPlantel[] = [...PLANTEL_BASE, ...generar()]
