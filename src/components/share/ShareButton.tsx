'use client'

import { Share2 } from 'lucide-react'

// Compartir con la hoja nativa del celular; en escritorio abre WhatsApp con el texto y el link
// (con ?cat= para que quien lo abra vea la misma categoría).
export default function ShareButton({ texto, categoria }: { texto: string; categoria: string }) {
  const compartir = async () => {
    const url = new URL(window.location.origin)
    url.searchParams.set('cat', categoria)
    const link = url.toString()
    if (navigator.share) {
      try { await navigator.share({ title: 'Torneo Imperial', text: texto, url: link }) } catch {}
      return
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(`${texto}\n${link}`)}`, '_blank', 'noopener,noreferrer')
  }
  return (
    <button
      type="button"
      onClick={compartir}
      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-90"
      style={{ backgroundColor: 'var(--demo-structural)', color: 'var(--demo-on-structural)', borderRadius: 'var(--demo-radius)' }}
    >
      <Share2 size={15} /> Compartir fecha
    </button>
  )
}
