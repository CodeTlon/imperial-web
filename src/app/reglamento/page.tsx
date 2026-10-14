import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PageHeader from '@/components/ui/PageHeader'
import { categoriasInfo, reglamentoCapitulos } from '@/lib/reglamento-ti'

export const metadata: Metadata = {
  title: 'Reglamento',
  description: 'Formato del torneo, categorías, sanciones por tarjetas y reglas de juego del Torneo Imperial.',
}

const TEAL = '#0494a4'
const TEAL_OSCURO = '#04707c'
const heading = { color: 'var(--demo-heading)', fontFamily: 'var(--demo-font-heading)' } as const

// Cifras y plazos que importan: se resaltan con color dentro de cada párrafo.
const CLAVES = /(-?\d+(?:\s(?:a|y)\s\d+)?\s?(?:puntos?|fechas?|partidos?|meses|min\b|minutos|jugadores|amarillas|apercibimientos?|cambios|equipos|años?)|\bMARTES\b|\bINHABILITADO\b)/gi
function resaltar(texto: string): ReactNode[] {
  return texto.split(CLAVES).map((t, i) => (i % 2 === 1 ? <strong key={i} style={{ color: TEAL_OSCURO }}>{t}</strong> : t))
}

// "Art. 34: texto" -> subtítulo "Art. 34" + párrafo. Si no hay artículo, se usa lo que va antes de los dos puntos
// cuando es corto ("Inscripción: ...", "+30: ..."). Los puntos seguidos del mismo artículo comparten subtítulo.
type Punto = { sub?: string; texto: string }
function parsear(p: string): Punto {
  const art = p.match(/^(Art\. \d+(?: Bis)?(?: y \d+)?(?: \([^)]*\))?):\s*(.*)$/)
  if (art) return { sub: art[1], texto: art[2] }
  const pref = p.match(/^([^:.]{2,24}):\s+(.*)$/)
  if (pref) return { sub: pref[1], texto: pref[2] }
  return { texto: p }
}
function agrupar(puntos: string[]): { sub?: string; textos: string[] }[] {
  const grupos: { sub?: string; textos: string[] }[] = []
  for (const p of puntos.map(parsear)) {
    const ultimo = grupos[grupos.length - 1]
    if (ultimo && ultimo.sub && ultimo.sub === p.sub) ultimo.textos.push(p.texto)
    else grupos.push({ sub: p.sub, textos: [p.texto] })
  }
  return grupos
}
// "Cap. 2 · De los campeonatos: partidos, formalidades" -> n=2, título y bajada.
function partirTitulo(t: string) {
  const [cap, resto] = t.split(' · ')
  const n = Number(cap.replace(/\D/g, ''))
  const [titulo, bajada] = resto.split(': ')
  return { n, titulo, bajada: bajada ? bajada.charAt(0).toUpperCase() + bajada.slice(1) : undefined }
}

const ESENCIAL = [
  { valor: '3 · 1 · 0', texto: 'puntos por victoria, empate y derrota' },
  { valor: '25', texto: 'jugadores en la lista de buena fe' },
  { valor: '7', texto: 'jugadores mínimos para presentarse' },
  { valor: '15′', texto: 'de tolerancia desde el horario pactado' },
  { valor: 'Martes', texto: 'único día en que se reciben apelaciones' },
]

const capitulos = reglamentoCapitulos.map((c) => ({ ...c, ...partirTitulo(c.titulo) }))
const INDICE = [
  { id: 'categorias-y-duracion', n: 'A', titulo: 'Categorías y duración' },
  ...capitulos.map((c) => ({ id: c.id, n: String(c.n).padStart(2, '0'), titulo: c.titulo })),
]

function Seccion({ id, n, titulo, bajada, children }: { id: string; n: string; titulo: string; bajada?: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 pb-12 mb-12 border-b last:border-b-0 last:pb-0 last:mb-0" style={{ borderColor: 'var(--demo-border)' }}>
      <div className="flex items-baseline gap-4">
        <span className="text-5xl leading-none font-bold" style={{ color: 'var(--demo-accent)', fontFamily: 'var(--demo-font-heading)' }}>{n}</span>
        <h2 className="text-3xl sm:text-4xl font-bold" style={heading}>{titulo}</h2>
      </div>
      {bajada && <p className="mt-2 ml-[4.25rem] text-sm sm:text-base" style={{ color: 'var(--demo-muted)' }}>{bajada}</p>}
      <div className="mt-6">{children}</div>
    </section>
  )
}

const th = 'py-2.5 pr-4 text-xs font-bold uppercase tracking-wider'

export default function ReglamentoPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen" style={{ backgroundColor: 'var(--demo-bg)' }}>
        <PageHeader
          backgroundImage="/images/gallery-5.jpg"
          title="Reglamento"
          subtitle="Resumen del reglamento oficial 2026: lo que un jugador o delegado consulta todas las fechas."
          cta={false}
        />

        <div className="section-pad">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-14">
            {/* Índice */}
            <nav aria-label="Índice del reglamento" className="mb-10 lg:mb-0">
              <div className="lg:sticky lg:top-24 lg:max-h-[calc(100svh-7rem)] lg:overflow-y-auto">
                <p className="text-xs font-bold uppercase tracking-[0.18em] mb-3" style={{ color: TEAL }}>En esta página</p>
                <ol className="grid gap-0.5 sm:grid-cols-2 lg:grid-cols-1 border-l-2" style={{ borderColor: 'var(--demo-border)' }}>
                  {INDICE.map((s) => (
                    <li key={s.id}>
                      <a href={`#${s.id}`} className="flex items-baseline gap-3 -ml-0.5 border-l-2 border-transparent py-1.5 pl-4 text-sm font-semibold transition-colors hover:border-[var(--demo-accent)]" style={{ color: 'var(--demo-text)' }}>
                        <span className="text-xs tabular-nums" style={{ color: 'var(--demo-accent)' }}>{s.n}</span>
                        {s.titulo}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            </nav>

            <article className="min-w-0 max-w-3xl">
              {/* Lo esencial */}
              <dl className="mb-14 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3 border-y py-7" style={{ borderColor: 'var(--demo-border)' }}>
                {ESENCIAL.map((e) => (
                  <div key={e.texto}>
                    <dt className="text-3xl sm:text-4xl font-bold leading-none" style={{ color: 'var(--demo-accent)', fontFamily: 'var(--demo-font-heading)' }}>{e.valor}</dt>
                    <dd className="mt-2 text-sm leading-snug" style={{ color: 'var(--demo-text)' }}>{e.texto}</dd>
                  </div>
                ))}
              </dl>

              <Seccion id="categorias-y-duracion" n="A" titulo="Categorías y duración">
                <p className="mb-5 leading-relaxed" style={{ color: 'var(--demo-text)' }}>
                  Cada categoría se define por la clase de nacimiento de los jugadores. La duración de los partidos y la cantidad de cambios dependen de la categoría.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm sm:text-base">
                    <thead>
                      <tr className="border-b-2" style={{ borderColor: TEAL }}>
                        {['Categoría', 'Edad', 'Duración', 'Cambios'].map((h) => <th key={h} scope="col" className={th} style={{ color: TEAL_OSCURO }}>{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {categoriasInfo.map((c) => (
                        <tr key={c.nombre} className="border-b" style={{ borderColor: 'var(--demo-border)' }}>
                          <th scope="row" className="py-3 pr-4 text-xl font-bold" style={heading}>{c.nombre}</th>
                          <td className="py-3 pr-4" style={{ color: 'var(--demo-text)' }}>{c.edad}</td>
                          <td className="py-3 pr-4 whitespace-nowrap" style={{ color: 'var(--demo-text)' }}>{c.minutos}</td>
                          <td className="py-3 font-bold" style={{ color: TEAL_OSCURO }}>{c.cambios}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Seccion>

              {capitulos.map((cap) => (
                <Seccion key={cap.id} id={cap.id} n={String(cap.n).padStart(2, '0')} titulo={cap.titulo} bajada={cap.bajada}>
                  <div className="grid gap-6">
                    {agrupar(cap.puntos).map((g, i) => (
                      <div key={i}>
                        {g.sub && <h3 className="text-xs sm:text-sm font-bold uppercase tracking-[0.14em] mb-2" style={{ color: TEAL }}>{g.sub}</h3>}
                        <div className="grid gap-3">
                          {g.textos.map((t) => (
                            <p key={t} className="leading-relaxed text-base sm:text-[17px]" style={{ color: 'var(--demo-text)' }}>{resaltar(t)}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </Seccion>
              ))}
            </article>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
