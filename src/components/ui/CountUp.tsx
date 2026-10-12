'use client'

import { useEffect, useRef, useState } from 'react'

// Contador que sube hasta el valor al entrar en pantalla (idea de react-bits/CountUp,
// sin dependencias). Acepta sufijos como "40+". El HTML del servidor ya trae el
// valor final, así que sin JS o con "reducir movimiento" se ve igual de bien.
export default function CountUp({ value, duration = 1400 }: { value: string; duration?: number }) {
  const match = value.match(/^(\d+)(.*)$/)
  const objetivo = match ? Number(match[1]) : null
  const sufijo = match ? match[2] : ''
  const ref = useRef<HTMLSpanElement>(null)
  const [actual, setActual] = useState<number | null>(objetivo)

  useEffect(() => {
    if (objetivo === null || !ref.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = ref.current
    let raf = 0
    const observer = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return
        observer.disconnect()
        const inicio = performance.now()
        const paso = (ahora: number) => {
          const t = Math.min((ahora - inicio) / duration, 1)
          setActual(Math.round(objetivo * (1 - Math.pow(1 - t, 3))))
          if (t < 1) raf = requestAnimationFrame(paso)
        }
        setActual(0)
        raf = requestAnimationFrame(paso)
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [objetivo, duration])

  if (objetivo === null) return <span>{value}</span>
  return <span ref={ref}>{actual}{sufijo}</span>
}
