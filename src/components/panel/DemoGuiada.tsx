'use client'

import {
  ArrowLeft, ArrowRight, CalendarDays, ClipboardList, Gavel, Home, Image as ImagenIcon, LayoutDashboard,
  Shield, ShieldAlert, Table2, Users, X, type LucideIcon,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Icono } from '@/components/panel/icono'
import { C, K } from '@/components/panel/ui'
import type { Rol } from '@/lib/demo-store'

type Paso = { icono: LucideIcon; seccion: string; titulo: string; texto: string; sirve: string }

// Recorrido por rol: qué puede hacer cada uno y para qué sirve. Se muestra al ingresar y desde "Demo guiada".
const PASOS: Record<Rol, Paso[]> = {
  organizacion: [
    {
      icono: LayoutDashboard, seccion: 'Resumen', titulo: 'Todo el torneo en una pantalla',
      texto: 'Gráficos de goles por categoría, estado de las sanciones y avance de la documentación de jugadores.',
      sirve: 'Para saber de un vistazo qué necesita atención hoy.',
    },
    {
      icono: ShieldAlert, seccion: 'Sanciones', titulo: 'Cargar una sanción',
      texto: 'Se carga con el informe de expulsión del árbitro y las fechas de suspensión. El sistema sugiere los artículos del reglamento y se pueden ajustar.',
      sirve: 'Para dejar un registro oficial que el delegado y el jugador ven al instante.',
    },
    {
      icono: Gavel, seccion: 'Descargos', titulo: 'Resolver los descargos',
      texto: 'El delegado presenta su descargo con texto, fotos, PDF o video. La organización conversa en la misma sanción, acepta o rechaza, puede reabrir la resolución y marcar la sanción como cumplida.',
      sirve: 'Para que todo el proceso quede en un solo lugar, con fecha y archivos.',
    },
    {
      icono: Shield, seccion: 'Equipos', titulo: 'Revisar la documentación',
      texto: 'Cada equipo muestra sus jugadores con DNI y foto. Se puede aprobar, observar o borrar.',
      sirve: 'Para tener las listas de buena fe completas antes de la segunda fecha.',
    },
    {
      icono: ClipboardList, seccion: 'Resultados y goleadores', titulo: 'Cargar resultados y goles',
      texto: 'Lo que se carga acá actualiza las posiciones, el fixture y la tabla de goleadores del sitio público.',
      sirve: 'Para que la web esté al día sin pedirle nada a nadie.',
    },
    {
      icono: ImagenIcon, seccion: 'Contenido', titulo: 'Editar el sitio',
      texto: 'Textos, datos de contacto, preguntas frecuentes y enlaces del sitio se cambian desde el panel.',
      sirve: 'Para mantener la web sin tocar código.',
    },
  ],
  delegado: [
    {
      icono: Home, seccion: 'Inicio', titulo: 'El equipo de un vistazo',
      texto: 'Próximo partido, estado del plantel y sanciones abiertas de tu equipo.',
      sirve: 'Para llegar a cada fecha sabiendo qué falta resolver.',
    },
    {
      icono: Table2, seccion: 'Fixture y posiciones', titulo: 'Fixture y tabla de tu categoría',
      texto: 'Todas las fechas, los resultados cargados y las posiciones de la zona.',
      sirve: 'Para seguir la competencia sin salir del panel.',
    },
    {
      icono: Gavel, seccion: 'Descargos', titulo: 'Presentar un descargo',
      texto: 'Si un jugador fue sancionado, se escribe el descargo y se adjuntan fotos, PDF o video de la jugada. La organización responde en la misma sanción.',
      sirve: 'Para defender a tu jugador con pruebas, dentro de plazo y con respuesta registrada.',
    },
    {
      icono: Users, seccion: 'Plantel', titulo: 'Armar la lista de buena fe',
      texto: 'Hasta 25 jugadores con nombre, DNI (frente y dorso) y foto. Un semáforo indica qué documentación está aprobada, pendiente u observada.',
      sirve: 'Para tener el equipo habilitado antes de la segunda fecha.',
    },
  ],
  jugador: [
    {
      icono: Home, seccion: 'Inicio', titulo: 'Tu rendimiento y el de tu equipo',
      texto: 'Tus goles, el próximo partido y cómo viene tu equipo en la tabla.',
      sirve: 'Para seguir tu temporada en un solo lugar.',
    },
    {
      icono: ShieldAlert, seccion: 'Mis sanciones', titulo: 'Tus sanciones',
      texto: 'Fechas de suspensión, fechas por cumplir, artículos del reglamento aplicados y el estado del descargo.',
      sirve: 'Para saber cuándo volvés a jugar y por qué te sancionaron.',
    },
    {
      icono: CalendarDays, seccion: 'Posiciones', titulo: 'Posiciones de tu categoría',
      texto: 'La tabla actualizada con los resultados que carga la organización.',
      sirve: 'Para ver cómo está tu equipo en la zona.',
    },
  ],
}

const TITULO: Record<Rol, string> = { organizacion: 'Organización', delegado: 'Delegado', jugador: 'Jugador' }
const QUIEN: Record<Rol, string> = {
  organizacion: 'Lo que puede hacer la organización del torneo',
  delegado: 'Lo que puede hacer el delegado de un equipo',
  jugador: 'Lo que puede ver y seguir un jugador',
}

export default function DemoGuiada({ rol, onCerrar, final = 'Cerrar' }: { rol: Rol; onCerrar: () => void; final?: string }) {
  const pasos = PASOS[rol]
  const [i, setI] = useState(0)
  const p = pasos[i]
  const ultimo = i === pasos.length - 1
  const principal = useRef<HTMLButtonElement>(null)

  useEffect(() => { principal.current?.focus() }, [i])
  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCerrar()
      if (e.key === 'ArrowRight') setI((n) => Math.min(pasos.length - 1, n + 1))
      if (e.key === 'ArrowLeft') setI((n) => Math.max(0, n - 1))
    }
    document.addEventListener('keydown', tecla)
    return () => document.removeEventListener('keydown', tecla)
  }, [onCerrar, pasos.length])

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-[#062f36]/70 p-0 sm:items-center sm:p-6" onMouseDown={(e) => { if (e.target === e.currentTarget) onCerrar() }}>
      <div role="dialog" aria-modal="true" aria-labelledby="guia-titulo" className="flex max-h-[92svh] w-full max-w-xl flex-col overflow-hidden rounded-t-2xl bg-white text-[color:var(--p-texto)] shadow-2xl sm:rounded-2xl">
        <div className="flex items-start gap-3 px-5 pt-5 sm:px-6" style={{ color: C.navy }}>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: C.oro }}>Demo guiada · {TITULO[rol]}</p>
            <p className={`mt-0.5 text-sm ${K.suave}`}>{QUIEN[rol]}</p>
          </div>
          <button type="button" onClick={onCerrar} aria-label="Cerrar la demo guiada" className="-mr-2 -mt-1 flex h-10 w-10 items-center justify-center rounded-xl hover:bg-[var(--p-fondo)]"><Icono i={X} t="md" /></button>
        </div>

        <div className="overflow-y-auto px-5 py-5 sm:px-6" aria-live="polite">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white" style={{ background: `linear-gradient(135deg, ${C.navy}, ${C.teal})` }}><Icono i={p.icono} t="lg" /></span>
            <div className="min-w-0">
              <p className="inline-block rounded-full bg-[var(--p-fondo)] px-2.5 py-0.5 text-xs font-bold" style={{ color: C.profundo }}>{p.seccion}</p>
              <h2 id="guia-titulo" className="mt-1 font-heading text-2xl leading-tight" style={{ color: C.navy }}>{p.titulo}</h2>
            </div>
          </div>
          <p className="mt-4 text-[15px] leading-relaxed">{p.texto}</p>
          <p className="mt-4 rounded-xl border-l-4 bg-[var(--p-fondo)] px-4 py-3 text-sm" style={{ borderColor: C.oro }}>
            <span className="block text-xs font-bold uppercase tracking-wide" style={{ color: C.navy }}>Para qué sirve</span>
            {p.sirve}
          </p>
        </div>

        <div className="flex items-center gap-3 border-t border-[color:var(--p-borde)] px-5 py-4 sm:px-6">
          <ol className="flex flex-1 items-center gap-1.5" aria-label={`Paso ${i + 1} de ${pasos.length}`}>
            {pasos.map((x, n) => (
              <li key={x.titulo}>
                <button type="button" onClick={() => setI(n)} aria-label={`Ir al paso ${n + 1}: ${x.seccion}`} aria-current={n === i ? 'step' : undefined} className="flex h-6 items-center">
                  <span className="block h-1.5 rounded-full transition-all" style={{ width: n === i ? 24 : 8, background: n === i ? C.teal : C.borde }} />
                </button>
              </li>
            ))}
          </ol>
          {i > 0 && (
            <button type="button" onClick={() => setI(i - 1)} className="inline-flex items-center gap-1.5 rounded-xl border border-[color:var(--p-borde)] px-3.5 py-2.5 text-sm font-bold hover:bg-[var(--p-fondo)]"><Icono i={ArrowLeft} />Anterior</button>
          )}
          <button ref={principal} type="button" onClick={() => (ultimo ? onCerrar() : setI(i + 1))} className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold text-white hover:brightness-90" style={{ background: C.teal }}>
            {ultimo ? final : 'Siguiente'}{!ultimo && <Icono i={ArrowRight} />}
          </button>
        </div>
      </div>
    </div>
  )
}
