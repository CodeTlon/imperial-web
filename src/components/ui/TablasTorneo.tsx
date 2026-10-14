import Image from 'next/image'
import { Trophy } from 'lucide-react'
import { escudoPorEquipo, goleadores, posiciones, type Categoria } from '@/lib/torneo-data'

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

// Tabla de goleadores: la misma en /posiciones y en el inicio, con el mismo estilo que la de posiciones.
export function TarjetaGoleadores({ top, categoria }: { top: Goleador[]; categoria: string }) {
  const maximo = Math.max(1, ...top.map((g) => g.goles))
  return (
    <div className="card card-tabla overflow-x-auto">
      <p className="eyebrow !mb-4 flex items-center gap-2"><Trophy size={16} aria-hidden /> Goleadores · {categoria}</p>
      {top.length === 0 ? (
        <p className="py-6 text-center text-sm" style={{ color: 'var(--demo-muted)' }}>Todavía no hay goles cargados en esta categoría.</p>
      ) : (
        <table className="w-full text-xs sm:text-sm 2xl:text-base">
          <caption className="sr-only">Tabla de goleadores de {categoria}</caption>
          <thead>
            <tr className="text-left border-b" style={{ borderColor: 'var(--demo-border)' }}>
              {['#', 'Jugador', 'Equipo', 'Goles'].map((h) => (
                <th key={h} scope="col" className={`${h === 'Equipo' ? 'hidden sm:table-cell ' : ''}${h === 'Goles' ? 'text-right ' : ''}py-2.5 px-1 sm:px-1.5 font-semibold uppercase text-[10px] sm:text-xs tracking-wider`} style={{ color: 'var(--demo-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {top.map((g, i) => {
              const escudo = escudoPorEquipo[g.equipo]
              return (
                <tr key={`${g.jugador}-${g.equipo}`} className="border-b last:border-0 fila-in" style={{ borderColor: 'var(--demo-border)', ['--i' as string]: i } as React.CSSProperties}>
                  <td className="py-2 px-1 sm:px-1.5 font-bold" style={{ color: i < 3 ? 'var(--demo-accent)' : 'var(--demo-muted)' }}>{i + 1}</td>
                  <td className="py-2 px-1 sm:px-1.5 font-medium w-full max-w-0">
                    <span className="block truncate" title={g.jugador} style={{ color: 'var(--demo-heading)' }}>{g.jugador}</span>
                    <span className="block truncate text-[11px] sm:hidden" style={{ color: 'var(--demo-muted)' }}>{g.equipo}</span>
                  </td>
                  <td className="hidden sm:table-cell py-2 px-1 sm:px-1.5 whitespace-nowrap" style={{ color: 'var(--demo-text)' }}>
                    <span className="flex items-center gap-1.5">
                      {escudo && <span className="relative w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"><Image src={escudo} alt="" fill className="object-contain" /></span>}
                      {g.equipo}
                    </span>
                  </td>
                  <td className="py-2 px-1 sm:px-1.5">
                    <span className="flex items-center justify-end gap-3">
                      <span aria-hidden className="hidden md:block h-1.5 w-24 overflow-hidden rounded-full" style={{ backgroundColor: 'var(--demo-surface-alt)' }}>
                        <span className="block h-full rounded-full" style={{ width: `${(g.goles / maximo) * 100}%`, backgroundColor: 'var(--demo-accent)' }} />
                      </span>
                      <span className="w-6 text-right font-bold" style={{ color: 'var(--demo-accent)' }}>{g.goles}</span>
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
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
