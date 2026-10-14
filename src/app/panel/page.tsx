'use client'

import Contenido from '@/components/panel/Contenido'
import DescargosOrg from '@/components/panel/DescargosOrg'
import Goleadores from '@/components/panel/Goleadores'
import Equipos from '@/components/panel/Jugadores'
import Resultados from '@/components/panel/Resultados'
import Resumen from '@/components/panel/Resumen'
import Sanciones from '@/components/panel/Sanciones'
import { PanelShell, usePestanaUrl } from '@/components/panel/ui'
import { useDemo } from '@/lib/demo-store'

const TABS = ['Resumen', 'Descargos', 'Sanciones', 'Equipos', 'Resultados', 'Goleadores', 'Contenido']

export default function PanelPage() {
  const [tab, setTab] = usePestanaUrl(TABS, 'Resumen')
  const { datos } = useDemo()
  const contadores = {
    Descargos: datos.sanciones.filter((s) => s.estado === 'En revisión').length,
    Sanciones: datos.sanciones.length,
    Equipos: datos.plantel.filter((j) => j.estadoDoc !== 'Aprobado').length,
  }
  return (
    <PanelShell rol="organizacion" titulo="Panel de administración" tabs={TABS} tab={tab} setTab={setTab} contadores={contadores}>
      {tab === 'Resumen' && <Resumen irA={setTab} />}
      {tab === 'Descargos' && <DescargosOrg />}
      {tab === 'Sanciones' && <Sanciones />}
      {tab === 'Equipos' && <Equipos />}
      {tab === 'Resultados' && <Resultados />}
      {tab === 'Goleadores' && <Goleadores />}
      {tab === 'Contenido' && <Contenido />}
    </PanelShell>
  )
}
