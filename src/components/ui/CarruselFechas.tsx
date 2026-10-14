'use client'

import { useCallback, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface FechaItem { numero: number; fechaLabel: string }

// Carrusel de fechas: la elegida queda siempre centrada en el contenedor.
export default function CarruselFechas({
  fechas, numero, onChange, className = '',
}: { fechas: FechaItem[]; numero: number; onChange: (n: number) => void; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const primera = useRef(true)
  const drag = useRef({ down: false, x: 0, left: 0, moved: false })

  const centrar = useCallback((smooth: boolean) => {
    const c = ref.current
    const el = c?.querySelector<HTMLElement>('[data-activa="true"]')
    if (!c || !el) return
    const cr = c.getBoundingClientRect()
    const er = el.getBoundingClientRect()
    const left = er.left - cr.left + c.scrollLeft - c.clientWidth / 2 + er.width / 2
    c.scrollTo({ left, behavior: smooth ? 'smooth' : 'auto' })
  }, [])

  useEffect(() => {
    centrar(!primera.current)
    primera.current = false
  }, [numero, fechas, centrar])

  const mover = (dir: number) => {
    const i = fechas.findIndex((f) => f.numero === numero)
    const n = fechas[Math.min(fechas.length - 1, Math.max(0, i + dir))]
    if (n) onChange(n.numero)
  }

  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return
    const c = ref.current!
    drag.current = { down: true, x: e.clientX, left: c.scrollLeft, moved: false }
  }
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (!d.down) return
    const dx = e.clientX - d.x
    if (Math.abs(dx) > 5 && !d.moved) {
      d.moved = true
      ref.current!.classList.add('arrastrando')
    }
    if (d.moved) ref.current!.scrollLeft = d.left - dx
  }
  const onUp = () => {
    const d = drag.current
    if (!d.down) return
    d.down = false
    ref.current?.classList.remove('arrastrando')
    if (d.moved) setTimeout(() => { drag.current.moved = false }, 0)
  }

  const flecha = 'hidden md:flex absolute top-1/2 -translate-y-1/2 z-10 w-7 h-7 items-center justify-center rounded-full'
  const flechaStyle = { backgroundColor: 'var(--demo-surface)', color: 'var(--demo-heading)', border: '1px solid var(--demo-border)' }

  return (
    <div className={`relative ${className}`}>
      <button type="button" aria-label="Fecha anterior" onClick={() => mover(-1)} className={`${flecha} left-0`} style={flechaStyle}><ChevronLeft size={16} /></button>
      <button type="button" aria-label="Fecha siguiente" onClick={() => mover(1)} className={`${flecha} right-0`} style={flechaStyle}><ChevronRight size={16} /></button>
      <div
        ref={ref}
        className="fechas-carrusel flex gap-2 overflow-x-auto snap-x snap-mandatory py-3 md:cursor-grab"
        style={{ paddingInline: 'calc(50% - 2.25rem)' }}
        role="tablist"
        aria-label="Fechas"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
        onPointerCancel={onUp}
      >
        {fechas.map((f) => {
          const activa = numero === f.numero
          return (
            <button
              key={f.numero}
              type="button"
              data-activa={activa}
              role="tab"
              aria-selected={activa}
              onClick={() => { if (!drag.current.moved) onChange(f.numero) }}
              className="fecha-pill snap-center flex-shrink-0 w-[4.5rem] h-14 rounded-xl text-center flex flex-col items-center justify-center select-none"
              style={{
                backgroundColor: activa ? 'var(--demo-accent)' : 'var(--demo-surface-alt)',
                color: activa ? 'var(--demo-on-accent)' : 'var(--demo-text)',
                border: `1px solid ${activa ? 'var(--demo-accent)' : 'var(--demo-border)'}`,
              }}
            >
              <span className="block text-[8px] font-semibold uppercase tracking-widest opacity-70 leading-none">Fecha</span>
              <span className="block font-heading text-xl leading-none my-0.5">{f.numero}</span>
              <span className="block text-[9px] font-medium opacity-80 leading-none whitespace-nowrap">{f.fechaLabel}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
