'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { categorias, type Categoria } from '@/lib/torneo-data'

const STORAGE_KEY = 'imperial:categoria'

type CategoryContextValue = {
  categoria: Categoria
  setCategoria: (c: Categoria) => void
}

const CategoryContext = createContext<CategoryContextValue | null>(null)

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [categoria, setCategoriaState] = useState<Categoria>('+30')

  // Se hidrata desde localStorage recién en el cliente para no generar
  // mismatch de hidratación SSR (el render inicial siempre usa el default).
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored && (categorias as readonly string[]).includes(stored)) {
      setCategoriaState(stored as Categoria)
    }
  }, [])

  const setCategoria = (c: Categoria) => {
    setCategoriaState(c)
    window.localStorage.setItem(STORAGE_KEY, c)
  }

  return <CategoryContext.Provider value={{ categoria, setCategoria }}>{children}</CategoryContext.Provider>
}

export function useCategoria() {
  const ctx = useContext(CategoryContext)
  if (!ctx) throw new Error('useCategoria debe usarse dentro de <CategoryProvider>')
  return ctx
}
