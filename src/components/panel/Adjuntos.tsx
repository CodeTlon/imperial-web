'use client'

import { Download, ExternalLink, File as ArchivoIcono, FileText, Film, Loader2, Paperclip, Send, X, AlertTriangle } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type ClipboardEvent, type DragEvent } from 'react'
import { borrar, claseDe, formatoTamano, guardar, MAX_ARCHIVOS, MAX_BYTES, obtenerURL, validar, type Adjunto } from '@/lib/adjuntos-db'
import { useDemo, type Mensaje, type Sancion } from '@/lib/demo-store'
import { Boton, K } from '@/components/panel/ui'

const ACCEPT = 'image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime,.mov,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip'

// ---------- URL de un adjunto guardado en IndexedDB ----------
function useURL(id: string) {
  const [url, setUrl] = useState<string | null>(null)
  const [error, setError] = useState(false)
  useEffect(() => {
    let vivo = true
    obtenerURL(id).then((u) => { if (!vivo) return; if (u) setUrl(u); else setError(true) }).catch(() => vivo && setError(true))
    return () => { vivo = false }
  }, [id])
  return { url, error }
}

function Perdido({ a }: { a: Adjunto }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-dashed border-[color-mix(in_srgb,currentColor_30%,transparent)] px-3 py-2 text-xs min-w-0 opacity-80">
      <AlertTriangle size={14} className="shrink-0" />
      <span className="truncate">No se pudo cargar «{a.nombre}» (¿se reinició la demo o el navegador bloquea el almacenamiento?)</span>
    </div>
  )
}

// ---------- Lightbox ----------
function Visor({ a, url, onCerrar }: { a: Adjunto; url: string; onCerrar: () => void }) {
  const cerrar = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const previo = document.activeElement as HTMLElement | null
    cerrar.current?.focus()
    const tecla = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.stopPropagation(); onCerrar() } }
    document.addEventListener('keydown', tecla, true)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', tecla, true); document.body.style.overflow = overflow; previo?.focus?.() }
  }, [onCerrar])
  return (
    <div role="dialog" aria-modal="true" aria-label={`Imagen ${a.nombre}`} className="fixed inset-0 z-[100] flex flex-col bg-black/90 text-white" onClick={onCerrar}>
      <div className="flex items-center justify-between gap-3 p-3 sm:p-4" onClick={(e) => e.stopPropagation()}>
        <p className="min-w-0 truncate text-sm font-semibold">{a.nombre} <span className="font-normal opacity-70">· {formatoTamano(a.tamano)}</span></p>
        <div className="flex shrink-0 gap-2">
          <a href={url} download={a.nombre} className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold hover:bg-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"><Download size={16} />Descargar</a>
          <button ref={cerrar} type="button" onClick={onCerrar} aria-label="Cerrar visor" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 hover:bg-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"><X size={18} /></button>
        </div>
      </div>
      <div className="flex min-h-0 flex-1 items-center justify-center p-3 sm:p-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt={a.nombre} onClick={(e) => e.stopPropagation()} className="max-h-full max-w-full object-contain" />
      </div>
    </div>
  )
}

// ---------- Un adjunto dentro de una burbuja o galería ----------
export function AdjuntoVista({ a, compacto = false }: { a: Adjunto; compacto?: boolean }) {
  const { url, error } = useURL(a.id)
  const [visor, setVisor] = useState(false)
  const cerrar = useCallback(() => setVisor(false), [])
  const clase = claseDe(a)
  if (error) return <Perdido a={a} />
  if (!url) return <div className="h-16 w-full max-w-xs animate-pulse rounded-lg bg-[color-mix(in_srgb,currentColor_10%,transparent)]" aria-label={`Cargando ${a.nombre}`} />

  if (clase === 'imagen')
    return (
      <>
        <button type="button" onClick={() => setVisor(true)} aria-label={`Abrir imagen ${a.nombre}`} className="block max-w-full overflow-hidden rounded-lg bg-black/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--p-teal)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt={a.nombre} loading="lazy" className={`block object-cover ${compacto ? 'h-24 w-24' : 'max-h-56 w-auto max-w-full'}`} />
        </button>
        {visor && <Visor a={a} url={url} onCerrar={cerrar} />}
      </>
    )

  if (clase === 'video')
    return (
      <div className="min-w-0 max-w-full">
        <video src={url} controls preload="metadata" aria-label={`Video ${a.nombre}`} className={`block rounded-lg bg-black ${compacto ? 'h-28 w-full max-w-[12rem]' : 'max-h-64 w-full max-w-md'}`} />
        <p className="mt-1 flex items-center gap-1 text-xs opacity-80"><Film size={12} className="shrink-0" /><span className="truncate">{a.nombre} · {formatoTamano(a.tamano)}</span></p>
      </div>
    )

  const esPdf = clase === 'pdf'
  const Icono = esPdf ? FileText : ArchivoIcono
  const btn = 'inline-flex items-center gap-1 rounded-full bg-[color-mix(in_srgb,currentColor_10%,transparent)] px-3 py-1.5 text-xs font-semibold hover:bg-[color-mix(in_srgb,currentColor_20%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--p-teal)]'
  return (
    <div className="flex w-full max-w-sm min-w-0 items-center gap-3 rounded-lg border border-[color-mix(in_srgb,currentColor_20%,transparent)] bg-[color-mix(in_srgb,currentColor_5%,transparent)] p-2.5">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[color-mix(in_srgb,currentColor_10%,transparent)]"><Icono size={20} aria-hidden /></span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold" title={a.nombre}>{a.nombre}</p>
        <p className="text-xs opacity-75">{esPdf ? 'PDF' : a.nombre.split('.').pop()?.toUpperCase()} · {formatoTamano(a.tamano)}</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {esPdf && <a href={url} target="_blank" rel="noopener noreferrer" className={btn} aria-label={`Ver ${a.nombre} en una pestaña nueva`}><ExternalLink size={12} />Ver</a>}
          <a href={url} download={a.nombre} className={btn} aria-label={`Descargar ${a.nombre}`}><Download size={12} />Descargar</a>
        </div>
      </div>
    </div>
  )
}

// ---------- Sección "Archivos de la sanción" ----------
export function ArchivosSancion({ mensajes }: { mensajes: Mensaje[] }) {
  const todos = mensajes.flatMap((m) => (m.adjuntos ?? []).map((a) => ({ a, de: m.de, fecha: m.fecha })))
  if (todos.length === 0) return null
  const grupos: { titulo: string; items: typeof todos }[] = [
    { titulo: 'Fotos', items: todos.filter((x) => claseDe(x.a) === 'imagen') },
    { titulo: 'Videos', items: todos.filter((x) => claseDe(x.a) === 'video') },
    { titulo: 'Documentos', items: todos.filter((x) => ['pdf', 'archivo'].includes(claseDe(x.a))) },
  ].filter((g) => g.items.length)
  return (
    <details className={`rounded-lg border ${K.borde} p-3 min-w-0`}>
      <summary className="cursor-pointer text-sm font-bold">Archivos de la sanción ({todos.length})</summary>
      <div className="mt-3 space-y-3 text-[color:var(--p-navy)]">
        {grupos.map((g) => (
          <div key={g.titulo}>
            <p className={`mb-1.5 text-xs font-bold uppercase ${K.suave}`}>{g.titulo} ({g.items.length})</p>
            <div className={g.titulo === 'Documentos' ? 'grid gap-2 sm:grid-cols-2' : 'flex flex-wrap gap-2'}>
              {g.items.map(({ a, de, fecha }) => (
                <div key={a.id} className="min-w-0 max-w-full">
                  <AdjuntoVista a={a} compacto={g.titulo !== 'Documentos'} />
                  <p className={`mt-0.5 truncate text-[11px] ${K.suave}`}>{de === 'organizacion' ? 'Organización' : 'Delegado'} · {fecha}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </details>
  )
}

// ---------- Hilo completo: mensajes + redactor ----------
type Pendiente = { key: string; nombre: string; tamano: number; clase: ReturnType<typeof claseDe>; preview?: string; estado: 'guardando' | 'listo'; adj?: Adjunto }

const MAX_MENSAJE = 1000

export function HiloMensajes({ s, quien, placeholder, variante = 'lista' }: { s: Sancion; quien: 'organizacion' | 'delegado'; placeholder: string; variante?: 'lista' | 'chat' }) {
  const chat = variante === 'chat'
  const logRef = useRef<HTMLDivElement>(null)
  const { mensaje } = useDemo()
  const [texto, setTexto] = useState('')
  const [pend, setPend] = useState<Pendiente[]>([])
  const [aviso, setAviso] = useState<string[]>([])
  const [arrastrando, setArrastrando] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const pendRef = useRef(pend)
  pendRef.current = pend
  const contador = useRef(0)

  const enviado = useRef(new Set<string>())
  // En el chat el panel de mensajes siempre baja al último mensaje.
  useEffect(() => { if (chat) logRef.current?.scrollTo({ top: logRef.current.scrollHeight }) }, [chat, s.mensajes.length])
  // Si se desmonta con adjuntos sin enviar, se limpian de la base y se revocan las previews.
  useEffect(() => () => {
    pendRef.current.forEach((p) => { if (p.preview) URL.revokeObjectURL(p.preview); if (p.adj && !enviado.current.has(p.adj.id)) void borrar(p.adj.id).catch(() => {}) })
  }, [])

  async function agregar(archivos: File[]) {
    if (!archivos.length) return
    const errores: string[] = []
    let cupo = MAX_ARCHIVOS - pendRef.current.length
    const validos: File[] = []
    for (const f of archivos) {
      const e = validar(f)
      if (e) errores.push(e)
      else if (cupo <= 0) errores.push(`"${f.name}" no entró: el máximo es ${MAX_ARCHIVOS} archivos por mensaje.`)
      else { validos.push(f); cupo-- }
    }
    setAviso(errores)
    for (const f of validos) {
      const key = `p${++contador.current}`
      const tipo = f.type
      const clase = claseDe({ nombre: f.name, tipo })
      const preview = clase === 'imagen' ? URL.createObjectURL(f) : undefined
      setPend((p) => [...p, { key, nombre: f.name, tamano: f.size, clase, preview, estado: 'guardando' }])
      try {
        const adj = await guardar(f)
        setPend((p) => p.map((x) => (x.key === key ? { ...x, estado: 'listo', adj, tamano: adj.tamano } : x)))
      } catch {
        if (preview) URL.revokeObjectURL(preview)
        setPend((p) => p.filter((x) => x.key !== key))
        setAviso((a) => [...a, `No se pudo guardar "${f.name}": el navegador bloqueó el almacenamiento de archivos (¿modo privado?). Podés seguir escribiendo mensajes sin adjuntos.`])
      }
    }
  }

  function quitar(p: Pendiente) {
    if (p.preview) URL.revokeObjectURL(p.preview)
    setPend((x) => x.filter((y) => y.key !== p.key))
    if (p.adj) void borrar(p.adj.id).catch(() => {})
  }

  function soltar(e: DragEvent) {
    e.preventDefault(); setArrastrando(false)
    void agregar(Array.from(e.dataTransfer.files))
  }
  function pegar(e: ClipboardEvent) {
    const fs = Array.from(e.clipboardData.files)
    if (fs.length) { e.preventDefault(); void agregar(fs.map((f, i) => (f.name === 'image.png' || !f.name ? new File([f], `captura-${Date.now()}-${i}.${(f.type.split('/')[1] || 'png')}`, { type: f.type }) : f))) }
  }

  const ocupado = pend.some((p) => p.estado === 'guardando')
  const hayAdj = pend.some((p) => p.adj)
  const puede = !ocupado && (texto.trim() || hayAdj) && texto.length <= MAX_MENSAJE

  function enviar() {
    if (texto.length > MAX_MENSAJE) return setAviso([`El mensaje es muy largo: máximo ${MAX_MENSAJE} caracteres (tenés ${texto.length}).`])
    if (!puede) return setAviso(['Escribí un mensaje o adjuntá un archivo para enviar.'])
    const adjs = pend.flatMap((p) => (p.adj ? [p.adj] : []))
    adjs.forEach((a) => enviado.current.add(a.id))
    pend.forEach((p) => p.preview && URL.revokeObjectURL(p.preview))
    mensaje(s.id, texto.trim(), adjs)
    setTexto(''); setPend([]); setAviso([])
  }

  const yo = quien
  return (
    <div className={chat ? 'flex h-full min-h-0 min-w-0 flex-col' : 'space-y-2 min-w-0'} onDragOver={(e) => { e.preventDefault(); setArrastrando(true) }} onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setArrastrando(false) }} onDrop={soltar} onPaste={pegar}>
      <div ref={logRef} className={chat ? 'min-h-0 flex-1 space-y-4 overflow-y-auto px-1 py-3' : 'space-y-1.5'} role="log" aria-label="Mensajes del descargo">
        {chat && s.mensajes.length === 0 && <p className={`py-10 text-center text-sm ${K.suave}`}>Todavía no hay mensajes. Escribí el primero abajo.</p>}
        {s.mensajes.map((m, i) => {
          const org = m.de === 'organizacion'
          if (chat) {
            const mio = (m.de === 'organizacion') === (yo === 'organizacion')
            return (
              <div key={i} className={`flex min-w-0 flex-col ${mio ? 'items-end' : 'items-start'}`}>
                <p className={`mb-1 px-1 text-xs ${K.suave}`}><span className="font-bold text-[color:var(--p-navy)]">{org ? 'Organización' : yo === 'delegado' ? 'Vos' : 'Delegado'}</span> · {m.fecha}</p>
                <div className={`min-w-0 max-w-[88%] break-words rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed ${mio ? 'rounded-br-md border border-[color:var(--p-teal)]/25 bg-[var(--p-teal)]/10 text-[color:var(--p-navy)]' : `rounded-bl-md border ${K.borde} bg-white`}`}>
                  {m.texto && <p>{m.texto}</p>}
                  {m.adjuntos && m.adjuntos.length > 0 && (
                    <div className={`flex min-w-0 flex-wrap gap-2 ${m.texto ? 'mt-2' : ''}`}>{m.adjuntos.map((a) => <AdjuntoVista key={a.id} a={a} />)}</div>
                  )}
                </div>
              </div>
            )
          }
          return (
            <div key={i} className={`min-w-0 break-words rounded-lg px-3 py-2 text-sm ${org ? 'bg-[var(--p-navy)] text-white' : 'bg-[var(--p-oro)]/30'}`}>
              <p className="font-bold">{org ? 'Organización' : yo === 'delegado' ? 'Vos' : 'Delegado'} · {m.fecha}{m.texto ? ':' : ''} {m.texto && <span className="font-normal">{m.texto}</span>}</p>
              {m.adjuntos && m.adjuntos.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2 min-w-0">{m.adjuntos.map((a) => <AdjuntoVista key={a.id} a={a} />)}</div>
              )}
            </div>
          )
        })}
      </div>

      <div className={`${chat ? 'mt-2 border-t border-[color:var(--p-borde)] pt-3 ' : ''}rounded-xl border-2 border-dashed p-2 transition-colors ${arrastrando ? 'border-[color:var(--p-teal)] bg-[var(--p-teal)]/10' : 'border-transparent'}`}>
        {arrastrando && <p className="mb-1 text-center text-xs font-semibold text-[color:var(--p-teal)]">Soltá los archivos acá para adjuntarlos</p>}
        {pend.length > 0 && (
          <ul className="mb-2 flex flex-wrap gap-2" aria-label="Adjuntos para enviar">
            {pend.map((p) => (
              <li key={p.key} className={`relative flex w-full min-w-0 max-w-[15rem] items-center gap-2 rounded-lg border ${K.borde} bg-[var(--p-fondo)] p-1.5 pr-8`}>
                {p.preview
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={p.preview} alt="" className="h-11 w-11 shrink-0 rounded object-cover" />
                  : <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded bg-[var(--p-teal)]/10">{p.clase === 'video' ? <Film size={18} /> : p.clase === 'pdf' ? <FileText size={18} /> : <ArchivoIcono size={18} />}</span>}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-semibold" title={p.nombre}>{p.nombre}</span>
                  <span className={`block text-[11px] ${K.suave}`}>{p.estado === 'guardando' ? 'Cargando…' : `Listo · ${formatoTamano(p.tamano)}`}</span>
                  <span className="mt-0.5 block h-1 overflow-hidden rounded-full bg-black/10" role="progressbar" aria-label={`Carga de ${p.nombre}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={p.estado === 'listo' ? 100 : undefined}>
                    <span className={`block h-full rounded-full bg-[var(--p-teal)] ${p.estado === 'listo' ? 'w-full' : 'w-1/3 animate-pulse'}`} />
                  </span>
                </span>
                <button type="button" onClick={() => quitar(p)} aria-label={`Quitar ${p.nombre}`} className="absolute right-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded-full hover:bg-black/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--p-teal)]"><X size={14} /></button>
              </li>
            ))}
          </ul>
        )}
        {aviso.length > 0 && (
          <div role="alert" className="mb-2 rounded-lg bg-[#dc2626]/10 px-3 py-2 text-xs text-[#b91c1c]">
            {aviso.map((a, i) => <p key={i} className="break-words">{a}</p>)}
          </div>
        )}
        <div className="flex items-center gap-2">
          <input ref={inputRef} type="file" multiple accept={ACCEPT} className="sr-only" tabIndex={-1} aria-hidden onChange={(e) => { void agregar(Array.from(e.target.files ?? [])); e.target.value = '' }} data-testid="adjuntos-input" />
          <Boton type="button" variante="suave" className="!px-3 shrink-0" onClick={() => inputRef.current?.click()} aria-label="Adjuntar archivos" title="Adjuntar fotos, videos o PDFs">
            <Paperclip size={16} />
          </Boton>
          <input
            value={texto}
            onChange={(e) => { setTexto(e.target.value); if (aviso.length) setAviso([]) }}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); enviar() } }}
            placeholder={placeholder}
            aria-label="Escribir mensaje"
            className={`${K.campo} flex-1 !py-2.5`}
          />
          <Boton variante="suave" disabled={ocupado} onClick={enviar} aria-label="Enviar mensaje" className="shrink-0">
            {ocupado ? <Loader2 size={16} className="animate-spin" /> : <><span className="hidden sm:inline">Enviar</span><Send size={16} className="sm:hidden" /></>}
          </Boton>
        </div>
        <p className={`mt-1 text-[11px] ${K.suave}`}>Adjuntá fotos, videos o PDFs (hasta {MAX_ARCHIVOS} archivos de {formatoTamano(MAX_BYTES)}). También podés arrastrarlos acá o pegar una captura.</p>
      </div>
    </div>
  )
}
