'use client'

import { CircleHelp, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { Icono } from '@/components/panel/icono'
import { K, Tarjeta } from '@/components/panel/ui'

export const PASOS_SANCION = [
  { t: 'La organización carga la sanción', d: 'Con el informe del árbitro, los artículos del reglamento y las fechas de suspensión.' },
  { t: 'El delegado presenta su descargo', d: 'Desde su panel, con texto y archivos: fotos, PDF o video de la jugada.' },
  { t: 'Conversan en la misma sanción', d: 'Cada parte puede responder y sumar archivos hasta tener todo claro.' },
  { t: 'La organización resuelve', d: 'Acepta o rechaza el descargo. Si hace falta, puede reabrir la resolución y marcar la sanción como cumplida.' },
]

export function PasosLista({ oscuro = false }: { oscuro?: boolean }) {
  return (
    <ol className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {PASOS_SANCION.map((p, i) => (
        <li key={p.t} className="flex gap-3">
          <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${oscuro ? 'bg-white/15 text-white' : 'bg-[var(--p-teal)] text-white'}`}>{i + 1}</span>
          <span className="min-w-0">
            <span className={`block text-sm font-bold ${oscuro ? '' : 'text-[color:var(--p-navy)]'}`}>{p.t}</span>
            <span className={`block text-sm ${oscuro ? 'text-white/70' : K.suave}`}>{p.d}</span>
          </span>
        </li>
      ))}
    </ol>
  )
}

export function ComoFunciona({ abierto, onCambiar }: { abierto: boolean; onCambiar: (v: boolean) => void }) {
  const [id] = useState('como-funciona')
  return (
    <Tarjeta className="!p-0" >
      <button type="button" onClick={() => onCambiar(!abierto)} aria-expanded={abierto} aria-controls={id} className="flex w-full items-center gap-3 p-4 sm:p-5 text-left">
        <Icono i={CircleHelp} t="md" className="text-[color:var(--p-teal)]" />
        <span className="min-w-0 flex-1">
          <span className="block font-heading text-xl text-[color:var(--p-navy)]">Cómo funciona una sanción</span>
          <span className={`block text-sm ${K.suave}`}>El recorrido de principio a fin, en 4 pasos.</span>
        </span>
        <Icono i={ChevronDown} t="md" className={`transition-transform ${abierto ? 'rotate-180' : ''}`} />
      </button>
      {abierto && <div id={id} className="px-4 pb-5 sm:px-5"><PasosLista /></div>}
    </Tarjeta>
  )
}
