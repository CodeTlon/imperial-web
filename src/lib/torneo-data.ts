// ponytail: data hardcodeada para la demo (mock, no persiste) — inspirada en
// la estructura real del sitio actual (SportsPress: posiciones/goleadores/
// equipos por categoría). Nombres de equipos inventados, cambiar por los
// reales del torneo cuando estén disponibles.

// Orden: +30 primero (única categoría con datos 100% reales —
// escudos, goleadores, sancionados), después +35/+40/+45 ascendente, Libre y
// Femenino al final (siguen con datos de demostración).
import { SANCIONES_MOCK } from '@/lib/sanciones-mock'
import { datosMock, fixtureMas30, type FechaFixture } from './categorias-mock'

export const categorias = ['+30', '+35', '+40', '+45', 'Libre', 'Femenino'] as const

// +30 tiene tabla, goleadores y sanciones reales (torneoimperial.com.ar/mas-30). El resto de las categorías
// son mock (ver categorias-mock.ts) pero se muestran igual en los selectores, como en la app.
export const categoriasConDatos = categorias
export type Categoria = (typeof categorias)[number]

type Equipo = {
  nombre: string; pj: number; pg: number; pe: number; pp: number; gf: number; gc: number
  zona?: string        // solo +30 juega en 2 zonas (A/B) — el resto es tabla única
  escudo?: string       // path real (public/images/escudos/) — sin esto cae al círculo con iniciales
  ap?: number           // "adición de puntos" — bonus administrativo, real del sitio (torneoimperial.com.ar/mas-30)
  qp?: number           // "quita de puntos" pendiente de aplicar (Art. 26 del reglamento — ver /reglamento)
}

const tabla = (equipos: Omit<Equipo, 'pj'>[]): Equipo[] =>
  equipos
    .map((e) => ({ ...e, pj: e.pg + e.pe + e.pp }))
    .sort((a, b) => (b.pg * 3 + b.pe) - (a.pg * 3 + a.pe) || (b.gf - b.gc) - (a.gf - a.gc))

const posicionesBase: Record<Categoria, Equipo[]> = {
  'Libre': tabla([
    { nombre: 'Atlético Guiñazú',     pg: 9, pe: 2, pp: 1, gf: 28, gc: 12 },
    { nombre: 'Deportivo Argüello',   pg: 8, pe: 3, pp: 1, gf: 24, gc: 14 },
    { nombre: 'Juniors del Norte',    pg: 7, pe: 2, pp: 3, gf: 20, gc: 16 },
    { nombre: 'Sportivo Colón',       pg: 5, pe: 4, pp: 3, gf: 18, gc: 17 },
    { nombre: 'Racing Guiñazú',       pg: 4, pe: 3, pp: 5, gf: 15, gc: 20 },
    { nombre: 'Unión Villa Retiro',   pg: 2, pe: 2, pp: 8, gf: 10, gc: 26 },
  ]),
  // Datos reales relevados de torneoimperial.com.ar/mas-30 (2 zonas de 12).
  '+30': [
    ...tabla([
      { nombre: 'Atl.Gral.Bustos +30', pg: 13, pe: 2, pp: 1,  gf: 29, gc: 10, zona: 'A', escudo: '/images/escudos/atl-gral-bustos.png' },
      { nombre: 'Smata +30',           pg: 11, pe: 2, pp: 2,  gf: 28, gc: 10, zona: 'A', escudo: '/images/escudos/smata.jpeg' },
      { nombre: 'El Tala +30',         pg: 10, pe: 4, pp: 2,  gf: 45, gc: 12, zona: 'A', escudo: '/images/escudos/el-tala.png' },
      { nombre: 'La Sede +30',         pg: 9,  pe: 2, pp: 5,  gf: 28, gc: 25, zona: 'A', escudo: '/images/escudos/la-sede.png' },
      { nombre: 'Chape +30',           pg: 8,  pe: 3, pp: 5,  gf: 28, gc: 25, zona: 'A', escudo: '/images/escudos/chape.png' },
      { nombre: 'Triangulo +30',       pg: 8,  pe: 1, pp: 7,  gf: 32, gc: 24, zona: 'A', escudo: '/images/escudos/triangulo.png' },
      { nombre: 'Arias Jrs +30',       pg: 4,  pe: 5, pp: 6,  gf: 21, gc: 27, zona: 'A', escudo: '/images/escudos/arias-jrs.jpeg' },
      { nombre: 'Monaco FC +30',       pg: 4,  pe: 5, pp: 6,  gf: 19, gc: 28, zona: 'A', escudo: '/images/escudos/monaco-fc.png' },
      { nombre: 'Labanda FC +30',      pg: 3,  pe: 5, pp: 8,  gf: 14, gc: 20, zona: 'A', escudo: '/images/escudos/labanda-fc.png', ap: 2 },
      { nombre: 'Ankara +30',          pg: 2,  pe: 5, pp: 9,  gf: 21, gc: 32, zona: 'A', escudo: '/images/escudos/ankara.jpeg' },
      { nombre: 'Juan B. Justo +30',   pg: 2,  pe: 5, pp: 9,  gf: 14, gc: 32, zona: 'A', escudo: '/images/escudos/juan-b-justo.png', qp: 3 },
      { nombre: 'El Banco +30',        pg: 0,  pe: 3, pp: 12, gf: 12, gc: 38, zona: 'A', escudo: '/images/escudos/el-banco.jpeg' },
    ]),
    ...tabla([
      { nombre: 'Alianza +30',         pg: 10, pe: 2, pp: 3,  gf: 33, gc: 18, zona: 'B', escudo: '/images/escudos/alianza.png', ap: 3 },
      { nombre: 'Newbery +30',         pg: 9,  pe: 2, pp: 4,  gf: 33, gc: 25, zona: 'B', escudo: '/images/escudos/newbery.png' },
      { nombre: 'Ospaca +30',          pg: 9,  pe: 1, pp: 6,  gf: 34, gc: 19, zona: 'B', escudo: '/images/escudos/ospaca.jpeg' },
      { nombre: 'Borussia +30',        pg: 8,  pe: 4, pp: 4,  gf: 26, gc: 19, zona: 'B', escudo: '/images/escudos/borussia.jpeg' },
      { nombre: 'Celtic +30',          pg: 6,  pe: 7, pp: 3,  gf: 26, gc: 22, zona: 'B', escudo: '/images/escudos/celtic.png' },
      { nombre: 'LBND +30',            pg: 8,  pe: 1, pp: 6,  gf: 24, gc: 27, zona: 'B', escudo: '/images/escudos/lbnd.png' },
      { nombre: 'Azzurra +30',         pg: 7,  pe: 2, pp: 7,  gf: 23, gc: 26, zona: 'B', escudo: '/images/escudos/azzurra.png' },
      { nombre: 'Caff +30',            pg: 5,  pe: 4, pp: 6,  gf: 21, gc: 22, zona: 'B', escudo: '/images/escudos/caff.png' },
      { nombre: 'Aguilas +30',         pg: 6,  pe: 0, pp: 9,  gf: 31, gc: 32, zona: 'B', escudo: '/images/escudos/aguilas.png' },
      { nombre: 'Santos +30',          pg: 5,  pe: 2, pp: 8,  gf: 24, gc: 34, zona: 'B', escudo: '/images/escudos/santos.png' },
      { nombre: 'Las Torres +30',      pg: 3,  pe: 4, pp: 8,  gf: 16, gc: 26, zona: 'B', escudo: '/images/escudos/las-torres.jpeg' },
      { nombre: 'AS Monaco +30',       pg: 0,  pe: 1, pp: 14, gf: 3,  gc: 32, zona: 'B', escudo: '/images/escudos/as-monaco.png' },
    ]),
  ],
  '+35': tabla([
    { nombre: 'El Tala +35',          pg: 9, pe: 1, pp: 2, gf: 25, gc: 13 },
    { nombre: 'Smata +35',            pg: 7, pe: 4, pp: 1, gf: 21, gc: 12 },
    { nombre: 'Colorado FC',          pg: 6, pe: 3, pp: 3, gf: 18, gc: 15 },
    { nombre: 'Nacional +35',         pg: 5, pe: 3, pp: 4, gf: 16, gc: 16 },
    { nombre: 'Villa Belgrano',       pg: 3, pe: 4, pp: 5, gf: 13, gc: 19 },
    { nombre: 'Alta Córdoba FC',      pg: 1, pe: 3, pp: 8, gf: 9,  gc: 27 },
  ]),
  '+40': tabla([
    { nombre: 'Deportivo San Martín', pg: 8, pe: 4, pp: 0, gf: 20, gc: 8 },
    { nombre: 'El Pasaje +40',        pg: 7, pe: 2, pp: 3, gf: 18, gc: 14 },
    { nombre: 'Nacional +40',         pg: 6, pe: 3, pp: 3, gf: 16, gc: 13 },
    { nombre: 'Colorado +40',         pg: 5, pe: 4, pp: 3, gf: 15, gc: 15 },
    { nombre: 'Güemes +40',           pg: 3, pe: 3, pp: 6, gf: 11, gc: 19 },
    { nombre: 'Juniors +40',          pg: 2, pe: 2, pp: 8, gf: 9,  gc: 22 },
  ]),
  '+45': tabla([
    { nombre: 'Los Fundadores',       pg: 8, pe: 3, pp: 1, gf: 19, gc: 9 },
    { nombre: 'Veteranos del Norte',  pg: 7, pe: 3, pp: 2, gf: 17, gc: 11 },
    { nombre: 'Atlético Yofre +45',   pg: 5, pe: 5, pp: 2, gf: 14, gc: 12 },
    { nombre: 'Sportivo Argüello',    pg: 4, pe: 4, pp: 4, gf: 13, gc: 15 },
    { nombre: 'Real Guiñazú',         pg: 3, pe: 2, pp: 7, gf: 10, gc: 18 },
    { nombre: 'Unión +45',            pg: 1, pe: 3, pp: 8, gf: 7,  gc: 20 },
  ]),
  'Femenino': tabla([
    { nombre: 'Las Imperiales FEM',   pg: 10, pe: 1, pp: 1, gf: 32, gc: 10 },
    { nombre: 'Guerreras del Sur',    pg: 8,  pe: 2, pp: 2, gf: 26, gc: 14 },
    { nombre: 'Atlético Femenino CBA', pg: 5, pe: 3, pp: 4, gf: 18, gc: 17 },
    { nombre: 'Rojas FC Femenino',    pg: 4,  pe: 2, pp: 6, gf: 15, gc: 21 },
    { nombre: 'Deportivo Argüello FEM', pg: 2, pe: 3, pp: 7, gf: 11, gc: 24 },
  ]),
}

const MOCK = datosMock()
// Los equipos que no son de +30 no tienen escudo oficial: llevan uno generado (public/images/escudos/<id>.png), el mismo que usa la app.
const aEquipoSitio = (e: { id: string; nombre: string; zona: 'A' | 'B'; g: number; e: number; p: number; gf: number; gc: number }): Equipo => ({
  nombre: e.nombre, zona: e.zona, pj: e.g + e.e + e.p, pg: e.g, pe: e.e, pp: e.p, gf: e.gf, gc: e.gc, escudo: `/images/escudos/${e.id}.png`,
})

export const posiciones: Record<Categoria, Equipo[]> = {
  ...posicionesBase,
  Libre: tabla(MOCK.Libre.equipos.map(aEquipoSitio)),
  '+35': tabla(MOCK['+35'].equipos.map(aEquipoSitio)),
  '+40': tabla(MOCK['+40'].equipos.map(aEquipoSitio)),
  '+45': tabla(MOCK['+45'].equipos.map(aEquipoSitio)),
  Femenino: tabla(MOCK.Femenino.equipos.map(aEquipoSitio)),
}

const goleadoresBase: Record<Categoria, { jugador: string; equipo: string; goles: number }[]> = {
  'Libre':   [ { jugador: 'M. Ferreyra', equipo: 'Atlético Guiñazú', goles: 14 }, { jugador: 'J. Correa', equipo: 'Deportivo Argüello', goles: 11 }, { jugador: 'N. Ríos', equipo: 'Juniors del Norte', goles: 9 } ],
  '+30':     [
    { jugador: 'Emanuel Reartes',  equipo: 'El Tala +30',          goles: 17 },
    { jugador: 'Luciano Abel Lopez', equipo: 'Chape +30',          goles: 15 },
    { jugador: 'Salas Ariel',      equipo: 'Aguilas +30',          goles: 13 },
    { jugador: 'Robles Tomas',     equipo: 'Triangulo +30',        goles: 12 },
    { jugador: 'Palacios Diego Sebastian', equipo: 'La Sede +30',  goles: 11 },
  ],
  '+35':     [ { jugador: 'S. Paredes', equipo: 'El Tala +35', goles: 13 }, { jugador: 'R. Aguirre', equipo: 'Smata +35', goles: 9 }, { jugador: 'H. Luna', equipo: 'Colorado FC', goles: 8 } ],
  '+40':     [ { jugador: 'D. Romero', equipo: 'Deportivo San Martín', goles: 9 }, { jugador: 'C. Ibáñez', equipo: 'El Pasaje +40', goles: 7 }, { jugador: 'A. Torres', equipo: 'Nacional +40', goles: 6 } ],
  '+45':     [ { jugador: 'O. Bustos', equipo: 'Los Fundadores', goles: 8 }, { jugador: 'E. Díaz', equipo: 'Veteranos del Norte', goles: 6 }, { jugador: 'G. Farías', equipo: 'Atlético Yofre +45', goles: 5 } ],
  'Femenino': [ { jugador: 'M. Torres', equipo: 'Las Imperiales FEM', goles: 16 }, { jugador: 'C. Gómez', equipo: 'Guerreras del Sur', goles: 12 }, { jugador: 'V. Acosta', equipo: 'Atlético Femenino CBA', goles: 8 } ],
}

export const goleadores: Record<Categoria, { jugador: string; equipo: string; goles: number }[]> = {
  ...goleadoresBase,
  Libre: MOCK.Libre.goleadores,
  '+35': MOCK['+35'].goleadores,
  '+40': MOCK['+40'].goleadores,
  '+45': MOCK['+45'].goleadores,
  Femenino: MOCK.Femenino.goleadores,
}

// Jugadores suspendidos — real de torneoimperial.com.ar/mas-30. "Por cumplir" según
// el Capítulo 6 del reglamento (ver /reglamento); vacío = sin sancionados en esa categoría.
const sancionesBase: Record<Categoria, { jugador: string; equipo: string; sancion: number; porCumplir: number; motivo: string }[]> = {
  'Libre': [],
  '+30': [
    { jugador: 'Cristian Agustín Salussolia', equipo: 'Ankara +30',       sancion: 8,  porCumplir: 4, motivo: 'Art 39 - Art 34 A' },
    { jugador: 'Maximiliano Sánchez',         equipo: 'Las Torres +30',   sancion: 1,  porCumplir: 1, motivo: 'Art 36' },
    { jugador: 'Brian Luna',                  equipo: 'Newbery +30',      sancion: 2,  porCumplir: 2, motivo: 'Art 39' },
    { jugador: 'Gigena Gomez Nahuel',         equipo: 'Triangulo +30',    sancion: 2,  porCumplir: 1, motivo: 'Art 39' },
    { jugador: 'Yamil Segura',                equipo: 'Aguilas +30',      sancion: 1,  porCumplir: 1, motivo: 'Art 36' },
    { jugador: 'Franco Espinoza',             equipo: 'Smata +30',        sancion: 3,  porCumplir: 3, motivo: 'Art 34 B' },
    { jugador: 'Jonathan Irazabal',           equipo: 'Smata +30',        sancion: 6,  porCumplir: 6, motivo: 'Art 34 A' },
    { jugador: 'Matias Ochoa',                equipo: 'Smata +30',        sancion: 10, porCumplir: 10, motivo: 'Art 42 D 1' },
    { jugador: 'Albornoz Jonatan Exequiel',   equipo: 'LBND +30',         sancion: 1,  porCumplir: 1, motivo: 'Art 37' },
    { jugador: 'Linossi Joel',                equipo: 'LBND +30',         sancion: 1,  porCumplir: 1, motivo: 'Art 37' },
    { jugador: 'Monje Lucas',                 equipo: 'Celtic +30',       sancion: 5,  porCumplir: 5, motivo: 'Art 39 C' },
    { jugador: 'Federico Villaroel',          equipo: 'Chape +30',        sancion: 5,  porCumplir: 4, motivo: 'Art 39 C' },
    { jugador: 'German Zapata',               equipo: 'Borussia +30',     sancion: 3,  porCumplir: 2, motivo: 'Art 39' },
    { jugador: 'Luciano Jeremías Romano',     equipo: 'Ankara +30',       sancion: 4,  porCumplir: 4, motivo: 'Art 39' },
  ],
  '+35': [],
  '+40': [],
  '+45': [],
  'Femenino': [],
}

// Las demás categorías salen de las sanciones de demostración (sanciones-mock.ts): solo las que todavía tienen fechas por cumplir.
export const sanciones: Record<Categoria, { jugador: string; equipo: string; sancion: number; porCumplir: number; motivo: string }[]> = Object.fromEntries(
  (Object.keys(sancionesBase) as Categoria[]).map((cat) => [
    cat,
    cat === '+30'
      ? sancionesBase[cat]
      : SANCIONES_MOCK.filter((s) => s.categoria === cat && s.porCumplir > 0 && s.estado !== 'Descargo aceptado')
          .map((s) => ({ jugador: s.jugador, equipo: s.equipo, sancion: s.fechasSuspension, porCumplir: s.porCumplir, motivo: (s.articulo ?? '').replace('Art. ', 'Art ') })),
  ])
) as Record<Categoria, { jugador: string; equipo: string; sancion: number; porCumplir: number; motivo: string }[]>

// Fixture indexado por jornada — inspirado en la navegación "elegí una fecha"
// de torneogolden.com.ar. Reemplaza a los antiguos `proximaFecha`/`ultimosResultados`:
// tanto /fixture como el chip del Hero derivan "próximo partido" y "últimos
// resultados" de acá, para tener una sola fuente de verdad.
export type Partido = {
  zona?: 'A' | 'B'
  local: string
  visitante: string
  hora: string
  cancha?: string
  golesLocal?: number
  golesVisitante?: number
}

export type Fecha = {
  numero: number
  fechaLabel: string
  partidos: Partido[]
}

// Fixture viejo (solo para referencia de los partidos reales de +30). La fuente vigente es `fixturePorCategoria`, de abajo.
export const fixtureViejo: Record<Categoria, Fecha[]> = {
  'Libre': [
    { numero: 1, fechaLabel: '01-08', partidos: [
      { local: 'Deportivo Argüello', visitante: 'Unión Villa Retiro', hora: '18:00 hs', cancha: 'Cancha 1', golesLocal: 3, golesVisitante: 1 },
      { local: 'Atlético Guiñazú', visitante: 'Sportivo Colón', hora: '19:30 hs', cancha: 'Cancha 2', golesLocal: 2, golesVisitante: 2 },
    ] },
    { numero: 2, fechaLabel: '08-08', partidos: [
      { local: 'Atlético Guiñazú', visitante: 'Racing Guiñazú', hora: '18:00 hs', cancha: 'Cancha 1' },
      { local: 'Deportivo Argüello', visitante: 'Sportivo Colón', hora: '19:30 hs', cancha: 'Cancha 2' },
    ] },
  ],
  '+30': [
    { numero: 1, fechaLabel: '01-08', partidos: [
      { local: 'Atl.Gral.Bustos +30', visitante: 'El Banco +30', hora: '10:00 hs', cancha: 'Cancha 1', golesLocal: 4, golesVisitante: 0 },
      { local: 'Smata +30', visitante: 'Ankara +30', hora: '10:00 hs', cancha: 'Cancha 2', golesLocal: 2, golesVisitante: 1 },
      { local: 'Alianza +30', visitante: 'Las Torres +30', hora: '11:30 hs', cancha: 'Cancha 1', golesLocal: 3, golesVisitante: 1 },
    ] },
    { numero: 2, fechaLabel: '08-08', partidos: [
      { local: 'El Tala +30', visitante: 'Chape +30', hora: '10:00 hs', cancha: 'Cancha 1', golesLocal: 3, golesVisitante: 2 },
      { local: 'Newbery +30', visitante: 'Ospaca +30', hora: '11:30 hs', cancha: 'Cancha 2', golesLocal: 1, golesVisitante: 1 },
    ] },
    { numero: 3, fechaLabel: '16-08', partidos: [
      { local: 'Atl.Gral.Bustos +30', visitante: 'Ankara +30', hora: '10:00 hs', cancha: 'Cancha 1' },
      { local: 'Alianza +30', visitante: 'Celtic +30', hora: '11:30 hs', cancha: 'Cancha 2' },
      { local: 'Triangulo +30', visitante: 'Monaco FC +30', hora: '13:00 hs', cancha: 'Cancha 1' },
    ] },
    { numero: 4, fechaLabel: '23-08', partidos: [
      { local: 'La Sede +30', visitante: 'Arias Jrs +30', hora: '10:00 hs', cancha: 'Cancha 1' },
      { local: 'Borussia +30', visitante: 'Azzurra +30', hora: '11:30 hs', cancha: 'Cancha 2' },
    ] },
  ],
  '+35': [
    { numero: 1, fechaLabel: '02-08', partidos: [
      { local: 'El Tala +35', visitante: 'Alta Córdoba FC', hora: '10:00 hs', cancha: 'Cancha 1', golesLocal: 4, golesVisitante: 1 },
      { local: 'Smata +35', visitante: 'Villa Belgrano', hora: '11:30 hs', cancha: 'Cancha 2', golesLocal: 2, golesVisitante: 0 },
    ] },
    { numero: 2, fechaLabel: '09-08', partidos: [
      { local: 'Colorado FC', visitante: 'Nacional +35', hora: '10:00 hs', cancha: 'Cancha 1' },
      { local: 'El Tala +35', visitante: 'Villa Belgrano', hora: '11:30 hs', cancha: 'Cancha 2' },
    ] },
  ],
  '+40': [
    { numero: 1, fechaLabel: '02-08', partidos: [
      { local: 'Deportivo San Martín', visitante: 'Juniors +40', hora: '17:00 hs', cancha: 'Cancha 1', golesLocal: 2, golesVisitante: 0 },
      { local: 'Nacional +40', visitante: 'Colorado +40', hora: '18:30 hs', cancha: 'Cancha 2', golesLocal: 1, golesVisitante: 1 },
    ] },
    { numero: 2, fechaLabel: '09-08', partidos: [
      { local: 'Güemes +40', visitante: 'El Pasaje +40', hora: '17:00 hs', cancha: 'Cancha 1' },
      { local: 'Deportivo San Martín', visitante: 'Colorado +40', hora: '18:30 hs', cancha: 'Cancha 2' },
    ] },
  ],
  '+45': [
    { numero: 1, fechaLabel: '02-08', partidos: [
      { local: 'Los Fundadores', visitante: 'Unión +45', hora: '17:00 hs', cancha: 'Cancha 1', golesLocal: 3, golesVisitante: 1 },
      { local: 'Veteranos del Norte', visitante: 'Real Guiñazú', hora: '18:30 hs', cancha: 'Cancha 2', golesLocal: 2, golesVisitante: 2 },
    ] },
    { numero: 2, fechaLabel: '09-08', partidos: [
      { local: 'Atlético Yofre +45', visitante: 'Sportivo Argüello', hora: '17:00 hs', cancha: 'Cancha 1' },
      { local: 'Los Fundadores', visitante: 'Real Guiñazú', hora: '18:30 hs', cancha: 'Cancha 2' },
    ] },
  ],
  'Femenino': [
    { numero: 1, fechaLabel: '01-08', partidos: [
      { local: 'Las Imperiales FEM', visitante: 'Deportivo Argüello FEM', hora: '16:00 hs', cancha: 'Cancha 1', golesLocal: 5, golesVisitante: 0 },
      { local: 'Guerreras del Sur', visitante: 'Rojas FC Femenino', hora: '17:30 hs', cancha: 'Cancha 2', golesLocal: 3, golesVisitante: 2 },
    ] },
    { numero: 2, fechaLabel: '08-08', partidos: [
      { local: 'Las Imperiales FEM', visitante: 'Rojas FC Femenino', hora: '16:00 hs', cancha: 'Cancha 1' },
      { local: 'Guerreras del Sur', visitante: 'Atlético Femenino CBA', hora: '17:30 hs', cancha: 'Cancha 2' },
    ] },
  ],
}

// Se juega todos los sábados; la próxima fecha de cada categoría es el sábado
// 10/10/2026. Misma generación que la app (ida y vuelta, resultados fijos).
const aFecha = (f: FechaFixture): Fecha => ({
  numero: f.numero,
  fechaLabel: f.fechaTexto.replace(/^\S+\s+/, '').replace('/', '-'),
  partidos: f.partidos.map((p) => ({
    zona: p.zona,
    local: p.local,
    visitante: p.visitante,
    hora: `${p.hora} hs`,
    cancha: p.cancha,
    ...(p.golesLocal !== undefined ? { golesLocal: p.golesLocal, golesVisitante: p.golesVisitante } : {}),
  })),
})

const fixtureMas30Sitio = fixtureMas30(
  posicionesBase['+30'].map((e) => ({ nombre: e.nombre, zona: (e.zona ?? 'A') as 'A' | 'B' })),
  [
    { local: 'Atl.Gral.Bustos +30', visitante: 'Ankara +30', hora: 'Sáb 10:00' },
    { local: 'Alianza +30', visitante: 'Celtic +30', hora: 'Sáb 11:30' },
    { local: 'Triangulo +30', visitante: 'Monaco FC +30', hora: 'Sáb 13:00' },
  ],
  [
    { local: 'Atl.Gral.Bustos +30', golesLocal: 4, visitante: 'El Banco +30', golesVisitante: 0 },
    { local: 'Smata +30', golesLocal: 2, visitante: 'Ankara +30', golesVisitante: 1 },
    { local: 'Alianza +30', golesLocal: 3, visitante: 'Las Torres +30', golesVisitante: 1 },
    { local: 'El Tala +30', golesLocal: 3, visitante: 'Chape +30', golesVisitante: 2 },
    { local: 'Newbery +30', golesLocal: 1, visitante: 'Ospaca +30', golesVisitante: 1 },
  ]
)

export const fixturePorCategoria: Record<Categoria, Fecha[]> = {
  Libre: MOCK.Libre.fixture.map(aFecha),
  '+30': fixtureMas30Sitio.map(aFecha),
  '+35': MOCK['+35'].fixture.map(aFecha),
  '+40': MOCK['+40'].fixture.map(aFecha),
  '+45': MOCK['+45'].fixture.map(aFecha),
  Femenino: MOCK.Femenino.fixture.map(aFecha),
}

// Escudo por nombre de equipo, para pintar los cruces del fixture (solo +30
// tiene escudos reales cargados en `posiciones`).
export const escudoPorEquipo: Partial<Record<string, string>> = Object.fromEntries(
  (Object.values(posiciones).flat() as { nombre: string; escudo?: string }[])
    .filter((e) => e.escudo)
    .map((e) => [e.nombre, e.escudo as string])
)

// "Próxima fecha" de una categoría: la primera jornada que todavía no tiene
// resultados cargados (mismo criterio implícito que usaba el viejo proximaFecha).
export const proximaFechaDe = (cat: Categoria): Fecha =>
  fixturePorCategoria[cat].find((f) => f.partidos.some((p) => p.golesLocal === undefined)) ??
  fixturePorCategoria[cat][fixturePorCategoria[cat].length - 1]
