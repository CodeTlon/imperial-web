'use client'

import { useState } from 'react'
import Contenido from '@/components/panel/Contenido'
import DescargosOrg from '@/components/panel/DescargosOrg'
import Goleadores from '@/components/panel/Goleadores'
import Jugadores from '@/components/panel/Jugadores'
import Resultados from '@/components/panel/Resultados'
import Resumen from '@/components/panel/Resumen'
import Sanciones from '@/components/panel/Sanciones'
import { PanelShell } from '@/components/panel/ui'

const TABS = ['Resumen', 'Descargos', 'Sanciones', 'Jugadores', 'Resultados', 'Goleadores', 'Contenido']

export default function PanelPage() {
  const [tab, setTab] = useState('Resumen')
  return (
    <PanelShell rol="organizacion" titulo="Panel de administración" tabs={TABS} tab={tab} setTab={setTab}>
      {tab === 'Resumen' && <Resumen irA={setTab} />}
      {tab === 'Descargos' && <DescargosOrg />}
      {tab === 'Sanciones' && <Sanciones />}
      {tab === 'Jugadores' && <Jugadores />}
      {tab === 'Resultados' && <Resultados />}
      {tab === 'Goleadores' && <Goleadores />}
      {tab === 'Contenido' && <Contenido />}
    </PanelShell>
  )
}
