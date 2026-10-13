'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  CalendarDays, ClipboardList, Gavel, Goal, Home, Image as ImagenIcon, LayoutDashboard, Search, ShieldAlert,
  Table2, Trophy, User, Users, X, type LucideIcon,
} from 'lucide-react'
import { useEffect, useState, type ButtonHTMLAttributes, type CSSProperties, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'
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
  Resumen: LayoutDashboard, Inicio: Home, Descargos: Gavel, Sanciones: ShieldAlert, Jugadores: Users, Plantel: Users,
  Resultados: ClipboardList, Goleadores: Goal, Contenido: ImagenIcon, Fixture: CalendarDays, 'Fixture y posiciones': Table2,
  'Mis sanciones': ShieldAlert, Posiciones: Table2, 'Mi equipo': Trophy, 'Mi perfil': User,
}

// Estructura común de los paneles: barra con marca y usuario; navegación lateral en desktop y pestañas en celular.
export function PanelShell({ rol, titulo, tabs, tab, setTab, children }: {
  rol: Rol; titulo: string; tabs: string[]; tab: string; setTab: (t: string) => void; children: ReactNode
}) {
  const { sesion, listo, salir, reiniciar } = useDemo()
  const router = useRouter()
  useEffect(() => {
    if (listo && sesion?.rol !== rol) router.replace('/ingresar')
  }, [listo, sesion, rol, router])
  if (!listo || sesion?.rol !== rol) return <div className="min-h-screen" style={{ background: C.navy }} />
  return (
    <div className="min-h-screen bg-[var(--p-fondo)] text-[color:var(--p-texto)]" style={VARS_PANEL}>
      <header className="text-white" style={{ background: `linear-gradient(135deg, ${C.navy}, ${C.profundo})` }}>
        <div className="mx-auto max-w-[1800px] 2xl:max-w-[2200px] px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-wrap items-center gap-3 justify-between">
          <div className="min-w-0">
            <Link href="/" className="text-xs uppercase tracking-[0.25em] font-bold" style={{ color: C.oro }}>Torneo Imperial</Link>
            <h1 className="font-heading text-2xl sm:text-3xl mt-1">{titulo}</h1>
            <p className="text-white/70 text-sm truncate">{sesion.nombre}{sesion.equipo ? ` · ${sesion.equipo}` : ''}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={reiniciar} className="rounded-full border border-white/25 px-4 py-2 text-sm hover:bg-white/10">Reiniciar demo</button>
            <button onClick={() => { salir(); router.replace('/') }} className="rounded-full px-4 py-2 text-sm font-bold" style={{ background: C.oro, color: C.navy }}>Salir</button>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-[1800px] 2xl:max-w-[2200px] px-4 sm:px-6 lg:px-8 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-8">
        <aside className="lg:py-6">
          <nav
            aria-label="Secciones del panel"
            className="sticky top-0 z-20 -mx-4 sm:-mx-6 lg:mx-0 lg:top-4 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible bg-[var(--p-fondo)]/95 backdrop-blur px-4 sm:px-6 lg:px-0 py-3 lg:py-0 border-b lg:border-0 border-[color:var(--p-borde)]"
          >
            {tabs.map((t) => {
              const Icono = ICONOS[t] ?? LayoutDashboard
              const activa = tab === t
              return (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  aria-current={activa ? 'page' : undefined}
                  className={`shrink-0 inline-flex items-center gap-2 rounded-full lg:rounded-xl px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition ${activa ? 'bg-[var(--p-navy)] text-white shadow' : 'bg-white text-[color:var(--p-suave)] border border-[color:var(--p-borde)] hover:text-[color:var(--p-navy)]'}`}
                >
                  <Icono size={16} style={activa ? { color: C.oro } : undefined} />
                  {t}
                </button>
              )
            })}
          </nav>
        </aside>
        <main className="min-w-0 py-6 space-y-6">
          <p className={`text-xs ${K.suave} bg-white rounded-xl px-4 py-2 border ${K.borde}`}>
            Demo: los datos se guardan solo en este navegador. No subas documentos reales.
          </p>
          {children}
        </main>
      </div>
    </div>
  )
}

export function Tarjeta({ titulo, children, derecha, className = '' }: { titulo?: string; children: ReactNode; derecha?: ReactNode; className?: string }) {
  return (
    <section className={`bg-white rounded-2xl border ${K.borde} p-4 sm:p-5 min-w-0 ${className}`}>
      {(titulo || derecha) && (
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          {titulo && <h2 className="font-heading text-xl text-[color:var(--p-navy)]">{titulo}</h2>}
          {derecha}
        </div>
      )}
      {children}
    </section>
  )
}

export function Boton({ variante = 'primario', className = '', ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { variante?: 'primario' | 'oro' | 'suave' | 'peligro' }) {
  const estilos = {
    primario: 'bg-[var(--p-teal)] text-white hover:bg-[var(--p-profundo)]',
    oro: 'bg-[var(--p-oro)] text-[color:var(--p-navy)] hover:opacity-90',
    suave: 'bg-[var(--p-fondo)] text-[color:var(--p-navy)] border border-[color:var(--p-borde)] hover:bg-white',
    peligro: 'bg-[#dc2626]/10 text-[#dc2626] hover:bg-[#dc2626]/15',
  }[variante]
  return <button type="button" {...p} className={`rounded-xl px-4 py-2.5 text-sm font-bold disabled:opacity-40 transition ${estilos} ${className}`} />
}

export function Campo({ label, className = '', ...p }: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block min-w-0">
      <span className={K.etiqueta}>{label}</span>
      <input {...p} className={`${K.campo} ${className}`} />
    </label>
  )
}

export function AreaTexto({ label, className = '', ...p }: TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }) {
  return (
    <label className="block min-w-0">
      {label && <span className={K.etiqueta}>{label}</span>}
      <textarea {...p} className={`${K.campo} ${className}`} />
    </label>
  )
}

export function Selector({ label, opciones, className = '', ...p }: SelectHTMLAttributes<HTMLSelectElement> & { label: string; opciones: { valor: string; texto: string }[] }) {
  return (
    <label className="block min-w-0">
      <span className={K.etiqueta}>{label}</span>
      <select {...p} className={`${K.campo} ${className}`}>
        {opciones.map((o) => <option key={o.valor} value={o.valor}>{o.texto}</option>)}
      </select>
    </label>
  )
}

export const normalizar = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim()

// Campo de texto con lista desplegable filtrada mientras se escribe (autocompletado). Acepta texto libre.
export function Combo({ label, value, onChange, opciones, placeholder, ayuda }: {
  label: string; value: string; onChange: (v: string) => void; opciones: string[]; placeholder?: string; ayuda?: string
}) {
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
          onFocus={() => setAbierto(true)}
          onBlur={() => setTimeout(() => setAbierto(false), 120)}
          placeholder={placeholder}
          autoComplete="off"
          role="combobox"
          aria-expanded={abierto}
          className={K.campo}
        />
      </label>
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
  if (filas.length === 0) return <p className={`text-sm ${K.suave} py-6 text-center`}>{vacio}</p>
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

export function Vacio({ children }: { children: ReactNode }) {
  return <p className={`text-sm ${K.suave} py-4`}>{children}</p>
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
      <Boton variante="suave" disabled={pagina === 0} onClick={() => ir(pagina - 1)} aria-label="Página anterior">←</Boton>
      <span className={`text-sm ${K.suave} font-semibold`}>Página {pagina + 1} de {total}</span>
      <Boton variante="suave" disabled={pagina >= total - 1} onClick={() => ir(pagina + 1)} aria-label="Página siguiente">→</Boton>
    </div>
  )
}

// Carga de imagen guardada como data URL (demo, queda en el navegador).
export function SubirFoto({ label, valor, onChange, ayuda = 'Tocar para elegir una imagen (JPG o PNG)' }: { label: string; valor?: string; onChange: (v: string) => void; ayuda?: string }) {
  return (
    <div>
      <span className={K.etiqueta}>{label}</span>
      <label className={`flex items-center justify-center rounded-xl border-2 border-dashed ${K.borde} bg-[var(--p-fondo)] h-32 cursor-pointer overflow-hidden hover:border-[color:var(--p-teal)]`}>
        {valor ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={valor} alt={label} className="h-full w-full object-cover" />
        ) : (
          <span className={`text-sm ${K.suave} px-3 text-center`}>{ayuda}</span>
        )}
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (!f) return
            const r = new FileReader()
            r.onload = () => {
              // Se reduce para no llenar el almacenamiento del navegador.
              const img = new Image()
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
    </div>
  )
}
