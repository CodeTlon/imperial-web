// Campeones del Apertura 2026 (nombres tal cual figuran en las gráficas oficiales del torneo).
// Es el mismo archivo en el sitio web y en la app (imperial-web/src/lib/campeones-ti.ts y imperial-app/src/lib/campeones-ti.ts):
// si se cambia uno, cambiar el otro.

export const CATEGORIAS_CAMPEONES = ['+30', '+35', '+40', '+45', 'Libre', 'Femenino'] as const
export type CategoriaCampeon = (typeof CATEGORIAS_CAMPEONES)[number]

export type CampeonTI = {
  categoria: CategoriaCampeon
  copa: 'Oro' | 'Plata' | 'Bronce'
  campeon: string
  subcampeon: string
  tercero?: string
}

export const CAMPEONES_TI: CampeonTI[] = [
  { categoria: '+30', copa: 'Oro', campeon: 'El Tala', subcampeon: 'La Sede', tercero: 'Borussia' },
  { categoria: '+30', copa: 'Plata', campeon: 'Chape', subcampeon: 'Ospaca' },
  { categoria: '+30', copa: 'Bronce', campeon: 'Azzurra', subcampeon: 'Labanda' },
  { categoria: '+35', copa: 'Oro', campeon: 'AGB', subcampeon: 'La France', tercero: 'Atl. Granada' },
  { categoria: '+35', copa: 'Plata', campeon: 'La 22', subcampeon: 'Graduados' },
  { categoria: '+40', copa: 'Oro', campeon: 'Chazón', subcampeon: 'La Chaza', tercero: 'Desertores' },
  { categoria: '+40', copa: 'Plata', campeon: 'Colorado', subcampeon: 'Dep. Oeste' },
  { categoria: '+45', copa: 'Oro', campeon: 'Nacional', subcampeon: 'La Amistad', tercero: 'Fokus' },
  { categoria: '+45', copa: 'Plata', campeon: 'Reencuentro', subcampeon: 'Lagartos' },
  { categoria: 'Libre', copa: 'Oro', campeon: 'Impresentables', subcampeon: 'Mecha', tercero: 'Juan B. Justo' },
  { categoria: 'Libre', copa: 'Plata', campeon: 'La Caseros', subcampeon: 'El Nothi' },
  { categoria: 'Libre', copa: 'Bronce', campeon: 'Dep. Unión', subcampeon: 'Isotopos' },
  { categoria: 'Femenino', copa: 'Oro', campeon: 'La Chaza', subcampeon: 'Ankara', tercero: 'Dep. Milán' },
  { categoria: 'Femenino', copa: 'Plata', campeon: 'El Deport', subcampeon: 'Oregon' },
]

// Nombre de archivo del escudo generado de un campeón (camp-<slug>.png): sin tildes ni signos.
export const slugCampeon = (nombre: string) =>
  nombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

// Campeones que son el mismo club que un equipo real de +30: usan el escudo de ese equipo.
export const MISMO_CLUB_QUE: Record<string, string> = { Ankara: 'Ankara +30', 'Juan B. Justo': 'Juan B. Justo +30' }
