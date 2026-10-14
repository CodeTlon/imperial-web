import Image from 'next/image'
import { Trophy } from 'lucide-react'
import { goleadores, posiciones, type Categoria } from '@/lib/torneo-data'

type Equipo = (typeof posiciones)[Categoria][number]

export function TablaPosiciones({ equipos, conAjustes }: { equipos: Equipo[]; conAjustes: boolean }) {
  return (
    <table className="w-full text-xs sm:text-sm 2xl:text-base">
      <thead>
        <tr className="text-left border-b" style={{ borderColor: 'var(--demo-border)' }}>
          {['#', 'Equipo', 'PJ', 'PG', 'PE', 'PP', 'GF', 'GC', 'DG', ...(conAjustes ? ['AP', 'QP'] : []), 'Pts'].map((h) => (
            <th key={h} style={h === 'Pts' ? { backgroundColor: 'var(--demo-surface)', color: 'var(--demo-muted)' } : { color: 'var(--demo-muted)' }} className={`${['GF', 'GC', 'PG', 'PE', 'PP', 'AP', 'QP'].includes(h) ? 'hidden sm:table-cell ' : ''}${h === 'Pts' ? 'sticky right-0 ' : ''}py-2.5 px-1 sm:px-1.5 font-semibold uppercase text-[10px] sm:text-xs tracking-wider whitespace-nowrap`}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {equipos.map((e, i) => (
          <tr key={e.nombre} className="border-b last:border-0 fila-in" style={{ borderColor: 'var(--demo-border)', ['--i' as string]: i } as React.CSSProperties}>
            <td className="py-2 px-1 sm:px-1.5 font-bold" style={{ color: i < 2 ? 'var(--demo-accent)' : 'var(--demo-muted)' }}>{i + 1}</td>
            <td className="py-2 px-1 sm:px-1.5 font-medium w-full max-w-0">
              <div className="flex items-center gap-1.5 min-w-0">
                {e.escudo && (
                  <span className="relative w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0">
                    <Image src={e.escudo} alt="" fill className="object-contain" />
                  </span>
                )}
                <span className="truncate" title={e.nombre} style={{ color: 'var(--demo-heading)' }}>{e.nombre}</span>
              </div>
            </td>
            <td className="py-2 px-1 sm:px-1.5" style={{ color: 'var(--demo-text)' }}>{e.pj}</td>
            <td className="hidden sm:table-cell py-2 px-1 sm:px-1.5" style={{ color: 'var(--demo-text)' }}>{e.pg}</td>
            <td className="hidden sm:table-cell py-2 px-1 sm:px-1.5" style={{ color: 'var(--demo-text)' }}>{e.pe}</td>
            <td className="hidden sm:table-cell py-2 px-1 sm:px-1.5" style={{ color: 'var(--demo-text)' }}>{e.pp}</td>
            <td className="hidden sm:table-cell py-2 px-1 sm:px-1.5" style={{ color: 'var(--demo-text)' }}>{e.gf}</td>
            <td className="hidden sm:table-cell py-2 px-1 sm:px-1.5" style={{ color: 'var(--demo-text)' }}>{e.gc}</td>
            <td className="py-2 px-1 sm:px-1.5" style={{ color: 'var(--demo-text)' }}>{e.gf - e.gc}</td>
            {conAjustes && (
              <>
                <td className="hidden sm:table-cell py-2 px-1 sm:px-1.5" style={{ color: 'var(--demo-muted)' }}>{e.ap ?? '–'}</td>
                <td className="hidden sm:table-cell py-2 px-1 sm:px-1.5" style={{ color: 'var(--demo-muted)' }}>{e.qp ?? '–'}</td>
              </>
            )}
            <td className="sticky right-0 py-2 px-1 sm:px-1.5 font-bold" style={{ backgroundColor: 'var(--demo-surface)', color: 'var(--demo-accent)' }}>{e.pg * 3 + e.pe}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

type Goleador = (typeof goleadores)[Categoria][number]

// Tarjeta de goleadores: la misma en /posiciones y en el inicio.
export function TarjetaGoleadores({ top, categoria }: { top: Goleador[]; categoria: string }) {
  return (
    <div className="card">
      <h3 className="font-bold text-lg mb-5 flex items-center gap-2" style={{ color: 'var(--demo-heading)' }}>
        <Trophy size={20} style={{ color: 'var(--demo-accent)' }} /> Goleadores — {categoria}
      </h3>
      <ol className="space-y-4">
        {top.map((g, i) => (
          <li key={g.jugador} className="flex items-center justify-between gap-3 min-w-0">
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-7 h-7 flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ backgroundColor: 'var(--demo-surface-alt)', color: 'var(--demo-accent)', borderRadius: 'var(--demo-radius)' }}>
                {i + 1}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: 'var(--demo-heading)' }}>{g.jugador}</p>
                <p className="text-xs" style={{ color: 'var(--demo-muted)' }}>{g.equipo}</p>
              </div>
            </div>
            <span className="font-bold" style={{ color: 'var(--demo-accent)' }}>{g.goles}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

export function NotaAjustes() {
  return (
    <p className="text-xs px-1" style={{ color: 'var(--demo-muted)' }}>
      AP: adición de puntos administrativa · QP: quita de puntos pendiente de aplicar (Art. 26 del reglamento).
    </p>
  )
}
