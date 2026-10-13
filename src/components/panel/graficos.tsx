'use client'

import type { ReactNode } from 'react'
import { C, K } from '@/components/panel/ui'

// Gráficos propios en SVG/CSS, sin librerías. Se adaptan al ancho del contenedor.

export type Dato = { etiqueta: string; valor: number; color?: string }

export function Kpi({ titulo, valor, detalle, color = C.teal, onClick }: { titulo: string; valor: ReactNode; detalle?: string; color?: string; onClick?: () => void }) {
  const cuerpo = (
    <>
      <span className="absolute inset-y-0 left-0 w-1.5" style={{ background: color }} />
      <p className="font-heading text-4xl leading-none text-[color:var(--p-navy)]">{valor}</p>
      <p className={`text-sm mt-2 font-semibold ${K.navy}`}>{titulo}</p>
      {detalle && <p className={`text-xs mt-0.5 ${K.suave}`}>{detalle}</p>}
    </>
  )
  const cls = `relative overflow-hidden text-left bg-white rounded-2xl border ${K.borde} p-5 pl-6 min-w-0`
  return onClick ? <button type="button" onClick={onClick} className={`${cls} hover:border-[color:var(--p-teal)] transition`}>{cuerpo}</button> : <div className={cls}>{cuerpo}</div>
}

// Barras horizontales: etiqueta, barra y valor. Sirve igual en 360 px que en 2560 px.
export function BarrasH({ datos, color = C.teal, max, vacio = 'Sin datos todavía.' }: { datos: Dato[]; color?: string; max?: number; vacio?: string }) {
  if (datos.length === 0) return <p className={`text-sm ${K.suave}`}>{vacio}</p>
  const tope = max ?? Math.max(1, ...datos.map((d) => d.valor))
  return (
    <ul className="space-y-2.5">
      {datos.map((d) => (
        <li key={d.etiqueta} className="grid grid-cols-[minmax(0,7.5rem)_1fr_auto] sm:grid-cols-[minmax(0,10rem)_1fr_auto] items-center gap-3 text-sm">
          <span className="truncate" title={d.etiqueta}>{d.etiqueta}</span>
          <span className="h-3 rounded-full bg-[var(--p-fondo)] overflow-hidden">
            <span className="block h-full rounded-full" style={{ width: `${Math.max(2, (d.valor / tope) * 100)}%`, background: d.color ?? color }} />
          </span>
          <span className="font-heading text-base tabular-nums w-8 text-right">{d.valor}</span>
        </li>
      ))}
    </ul>
  )
}

// Columnas verticales con eje: pensadas para pocos puntos (fechas, categorías).
export function BarrasV({ datos, color = C.teal, alto = 180, vacio = 'Sin datos todavía.' }: { datos: Dato[]; color?: string; alto?: number; vacio?: string }) {
  if (datos.length === 0 || datos.every((d) => d.valor === 0)) return <p className={`text-sm ${K.suave}`}>{vacio}</p>
  const tope = Math.max(1, ...datos.map((d) => d.valor))
  const W = Math.max(280, datos.length * 44), padB = 28, padT = 18
  const h = alto
  const ancho = W / datos.length
  return (
    <svg viewBox={`0 0 ${W} ${h + padB}`} className="w-full" style={{ height: 'auto', maxHeight: 280 }} role="img" aria-label="Gráfico de barras">
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <line key={f} x1={0} x2={W} y1={padT + (h - padT) * (1 - f)} y2={padT + (h - padT) * (1 - f)} stroke={C.borde} strokeDasharray="3 4" />
      ))}
      {datos.map((d, i) => {
        const bh = ((h - padT) * d.valor) / tope
        const x = i * ancho + ancho * 0.2
        const w = ancho * 0.6
        return (
          <g key={d.etiqueta}>
            <rect x={x} y={h - bh} width={w} height={bh} rx={4} fill={d.color ?? color} />
            <text x={x + w / 2} y={h - bh - 5} textAnchor="middle" fontSize="12" fontWeight="700" fill={C.navy}>{d.valor}</text>
            <text x={x + w / 2} y={h + 17} textAnchor="middle" fontSize="11" fill={C.suave}>{d.etiqueta}</text>
          </g>
        )
      })}
    </svg>
  )
}

// Dona con leyenda; el centro muestra el total.
export function Dona({ datos, centro, vacio = 'Sin datos todavía.' }: { datos: Dato[]; centro?: string; vacio?: string }) {
  const total = datos.reduce((a, d) => a + d.valor, 0)
  if (total === 0) return <p className={`text-sm ${K.suave}`}>{vacio}</p>
  const R = 52, r = 34, cx = 60, cy = 60
  let ang = -Math.PI / 2
  const arcos = datos.filter((d) => d.valor > 0).map((d) => {
    const frac = d.valor / total
    const a0 = ang
    const a1 = ang + frac * Math.PI * 2 - (frac === 1 ? 0.0001 : 0)
    ang += frac * Math.PI * 2
    const p = (rad: number, a: number) => `${cx + rad * Math.cos(a)} ${cy + rad * Math.sin(a)}`
    const g = a1 - a0 > Math.PI ? 1 : 0
    return { d, path: `M ${p(R, a0)} A ${R} ${R} 0 ${g} 1 ${p(R, a1)} L ${p(r, a1)} A ${r} ${r} 0 ${g} 0 ${p(r, a0)} Z` }
  })
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
      <svg viewBox="0 0 120 120" className="w-32 h-32 sm:w-36 sm:h-36 shrink-0" role="img" aria-label={`Total ${total}`}>
        {arcos.map(({ d, path }) => <path key={d.etiqueta} d={path} fill={d.color ?? C.teal} />)}
        <text x={cx} y={cy + 2} textAnchor="middle" fontSize="20" fontWeight="700" fill={C.navy}>{total}</text>
        {centro && <text x={cx} y={cy + 15} textAnchor="middle" fontSize="7" fill={C.suave}>{centro}</text>}
      </svg>
      <ul className="space-y-1.5 text-sm min-w-0">
        {datos.map((d) => (
          <li key={d.etiqueta} className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm shrink-0" style={{ background: d.color ?? C.teal }} />
            <span className="truncate">{d.etiqueta}</span>
            <span className="font-heading tabular-nums ml-1">{d.valor}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// Línea con área para series cortas (p. ej. resultados cargados por fecha).
export function Linea({ datos, color = C.teal, vacio = 'Sin datos todavía.' }: { datos: Dato[]; color?: string; vacio?: string }) {
  if (datos.length < 2) return <p className={`text-sm ${K.suave}`}>{vacio}</p>
  const W = 320, H = 150, pad = 24
  const tope = Math.max(1, ...datos.map((d) => d.valor))
  const pts = datos.map((d, i) => [pad + (i * (W - pad * 2)) / (datos.length - 1), H - pad - ((H - pad * 2) * d.valor) / tope] as const)
  const linea = pts.map(([x, y], i) => `${i ? 'L' : 'M'} ${x} ${y}`).join(' ')
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 'auto', maxHeight: 260 }} role="img" aria-label="Gráfico de línea">
      <path d={`${linea} L ${pts[pts.length - 1][0]} ${H - pad} L ${pts[0][0]} ${H - pad} Z`} fill={color} opacity={0.12} />
      <path d={linea} fill="none" stroke={color} strokeWidth={2.5} strokeLinejoin="round" />
      {pts.map(([x, y], i) => (
        <g key={datos[i].etiqueta}>
          <circle cx={x} cy={y} r={3.5} fill="#fff" stroke={color} strokeWidth={2} />
          <text x={x} y={y - 8} textAnchor="middle" fontSize="10" fontWeight="700" fill={C.navy}>{datos[i].valor}</text>
          <text x={x} y={H - 7} textAnchor="middle" fontSize="9" fill={C.suave}>{datos[i].etiqueta}</text>
        </g>
      ))}
    </svg>
  )
}

// Semáforo de documentación: tres contadores con color.
export function Semaforo({ aprobados, pendientes, observados }: { aprobados: number; pendientes: number; observados: number }) {
  const total = Math.max(1, aprobados + pendientes + observados)
  const items = [
    { t: 'Aprobados', n: aprobados, c: C.verde },
    { t: 'Pendientes', n: pendientes, c: C.oro },
    { t: 'Observados', n: observados, c: C.rojo },
  ]
  return (
    <div className="space-y-3">
      <div className="flex h-3 rounded-full overflow-hidden bg-[var(--p-fondo)]">
        {items.map((i) => <span key={i.t} style={{ width: `${(i.n / total) * 100}%`, background: i.c }} />)}
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        {items.map((i) => (
          <div key={i.t} className="rounded-xl bg-[var(--p-fondo)] py-2">
            <p className="font-heading text-2xl" style={{ color: i.c }}>{i.n}</p>
            <p className={`text-xs ${K.suave}`}>{i.t}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
