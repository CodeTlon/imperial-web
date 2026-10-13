'use client'

import { CalendarPlus, MapPin, Star } from 'lucide-react'
import { fixturePorCategoria, proximaFechaDe, type Categoria } from '@/lib/torneo-data'
import { useMiEquipo } from '@/lib/mi-equipo'

// 'SÁBADO 10-10' + '10:00 hs' -> Date (año actual; el fixture no trae año)
export function fechaDelPartido(fechaLabel: string, hora: string): Date | null {
  const f = fechaLabel.match(/(\d{1,2})-(\d{1,2})/)
  const h = hora.match(/(\d{1,2}):(\d{2})/)
  if (!f || !h) return null
  return new Date(new Date().getFullYear(), Number(f[2]) - 1, Number(f[1]), Number(h[1]), Number(h[2]))
}

const ics = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')

function descargarIcs(titulo: string, inicio: Date, lugar: string) {
  const fin = new Date(inicio.getTime() + 60 * 60 * 1000)
  const cuerpo = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Torneo Imperial//ES', 'BEGIN:VEVENT',
    `UID:${inicio.getTime()}@torneoimperial`, `DTSTAMP:${ics(new Date())}`,
    `DTSTART:${ics(inicio)}`, `DTEND:${ics(fin)}`, `SUMMARY:${titulo}`, `LOCATION:${lugar}`,
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n')
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([cuerpo], { type: 'text/calendar' }))
  a.download = 'partido-imperial.ics'
  a.click()
  URL.revokeObjectURL(a.href)
}

// Si hay equipos marcados con ☆, muestra el próximo partido del primero que tenga uno pendiente.
export default function MiProximoPartido() {
  const { favoritos } = useMiEquipo()
  for (const fav of favoritos) {
    const cat = fav.categoria as Categoria
    if (!fixturePorCategoria[cat]) continue
    const fecha = proximaFechaDe(cat)
    const p = fecha.partidos.find((x) => (x.local === fav.nombre || x.visitante === fav.nombre) && x.golesLocal === undefined)
    if (!p) continue
    const inicio = fechaDelPartido(fecha.fechaLabel, p.hora)
    return (
      <div className="card !p-4 mb-5 border-2" style={{ borderColor: 'var(--demo-accent)' }}>
        <p className="eyebrow !mb-2 flex items-center gap-1.5"><Star size={13} /> Tu próximo partido · {cat}</p>
        <p className="font-bold" style={{ color: 'var(--demo-heading)' }}>{p.local} vs {p.visitante}</p>
        <p className="text-sm mt-1" style={{ color: 'var(--demo-muted)' }}>Fecha {fecha.numero} · {fecha.fechaLabel} · {p.hora}{p.cancha ? ` · ${p.cancha}` : ''}</p>
        <div className="flex flex-wrap gap-3 mt-3">
          {inicio && (
            <button
              onClick={() => descargarIcs(`${p.local} vs ${p.visitante} (Torneo Imperial)`, inicio, p.cancha ?? 'Torneo Imperial, Coronado de Gloria')}
              className="inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: 'var(--demo-heading)' }}
            >
              <CalendarPlus size={15} /> Agregar al calendario
            </button>
          )}
          <a href="/como-llegar" className="inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: 'var(--demo-heading)' }}>
            <MapPin size={15} /> Cómo llegar
          </a>
        </div>
      </div>
    )
  }
  return (
    <p className="text-center text-xs mb-5" style={{ color: 'var(--demo-muted)' }}>
      Tocá la ☆ de tu equipo para ver acá su próximo partido.
    </p>
  )
}
