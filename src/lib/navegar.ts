// Navegar tapando primero con la pantalla de carga (PageTransition escucha este evento).
// Sirve para botones que navegan por código (ej. "Salir"), que no pasan por el clic en un <a>.
// `antes` corre cuando la cortina ya cubre todo, justo antes de cambiar de página: ahí conviene
// borrar la sesión, así no se ve ni un cuadro de la pantalla de destino ni del panel vaciándose.
export const EVENTO_NAVEGAR = 'ti-navegar'

export type NavegarDetalle = { href: string; antes?: () => void }

export function navegarConCortina(href: string, antes?: () => void) {
  if (typeof window === 'undefined') return
  const detalle: NavegarDetalle = { href, antes }
  // Si no hay nadie escuchando (o el usuario pide menos movimiento), navega directo.
  const escuchado = !window.dispatchEvent(new CustomEvent<NavegarDetalle>(EVENTO_NAVEGAR, { detail: detalle, cancelable: true }))
  if (!escuchado) {
    antes?.()
    window.location.assign(href)
  }
}
