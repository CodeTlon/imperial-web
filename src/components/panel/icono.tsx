import type { LucideIcon } from 'lucide-react'

// Escala unica de iconos del panel: sm 16 (dentro de botones y chips), md 20 (navegacion, avisos), lg 24 (estados vacios, titulos).
export const ESCALA_ICONO = { sm: 16, md: 20, lg: 24 } as const
export type TamanoIcono = keyof typeof ESCALA_ICONO

export function Icono({ i: I, t = 'sm', className = '' }: { i: LucideIcon; t?: TamanoIcono; className?: string }) {
  return <I size={ESCALA_ICONO[t]} aria-hidden className={`shrink-0 ${className}`} />
}
