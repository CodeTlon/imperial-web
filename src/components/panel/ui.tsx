'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Marca from '@/components/layout/Marca'
import { navegarConCortina } from '@/lib/navegar'
import { Icono } from '@/components/panel/icono'
import {
  AlertTriangle, CalendarDays, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, ClipboardList, Inbox, LogOut, RotateCcw, Shield, Gavel, Goal, Home, Image as ImagenIcon, LayoutDashboard, Search, ShieldAlert,
  Table2, Trophy, User, Users, X, type LucideIcon,
} from 'lucide-react'
import { useCallback, useEffect, useId, useRef, useState, type ButtonHTMLAttributes, type CSSProperties, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { createPortal } from 'react-dom'
import { useDemo, type Rol } from '@/lib/demo-store'

// Paleta de los paneles (teal del logo + dorado). Se publica como variables --p-* en la raíz del panel
// para poder usarla desde clases (bg-[var(--p-fondo)]) y desde SVG.
export const C = {
  teal: '#0494a4',
  profundo: '#04707c',
  navy: '#062f36',
  oro: '#f3a21c',
  fondo: '#eef6f7',
  borde: '#d9e8ea',
  texto: '#1f3a40',
  suave: '#5b7479',
  rojo: '#dc2626',
  verde: '#16a34a',
} as const
export const NAVY = C.navy
export const ORO = C.oro

export const VARS_PANEL = {
  '--p-teal': C.teal, '--p-profundo': C.profundo, '--p-navy': C.navy, '--p-oro': C.oro, '--p-fondo': C.fondo,
  '--p-borde': C.borde, '--p-texto': C.texto, '--p-suave': C.suave, '--p-rojo': C.rojo, '--p-verde': C.verde,
} as CSSProperties

// Clases reutilizables basadas en las variables.
export const K = {
  suave: 'text-[color:var(--p-suave)]',
  navy: 'text-[color:var(--p-navy)]',
  borde: 'border-[color:var(--p-borde)]',
  campo: 'w-full min-w-0 rounded-xl border border-[color:var(--p-borde)] bg-[var(--p-fondo)] px-4 py-3 text-sm outline-none placeholder:text-[color:var(--p-suave)]/60 focus:border-[color:var(--p-teal)] focus:ring-2 focus:ring-[color:var(--p-teal)]/20',
  etiqueta: 'block text-xs font-bold uppercase tracking-wide mb-1.5 text-[color:var(--p-navy)]',
}

const ICONOS: Record<string, LucideIcon> = {
  Resumen: LayoutDashboard, Equipos: Shield, Inicio: Home, Descargos: Gavel, Sanciones: ShieldAlert, Jugadores: Users, Plantel: Users,
  Resultados: ClipboardList, Goleadores: Goal, Contenido: ImagenIcon, Fixture: CalendarDays, 'Fixture y posiciones': Table2,
  'Mis sanciones': ShieldAlert, Posiciones: Table2, 'Mi equipo': Trophy, 'Mi perfil': User,
}

const ROLES: Record<Rol, string> = { organizacion: 'Organización', delegado: 'Delegado', jugador: 'Jugador' }
const CLAVE_DEMO_CERRADA = 'ti-demo-franja-cerrada'

// Estructura común de los paneles: barra con marca, rol y usuario; navegación lateral en desktop y pestañas en celular.
export function PanelShell({ rol, titulo, tabs, tab, setTab, children }: {
  rol: Rol; titulo: string; tabs: string[]; tab: string; setTab: (t: string) => void
  children: ReactNode
}) {
  const { sesion, listo, salir, reiniciar } = useDemo()
  const router = useRouter()
  // Mientras se cierra la sesión, la cortina de carga ya cubre todo: la guarda no debe navegar por su cuenta.
  const cerrando = useRef(false)
  const [abierto, setAbierto] = useState(false)
  const [demoOculta, setDemoOculta] = useState(true)
  useEffect(() => {
    if (listo && sesion?.rol !== rol && !cerrando.current) router.replace('/ingresar')
  }, [listo, sesion, rol, router])
  useEffect(() => {
    try { setDemoOculta(localStorage.getItem(CLAVE_DEMO_CERRADA) === '1') } catch { setDemoOculta(false) }
  }, [])
  // El menú lateral del celular se cierra con Esc y si la pantalla pasa a escritorio.
  useEffect(() => {
    if (!abierto) return
    const tecla = (e: KeyboardEvent) => { if (e.key === 'Escape') setAbierto(false) }
    const ancho = () => { if (window.innerWidth >= 1024) setAbierto(false) }
    document.addEventListener('keydown', tecla)
    window.addEventListener('resize', ancho)
    return () => { document.removeEventListener('keydown', tecla); window.removeEventListener('resize', ancho) }
  }, [abierto])
  if (!listo || sesion?.rol !== rol) return <div className="min-h-screen" style={{ background: C.navy }} />
  const cerrarSesion = () => {
    cerrando.current = true
    setAbierto(false)
    navegarConCortina('/ingresar', () => salir())
  }
  const lateral = (
    <MenuLateral
      titulo={titulo} tabs={tabs} tab={tab}
      nombre={sesion.nombre} detalle={`${ROLES[rol]}${sesion.equipo ? ` · ${sesion.equipo}` : ''}`}
      onTab={(t) => { setAbierto(false); setTab(t) }}
      onReiniciar={() => { setAbierto(false); reiniciar() }}
      onSalir={cerrarSesion}
    />
  )
  return (
    <div className="min-h-screen bg-[var(--p-fondo)] text-[color:var(--p-texto)] lg:grid lg:grid-cols-[264px_minmax(0,1fr)]" style={VARS_PANEL}>
      {/* Escritorio: barra lateral fija a la izquierda, de punta a punta */}
      <aside className="sb-oscuro hidden lg:block sticky top-0 h-screen" style={{ background: `linear-gradient(180deg, ${C.navy}, #04434d)` }}>{lateral}</aside>

      {/* Celular: barra superior mínima con el botón del menú */}
      <header className="lg:hidden sticky top-0 z-30 flex h-14 items-center gap-2 px-3 text-white" style={{ background: C.navy }}>
        <button type="button" onClick={() => setAbierto(!abierto)} aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={abierto} aria-controls="menu-panel"
          className="relative flex h-11 w-11 items-center justify-center rounded-xl active:scale-90 transition-transform duration-150 hover:bg-white/10">
          <span className="hamburguesa" data-open={abierto} aria-hidden><i /><i /><i /></span>
        </button>
        <Link href="/" aria-label="Ir al sitio de Torneo Imperial"><Marca tamano="sm" color="#fff" /></Link>
        <span className="ml-auto truncate text-sm font-semibold text-white/80">{tab}</span>
      </header>
      <div className="panel-fondo lg:hidden" data-open={abierto} onClick={() => setAbierto(false)} aria-hidden />
      <aside id="menu-panel" className="sb-oscuro panel-cajon lg:hidden" data-open={abierto} style={{ background: `linear-gradient(180deg, ${C.navy}, #04434d)` }}>{lateral}</aside>

      <main className="min-w-0 px-4 sm:px-6 lg:px-10 py-6 space-y-6 max-w-[1800px]">
        {!demoOculta && (
          <p className={`inline-flex items-center gap-2 rounded-full bg-white border ${K.borde} pl-3 pr-1.5 py-1 text-xs ${K.suave}`}>
            <span className="font-bold text-[color:var(--p-navy)]">Demo</span> los datos se guardan solo en este navegador
            <button type="button" aria-label="Ocultar aviso de demo" onClick={() => { setDemoOculta(true); try { localStorage.setItem(CLAVE_DEMO_CERRADA, '1') } catch {} }} className="-my-2 -mr-1 flex h-10 w-10 items-center justify-center rounded-full hover:bg-[var(--p-fondo)]"><X size={14} aria-hidden /></button>
          </p>
        )}
        {children}
      </main>
    </div>
  )
}

// Contenido de la barra lateral: marca arriba, secciones al medio y usuario con sus acciones abajo.
function MenuLateral({ titulo, tabs, tab, nombre, detalle, onTab, onReiniciar, onSalir }: {
  titulo: string; tabs: string[]; tab: string; nombre: string; detalle: string
  onTab: (t: string) => void; onReiniciar: () => void; onSalir: () => void
}) {
  return (
    <div className="flex h-full flex-col text-white">
      <div className="px-5 pt-6 pb-5">
        <Link href="/" aria-label="Ir al sitio de Torneo Imperial" className="block"><Marca tamano="sm" color="#fff" /></Link>
        <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white/50">{titulo}</p>
      </div>
      <nav aria-label={`Secciones: ${titulo}`} className="flex-1 overflow-y-auto px-3 space-y-1">
        {tabs.map((t) => {
          const activa = tab === t
          return (
            <button
              key={t}
              type="button"
              onClick={() => onTab(t)}
              aria-current={activa ? 'page' : undefined}
              className={`relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors ${activa ? 'bg-white/12 text-white' : 'text-white/70 hover:bg-white/8 hover:text-white'}`}
            >
              {activa && <span aria-hidden className="absolute inset-y-2 left-0 w-1 rounded-r-full" style={{ background: C.oro }} />}
              <Icono i={ICONOS[t] ?? LayoutDashboard} t="md" className={activa ? 'text-[var(--p-oro)]' : ''} />
              <span className="min-w-0 flex-1 truncate">{t}</span>
            </button>
          )
        })}
      </nav>
      <div className="mt-4 border-t border-white/10 p-3">
        <div className="flex items-center gap-3 px-2 py-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold" style={{ background: C.oro, color: C.navy }}>{nombre[0]}</span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold">{nombre}</span>
            <span className="block truncate text-xs text-white/60">{detalle}</span>
          </span>
        </div>
        <button type="button" onClick={onReiniciar} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-white/70 hover:bg-white/8 hover:text-white"><Icono i={RotateCcw} t="md" />Reiniciar demo</button>
        <button type="button" onClick={onSalir} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-bold text-white hover:bg-white/8"><Icono i={LogOut} t="md" />Salir</button>
      </div>
    </div>
  )
}

// Pestañas sincronizadas con la URL (?tab=...), sin useSearchParams para no exigir Suspense.
const slug = (t: string) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-')
export function usePestanaUrl(tabs: string[], inicial: string): [string, (t: string) => void] {
  const [tab, setTabState] = useState(inicial)
  useEffect(() => {
    const leer = () => {
      const q = new URLSearchParams(window.location.search).get('tab')
      const t = tabs.find((x) => slug(x) === q)
      setTabState(t ?? inicial)
    }
    leer()
    window.addEventListener('popstate', leer)
    return () => window.removeEventListener('popstate', leer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const setTab = useCallback((t: string) => {
    setTabState(t)
    const url = new URL(window.location.href)
    if (t === inicial) url.searchParams.delete('tab'); else url.searchParams.set('tab', slug(t))
    url.searchParams.delete('d')   // un detalle abierto (ej. un descargo) no se arrastra a otra sección
    window.history.pushState(null, '', url.pathname + url.search)
    window.scrollTo({ top: 0 })
  }, [inicial])
  return [tab, setTab]
}

// Título, descripción y acción principal de cada sección.
export function Encabezado({ titulo, descripcion, accion }: { titulo: string; descripcion: string; accion?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <h1 className="font-heading text-2xl sm:text-3xl text-[color:var(--p-navy)]">{titulo}</h1>
        <p className={`text-sm mt-1 max-w-2xl ${K.suave}`}>{descripcion}</p>
      </div>
      {accion}
    </div>
  )
}

// Panel lateral en desktop, pantalla completa en celular.
export function Lateral({ abierto, titulo, onCerrar, children }: { abierto: boolean; titulo: string; onCerrar: () => void; children: ReactNode }) {
  useEffect(() => {
    if (!abierto) return
    const tecla = (e: KeyboardEvent) => { if (e.key === 'Escape') onCerrar() }
    document.addEventListener('keydown', tecla)
    const previo = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', tecla); document.body.style.overflow = previo }
  }, [abierto, onCerrar])
  if (!abierto) return null
  // Portal a <body>: así `fixed` siempre cubre toda la pantalla (dentro del shell quedaba 24 px más abajo).
  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end" style={VARS_PANEL}>
      <div className="absolute inset-0 bg-[#062f36]/50" onClick={onCerrar} aria-hidden />
      <aside role="dialog" aria-modal="true" aria-label={titulo} className="relative flex h-full w-full sm:max-w-xl flex-col bg-white shadow-2xl text-[color:var(--p-texto)]">
        <div className={`flex items-center justify-between gap-3 border-b ${K.borde} px-4 sm:px-6 py-4`}>
          <h2 className="font-heading text-xl text-[color:var(--p-navy)]">{titulo}</h2>
          <Boton variante="suave" icono={X} onClick={onCerrar} aria-label="Cerrar panel">Cerrar</Boton>
        </div>
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5">{children}</div>
      </aside>
    </div>,
    document.body,
  )
}

// Confirmación propia (reemplaza a window.confirm).
export function Confirmar({ abierto, titulo, texto, etiqueta = 'Confirmar', peligro = true, onOk, onCancelar }: {
  abierto: boolean; titulo: string; texto?: string; etiqueta?: string; peligro?: boolean; onOk: () => void; onCancelar: () => void
}) {
  useEffect(() => {
    if (!abierto) return
    const tecla = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancelar() }
    document.addEventListener('keydown', tecla)
    return () => document.removeEventListener('keydown', tecla)
  }, [abierto, onCancelar])
  if (!abierto) return null
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={VARS_PANEL}>
      <div className="absolute inset-0 bg-[#062f36]/50" onClick={onCancelar} aria-hidden />
      <div role="alertdialog" aria-modal="true" aria-label={titulo} className="relative w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl text-[color:var(--p-texto)]">
        <div className="flex items-start gap-3">
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${peligro ? 'bg-[#dc2626]/10 text-[#dc2626]' : 'bg-[var(--p-teal)]/10 text-[color:var(--p-profundo)]'}`}><Icono i={AlertTriangle} t="md" /></span>
          <div className="min-w-0">
            <h2 className="font-heading text-xl text-[color:var(--p-navy)]">{titulo}</h2>
            {texto && <p className={`text-sm mt-1 ${K.suave}`}>{texto}</p>}
          </div>
        </div>
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <Boton variante="suave" onClick={onCancelar}>Cancelar</Boton>
          <Boton variante={peligro ? 'peligroSolido' : 'primario'} onClick={onOk}>{etiqueta}</Boton>
        </div>
      </div>
    </div>
  )
}

// Hook cómodo: `pedir({...})` abre el diálogo; `dialogo` va una vez en el JSX.
export function useConfirmar() {
  const [p, setP] = useState<{ titulo: string; texto?: string; etiqueta?: string; peligro?: boolean; ok: () => void } | null>(null)
  const pedir = useCallback((o: { titulo: string; texto?: string; etiqueta?: string; peligro?: boolean }, ok: () => void) => setP({ ...o, ok }), [])
  const dialogo = (
    <Confirmar abierto={!!p} titulo={p?.titulo ?? ''} texto={p?.texto} etiqueta={p?.etiqueta} peligro={p?.peligro} onCancelar={() => setP(null)} onOk={() => { p?.ok(); setP(null) }} />
  )
  return { pedir, dialogo }
}

export function Tarjeta({ titulo, children, derecha, className = '', descripcion }: { titulo?: string; children: ReactNode; derecha?: ReactNode; className?: string; descripcion?: string }) {
  return (
    <section className={`bg-white rounded-2xl border ${K.borde} p-4 sm:p-5 min-w-0 ${className}`}>
      {(titulo || derecha) && (
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          {titulo && <div className="min-w-0"><h2 className="font-heading text-xl text-[color:var(--p-navy)]">{titulo}</h2>{descripcion && <p className={`text-sm ${K.suave}`}>{descripcion}</p>}</div>}
          {derecha}
        </div>
      )}
      {children}
    </section>
  )
}

type VarianteBoton = 'primario' | 'oro' | 'suave' | 'peligro' | 'peligroSolido' | 'fantasma'
export function Boton({ variante = 'primario', className = '', icono, children, ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { variante?: VarianteBoton; icono?: LucideIcon }) {
  const estilos = {
    primario: 'bg-[var(--p-teal)] text-white hover:bg-[var(--p-profundo)]',
    oro: 'bg-[var(--p-oro)] text-[color:var(--p-navy)] hover:opacity-90',
    suave: 'bg-[var(--p-fondo)] text-[color:var(--p-navy)] border border-[color:var(--p-borde)] hover:bg-white',
    peligro: 'bg-[#dc2626]/10 text-[#dc2626] hover:bg-[#dc2626]/15',
    peligroSolido: 'bg-[#dc2626] text-white hover:bg-[#b91c1c]',
    fantasma: 'border border-white/25 text-white hover:bg-white/10',
  }[variante]
  return (
    <button type="button" {...p} className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed transition ${estilos} ${className}`}>
      {icono && <Icono i={icono} />}
      {children}
    </button>
  )
}

// Mensaje de error de un campo: texto rojo con ícono, anunciado a lectores de pantalla.
export function MensajeError({ id, children }: { id?: string; children?: ReactNode }) {
  if (!children) return null
  return <p id={id} role="alert" className="mt-1.5 flex items-start gap-1.5 text-xs font-semibold text-[#dc2626]"><AlertTriangle size={14} className="mt-px shrink-0" aria-hidden />{children}</p>
}
const conError = (error?: string) => (error ? ' !border-[#dc2626] focus:!border-[#dc2626] focus:!ring-[#dc2626]/20' : '')

export function Campo({ label, className = '', error, ...p }: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  const id = useId()
  return (
    <div className="min-w-0">
      <label className="block">
        <span className={K.etiqueta}>{label}</span>
        <input {...p} aria-invalid={!!error || undefined} aria-describedby={error ? id : undefined} className={`${K.campo}${conError(error)} ${className}`} />
      </label>
      <MensajeError id={id}>{error}</MensajeError>
    </div>
  )
}

export function AreaTexto({ label, className = '', error, ...p }: TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; error?: string }) {
  const id = useId()
  return (
    <div className="min-w-0">
      <label className="block">
        {label && <span className={K.etiqueta}>{label}</span>}
        <textarea {...p} aria-invalid={!!error || undefined} aria-describedby={error ? id : undefined} className={`${K.campo}${conError(error)} ${className}`} />
      </label>
      <MensajeError id={id}>{error}</MensajeError>
    </div>
  )
}

export function Selector({ label, opciones, className = '', error, ...p }: SelectHTMLAttributes<HTMLSelectElement> & { label: string; opciones: { valor: string; texto: string }[]; error?: string }) {
  const id = useId()
  return (
    <div className="min-w-0">
      <label className="block">
        <span className={K.etiqueta}>{label}</span>
        <select {...p} aria-invalid={!!error || undefined} aria-describedby={error ? id : undefined} className={`${K.campo}${conError(error)} ${className}`}>
          {opciones.map((o) => <option key={o.valor} value={o.valor}>{o.texto}</option>)}
        </select>
      </label>
      <MensajeError id={id}>{error}</MensajeError>
    </div>
  )
}

export const normalizar = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim()

// Campo de texto con lista desplegable filtrada mientras se escribe (autocompletado). Acepta texto libre.
export function Combo({ label, value, onChange, opciones, placeholder, ayuda, error }: {
  label: string; value: string; onChange: (v: string) => void; opciones: string[]; placeholder?: string; ayuda?: string; error?: string
}) {
  const idError = useId()
  const [abierto, setAbierto] = useState(false)
  const q = normalizar(value)
  const lista = opciones.filter((o) => !q || normalizar(o).includes(q)).slice(0, 40)
  return (
    <div className="relative min-w-0">
      <label className="block">
        <span className={K.etiqueta}>{label}</span>
        <input
          value={value}
          onChange={(e) => { onChange(e.target.value); setAbierto(true) }}
          onClick={() => setAbierto(true)}
          onKeyDown={(e) => { if (e.key === 'ArrowDown') setAbierto(true); if (e.key === 'Escape') setAbierto(false) }}
          onBlur={() => setTimeout(() => setAbierto(false), 120)}
          placeholder={placeholder}
          autoComplete="off"
          role="combobox"
          aria-expanded={abierto}
          aria-invalid={!!error || undefined}
          aria-describedby={error ? idError : undefined}
          className={`${K.campo}${conError(error)}`}
        />
      </label>
      <MensajeError id={idError}>{error}</MensajeError>
      {ayuda && <p className={`text-xs mt-1 ${K.suave}`}>{ayuda}</p>}
      {abierto && lista.length > 0 && !(lista.length === 1 && lista[0] === value) && (
        <ul role="listbox" className={`absolute z-30 mt-1 max-h-56 w-full overflow-auto rounded-xl border ${K.borde} bg-white shadow-lg`}>
          {lista.map((o) => (
            <li key={o}>
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); onChange(o); setAbierto(false) }}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-[var(--p-fondo)]"
              >
                {o}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function Buscador({ value, onChange, placeholder = 'Buscar…' }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="relative block min-w-0 flex-1 basis-56">
      <span className="sr-only">Buscar</span>
      <Search size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${K.suave}`} />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`${K.campo} !pl-10`} />
      {value && (
        <button type="button" onClick={() => onChange('')} aria-label="Limpiar búsqueda" className={`absolute right-3 top-1/2 -translate-y-1/2 ${K.suave}`}><X size={16} /></button>
      )}
    </label>
  )
}

export function Filtro({ label, value, onChange, opciones }: { label: string; value: string; onChange: (v: string) => void; opciones: string[] }) {
  return (
    <label className="block min-w-0 basis-48 grow sm:grow-0">
      <span className="sr-only">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} aria-label={label} className={K.campo}>
        <option value="">{label}: todos</option>
        {opciones.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  )
}

export function BarraFiltros({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap gap-3 mb-4">{children}</div>
}

export type Columna<T> = { titulo: string; celda: (r: T) => ReactNode; className?: string }

// Tabla en pantallas medianas y grandes; en celular cada fila pasa a una tarjeta (`tarjeta`).
export function Tabla<T>({ filas, columnas, clave, tarjeta, vacio = 'Sin resultados.' }: {
  filas: T[]; columnas: Columna<T>[]; clave: (r: T) => string; tarjeta: (r: T) => ReactNode; vacio?: string
}) {
  if (filas.length === 0) return <Vacio>{vacio}</Vacio>
  return (
    <>
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className={`text-left text-xs uppercase tracking-wide ${K.suave} border-b ${K.borde}`}>
              {columnas.map((c) => <th key={c.titulo} className={`py-2.5 px-3 font-bold ${c.className ?? ''}`}>{c.titulo}</th>)}
            </tr>
          </thead>
          <tbody>
            {filas.map((r) => (
              <tr key={clave(r)} className={`border-b last:border-0 ${K.borde} hover:bg-[var(--p-fondo)]/60 align-top`}>
                {columnas.map((c) => <td key={c.titulo} className={`py-3 px-3 ${c.className ?? ''}`}>{c.celda(r)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="md:hidden space-y-3">
        {filas.map((r) => (
          <div key={clave(r)} className={`rounded-xl border ${K.borde} p-3`}>{tarjeta(r)}</div>
        ))}
      </div>
    </>
  )
}

export function Chip({ children, tono = 'teal', onQuitar }: { children: ReactNode; tono?: 'teal' | 'oro' | 'gris'; onQuitar?: () => void }) {
  const t = {
    teal: 'bg-[var(--p-teal)]/10 text-[color:var(--p-profundo)]',
    oro: 'bg-[var(--p-oro)]/25 text-[#7a4d00]',
    gris: 'bg-[var(--p-fondo)] text-[color:var(--p-suave)]',
  }[tono]
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${t}`}>
      {children}
      {onQuitar && <button type="button" onClick={onQuitar} aria-label="Quitar" className="opacity-70 hover:opacity-100"><X size={12} /></button>}
    </span>
  )
}

export function Etiqueta({ texto }: { texto: string }) {
  const color = texto === 'Firme' || texto === 'Descargo rechazado' || texto === 'Observado'
    ? 'bg-[#dc2626]/10 text-[#dc2626]'
    : texto === 'En revisión' || texto === 'Pendiente'
      ? 'bg-[#f3a21c]/30 text-[#8a5a00]'
      : 'bg-[#16a34a]/10 text-[#16a34a]'
  return <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold whitespace-nowrap ${color}`}>{texto}</span>
}

export const COLOR_ESTADO: Record<string, string> = {
  Firme: C.rojo, 'Descargo rechazado': '#9a1b1b', 'En revisión': C.oro, 'Descargo aceptado': C.verde,
  Pendiente: C.oro, Aprobado: C.verde, Observado: C.rojo,
}

export function Vacio({ children, icono = Inbox, accion }: { children: ReactNode; icono?: LucideIcon; accion?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 py-8 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--p-fondo)] text-[color:var(--p-suave)]"><Icono i={icono} t="lg" /></span>
      <p className={`text-sm max-w-sm ${K.suave}`}>{children}</p>
      {accion}
    </div>
  )
}

// Paginación de listas: vuelve a la primera si cambia el largo.
export function usePaginas<T>(items: T[], por = 6) {
  const [p, setP] = useState(0)
  const total = Math.max(1, Math.ceil(items.length / por))
  useEffect(() => setP(0), [items.length])
  const a = Math.min(p, total - 1)
  return { items: items.slice(a * por, (a + 1) * por), pagina: a, total, ir: setP }
}

export function Paginador({ pagina, total, ir }: { pagina: number; total: number; ir: (n: number) => void }) {
  if (total <= 1) return null
  return (
    <div className="flex items-center justify-center gap-4 pt-4">
      <Boton variante="suave" disabled={pagina === 0} onClick={() => ir(pagina - 1)} aria-label="Página anterior" icono={ChevronLeft}><span className="sr-only sm:not-sr-only">Anterior</span></Boton>
      <span className={`text-sm ${K.suave} font-semibold`}>Página {pagina + 1} de {total}</span>
      <Boton variante="suave" disabled={pagina >= total - 1} onClick={() => ir(pagina + 1)} aria-label="Página siguiente"><span className="sr-only sm:not-sr-only">Siguiente</span><Icono i={ChevronRight} /></Boton>
    </div>
  )
}

// Carga de imagen guardada como data URL (demo, queda en el navegador).
const MAX_FOTO = 8 * 1024 * 1024

export function SubirFoto({ label, valor, onChange, ayuda = 'Tocar para elegir una imagen (JPG o PNG)', error }: { label: string; valor?: string; onChange: (v: string) => void; ayuda?: string; error?: string }) {
  const [problema, setProblema] = useState('')
  const mostrado = problema || error
  return (
    <div>
      <span className={K.etiqueta}>{label}</span>
      <label className={`flex items-center justify-center rounded-xl border-2 border-dashed ${mostrado ? 'border-[#dc2626]' : K.borde} bg-[var(--p-fondo)] h-32 cursor-pointer overflow-hidden hover:border-[color:var(--p-teal)]`}>
        {valor ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={valor} alt={label} className="h-full w-full object-cover" />
        ) : (
          <span className={`text-sm ${K.suave} px-3 text-center`}>{ayuda}</span>
        )}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          aria-invalid={!!mostrado || undefined}
          onChange={(e) => {
            const f = e.target.files?.[0]
            e.target.value = ''
            if (!f) return
            if (!/^image\/(jpeg|png|webp)$/.test(f.type)) return setProblema('Elegí una imagen JPG, PNG o WebP.')
            if (f.size > MAX_FOTO) return setProblema('La imagen pesa más de 8 MB. Elegí una más liviana.')
            setProblema('')
            const r = new FileReader()
            r.onerror = () => setProblema('No se pudo leer el archivo. Probá con otro.')
            r.onload = () => {
              // Se reduce para no llenar el almacenamiento del navegador.
              const img = new Image()
              img.onerror = () => setProblema('La imagen está dañada o no se puede abrir.')
              img.onload = () => {
                const k = Math.min(1, 640 / Math.max(img.width, img.height))
                const c = document.createElement('canvas')
                c.width = img.width * k
                c.height = img.height * k
                c.getContext('2d')?.drawImage(img, 0, 0, c.width, c.height)
                onChange(c.toDataURL('image/jpeg', 0.7))
              }
              img.src = String(r.result)
            }
            r.readAsDataURL(f)
          }}
        />
      </label>
      <MensajeError>{mostrado}</MensajeError>
    </div>
  )
}
