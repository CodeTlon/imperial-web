import Image from 'next/image'

// ponytail: los logos llegaron como recorte cuadrado tipo "foto de perfil"
// (fondo propio sólido, no transparente) — se muestran en su propia card en
// vez de forzarlos a una tira transparente, así cada uno se ve prolijo sin
// importar su fondo original.
const sponsors = [
  { name: 'Gatorade', src: '/images/sponsors/gatorade.png' },
  { name: 'Quilmes', src: '/images/sponsors/quilmes.png' },
  { name: 'IFK Sports', src: '/images/sponsors/ifk.jpeg' },
  { name: 'Speed Unlimited', src: '/images/sponsors/speed.png' },
  { name: 'Vidón Bar', src: '/images/sponsors/vidon.png' },
]

export default function Sponsors() {
  return (
    <section className="py-14 border-y" style={{ borderColor: 'var(--demo-border)', backgroundColor: 'var(--demo-bg)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="eyebrow text-center mb-8">Nos acompañan</p>
        {/* Carrusel infinito (idea de react-bits/LogoLoop): la lista va duplicada y se
            desplaza la mitad, así el bucle no tiene corte. Pausa al pasar el mouse. */}
        <div className="marquee" aria-label="Sponsors">
          <div className="marquee-track">
            {[...sponsors, ...sponsors].map((s, i) => (
              <div key={`${s.name}-${i}`} className="card !p-3 flex flex-col items-center gap-2 w-28 flex-shrink-0" aria-hidden={i >= sponsors.length}>
                <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                  <Image src={s.src} alt={s.name} fill className="object-cover" />
                </div>
                <span className="text-[11px] text-center font-medium leading-tight" style={{ color: 'var(--demo-muted)' }}>
                  {s.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
