'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { createPortal } from 'react-dom'
import { CUENTAS, useDemo } from '@/lib/demo-store'
import { navegarConCortina } from '@/lib/navegar'
import Marca from '@/components/layout/Marca'
import { ChevronRight, ClipboardList, Eye, EyeOff, Gavel, Info, Loader2, User, X } from 'lucide-react'
import { NAVY, VARS_PANEL } from '@/components/panel/ui'

function Formulario() {
  const { ingresar } = useDemo()
  const desde = useSearchParams().get('desde')
  const [email, setEmail] = useState('')
  const [clave, setClave] = useState('')
  const [error, setError] = useState('')
  const [ver, setVer] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [cuentas, setCuentas] = useState(false)
  const botonCuentas = useRef<HTMLButtonElement>(null)
  const botonIngresar = useRef<HTMLButtonElement>(null)
  const dialogo = useRef<HTMLDivElement>(null)

  // Ventana de cuentas de prueba: Esc la cierra, el foco queda adentro mientras está abierta y vuelve al botón al cerrar.
  useEffect(() => {
    if (!cuentas) return
    dialogo.current?.querySelector<HTMLElement>('button[data-cuenta]')?.focus()
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setCuentas(false); botonCuentas.current?.focus() }
      if (e.key !== 'Tab' || !dialogo.current) return
      const f = Array.from(dialogo.current.querySelectorAll<HTMLElement>('button'))
      const primero = f[0], ultimo = f[f.length - 1]
      if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus() }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus() }
    }
    document.addEventListener('keydown', tecla)
    return () => document.removeEventListener('keydown', tecla)
  }, [cuentas])

  function enviar(e: React.FormEvent) {
    e.preventDefault()
    if (cargando) return
    setCargando(true)
    if (!ingresar(email, clave)) {
      setCargando(false)
      return setError('Email o contraseña incorrectos.')
    }
    const rol = CUENTAS.find((c) => c.email === email.trim().toLowerCase())!.rol
    // La pantalla de carga cubre primero y recién después se cambia de página: no se ve el panel antes.
    navegarConCortina(desde ?? (rol === 'organizacion' ? '/panel' : rol === 'jugador' ? '/jugador' : '/delegado'))
  }

  // Elegir una cuenta carga el email y la contraseña, cierra la ventana y deja el foco en "Iniciar sesión".
  const usar = (c: (typeof CUENTAS)[number]) => { setEmail(c.email); setClave(c.clave); setError(''); setCuentas(false); requestAnimationFrame(() => botonIngresar.current?.focus()) }
  const ROL: Record<string, { texto: string; detalle: string; icono: typeof User }> = {
    organizacion: { texto: 'Organización', detalle: 'Carga resultados y sanciones, resuelve descargos y revisa la documentación.', icono: Gavel },
    delegado: { texto: 'Delegado', detalle: 'Arma el plantel, presenta descargos y sigue el fixture de su equipo.', icono: ClipboardList },
    jugador: { texto: 'Jugador', detalle: 'Mira sus sanciones, los resultados y las posiciones de su equipo.', icono: User },
  }

  return (
    <form onSubmit={enviar} className="space-y-4">
      <button ref={botonCuentas} type="button" onClick={() => setCuentas(true)} aria-haspopup="dialog" className="flex w-full items-center gap-2 rounded-xl border border-[#d9e8ea] px-4 py-3 text-left text-sm font-semibold text-[#062f36] transition hover:bg-[#eef6f7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0494a4]">
        <Info size={18} className="text-[#0494a4]" aria-hidden />
        Cuentas de prueba
        <ChevronRight size={18} className="ml-auto text-[#5b7479]" aria-hidden />
      </button>
      {cuentas && createPortal(
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-[#062f36]/60 p-0 sm:items-center sm:p-6" style={{ ...VARS_PANEL, animation: 'cuentas-fondo .2s ease-out' }} onMouseDown={(e) => { if (e.target === e.currentTarget) setCuentas(false) }}>
          <div ref={dialogo} role="dialog" aria-modal="true" aria-labelledby="titulo-cuentas" className="w-full max-w-md rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl sm:p-6" style={{ animation: 'cuentas-entra .28s cubic-bezier(.23,1,.32,1)' }}>
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <h2 id="titulo-cuentas" className="font-heading text-2xl text-[#062f36]">Cuentas de prueba</h2>
                <p className="mt-1 text-sm text-[#5b7479]">Elegí una para cargar el email y la contraseña. La contraseña de todas es <b className="text-[#062f36]">imperial123</b>.</p>
              </div>
              <button type="button" onClick={() => { setCuentas(false); botonCuentas.current?.focus() }} aria-label="Cerrar" className="-mr-2 -mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[#5b7479] hover:bg-[#eef6f7]"><X size={20} aria-hidden /></button>
            </div>
            <ul className="mt-4 space-y-2">
              {CUENTAS.map((c) => {
                const r = ROL[c.rol]
                const Icono = r.icono
                return (
                  <li key={c.email}>
                    <button type="button" data-cuenta onClick={() => usar(c)} className="flex w-full items-center gap-3 rounded-xl border border-[#d9e8ea] bg-[#eef6f7] px-4 py-3 text-left transition hover:border-[#0494a4] hover:bg-[#dff0f2] active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0494a4]">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white" style={{ background: 'linear-gradient(135deg,#062f36,#0494a4)' }}><Icono size={22} aria-hidden /></span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-bold text-[#062f36]">{r.texto}</span>
                        <span className="block truncate text-xs text-[#1f3a40]">{c.email}</span>
                        <span className="mt-0.5 block text-xs leading-snug text-[#5b7479]">{r.detalle}</span>
                      </span>
                      <ChevronRight size={18} className="shrink-0 text-[#5b7479]" aria-hidden />
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
          <style>{`@keyframes cuentas-fondo{from{opacity:0}to{opacity:1}}@keyframes cuentas-entra{from{opacity:0;transform:translateY(16px) scale(.98)}to{opacity:1;transform:none}}@media (prefers-reduced-motion:reduce){[role=dialog]{animation:none!important}}`}</style>
        </div>,
        document.body,
      )}
      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold text-[#062f36]">Email</span>
        <input type="email" required value={email} onChange={(e) => { setEmail(e.target.value); setError('') }} autoComplete="username" placeholder="delegado@imperial.com" className="w-full rounded-xl border border-[#d9e8ea] bg-[#eef6f7] px-4 py-3 text-base outline-none focus:border-[#0494a4] focus:ring-2 focus:ring-[#0494a4]/30" />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold text-[#062f36]">Contraseña</span>
        <span className="relative block">
          <input type={ver ? 'text' : 'password'} required value={clave} onChange={(e) => { setClave(e.target.value); setError('') }} autoComplete="current-password" placeholder="Tu contraseña" className="w-full rounded-xl border border-[#d9e8ea] bg-[#eef6f7] py-3 pl-4 pr-12 text-base outline-none focus:border-[#0494a4] focus:ring-2 focus:ring-[#0494a4]/30" />
          <button type="button" onClick={() => setVer(!ver)} aria-label={ver ? 'Ocultar contraseña' : 'Mostrar contraseña'} className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[#5b7479] hover:text-[#062f36]">
            {ver ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </span>
      </label>
      {error && <p role="alert" className="text-sm text-[#dc2626]">{error}</p>}
      <button
        ref={botonIngresar}
        type="submit"
        disabled={cargando}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-base font-bold text-white transition hover:brightness-90 disabled:opacity-70"
        style={{ background: '#0494a4' }}
      >
        {cargando ? <><Loader2 size={20} className="animate-spin" aria-hidden />Ingresando…</> : 'Iniciar sesión'}
      </button>
    </form>
  )
}

function Foto({ className }: { className: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image src="/images/hero.jpg" alt="" fill priority sizes="(min-width:1024px) 50vw, 100vw" className="object-cover object-[60%_40%]" />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(6,47,54,0.95) 0%, rgba(4,112,124,0.55) 55%, rgba(4,148,164,0.25) 100%)' }} />
      <div className="absolute inset-x-0 bottom-0 flex items-end gap-4 p-6 text-white lg:p-12 2xl:p-16">
        <Image src="/images/logo-mark.png" alt="" width={180} height={320} className="h-14 w-auto object-contain lg:h-24 2xl:h-28" />
        <div>
          <p className="font-heading text-2xl leading-tight sm:text-3xl lg:text-5xl 2xl:text-6xl">Coronado de Gloria</p>
          <p className="mt-1 hidden text-sm text-white/80 lg:block 2xl:text-lg">Seguí tu equipo, cargá resultados y gestioná tu plantel.</p>
        </div>
      </div>
    </div>
  )
}

export default function IngresarPage() {
  return (
    <main className="min-h-screen bg-white lg:grid lg:grid-cols-2" style={VARS_PANEL}>
      <section className="flex items-center justify-center px-6 py-10 lg:min-h-screen lg:py-16">
        <div className="w-full max-w-md 2xl:max-w-lg">
          <Link href="/" className="mb-8 flex items-center gap-3">
            <Marca tamano="lg" color={NAVY} />
          </Link>
          <h1 className="font-heading text-3xl" style={{ color: NAVY }}>Ingresar</h1>
          <p className="mb-6 mt-1 text-sm text-[#5b7479]">Acceso para jugadores, delegados y organización.</p>
          <Suspense><Formulario /></Suspense>
          <p className="mt-8 text-center text-xs text-[#5b7479]">
            <Link href="/" className="underline">Volver al sitio</Link> · Desarrollado por CodeTlon
          </p>
        </div>
      </section>
      <Foto className="hidden lg:block lg:min-h-screen" />
    </main>
  )
}
