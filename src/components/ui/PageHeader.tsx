import Image from 'next/image'

type Pill = { label: string; value: string }

function Pills({ pills }: { pills: Pill[] }) {
  if (pills.length === 0) return null
  return (
    <div className="flex flex-wrap justify-center gap-3 mt-6">
      {pills.map((p) => (
        <span
          key={p.label}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold"
          style={{
            borderRadius: 'var(--demo-radius)',
            backgroundColor: 'var(--demo-surface)',
            border: '1px solid var(--demo-border)',
            color: 'var(--demo-text)',
          }}
        >
          <span style={{ color: 'var(--demo-muted)' }}>{p.label}:</span>
          <span style={{ color: 'var(--demo-accent)' }}>{p.value}</span>
        </span>
      ))}
    </div>
  )
}

export default function PageHeader({
  eyebrow,
  title,
  subtitle,
  pills = [],
  backgroundImage,
}: {
  eyebrow: string
  title: string
  subtitle?: string
  pills?: Pill[]
  backgroundImage?: string
}) {
  if (backgroundImage) {
    return (
      <div className="relative w-full h-64 md:h-80 pt-16">
        <Image src={backgroundImage} alt={title} fill className="object-cover" style={{ objectPosition: '50% 25%' }} priority />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, color-mix(in srgb, var(--demo-structural) 60%, black) 0%, color-mix(in srgb, var(--demo-structural) 92%, black) 100%)' }}
        />
        <div className="relative z-10 h-full flex flex-col items-center justify-end pb-10 px-4 text-center">
          <p className="eyebrow !mb-2">{eyebrow}</p>
          <h1 className="text-4xl md:text-5xl font-bold" style={{ color: 'var(--demo-on-structural)' }}>{title}</h1>
          <Pills pills={pills} />
        </div>
      </div>
    )
  }

  return (
    <div className="text-center mb-12">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="section-title">{title}</h1>
      {subtitle && <p className="section-subtitle mt-4">{subtitle}</p>}
      <Pills pills={pills} />
    </div>
  )
}
