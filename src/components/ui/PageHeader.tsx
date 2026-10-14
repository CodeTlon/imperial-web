import Image from 'next/image'
import Link from 'next/link'

type Pill = { label: string; value: string }

function Pills({ pills }: { pills: Pill[] }) {
  if (!pills.length) return null
  return (
    <div className="hero-in flex flex-wrap justify-center gap-2 mt-5" style={{ ['--d' as string]: '460ms' }}>
      {pills.map((p) => (
        <span
          key={p.label}
          className="inline-flex items-center gap-1.5 px-3 py-1 text-xs sm:text-sm font-semibold border border-white/25 bg-white/10 backdrop-blur-sm rounded-full"
        >
          <span className="text-white/70">{p.label}:</span>
          <span style={{ color: 'var(--demo-accent)' }}>{p.value}</span>
        </span>
      ))}
    </div>
  )
}

// Mini hero a ancho completo (sin video): foto de fondo + velo teal, título con brillo,
// subtítulo y botón "Inscribí a tu equipo". Cubre también el área del navbar fijo.
export default function PageHeader({
  eyebrow,
  title,
  subtitle,
  pills = [],
  backgroundImage = '/images/home-poster.jpg',
  objectPosition = '50% 40%',
  cta = true,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  pills?: Pill[]
  backgroundImage?: string
  objectPosition?: string
  cta?: boolean
}) {
  return (
    <section
      className="relative w-full min-h-[340px] sm:min-h-[38svh] overflow-hidden flex flex-col text-white"
      style={{ backgroundColor: 'var(--demo-structural, #062f36)' }}
    >
      <Image src={backgroundImage} alt="" fill priority sizes="100vw" className="object-cover" style={{ objectPosition }} />
      <div className="absolute inset-0" style={{ backgroundColor: 'color-mix(in srgb, var(--demo-structural, #062f36) 78%, transparent)' }} />
      <div
        className="absolute inset-x-0 bottom-0 h-1/2"
        style={{ background: 'linear-gradient(180deg, transparent, color-mix(in srgb, var(--demo-structural, #062f36) 95%, black))' }}
      />

      <div className="relative flex-1 flex flex-col items-center justify-center text-center px-4 pt-24 sm:pt-28 pb-10 sm:pb-12 2xl:pt-32 2xl:pb-16">
        {eyebrow && (
          <p
            className="hero-in mb-2 text-xs sm:text-sm 2xl:text-lg font-bold uppercase tracking-[0.18em]"
            style={{ ['--d' as string]: '60ms', color: 'var(--demo-accent)' }}
          >
            {eyebrow}
          </p>
        )}
        <h1 className="hero-shine font-heading text-4xl sm:text-5xl md:text-6xl xl:text-7xl 2xl:text-8xl leading-[1.05] uppercase" style={{ ['--d' as string]: '160ms' }}>
          {title}
        </h1>
        {subtitle && (
          <p
            className="hero-in mt-3 mb-1 max-w-xl sm:max-w-2xl 2xl:max-w-4xl text-base sm:text-lg xl:text-xl 2xl:text-3xl leading-relaxed text-white/85"
            style={{ ['--d' as string]: '320ms' }}
          >
            {subtitle}
          </p>
        )}
        <Pills pills={pills} />
        {cta && (
          <div className="hero-in mt-6 2xl:mt-8" style={{ ['--d' as string]: '520ms' }}>
            <Link
              href="/inscripcion"
              className="inline-flex items-center justify-center h-11 2xl:h-14 px-6 2xl:px-9 text-sm 2xl:text-xl font-bold whitespace-nowrap transition-all hover:brightness-110"
              style={{ backgroundColor: 'var(--demo-accent)', color: 'var(--demo-on-accent)', borderRadius: '0.5rem' }}
            >
              Inscribí a tu equipo
            </Link>
          </div>
        )}
      </div>

      <style>{`
        .hero-in{opacity:0;animation:hero-up .8s var(--d,0ms) ease-out forwards}
        .hero-shine{opacity:0;background:linear-gradient(110deg,#f3a21c 35%,#fff3c4 50%,#f3a21c 65%) 0 0/250% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:hero-up .8s var(--d,0ms) ease-out forwards,hero-brillo 4s 1.2s linear infinite}
        @keyframes hero-up{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}
        @keyframes hero-brillo{from{background-position:150% 0}to{background-position:-100% 0}}
        @media (prefers-reduced-motion: reduce){.hero-in,.hero-shine{animation:none;opacity:1}}
      `}</style>
    </section>
  )
}
