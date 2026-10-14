import Image from 'next/image'
import { demoConfig } from '@/lib/demo-config'

// Marca compartida (logo sin círculo + nombre) usada en Navbar y Footer.
const TAMANOS = { sm: ['h-8', 'text-base', 'gap-2'], md: ['h-11', 'text-xl', 'gap-3'], lg: ['h-14', 'text-2xl', 'gap-3'] } as const

export default function Marca({ color = 'var(--demo-on-structural)', tamano = 'md' }: { color?: string; tamano?: 'sm' | 'md' | 'lg' }) {
  const [alto, texto, sep] = TAMANOS[tamano]
  return (
    <span className={`flex items-center ${sep} flex-shrink-0`}>
      <Image src="/images/logo-mark.png" alt="" width={180} height={320} className={`flex-shrink-0 ${alto} w-auto object-contain`} />
      <span className={`${texto} font-bold leading-none tracking-tight whitespace-nowrap translate-y-[3px]`} style={{ color }}>
        {demoConfig.business.name}
      </span>
    </span>
  )
}
