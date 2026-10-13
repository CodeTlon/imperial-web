import { ImageResponse } from 'next/og'

export const alt = 'Torneo Imperial · Fútbol amateur en Córdoba'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Imagen que se ve al compartir el link por WhatsApp o redes.
export default function OG() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 80, background: '#0c1d3d', color: '#fff' }}>
        <div style={{ display: 'flex', width: 90, height: 8, background: '#ffc72c', marginBottom: 30 }} />
        <div style={{ display: 'flex', fontSize: 150, fontWeight: 800, lineHeight: 1, letterSpacing: -2 }}>TORNEO</div>
        <div style={{ display: 'flex', fontSize: 150, fontWeight: 800, lineHeight: 1, color: '#ffc72c', letterSpacing: -2 }}>IMPERIAL</div>
        <div style={{ display: 'flex', fontSize: 34, marginTop: 36, color: 'rgba(255,255,255,0.8)' }}>Fixture · Posiciones · Goleadores · Coronado de Gloria, Córdoba</div>
      </div>
    ),
    size,
  )
}
