'use client'

import { useCallback, useEffect, useState } from 'react'

// "Mi equipo": favoritos guardados en el navegador (sin cuenta). Se identifican por categoría + nombre,
// porque el mismo nombre puede repetirse entre categorías.
const KEY = 'imperial:mi-equipo'
const EVENTO = 'imperial:mi-equipo-cambio'

export type Favorito = { nombre: string; categoria: string }

const leer = (): Favorito[] => {
  try { return JSON.parse(window.localStorage.getItem(KEY) ?? '[]') } catch { return [] }
}

export function useMiEquipo() {
  const [favoritos, setFavoritos] = useState<Favorito[]>([])

  useEffect(() => {
    const sync = () => setFavoritos(leer())
    sync()
    window.addEventListener(EVENTO, sync)
    window.addEventListener('storage', sync)
    return () => { window.removeEventListener(EVENTO, sync); window.removeEventListener('storage', sync) }
  }, [])

  const esFavorito = useCallback(
    (nombre: string, categoria: string) => favoritos.some((f) => f.nombre === nombre && f.categoria === categoria),
    [favoritos],
  )

  const alternar = useCallback((nombre: string, categoria: string) => {
    const actual = leer()
    const hay = actual.some((f) => f.nombre === nombre && f.categoria === categoria)
    const nuevo = hay ? actual.filter((f) => !(f.nombre === nombre && f.categoria === categoria)) : [...actual, { nombre, categoria }]
    try { window.localStorage.setItem(KEY, JSON.stringify(nuevo)) } catch {}
    window.dispatchEvent(new Event(EVENTO))
  }, [])

  return { favoritos, esFavorito, alternar }
}
