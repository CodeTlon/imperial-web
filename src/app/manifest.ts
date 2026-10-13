import type { MetadataRoute } from 'next'

// Permite "agregar a la pantalla de inicio" desde el celular (PWA liviana, sin service worker).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Torneo Imperial',
    short_name: 'Imperial',
    description: 'Fixture, posiciones y goleadores del Torneo Imperial.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0c1d3d',
    theme_color: '#0c1d3d',
    lang: 'es-AR',
    icons: [{ src: '/images/logo-mark.png', sizes: '180x320', type: 'image/png' }],
  }
}
