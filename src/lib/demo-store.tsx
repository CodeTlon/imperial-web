'use client'

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

// Estado de la demo del sitio: login mockeado y datos de los paneles guardados en el navegador (localStorage).
// No hay backend: nada de lo que se carga acá sale del dispositivo. No subir DNI reales.

export type Rol = 'organizacion' | 'delegado'
export type Sesion = { email: string; nombre: string; rol: Rol; equipo?: string }

export type Mensaje = { de: 'organizacion' | 'delegado'; texto: string; fecha: string }
export type Sancion = {
  id: string
  jugador: string
  equipo: string
  partido: string
  fecha: string
  tipo: 'Roja directa' | 'Doble amarilla'
  articulo: string
  fechasSuspension: number
  motivo: string
  estado: 'Firme' | 'En revisión' | 'Descargo aceptado' | 'Descargo rechazado'
  descargo?: string
  mensajes: Mensaje[]
}
export type JugadorPlantel = {
  id: string
  equipo: string
  nombre: string
  dni: string
  posicion: string
  foto?: string
  dniFrente?: string
  dniDorso?: string
  estadoDoc: 'Pendiente' | 'Aprobado' | 'Observado'
}
export type Resultado = { id: string; categoria: string; fecha: number; local: string; visitante: string; golesLocal: number; golesVisitante: number }
export type Gol = { id: string; categoria: string; jugador: string; equipo: string; goles: number }

export const CUENTAS: (Sesion & { clave: string })[] = [
  { email: 'organizacion@imperial.com', nombre: 'Comisión Disciplinaria', rol: 'organizacion', clave: 'imperial123' },
  { email: 'delegado@imperial.com', nombre: 'Roberto Ibáñez', rol: 'delegado', equipo: 'Ankara +30', clave: 'imperial123' },
]

type Datos = { sanciones: Sancion[]; plantel: JugadorPlantel[]; resultados: Resultado[]; goleadores: Gol[]; fotoFechaUrl: string }

const INICIAL: Datos = {
  sanciones: [
    {
      id: 's1', jugador: 'Cristian Salussolia', equipo: 'Ankara +30', partido: 'vs. Los Ñoquis +30', fecha: '13/07', tipo: 'Roja directa',
      articulo: 'Art. 39', fechasSuspension: 2, motivo: 'Juego brusco grave.', estado: 'En revisión',
      descargo: 'El contacto fue accidental, el jugador disputaba la pelota.', mensajes: [],
    },
    {
      id: 's2', jugador: 'Luciano Romano', equipo: 'Ankara +30', partido: 'vs. El Banco +30', fecha: '06/07', tipo: 'Roja directa',
      articulo: 'Art. 39', fechasSuspension: 4, motivo: 'Juego brusco — 4 fechas de suspensión.', estado: 'Firme', mensajes: [],
    },
    {
      id: 's3', jugador: 'Martín Pereyra', equipo: 'Belgrano Vet. +30', partido: 'vs. Ankara +30', fecha: '29/06', tipo: 'Doble amarilla',
      articulo: 'Art. 36', fechasSuspension: 1, motivo: 'Doble amonestación.', estado: 'Firme', mensajes: [],
    },
  ],
  plantel: [
    { id: 'j1', equipo: 'Ankara +30', nombre: 'Cristian Salussolia', dni: '28.114.220', posicion: 'Mediocampista', estadoDoc: 'Aprobado' },
    { id: 'j2', equipo: 'Ankara +30', nombre: 'Mallky Godoy', dni: '30.552.118', posicion: 'Delantero', estadoDoc: 'Pendiente' },
    { id: 'j3', equipo: 'Ankara +30', nombre: 'Luciano Romano', dni: '29.847.003', posicion: 'Defensor', estadoDoc: 'Observado' },
  ],
  resultados: [],
  goleadores: [],
  fotoFechaUrl: 'https://drive.google.com/drive/folders/1UijkT6B73qCudx_L0uSlaxrv83ILYRQA',
}

const CLAVE_DATOS = 'ti-demo-datos'
const CLAVE_SESION = 'ti-demo-sesion'
const hoy = () => new Date().toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })
const nuevoId = (p: string) => `${p}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`

type Ctx = {
  listo: boolean
  sesion: Sesion | null
  datos: Datos
  ingresar: (email: string, clave: string) => boolean
  salir: () => void
  reiniciar: () => void
  enviarDescargo: (id: string, texto: string) => void
  mensaje: (id: string, texto: string) => void
  resolver: (id: string, aceptar: boolean) => void
  crearSancion: (s: Omit<Sancion, 'id' | 'mensajes' | 'estado'>) => void
  guardarJugador: (j: Omit<JugadorPlantel, 'id' | 'estadoDoc'> & { id?: string }) => void
  quitarJugador: (id: string) => void
  revisarDoc: (id: string, estado: JugadorPlantel['estadoDoc']) => void
  cargarResultado: (r: Omit<Resultado, 'id'>) => void
  cargarGoles: (g: Omit<Gol, 'id'>) => void
  setFotoFecha: (url: string) => void
}

const StoreCtx = createContext<Ctx | null>(null)

export function DemoProvider({ children }: { children: ReactNode }) {
  const [listo, setListo] = useState(false)
  const [sesion, setSesion] = useState<Sesion | null>(null)
  const [datos, setDatos] = useState<Datos>(INICIAL)

  useEffect(() => {
    try {
      const d = localStorage.getItem(CLAVE_DATOS)
      if (d) setDatos({ ...INICIAL, ...JSON.parse(d) })
      const s = localStorage.getItem(CLAVE_SESION)
      if (s) setSesion(JSON.parse(s))
    } catch {}
    setListo(true)
  }, [])

  const guardar = useCallback((fn: (d: Datos) => Datos) => {
    setDatos((prev) => {
      const sig = fn(prev)
      try { localStorage.setItem(CLAVE_DATOS, JSON.stringify(sig)) } catch {}
      return sig
    })
  }, [])

  const ingresar = (email: string, clave: string) => {
    const c = CUENTAS.find((x) => x.email === email.trim().toLowerCase() && x.clave === clave)
    if (!c) return false
    const { clave: _omit, ...s } = c
    setSesion(s)
    try { localStorage.setItem(CLAVE_SESION, JSON.stringify(s)) } catch {}
    // Cookie solo para que el middleware pueda redirigir; en producción sería una sesión firmada.
    document.cookie = `ti_rol=${s.rol}; path=/; max-age=86400; samesite=lax`
    return true
  }
  const salir = () => {
    setSesion(null)
    try { localStorage.removeItem(CLAVE_SESION) } catch {}
    document.cookie = 'ti_rol=; path=/; max-age=0'
  }
  const reiniciar = () => guardar(() => INICIAL)

  const actualizarSancion = (id: string, fn: (s: Sancion) => Sancion) =>
    guardar((d) => ({ ...d, sanciones: d.sanciones.map((s) => (s.id === id ? fn(s) : s)) }))

  const value: Ctx = {
    listo, sesion, datos, ingresar, salir, reiniciar,
    enviarDescargo: (id, texto) => actualizarSancion(id, (s) => ({ ...s, descargo: texto, estado: 'En revisión' })),
    mensaje: (id, texto) =>
      actualizarSancion(id, (s) => ({ ...s, mensajes: [...s.mensajes, { de: sesion?.rol ?? 'delegado', texto, fecha: hoy() }] })),
    resolver: (id, aceptar) => actualizarSancion(id, (s) => ({ ...s, estado: aceptar ? 'Descargo aceptado' : 'Descargo rechazado' })),
    crearSancion: (s) => guardar((d) => ({ ...d, sanciones: [{ ...s, id: nuevoId('s'), estado: 'Firme', mensajes: [] }, ...d.sanciones] })),
    guardarJugador: (j) =>
      guardar((d) => {
        if (j.id) return { ...d, plantel: d.plantel.map((p) => (p.id === j.id ? { ...p, ...j, id: p.id, estadoDoc: 'Pendiente' } : p)) }
        return { ...d, plantel: [...d.plantel, { ...j, id: nuevoId('j'), estadoDoc: 'Pendiente' }] }
      }),
    quitarJugador: (id) => guardar((d) => ({ ...d, plantel: d.plantel.filter((p) => p.id !== id) })),
    revisarDoc: (id, estado) => guardar((d) => ({ ...d, plantel: d.plantel.map((p) => (p.id === id ? { ...p, estadoDoc: estado } : p)) })),
    cargarResultado: (r) => guardar((d) => ({ ...d, resultados: [{ ...r, id: nuevoId('r') }, ...d.resultados] })),
    cargarGoles: (g) => guardar((d) => ({ ...d, goleadores: [{ ...g, id: nuevoId('g') }, ...d.goleadores] })),
    setFotoFecha: (url) => guardar((d) => ({ ...d, fotoFechaUrl: url })),
  }

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>
}

export function useDemo() {
  const c = useContext(StoreCtx)
  if (!c) throw new Error('useDemo debe usarse dentro de DemoProvider')
  return c
}
