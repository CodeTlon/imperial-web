'use client'

export default function CategoryTabs({
  options,
  value,
  onChange,
}: {
  options: readonly string[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-10">
      {options.map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          className="px-5 py-2 text-sm font-semibold transition-all"
          style={{
            borderRadius: 'var(--demo-radius)',
            backgroundColor: value === c ? 'var(--demo-accent)' : 'var(--demo-surface)',
            color: value === c ? 'var(--demo-on-accent)' : 'var(--demo-text)',
            border: `1px solid ${value === c ? 'var(--demo-accent)' : 'var(--demo-border)'}`,
          }}
        >
          {c}
        </button>
      ))}
    </div>
  )
}
