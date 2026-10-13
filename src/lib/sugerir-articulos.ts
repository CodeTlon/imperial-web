import reglamento from '@/lib/reglamento.json'

// Sugerencia local (sin APIs externas) de artículos del reglamento a partir del informe de expulsión.
// Los códigos y descripciones salen de reglamento.json (articulosSancion); acá solo se mapean palabras clave.

export type ArticuloReglamento = { codigo: string; descripcion: string; tipo: string }
export const ARTICULOS: ArticuloReglamento[] = (reglamento as { articulosSancion: ArticuloReglamento[] }).articulosSancion

export const normalizarTexto = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

// Raíces (ya normalizadas, se buscan como fragmento) agrupadas por rol.
const ARBITRO = ['arbitro', 'referi', 'juez', 'asistente', 'planillero', 'liniers']
const RIVAL = ['rival', 'contrario', 'adversario', 'jugador de', 'jugador del', 'companero', 'oponente', 'marcador']
const DIRECTIVO = ['directivo', 'dirigente', 'organizador', 'organizacion', 'autoridad del torneo', 'presidente', 'comision', 'veedor']
const GOLPE = ['golpe', 'golpeo', 'agred', 'agresion', 'piña', 'pina', 'trompada', 'puñetazo', 'punetazo', 'cabezazo', 'empuj', 'escup', 'patada', 'patado', 'pateo', 'pego', 'pegar', 'codazo', 'trompon', 'cachetada', 'tiro un puño', 'tomo del cuello']
const OFENSA = ['insult', 'ofens', 'amenaz', 'agravi', 'reclamo', 'reclamar', 'protest', 'gesto', 'grito', 'falto el respeto', 'falta de respeto', 'desacat', 'insolent', 'maltrat', 'improper']
const BRUSCO = ['juego brusco', 'brusco', 'entrada fuerte', 'entrada violenta', 'plancha', 'infraccion fuerte', 'falta violenta', 'falta fuerte', 'pisotón', 'pisoton', 'pisó', 'piso el', 'a destiempo', 'brutal', 'fuerza excesiva', 'lesionar', 'lesion']
const INCITAR = ['incit', 'pelea', 'gresca', 'trifulca', 'batalla campal', 'se agarraron', 'se fueron a las manos', 'provoc', 'insultos entre', 'altercado']
const DOBLE = ['doble amarilla', 'doble amonestacion', 'segunda amarilla', 'dos amarillas', '2 amarillas', 'segunda amonestacion', 'segunda tarjeta amarilla', 'amarilla y roja']
const ACUMULA = ['5 amarillas', 'cinco amarillas', 'acumulacion de amarillas', 'amarillas acumuladas', 'acumulo amarillas', 'quinta amarilla', '5 tarjetas', 'cinco tarjetas']

type Regla = { codigo: string; fechas?: number; puntua: (t: string) => { puntos: number; palabra: string } | null }

const hallar = (t: string, lista: string[]) => lista.find((p) => t.includes(normalizarTexto(p)))

const regla = (codigo: string, fn: (t: string) => { puntos: number; palabra: string } | null, fechas?: number): Regla => ({ codigo, puntua: fn, fechas })

const REGLAS: Regla[] = [
  regla('Art. 34 A', (t) => {
    const a = hallar(t, ARBITRO), g = hallar(t, GOLPE)
    return a && g ? { puntos: 5, palabra: g } : null
  }),
  regla('Art. 34 B', (t) => {
    const a = hallar(t, ARBITRO), o = hallar(t, OFENSA)
    return a && o ? { puntos: 4, palabra: o } : null
  }),
  regla('Art. 36', (t) => { const d = hallar(t, DOBLE); return d ? { puntos: 6, palabra: d } : null }, 1),
  regla('Art. 37', (t) => {
    const i = hallar(t, INCITAR)
    if (i) return { puntos: 3, palabra: i }
    const r = hallar(t, RIVAL), o = hallar(t, OFENSA)
    return r && o && !hallar(t, ARBITRO) ? { puntos: 3, palabra: o } : null
  }),
  regla('Art. 39', (t) => { const b = hallar(t, BRUSCO); return b ? { puntos: 4, palabra: b } : null }),
  regla('Art. 39 C', (t) => {
    const r = hallar(t, RIVAL), g = hallar(t, GOLPE)
    return r && g && !hallar(t, ARBITRO) ? { puntos: 5, palabra: g } : null
  }),
  regla('Art. 42 D.1', (t) => {
    const d = hallar(t, DIRECTIVO), o = hallar(t, OFENSA)
    return d && o ? { puntos: 5, palabra: o } : null
  }),
  regla('Art. 43 Bis', (t) => { const a = hallar(t, ACUMULA); return a ? { puntos: 6, palabra: a } : null }, 1),
]

export type Sugerencia = { codigo: string; descripcion: string; palabra: string; puntos: number }

// Devuelve los artículos que mejor coinciden con el texto (más puntos primero). Solo existentes en el reglamento.
export function sugerirArticulos(informe: string): Sugerencia[] {
  const t = normalizarTexto(informe)
  if (t.trim().length < 4) return []
  const sug: Sugerencia[] = []
  for (const r of REGLAS) {
    const art = ARTICULOS.find((a) => a.codigo === r.codigo)
    const hit = art && r.puntua(t)
    if (art && hit) sug.push({ codigo: art.codigo, descripcion: art.descripcion, palabra: hit.palabra, puntos: hit.puntos })
  }
  // Si el artículo de agresión al árbitro / jugador ya explica el golpe, el juego brusco solo se sugiere si se lo nombra.
  return sug.sort((a, b) => b.puntos - a.puntos)
}

// Fechas fijas del reglamento (doble amonestación y 5 amarillas = 1 fecha); roja directa va de 1 a 30 según gravedad.
export function fechasSugeridas(codigos: string[]): { fijas?: number; rango?: string } {
  const fijas = codigos.map((c) => REGLAS.find((r) => r.codigo === c)?.fechas).filter((x): x is number => !!x)
  if (codigos.length && fijas.length === codigos.length) return { fijas: Math.max(...fijas) }
  const hayRoja = codigos.some((c) => ARTICULOS.find((a) => a.codigo === c)?.tipo === 'Roja directa')
  return hayRoja ? { rango: 'La roja directa va de 1 a 30 fechas según la gravedad (reglamento).' } : {}
}

export const tipoDeArticulo = (codigo: string) => ARTICULOS.find((a) => a.codigo === codigo)?.tipo
