'use client'

import { useLayoutEffect, useRef, useState } from 'react'

type Medida = { left: number; top: number; width: number; height: number }

// Selector de categoría con indicador deslizante (idea de kokonutui/smooth-tab).
// Mide el botón activo, así sigue funcionando cuando los botones pasan a 2 filas.
export default function CategoryTabs({
  options,
  value,
  onChange,
}: {
  options: readonly string[]
  value: string
  onChange: (v: string) => void
}) {
  const contenedor = useRef<HTMLDivElement>(null)
  const botones = useRef<Record<string, HTMLButtonElement | null>>({})
  const [medida, setMedida] = useState<Medida | null>(null)
  const [listo, setListo] = useState(false)

  useLayoutEffect(() => {
    const medir = () => {
      const b = botones.current[value]
      if (!b) return
      setMedida({ left: b.offsetLeft, top: b.offsetTop, width: b.offsetWidth, height: b.offsetHeight })
    }
    medir()
    // La transición recién se activa después de la primera medición: sin salto inicial.
    const id = requestAnimationFrame(() => setListo(true))
    window.addEventListener('resize', medir)
    return () => {
      cancelAnimationFrame(id)
      window.removeEventListener('resize', medir)
    }
  }, [value, options])

  return (
    <div className="mb-10">
    <p className="eyebrow !mb-3 text-center">Categorías</p>
    <div ref={contenedor} className="relative flex flex-wrap justify-center gap-2" role="tablist" aria-label="Categorías">
      {medida && (
        <span
          aria-hidden
          className="absolute pointer-events-none"
          style={{
            left: 0,
            top: 0,
            width: medida.width,
            height: medida.height,
            transform: `translate(${medida.left}px, ${medida.top}px)`,
            backgroundColor: 'var(--demo-accent)',
            borderRadius: 'var(--demo-radius)',
            transition: listo ? 'transform 0.35s cubic-bezier(0.34, 1.3, 0.64, 1), width 0.35s ease, height 0.35s ease' : 'none',
          }}
        />
      )}
      {options.map((c) => (
        <button
          key={c}
          ref={(el) => { botones.current[c] = el }}
          role="tab"
          aria-selected={value === c}
          onClick={() => onChange(c)}
          className="relative px-5 py-2 text-sm font-semibold transition-colors duration-200"
          style={{
            borderRadius: 'var(--demo-radius)',
            backgroundColor: 'transparent',
            color: value === c ? 'var(--demo-on-accent)' : 'var(--demo-text)',
            border: `1px solid ${value === c ? 'transparent' : 'var(--demo-border)'}`,
          }}
        >
          {c}
        </button>
      ))}
    </div>
    </div>
  )
}
