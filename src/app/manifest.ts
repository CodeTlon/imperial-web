import type { MetadataRoute } from 'next'

// Permite "agregar a la pantalla de inicio" desde el celular (PWA liviana, sin service worker).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Torneo Imperial',
    short_name: 'Imperial',
    description: 'Fixture, posiciones y goleadores del Torneo Imperial.',
    start_url: '/',
    display: 'standalone',
    background_color: '#062f36',
    theme_color: '#062f36',
    lang: 'es-AR',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
  }
}
