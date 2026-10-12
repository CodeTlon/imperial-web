// Datos mock de las categorías que todavía no tienen datos reales cargados
// (Libre, +35, +40, +45, Femenino) y fixture completo de todas, incluida +30.
// Todo determinista (hash de ids, sin Math.random) para que las capturas de la
// demo siempre muestren lo mismo. Solo se importan TIPOS de mobile-data para
// evitar un ciclo de módulos en runtime.
// Misma lógica que la app (torneo-imperial-app/src/lib/categorias-mock.ts) para
// que sitio y app muestren exactamente los mismos datos de demo.
export type Equipo = {
  id: string
  nombre: string
  categoria: string
  zona: 'A' | 'B'
  pj: number; g: number; e: number; p: number; gf: number; gc: number; pts: number
  jugadores: never[]
}

export type Categoria = 'Libre' | '+30' | '+35' | '+40' | '+45' | 'Femenino'
export const CATEGORIAS: Categoria[] = ['Libre', '+30', '+35', '+40', '+45', 'Femenino']

export type PartidoFixture = {
  local: string
  visitante: string
  zona: 'A' | 'B'
  hora: string
  cancha: string
  golesLocal?: number
  golesVisitante?: number
}

export type FechaFixture = {
  numero: number
  fechaTexto: string
  jugada: boolean
  partidos: PartidoFixture[]
}

export type GoleadorCategoria = { jugador: string; equipoId: string; equipo: string; goles: number }

const SUFIJO: Record<Categoria, string> = { Libre: 'Libre', '+30': '+30', '+35': '+35', '+40': '+40', '+45': '+45', Femenino: 'Fem.' }

const NOMBRES: Record<Exclude<Categoria, '+30'>, { A: string[]; B: string[] }> = {
  Libre: {
    A: ['Deportivo Norte', 'Los Pibes', 'Racing Ballesteros', 'Juventud Unida', 'Atlético Sur', 'Defensores del Centro', 'La Previa', 'Barrio Alberdi'],
    B: ['Real Cañada', 'Independiente Libre', 'Sporting Villa', 'Los Halcones', 'Unión Pueblo', 'Estrella Roja', 'Club Palermo', 'Fénix FC'],
  },
  '+35': {
    A: ['Los Pumas', 'Veteranos del Sur', 'Gral. Paz Jrs', 'Cruz del Sur', 'Atlético Costa', 'Talleres Viejos', 'El Galpón', 'Las Palmas'],
    B: ['Sportivo Imperial', 'Peñarol Cba', 'La Legión', 'Los Ñoquis', 'Belgrano Vet.', 'Unión Obrera', 'Santa Rosa', 'El Mirador'],
  },
  '+40': {
    A: ['Los Cracks', 'Ferro Vet.', 'El Fortín', 'Amigos del 80', 'Club Los Andes', 'La Tertulia', 'Sparta', 'Matadero FC'],
    B: ['San Martín Vet.', 'Los Pichiciegos', 'Argentinos Jrs. Vet.', 'El Rancho', 'Cuyaya', 'Los Mellizos', 'Tiro Federal', 'La Pandilla'],
  },
  '+45': {
    A: ['Los Históricos', 'Glorias Locales', 'El Viejo Almacén', 'Rivadavia', 'Los Tanos', 'Peñarol Vet.', 'La Cofradía', 'Vélez Sur'],
    B: ['Los Gladiadores', 'Maracaná', 'Amigos del Domingo', 'El Boliche', 'Fortaleza', 'Los Pinos', 'San Lorenzo Vet.', 'Los Leones'],
  },
  Femenino: {
    A: ['Las Fieras', 'Las Guerreras', 'Amazonas FC', 'Las Leonas', 'Estrellas del Sur', 'Las Halcones'],
    B: ['Las Panteras', 'Furia Celeste', 'Las Tigresas', 'Reinas del Área', 'Las Gladiadoras', 'Las Pumas'],
  },
}

const slug = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

// Hash FNV-1a chico: estable entre corridas.
function hash(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

type Cruce = [string, string]

// Método del círculo: n equipos (par) → n-1 fechas, todos contra todos.
function roundRobin(ids: string[]): Cruce[][] {
  const lista = [...ids]
  const n = lista.length
  const fechas: Cruce[][] = []
  for (let r = 0; r < n - 1; r++) {
    const cruces: Cruce[] = []
    for (let i = 0; i < n / 2; i++) {
      const a = lista[i]
      const b = lista[n - 1 - i]
      cruces.push(r % 2 === 0 ? [a, b] : [b, a])
    }
    fechas.push(cruces)
    lista.splice(1, 0, lista.pop() as string)
  }
  return fechas
}

function resultado(local: string, visitante: string, fecha: number): [number, number] {
  const fuerza = (id: string) => hash(id) % 100
  const h = hash(`${local}|${visitante}|${fecha}`)
  const ventajaL = fuerza(local) > fuerza(visitante) ? 2 : 1
  const ventajaV = fuerza(visitante) > fuerza(local) ? 2 : 1
  return [h % (ventajaL + 3), (h >>> 7) % (ventajaV + 3)]
}

const HORAS = ['10:00', '11:30', '13:00', '14:30', '16:00', '17:30']

// Se juega todos los sábados. La próxima fecha de todas las categorías es el
// sábado 10/10/2026 (la demo "está parada" el martes 06/10); el resto de las
// fechas se calcula hacia atrás/adelante desde ahí, de a 7 días.
const PROXIMO_SABADO = Date.UTC(2026, 9, 10)

function fechaTexto(numero: number, jugadas: number): string {
  const d = new Date(PROXIMO_SABADO + 7 * (numero - (jugadas + 1)) * 86400000)
  const dd = String(d.getUTCDate()).padStart(2, '0')
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0')
  return `Sábado ${dd}/${mm}`
}

type Zonas = { A: { id: string; nombre: string }[]; B: { id: string; nombre: string }[] }

// Ida y vuelta: la segunda rueda repite los cruces con la localía invertida.
function rueda(ids: string[]): Cruce[][] {
  const ida = roundRobin(ids)
  return [...ida, ...ida.map((f) => f.map(([l, v]): Cruce => [v, l]))]
}

function armarFixture(zonas: Zonas, jugadas: number, canchas: number): FechaFixture[] {
  const nombrePorId = new Map<string, string>([...zonas.A, ...zonas.B].map((e) => [e.id, e.nombre]))
  const porZona = { A: rueda(zonas.A.map((e) => e.id)), B: rueda(zonas.B.map((e) => e.id)) }
  const totalFechas = porZona.A.length
  const fechas: FechaFixture[] = []
  for (let f = 0; f < totalFechas; f++) {
    const partidos: PartidoFixture[] = []
    ;(['A', 'B'] as const).forEach((zona) => {
      porZona[zona][f].forEach(([l, v]) => {
        const idx = partidos.length
        const p: PartidoFixture = {
          local: nombrePorId.get(l) as string,
          visitante: nombrePorId.get(v) as string,
          zona,
          hora: HORAS[Math.floor(idx / canchas) % HORAS.length],
          cancha: `Cancha ${(idx % canchas) + 1}`,
        }
        if (f < jugadas) {
          const [gl, gv] = resultado(l, v, f + 1)
          p.golesLocal = gl
          p.golesVisitante = gv
        }
        partidos.push(p)
      })
    })
    fechas.push({ numero: f + 1, fechaTexto: fechaTexto(f + 1, jugadas), jugada: f < jugadas, partidos })
  }
  return fechas
}

function tablaDesdeFixture(fechas: FechaFixture[], equipos: Equipo[]): Equipo[] {
  const stats = new Map(equipos.map((e) => [e.nombre, { pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, pts: 0 }]))
  for (const f of fechas) {
    for (const p of f.partidos) {
      if (p.golesLocal === undefined || p.golesVisitante === undefined) continue
      const l = stats.get(p.local)
      const v = stats.get(p.visitante)
      if (!l || !v) continue
      l.pj++; v.pj++
      l.gf += p.golesLocal; l.gc += p.golesVisitante
      v.gf += p.golesVisitante; v.gc += p.golesLocal
      if (p.golesLocal > p.golesVisitante) { l.g++; l.pts += 3; v.p++ }
      else if (p.golesLocal < p.golesVisitante) { v.g++; v.pts += 3; l.p++ }
      else { l.e++; v.e++; l.pts++; v.pts++ }
    }
  }
  return equipos.map((e) => ({ ...e, ...(stats.get(e.nombre) as object) }))
}

const APELLIDOS = ['Gómez', 'Pereyra', 'Acosta', 'Villegas', 'Figueroa', 'Sosa', 'Luna', 'Herrera', 'Molina', 'Cabral', 'Ríos', 'Benítez', 'Ledesma', 'Torres', 'Maldonado', 'Paz']
const NOMBRES_M = ['Matías', 'Lucas', 'Nicolás', 'Franco', 'Diego', 'Sebastián', 'Gonzalo', 'Ramiro', 'Cristian', 'Ezequiel']
const NOMBRES_F = ['Camila', 'Lucía', 'Florencia', 'Agustina', 'Micaela', 'Romina', 'Julieta', 'Daiana', 'Brenda', 'Milagros']

function goleadoresMock(categoria: Categoria, equipos: Equipo[]): GoleadorCategoria[] {
  const nombres = categoria === 'Femenino' ? NOMBRES_F : NOMBRES_M
  return Array.from({ length: 10 }, (_, i) => {
    const e = equipos[hash(`${categoria}-gol-${i}`) % equipos.length]
    return {
      jugador: `${APELLIDOS[hash(`${categoria}-ap-${i}`) % APELLIDOS.length]} ${nombres[hash(`${categoria}-n-${i}`) % nombres.length]}`,
      equipoId: e.id,
      equipo: e.nombre,
      goles: 12 - i + (hash(`${categoria}-g-${i}`) % 2),
    }
  }).sort((a, b) => b.goles - a.goles)
}

function equiposMock(categoria: Exclude<Categoria, '+30'>): Equipo[] {
  const sufijo = SUFIJO[categoria]
  return (['A', 'B'] as const).flatMap((zona) =>
    NOMBRES[categoria][zona].map<Equipo>((n) => ({
      id: `${slug(n)}-${slug(sufijo)}`,
      nombre: `${n} ${sufijo}`,
      categoria,
      zona,
      pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, pts: 0,
      jugadores: [],
    }))
  )
}

const CANCHAS: Record<Categoria, number> = { Libre: 4, '+30': 3, '+35': 4, '+40': 3, '+45': 3, Femenino: 2 }
// Fechas ya jugadas por categoría (la próxima es la siguiente, sábado 10/10).
// +30 tiene 15 porque su tabla real ya va por la fecha 15/16.
const FECHAS_JUGADAS: Record<Categoria, number> = { Libre: 8, '+30': 15, '+35': 8, '+40': 8, '+45': 8, Femenino: 6 }

export type DatosCategoria = {
  equipos: Equipo[]
  fixture: FechaFixture[]
  goleadores?: GoleadorCategoria[]
}

export function datosMock(): Record<Exclude<Categoria, '+30'>, DatosCategoria & { goleadores: GoleadorCategoria[] }> {
  const salida = {} as Record<Exclude<Categoria, '+30'>, DatosCategoria & { goleadores: GoleadorCategoria[] }>
  for (const cat of CATEGORIAS) {
    if (cat === '+30') continue
    const base = equiposMock(cat)
    const zonas: Zonas = {
      A: base.filter((e) => e.zona === 'A').map((e) => ({ id: e.id, nombre: e.nombre })),
      B: base.filter((e) => e.zona === 'B').map((e) => ({ id: e.id, nombre: e.nombre })),
    }
    const fixture = armarFixture(zonas, FECHAS_JUGADAS[cat], CANCHAS[cat])
    const equipos = tablaDesdeFixture(fixture, base)
    salida[cat] = { equipos, fixture, goleadores: goleadoresMock(cat, equipos) }
  }
  return salida
}

// Fixture de +30: usa los equipos reales (12 por zona, ida y vuelta = 22 fechas)
// y respeta los partidos que ya están en la demo: la próxima fecha (sábado
// 10/10) y los resultados de la última jugada. Esas dos fechas se completan con
// cruces extra para que haya 12 partidos por jornada.
export function fixtureMas30(
  equipos: Pick<Equipo, 'nombre' | 'zona'>[],
  proxima: { local: string; visitante: string; hora: string }[],
  resultados: { local: string; golesLocal: number; visitante: string; golesVisitante: number }[]
): FechaFixture[] {
  const jugadas = FECHAS_JUGADAS['+30']
  const zonaDe = new Map(equipos.map((e) => [e.nombre, e.zona]))
  const zonas: Zonas = {
    A: equipos.filter((e) => e.zona === 'A').map((e) => ({ id: e.nombre, nombre: e.nombre })),
    B: equipos.filter((e) => e.zona === 'B').map((e) => ({ id: e.nombre, nombre: e.nombre })),
  }
  const fechas = armarFixture(zonas, jugadas, CANCHAS['+30'])

  const completar = (fijos: Cruce[], seed: number): Cruce[] => {
    const usados = new Set(fijos.flat())
    const libres = equipos.map((e) => e.nombre).filter((n) => !usados.has(n))
    const rot = seed % Math.max(libres.length, 1)
    const orden = [...libres.slice(rot), ...libres.slice(0, rot)]
    const extra: Cruce[] = []
    for (let i = 0; i + 1 < orden.length; i += 2) extra.push([orden[i], orden[i + 1]])
    return [...fijos, ...extra]
  }
  const reales = new Map<string, [number, number]>(resultados.map((r) => [`${r.local}|${r.visitante}`, [r.golesLocal, r.golesVisitante]]))
  const reemplazar = (numero: number, cruces: Cruce[], jugada: boolean): void => {
    fechas[numero - 1].partidos = cruces.map(([l, v], idx) => {
      const p: PartidoFixture = {
        local: l,
        visitante: v,
        zona: (zonaDe.get(l) ?? 'A') as 'A' | 'B',
        hora: HORAS[Math.floor(idx / CANCHAS['+30']) % HORAS.length],
        cancha: `Cancha ${(idx % CANCHAS['+30']) + 1}`,
      }
      if (jugada) {
        const [gl, gv] = reales.get(`${l}|${v}`) ?? resultado(l, v, numero)
        p.golesLocal = gl
        p.golesVisitante = gv
      }
      return p
    })
  }
  reemplazar(jugadas, completar(resultados.map((r) => [r.local, r.visitante] as Cruce), 3), true)
  reemplazar(jugadas + 1, completar(proxima.map((p) => [p.local, p.visitante] as Cruce), 5), false)
  // Las horas de los partidos reales de la próxima fecha se respetan.
  proxima.forEach((p, i) => { fechas[jugadas].partidos[i].hora = p.hora.replace(/^\S+\s/, '') })
  return fechas
}
