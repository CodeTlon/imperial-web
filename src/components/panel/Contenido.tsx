'use client'

import { useState } from 'react'
import { useDemo } from '@/lib/demo-store'
import { Boton, Campo, K, Tarjeta, Encabezado } from '@/components/panel/ui'

export default function Contenido() {
  const { datos, setFotoFecha } = useDemo()
  const [url, setUrl] = useState(datos.fotoFechaUrl)
  return (
    <div className="space-y-6">
      <Encabezado titulo="Contenido" descripcion="Enlaces y contenido del sitio que se editan desde el panel." />
    <Tarjeta titulo="Foto de la fecha">
      <form className="space-y-4 max-w-xl" onSubmit={(e) => { e.preventDefault(); setFotoFecha(url.trim()) }}>
        <Campo label="Link del Drive con las fotos" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Ej: https://drive.google.com/drive/folders/…" />
        <p className={`text-xs ${K.suave}`}>Es el enlace que se muestra en la home, en la sección de fotos de la fecha.</p>
        <Boton type="submit" disabled={!/^https?:\/\//.test(url)}>Guardar</Boton>
      </form>
    </Tarjeta>
    </div>
  )
}
