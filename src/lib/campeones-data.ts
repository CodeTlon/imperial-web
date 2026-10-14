// Campeones reales del Apertura 2026 — relevados de las gráficas de resultados
// oficiales del torneo, copiadas a
// public/images/campeones/. Nombres de equipos tal cual figuran en las gráficas
// (algunos no coinciden 1:1 con los nombres usados en torneo-data.ts porque son
// categorías/temporadas distintas — no se inventó nada acá).

export const categoriasCampeones = [
  '+30', '+35', '+40', '+45', 'Libre', 'Femenino',
] as const

export type CampeonEntry = {
  categoria: (typeof categoriasCampeones)[number]
  copa: 'Oro' | 'Plata' | 'Bronce'
  campeon: string
  subcampeon: string
  tercero?: string
  img: string
}

export const campeonesData: CampeonEntry[] = [
  { categoria: '+30', copa: 'Oro',    campeon: 'El Tala',         subcampeon: 'La Sede',     tercero: 'Borussia',     img: '/images/campeones/30-oro.jpg' },
  { categoria: '+30', copa: 'Plata',  campeon: 'Chape',           subcampeon: 'Ospaca',                                img: '/images/campeones/30-plata.jpg' },
  { categoria: '+30', copa: 'Bronce', campeon: 'Azzurra',         subcampeon: 'Labanda',                               img: '/images/campeones/30-bronce.jpg' },
  { categoria: '+35', copa: 'Oro',    campeon: 'AGB',             subcampeon: 'La France',   tercero: 'Atl. Granada', img: '/images/campeones/35-oro.jpg' },
  { categoria: '+35', copa: 'Plata',  campeon: 'La 22',           subcampeon: 'Graduados',                             img: '/images/campeones/35-plata.jpg' },
  { categoria: '+40', copa: 'Oro',    campeon: 'Chazón',          subcampeon: 'La Chaza',    tercero: 'Desertores',   img: '/images/campeones/40-oro.jpg' },
  { categoria: '+40', copa: 'Plata',  campeon: 'Colorado',        subcampeon: 'Dep. Oeste',                            img: '/images/campeones/40-plata.jpg' },
  { categoria: '+45', copa: 'Oro',    campeon: 'Nacional',        subcampeon: 'La Amistad',  tercero: 'Fokus',        img: '/images/campeones/45-oro.jpg' },
  { categoria: '+45', copa: 'Plata',  campeon: 'Reencuentro',     subcampeon: 'Lagartos',                              img: '/images/campeones/45-plata.jpg' },
  { categoria: 'Libre', copa: 'Oro',    campeon: 'Impresentables', subcampeon: 'Mecha',      tercero: 'Juan B. Justo', img: '/images/campeones/libre-oro.jpg' },
  { categoria: 'Libre', copa: 'Plata',  campeon: 'La Caseros',     subcampeon: 'El Nothi',                             img: '/images/campeones/libre-plata.jpg' },
  { categoria: 'Libre', copa: 'Bronce', campeon: 'Dep. Unión',     subcampeon: 'Isotopos',                             img: '/images/campeones/libre-bronce.jpg' },
  { categoria: 'Femenino', copa: 'Oro',   campeon: 'La Chaza',  subcampeon: 'Ankara',    tercero: 'Dep. Milán',   img: '/images/campeones/femenino-oro.jpg' },
  { categoria: 'Femenino', copa: 'Plata', campeon: 'El Deport', subcampeon: 'Oregon',                             img: '/images/campeones/femenino-plata.jpg' },
]
