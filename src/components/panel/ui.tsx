'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode } from 'react'
import { useDemo, type Rol } from '@/lib/demo-store'

export const NAVY = '#0c1d3d'
export const ORO = '#ffc72c'

// Estructura común de los paneles: barra navy con marca, rol, pestañas y salir.
export function PanelShell({ rol, titulo, tabs, tab, setTab, children }: {
  rol: Rol; titulo: string; tabs: string[]; tab: string; setTab: (t: string) => void; children: ReactNode
}) {
  const { sesion, listo, salir, reiniciar } = useDemo()
  const router = useRouter()
  useEffect(() => {
    if (listo && sesion?.rol !== rol) router.replace('/ingresar')
  }, [listo, sesion, rol, router])
  if (!listo || sesion?.rol !== rol) return <div className="min-h-screen" style={{ background: NAVY }} />
  return (
    <div className="min-h-screen bg-[#f2f4f8] text-[#233240]">
      <header style={{ background: NAVY }} className="text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-5 flex flex-wrap items-center gap-4 justify-between">
          <div>
            <Link href="/" className="text-xs uppercase tracking-[0.25em] font-bold" style={{ color: ORO }}>Torneo Imperial</Link>
            <h1 className="font-heading text-2xl sm:text-3xl mt-1">{titulo}</h1>
            <p className="text-white/60 text-sm">{sesion.nombre}{sesion.equipo ? ` · ${sesion.equipo}` : ''}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={reiniciar} className="rounded-full border border-white/25 px-4 py-2 text-sm hover:bg-white/10">Reiniciar demo</button>
            <button onClick={() => { salir(); router.replace('/') }} className="rounded-full px-4 py-2 text-sm font-bold" style={{ background: ORO, color: NAVY }}>Salir</button>
          </div>
        </div>
        <nav className="mx-auto max-w-6xl px-4 sm:px-6 flex gap-1 overflow-x-auto" aria-label="Secciones del panel">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap ${tab === t ? 'border-[#ffc72c] text-white' : 'border-transparent text-white/60 hover:text-white'}`}
            >
              {t}
            </button>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8 space-y-6">
        <p className="text-xs text-[#6b7685] bg-white rounded-xl px-4 py-2 border border-[#e3e7ee]">
          Demo: los datos se guardan solo en este navegador. No subas documentos reales.
        </p>
        {children}
      </main>
    </div>
  )
}

export function Tarjeta({ titulo, children, derecha }: { titulo?: string; children: ReactNode; derecha?: ReactNode }) {
  return (
    <section className="bg-white rounded-2xl border border-[#e3e7ee] p-4 sm:p-5 min-w-0">
      {(titulo || derecha) && (
        <div className="flex items-center justify-between gap-3 mb-4">
          {titulo && <h2 className="font-heading text-xl" style={{ color: NAVY }}>{titulo}</h2>}
          {derecha}
        </div>
      )}
      {children}
    </section>
  )
}

export function Boton({ variante = 'primario', className = '', ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { variante?: 'primario' | 'oro' | 'suave' | 'peligro' }) {
  const estilos = {
    primario: 'bg-[#0c1d3d] text-white hover:opacity-90',
    oro: 'bg-[#ffc72c] text-[#0c1d3d] hover:opacity-90',
    suave: 'bg-[#f2f4f8] text-[#0c1d3d] border border-[#e3e7ee] hover:bg-[#e9edf4]',
    peligro: 'bg-[#dc2626]/10 text-[#dc2626] hover:bg-[#dc2626]/15',
  }[variante]
  return <button {...p} className={`rounded-xl px-4 py-2.5 text-sm font-bold disabled:opacity-40 transition ${estilos} ${className}`} />
}

export function Campo({ label, className = '', ...p }: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block min-w-0">
      <span className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: NAVY }}>{label}</span>
      <input {...p} className={`w-full min-w-0 rounded-xl border border-[#e3e7ee] bg-[#f2f4f8] px-4 py-3 text-sm outline-none focus:border-[#0c1d3d] ${className}`} />
    </label>
  )
}

export function Etiqueta({ texto }: { texto: string }) {
  const color = texto === 'Firme' || texto === 'Descargo rechazado' || texto === 'Observado'
    ? 'bg-[#dc2626]/10 text-[#dc2626]'
    : texto === 'En revisión' || texto === 'Pendiente'
      ? 'bg-[#ffc72c]/30 text-[#8a5a00]'
      : 'bg-[#16a34a]/10 text-[#16a34a]'
  return <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${color}`}>{texto}</span>
}

// Paginación de listas: 6 por página, vuelve a la primera si cambia el largo.
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
      <span className="text-sm text-[#6b7685] font-semibold">Página {pagina + 1} de {total}</span>
      <Boton variante="suave" disabled={pagina >= total - 1} onClick={() => ir(pagina + 1)} aria-label="Página siguiente">→</Boton>
    </div>
  )
}

// Carga de imagen guardada como data URL (demo, queda en el navegador).
export function SubirFoto({ label, valor, onChange }: { label: string; valor?: string; onChange: (v: string) => void }) {
  return (
    <div>
      <span className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: NAVY }}>{label}</span>
      <label className="flex items-center justify-center rounded-xl border-2 border-dashed border-[#e3e7ee] bg-[#f2f4f8] h-32 cursor-pointer overflow-hidden hover:border-[#0c1d3d]">
        {valor ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={valor} alt={label} className="h-full w-full object-cover" />
        ) : (
          <span className="text-sm text-[#6b7685]">Tocar para elegir imagen</span>
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
