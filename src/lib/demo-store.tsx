'use client'

import { borrarTodo, type Adjunto } from '@/lib/adjuntos-db'
import { SANCIONES_APP, PLANTEL_APP } from '@/lib/datos-app'
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

// Estado de la demo del sitio: login mockeado y datos de los paneles guardados en el navegador (localStorage).
// No hay backend: nada de lo que se carga acá sale del dispositivo. No subir DNI reales.

export type Rol = 'organizacion' | 'delegado' | 'jugador'
export type Sesion = { email: string; nombre: string; rol: Rol; equipo?: string }

export type { Adjunto }
export type Mensaje = { de: 'organizacion' | 'delegado'; texto: string; fecha: string; adjuntos?: Adjunto[] }
export type Sancion = {
  id: string
  jugador: string
  equipo: string
  partido: string
  fecha: string
  tipo: string
  articulo: string
  fechasSuspension: number
  // Informe de expulsión: lo que cuenta el informe del árbitro (el campo se llama `motivo` por compatibilidad con datos guardados).
  motivo: string
  // Artículos del reglamento imputados (ej. 'Art. 39'). Las sanciones viejas solo tienen `articulo`.
  articulos?: string[]
  estado: 'Firme' | 'En revisión' | 'Descargo aceptado' | 'Descargo rechazado'
  cumplida?: boolean
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
export const TOPE_PLANTEL = 25

// Una sanción admite descargo solo si sigue abierta: no resuelta ni ya cumplida.
export const admiteDescargo = (s: Pick<Sancion, 'estado' | 'cumplida'>) =>
  (s.estado === 'Firme' || s.estado === 'En revisión') && !s.cumplida

// Artículos imputados: los guardados o, en datos viejos, los que se nombran en el texto.
export function articulosDe(s: Pick<Sancion, 'articulos' | 'articulo' | 'motivo'>): string[] {
  if (s.articulos && s.articulos.length) return s.articulos
  const hallados = s.motivo.match(/Art\. ?\d+(?: ?(?:Bis|[A-Z](?:\.\d)?))?/g)
  const lista = hallados && hallados.length ? hallados : [s.articulo]
  return Array.from(new Set(lista.map((a) => a.replace(/^Art\.?\s*/, 'Art. '))))
}

export type Resultado = { id: string; categoria: string; fecha: number; local: string; visitante: string; golesLocal: number; golesVisitante: number }
export type Gol = { id: string; categoria: string; jugador: string; equipo: string; goles: number }

export const CUENTAS: (Sesion & { clave: string })[] = [
  { email: 'organizacion@imperial.com', nombre: 'Comisión Disciplinaria', rol: 'organizacion', clave: 'imperial123' },
  { email: 'delegado@imperial.com', nombre: 'Roberto Ibáñez', rol: 'delegado', equipo: 'Ankara +30', clave: 'imperial123' },
  { email: 'jugador@imperial.com', nombre: 'Cristian Agustín Salussolia', rol: 'jugador', equipo: 'Ankara +30', clave: 'imperial123' },
]

// Textos del sitio que la organización puede cambiar desde el panel (Contenido). Lo que no se toca queda como en demo-config.ts.
export type ContenidoSitio = {
  contacto?: { email: string; address: string; whatsapp: string; instagram: string }
  portada?: { descripcion: string }
  cta?: { title: string; subtitle: string }
  // Inscripción: tarjeta "Cómo funciona".
  requisitos?: string[]
}

type Datos = { sanciones: Sancion[]; plantel: JugadorPlantel[]; resultados: Resultado[]; goleadores: Gol[]; fotoFechaUrl: string; contenido: ContenidoSitio }

const INICIAL: Datos = {
  sanciones: SANCIONES_APP,
  plantel: PLANTEL_APP,
  resultados: [],
  goleadores: [],
  contenido: {},
  fotoFechaUrl: 'https://drive.google.com/drive/folders/1UijkT6B73qCudx_L0uSlaxrv83ILYRQA',
}

const CLAVE_DATOS = 'ti-demo-datos-v2'
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
  mensaje: (id: string, texto: string, adjuntos?: Adjunto[]) => void
  resolver: (id: string, aceptar: boolean) => void
  reabrir: (id: string) => void
  marcarCumplida: (id: string, cumplida: boolean) => void
  crearSancion: (s: Omit<Sancion, 'id' | 'mensajes' | 'estado'>) => void
  editarSancion: (id: string, cambios: Partial<Omit<Sancion, 'id'>>) => void
  quitarSancion: (id: string) => void
  editarResultado: (id: string, cambios: Partial<Omit<Resultado, 'id'>>) => void
  quitarResultado: (id: string) => void
  editarGol: (id: string, cambios: Partial<Omit<Gol, 'id'>>) => void
  quitarGol: (id: string) => void
  guardarJugador: (j: Omit<JugadorPlantel, 'id' | 'estadoDoc'> & { id?: string }) => void
  quitarJugador: (id: string) => void
  revisarDoc: (id: string, estado: JugadorPlantel['estadoDoc']) => void
  cargarResultado: (r: Omit<Resultado, 'id'>) => void
  cargarGoles: (g: Omit<Gol, 'id'>) => void
  setFotoFecha: (url: string) => void
  guardarContenido: <K extends keyof ContenidoSitio>(clave: K, valor: ContenidoSitio[K]) => void
  restablecerContenido: (clave: keyof ContenidoSitio) => void
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
  const reiniciar = () => { void borrarTodo(); guardar(() => INICIAL) }

  const actualizarSancion = (id: string, fn: (s: Sancion) => Sancion) =>
    guardar((d) => ({ ...d, sanciones: d.sanciones.map((s) => (s.id === id ? fn(s) : s)) }))

  const value: Ctx = {
    listo, sesion, datos, ingresar, salir, reiniciar,
    enviarDescargo: (id, texto) => actualizarSancion(id, (s) => (admiteDescargo(s) ? { ...s, descargo: texto, estado: 'En revisión' } : s)),
    mensaje: (id, texto, adjuntos) =>
      actualizarSancion(id, (s) => ({ ...s, mensajes: [...s.mensajes, { de: sesion?.rol === 'organizacion' ? 'organizacion' : 'delegado', texto, fecha: hoy(), ...(adjuntos?.length ? { adjuntos } : {}) }] })),
    resolver: (id, aceptar) => actualizarSancion(id, (s) => ({ ...s, estado: aceptar ? 'Descargo aceptado' : 'Descargo rechazado' })),
    reabrir: (id) => actualizarSancion(id, (s) => ({ ...s, estado: s.descargo ? 'En revisión' : 'Firme', cumplida: false })),
    marcarCumplida: (id, cumplida) => actualizarSancion(id, (s) => ({ ...s, cumplida })),
    crearSancion: (s) => guardar((d) => ({ ...d, sanciones: [{ ...s, id: nuevoId('s'), estado: 'Firme', mensajes: [] }, ...d.sanciones] })),
    editarSancion: (id, cambios) => actualizarSancion(id, (s) => ({ ...s, ...cambios })),
    quitarSancion: (id) => guardar((d) => ({ ...d, sanciones: d.sanciones.filter((s) => s.id !== id) })),
    editarResultado: (id, cambios) => guardar((d) => ({ ...d, resultados: d.resultados.map((r) => (r.id === id ? { ...r, ...cambios } : r)) })),
    quitarResultado: (id) => guardar((d) => ({ ...d, resultados: d.resultados.filter((r) => r.id !== id) })),
    editarGol: (id, cambios) => guardar((d) => ({ ...d, goleadores: d.goleadores.map((g) => (g.id === id ? { ...g, ...cambios } : g)) })),
    quitarGol: (id) => guardar((d) => ({ ...d, goleadores: d.goleadores.filter((g) => g.id !== id) })),
    guardarJugador: (j) =>
      guardar((d) => {
        if (j.id) {
          // Solo vuelve a "Pendiente" si cambió algo documental (DNI o fotos); nombre o posición no reabren la revisión.
          return {
            ...d,
            plantel: d.plantel.map((p) => {
              if (p.id !== j.id) return p
              const documental = j.dni !== p.dni || j.foto !== p.foto || j.dniFrente !== p.dniFrente || j.dniDorso !== p.dniDorso
              return { ...p, ...j, id: p.id, estadoDoc: documental ? 'Pendiente' : p.estadoDoc }
            }),
          }
        }
        return { ...d, plantel: [...d.plantel, { ...j, id: nuevoId('j'), estadoDoc: 'Pendiente' }] }
      }),
    quitarJugador: (id) => guardar((d) => ({ ...d, plantel: d.plantel.filter((p) => p.id !== id) })),
    revisarDoc: (id, estado) => guardar((d) => ({ ...d, plantel: d.plantel.map((p) => (p.id === id ? { ...p, estadoDoc: estado } : p)) })),
    cargarResultado: (r) => guardar((d) => ({ ...d, resultados: [{ ...r, id: nuevoId('r') }, ...d.resultados] })),
    cargarGoles: (g) => guardar((d) => ({ ...d, goleadores: [{ ...g, id: nuevoId('g') }, ...d.goleadores] })),
    setFotoFecha: (url) => guardar((d) => ({ ...d, fotoFechaUrl: url })),
    guardarContenido: (clave, valor) => guardar((d) => ({ ...d, contenido: { ...d.contenido, [clave]: valor } })),
    restablecerContenido: (clave) => guardar((d) => { const { [clave]: _quitar, ...resto } = d.contenido; return { ...d, contenido: resto } }),
  }

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>
}

export function useDemo() {
  const c = useContext(StoreCtx)
  if (!c) throw new Error('useDemo debe usarse dentro de DemoProvider')
  return c
}
