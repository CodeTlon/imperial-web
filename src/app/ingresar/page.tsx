'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { CUENTAS, useDemo } from '@/lib/demo-store'
import Marca from '@/components/layout/Marca'
import { Eye, EyeOff, Info, Loader2 } from 'lucide-react'
import { NAVY, VARS_PANEL } from '@/components/panel/ui'

function Formulario() {
  const { ingresar } = useDemo()
  const router = useRouter()
  const desde = useSearchParams().get('desde')
  const [email, setEmail] = useState('')
  const [clave, setClave] = useState('')
  const [error, setError] = useState('')
  const [ver, setVer] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [cuentas, setCuentas] = useState(false)

  function enviar(e: React.FormEvent) {
    e.preventDefault()
    if (cargando) return
    setCargando(true)
    if (!ingresar(email, clave)) {
      setCargando(false)
      return setError('Email o contraseña incorrectos.')
    }
    const rol = CUENTAS.find((c) => c.email === email.trim().toLowerCase())?.rol
    router.replace(desde ?? (rol === 'organizacion' ? '/panel' : rol === 'jugador' ? '/jugador' : '/delegado'))
  }

  const usar = (c: (typeof CUENTAS)[number]) => { setEmail(c.email); setClave(c.clave); setError('') }
  const ROL: Record<string, string> = { organizacion: 'Organización', delegado: 'Delegado', jugador: 'Jugador' }

  return (
    <form onSubmit={enviar} className="space-y-4">
      <div className="rounded-xl border border-[#d9e8ea]">
        <button type="button" onClick={() => setCuentas(!cuentas)} aria-expanded={cuentas} aria-controls="cuentas-demo" className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-semibold text-[#062f36]">
          <Info size={18} className="text-[#0494a4]" aria-hidden />
          Cuentas de prueba
          <span className="ml-auto text-xs font-normal text-[#5b7479]">{cuentas ? 'Ocultar' : 'Ver'}</span>
        </button>
        {cuentas && (
          <ul id="cuentas-demo" className="space-y-2 border-t border-[#d9e8ea] p-3">
            {CUENTAS.map((c) => (
              <li key={c.email}>
                <button type="button" onClick={() => usar(c)} className="w-full rounded-lg bg-[#eef6f7] px-3 py-2.5 text-left transition hover:bg-[#dff0f2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0494a4]">
                  <span className="block text-sm font-bold text-[#062f36]">{ROL[c.rol]}</span>
                  <span className="block text-xs text-[#5b7479]">{c.email} · contraseña {c.clave}</span>
                </button>
              </li>
            ))}
            <li className="px-1 text-xs text-[#5b7479]">Tocá una cuenta para cargar los datos en el formulario.</li>
          </ul>
        )}
      </div>
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
      <Foto className="h-[28vh] min-h-[200px] lg:hidden" />
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
