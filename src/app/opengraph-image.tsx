import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const alt = 'Torneo Imperial · Fútbol amateur en Córdoba'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Imagen que se ve al compartir el link por WhatsApp o redes.
export default async function OG() {
  const logo = `data:image/png;base64,${(await readFile(join(process.cwd(), 'public/images/logo-mark.png'))).toString('base64')}`
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 70, justifyContent: 'center', padding: 70, background: '#062f36', color: '#fff' }}>
        <img src={logo} width={260} height={449} alt="" />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 130, fontWeight: 800, lineHeight: 1, letterSpacing: -2 }}>TORNEO</div>
          <div style={{ display: 'flex', fontSize: 130, fontWeight: 800, lineHeight: 1, color: '#f3a21c', letterSpacing: -2 }}>IMPERIAL</div>
          <div style={{ display: 'flex', fontSize: 32, marginTop: 30, color: 'rgba(255,255,255,0.8)' }}>Fixture · Posiciones · Goleadores</div>
        </div>
      </div>
    ),
    size,
  )
}
