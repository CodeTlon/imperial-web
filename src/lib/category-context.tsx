'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { categorias, type Categoria } from '@/lib/torneo-data'

const STORAGE_KEY = 'imperial:categoria'

type CategoryContextValue = {
  categoria: Categoria
  setCategoria: (c: Categoria) => void
}

const CategoryContext = createContext<CategoryContextValue | null>(null)

const esCategoria = (c: string | null): c is Categoria => !!c && (categorias as readonly string[]).includes(c)

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [categoria, setCategoriaState] = useState<Categoria>('+30')

  // Se hidrata en el cliente para no generar mismatch de hidratación SSR (el render inicial siempre usa
  // el default). Prioridad: ?cat= de la URL (link compartido) > localStorage > default.
  useEffect(() => {
    const deUrl = new URLSearchParams(window.location.search).get('cat')
    let guardada: string | null = null
    try { guardada = window.localStorage.getItem(STORAGE_KEY) } catch {}
    const inicial = esCategoria(deUrl) ? deUrl : esCategoria(guardada) ? guardada : null
    if (inicial) setCategoriaState(inicial)
  }, [])

  const setCategoria = (c: Categoria) => {
    setCategoriaState(c)
    try { window.localStorage.setItem(STORAGE_KEY, c) } catch {}
    // La categoría queda en la URL para que el link compartido muestre lo mismo.
    const url = new URL(window.location.href)
    url.searchParams.set('cat', c)
    window.history.replaceState(null, '', url)
  }

  return <CategoryContext.Provider value={{ categoria, setCategoria }}>{children}</CategoryContext.Provider>
}

export function useCategoria() {
  const ctx = useContext(CategoryContext)
  if (!ctx) throw new Error('useCategoria debe usarse dentro de <CategoryProvider>')
  return ctx
}
