'use client'

import { useState } from 'react'
import { Clock, ChevronLeft, ChevronRight, CalendarCheck, Check } from 'lucide-react'
import { demoConfig } from '@/lib/demo-config'
import { waLink } from '@/lib/utils'

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

const SLOTS = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00']
const TAKEN = [0, 2, 5]  // índices de slots "ocupados" en la demo

export default function Schedule() {
  const { business } = demoConfig
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const today = now.getDate()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const calendarCells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  // Estado real: el cliente elige día y horario, y el botón arma el turno.
  const [day, setDay] = useState<number>(today)
  const [slot, setSlot] = useState<string | null>(null)

  const waMsg = `Hola ${business.name}! Quiero reservar un turno para el ${day} de ${MONTHS[month]}` +
    (slot ? ` a las ${slot}.` : '.')

  return (
    <section id="schedule" className="section-pad" style={{ backgroundColor: 'var(--demo-surface)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="eyebrow">Agendá online</p>
          <h2 className="section-title">Reservá tu turno</h2>
          <p className="section-subtitle mt-4">
            Elegí el día y horario que mejor te quede.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Calendario */}
          <div className="card p-6" style={{ backgroundColor: 'var(--demo-surface-alt)' }}>
            <div className="flex items-center justify-between mb-6">
              <button className="p-2 opacity-50 cursor-default" style={{ backgroundColor: 'var(--demo-surface)', borderRadius: 'var(--demo-radius)', color: 'var(--demo-text)' }} disabled aria-label="Mes anterior">
                <ChevronLeft size={18} />
              </button>
              <h3 className="font-bold" style={{ color: 'var(--demo-heading)' }}>
                {MONTHS[month]} {year}
              </h3>
              <button className="p-2 opacity-50 cursor-default" style={{ backgroundColor: 'var(--demo-surface)', borderRadius: 'var(--demo-radius)', color: 'var(--demo-text)' }} disabled aria-label="Mes siguiente">
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="grid grid-cols-7 mb-2">
              {DAYS.map((d) => (
                <div key={d} className="text-center text-xs font-semibold py-1" style={{ color: 'var(--demo-muted)' }}>
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarCells.map((d, i) => {
                const selectable = d != null && d >= today
                const isSelected = d === day
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={!selectable}
                    onClick={() => d != null && setDay(d)}
                    className={`aspect-square flex items-center justify-center text-sm transition-all ${isSelected ? 'font-bold' : ''} ${selectable ? 'hover:opacity-80' : 'cursor-default'}`}
                    style={{
                      borderRadius: 'var(--demo-radius)',
                      backgroundColor: isSelected ? 'var(--demo-accent)' : selectable ? 'var(--demo-surface)' : 'transparent',
                      color: isSelected ? 'var(--demo-on-accent)' : 'var(--demo-text)',
                      opacity: !selectable ? 0.3 : 1,
                    }}
                  >
                    {d}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Slots de horario */}
          <div className="card p-6" style={{ backgroundColor: 'var(--demo-surface-alt)' }}>
            <div className="flex items-center gap-2 mb-6">
              <Clock size={18} style={{ color: 'var(--demo-accent)' }} />
              <h3 className="font-bold" style={{ color: 'var(--demo-heading)' }}>
                Horarios — {day} de {MONTHS[month]}
              </h3>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {SLOTS.map((s, i) => {
                const isTaken = TAKEN.includes(i)
                const isSelected = s === slot
                return (
                  <button
                    key={s}
                    type="button"
                    disabled={isTaken}
                    onClick={() => setSlot(s)}
                    className={`py-3 text-center text-sm font-medium transition-all ${isTaken ? 'cursor-default' : 'hover:opacity-90'}`}
                    style={{
                      borderRadius: 'var(--demo-radius)',
                      backgroundColor: isTaken ? 'var(--demo-surface)' : 'var(--demo-accent)',
                      color: isTaken ? 'var(--demo-muted)' : 'var(--demo-on-accent)',
                      opacity: isTaken ? 0.5 : 1,
                      textDecoration: isTaken ? 'line-through' : 'none',
                      outline: isSelected ? '2px solid var(--demo-heading)' : 'none',
                      outlineOffset: 2,
                    }}
                  >
                    {s}
                  </button>
                )
              })}
            </div>

            <div className="mt-8 p-4 flex items-start gap-3" style={{ backgroundColor: 'var(--demo-surface)', borderRadius: 'var(--demo-radius)' }}>
              {slot ? (
                <Check size={20} style={{ color: 'var(--demo-accent)', flexShrink: 0 }} className="mt-0.5" />
              ) : (
                <CalendarCheck size={20} style={{ color: 'var(--demo-accent)', flexShrink: 0 }} className="mt-0.5" />
              )}
              <div>
                <p className="text-sm font-semibold mb-1" style={{ color: 'var(--demo-heading)' }}>
                  {slot ? `Turno: ${day} de ${MONTHS[month]} a las ${slot}` : 'Elegí un horario'}
                </p>
                <p className="text-xs" style={{ color: 'var(--demo-muted)' }}>
                  Confirmás por WhatsApp y te respondemos en minutos.
                </p>
              </div>
            </div>

            <a
              href={waLink(business.whatsapp, waMsg)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 w-full block text-center py-3 font-semibold transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--demo-accent)', color: 'var(--demo-on-accent)', borderRadius: 'var(--demo-radius)' }}
            >
              {slot ? `Reservar ${slot} por WhatsApp` : 'Reservar por WhatsApp'}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
