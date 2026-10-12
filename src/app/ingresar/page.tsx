'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { CUENTAS, useDemo } from '@/lib/demo-store'
import { Boton, Campo, NAVY, ORO } from '@/components/panel/ui'

function Formulario() {
  const { ingresar } = useDemo()
  const router = useRouter()
  const desde = useSearchParams().get('desde')
  const [email, setEmail] = useState('')
  const [clave, setClave] = useState('')
  const [error, setError] = useState('')

  function enviar(e: React.FormEvent) {
    e.preventDefault()
    if (!ingresar(email, clave)) return setError('Email o contraseña incorrectos.')
    const rol = CUENTAS.find((c) => c.email === email.trim().toLowerCase())?.rol
    router.replace(desde ?? (rol === 'organizacion' ? '/panel' : '/delegado'))
  }

  return (
    <form onSubmit={enviar} className="space-y-4">
      <Campo label="Email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError('') }} autoComplete="username" placeholder="delegado@imperial.com" />
      <Campo label="Contraseña" type="password" value={clave} onChange={(e) => { setClave(e.target.value); setError('') }} autoComplete="current-password" />
      {error && <p role="alert" className="text-sm text-[#dc2626]">{error}</p>}
      <Boton type="submit" className="w-full py-3.5">Ingresar</Boton>
      <div className="rounded-xl bg-[#f2f4f8] p-4 text-xs text-[#6b7685] space-y-1">
        <p className="font-bold text-[#0c1d3d]">Cuentas de la demo (contraseña imperial123)</p>
        {CUENTAS.map((c) => (
          <button key={c.email} type="button" onClick={() => { setEmail(c.email); setClave('imperial123'); setError('') }} className="block underline">
            {c.email} · {c.rol === 'organizacion' ? 'Organización' : 'Delegado'}
          </button>
        ))}
      </div>
    </form>
  )
}

export default function IngresarPage() {
  return (
    <main className="min-h-screen flex flex-col" style={{ background: NAVY }}>
      <div className="px-6 pt-12 pb-16 text-center text-white">
        <Image src="/images/logo-mark.png" alt="" width={84} height={84} className="mx-auto h-20 w-20 object-contain" />
        <p className="font-heading text-3xl mt-3">TORNEO IMPERIAL</p>
        <p className="text-xs uppercase tracking-[0.3em] mt-2" style={{ color: ORO }}>Coronado de Gloria</p>
      </div>
      <div className="flex-1 bg-white rounded-t-[32px] px-6 pt-8 pb-10 -mt-6">
        <div className="mx-auto max-w-md">
          <h1 className="font-heading text-2xl" style={{ color: NAVY }}>Ingresar</h1>
          <p className="text-sm text-[#6b7685] mb-6">Acceso para delegados y organización.</p>
          <Suspense><Formulario /></Suspense>
          <p className="text-center mt-8 text-xs text-[#6b7685]">
            <Link href="/" className="underline">Volver al sitio</Link> · Desarrollado por CodeTlon
          </p>
        </div>
      </div>
    </main>
  )
}
