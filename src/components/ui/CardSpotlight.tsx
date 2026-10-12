'use client'

import { useEffect } from 'react'

// Brillo que sigue al mouse sobre cualquier `.card` (idea de kokonutui/spotlight-cards).
// Un solo listener global: guarda la posición en --mx/--my y el CSS dibuja el resplandor.
export default function CardSpotlight() {
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    let raf = 0
    const mover = (e: PointerEvent) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const card = (e.target as Element | null)?.closest?.('.card') as HTMLElement | null
        if (!card) return
        const r = card.getBoundingClientRect()
        card.style.setProperty('--mx', `${e.clientX - r.left}px`)
        card.style.setProperty('--my', `${e.clientY - r.top}px`)
      })
    }
    document.addEventListener('pointermove', mover, { passive: true })
    return () => {
      document.removeEventListener('pointermove', mover)
      cancelAnimationFrame(raf)
    }
  }, [])
  return null
}
