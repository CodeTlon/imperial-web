'use client'

import { Check, Plus, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ARTICULOS, normalizarTexto, sugerirArticulos } from '@/lib/sugerir-articulos'
import { Chip, K } from '@/components/panel/ui'

// Artículos del reglamento imputados. Mientras se escribe el informe de expulsión se sugieren (y preseleccionan)
// los que coinciden; después se puede marcar, desmarcar y buscar cualquier otro artículo del reglamento.
export function ArticulosSelector({ informe, value, onChange }: { informe: string; value: string[]; onChange: (v: string[]) => void }) {
  const [textoDebounce, setTextoDebounce] = useState(informe)
  const [busqueda, setBusqueda] = useState('')
  const [abierto, setAbierto] = useState(false)
  const yaSugeridos = useRef<Set<string>>(new Set())
  const valueRef = useRef(value)
  valueRef.current = value

  useEffect(() => {
    const t = setTimeout(() => setTextoDebounce(informe), 400)
    return () => clearTimeout(t)
  }, [informe])

  const sugs = useMemo(() => sugerirArticulos(textoDebounce), [textoDebounce])
  const porCodigo = useMemo(() => new Map(sugs.map((s) => [s.codigo, s])), [sugs])

  // Preselecciona cada sugerencia nueva una sola vez: si la persona la desmarca, no se vuelve a agregar.
  useEffect(() => {
    const nuevas = sugs.filter((s) => !yaSugeridos.current.has(s.codigo))
    if (nuevas.length === 0) return
    nuevas.forEach((s) => yaSugeridos.current.add(s.codigo))
    const actual = valueRef.current
    const agregar = nuevas.map((s) => s.codigo).filter((c) => !actual.includes(c))
    if (agregar.length) onChange([...actual, ...agregar])
  }, [sugs, onChange])

  // Si el formulario se vacía (se guardó la sanción), se reinicia el seguimiento.
  useEffect(() => {
    if (value.length === 0 && informe === '') yaSugeridos.current = new Set()
  }, [value, informe])

  const alternar = (c: string) => onChange(value.includes(c) ? value.filter((x) => x !== c) : [...value, c])
  const q = normalizarTexto(busqueda)
  const filtrados = ARTICULOS.filter((a) => !q || normalizarTexto(`${a.codigo} ${a.descripcion} ${a.tipo}`).includes(q))
  const descartadas = sugs.filter((s) => !value.includes(s.codigo))

  return (
    <div className="min-w-0">
      <span className={K.etiqueta}>Artículos del reglamento</span>
      <div className={`rounded-xl border ${K.borde} bg-[var(--p-fondo)] p-3 space-y-3`}>
        <div className="flex flex-wrap gap-2 min-h-7">
          {value.length === 0 && <span className={`text-sm ${K.suave}`}>Ninguno elegido. Escribí el informe y te sugiero los que coinciden, o buscalos abajo.</span>}
          {value.map((c) => {
            const s = porCodigo.get(c)
            const art = ARTICULOS.find((a) => a.codigo === c)
            return (
              <Chip key={c} onQuitar={() => alternar(c)}>
                <span title={art?.descripcion}>{c}</span>
                {s && <span className="font-normal inline-flex items-center gap-1 opacity-80"><Sparkles size={11} /> sugerido: coincide con «{s.palabra}»</span>}
              </Chip>
            )
          })}
        </div>
        {descartadas.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {descartadas.map((s) => (
              <button key={s.codigo} type="button" onClick={() => alternar(s.codigo)} className="inline-flex items-center gap-1 rounded-full border border-dashed border-[color:var(--p-teal)] px-2.5 py-1 text-xs font-bold text-[color:var(--p-profundo)]">
                <Plus size={12} /> {s.codigo} · coincide con «{s.palabra}»
              </button>
            ))}
          </div>
        )}
        <div className="relative">
          <input
            value={busqueda}
            onChange={(e) => { setBusqueda(e.target.value); setAbierto(true) }}
            onFocus={() => setAbierto(true)}
            placeholder="Buscar artículo. Ej: juego brusco, 39, agresión"
            className={K.campo}
            aria-label="Buscar artículo del reglamento"
          />
          {abierto && (
            <div className={`mt-2 max-h-64 overflow-auto rounded-xl border ${K.borde} bg-white`}>
              {filtrados.length === 0 && <p className={`px-4 py-3 text-sm ${K.suave}`}>No hay artículos que coincidan.</p>}
              {filtrados.map((a) => {
                const on = value.includes(a.codigo)
                return (
                  <button key={a.codigo} type="button" onClick={() => alternar(a.codigo)} className="flex w-full items-start gap-3 px-4 py-2.5 text-left text-sm hover:bg-[var(--p-fondo)]">
                    <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${on ? 'bg-[var(--p-teal)] border-[color:var(--p-teal)] text-white' : K.borde}`}>{on && <Check size={13} />}</span>
                    <span className="min-w-0"><span className="font-bold">{a.codigo}</span> · {a.descripcion}<span className={`block text-xs ${K.suave}`}>{a.tipo}</span></span>
                  </button>
                )
              })}
              <button type="button" onClick={() => setAbierto(false)} className={`w-full border-t ${K.borde} px-4 py-2 text-xs font-bold ${K.suave}`}>Cerrar lista</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
