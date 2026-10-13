import Image from 'next/image'
import { demoConfig } from '@/lib/demo-config'

// Marca compartida (logo sin círculo + nombre) usada en Navbar y Footer.
export default function Marca({ color = 'var(--demo-on-structural)' }: { color?: string }) {
  return (
    <span className="flex items-center gap-2.5 flex-shrink-0">
      <Image src="/images/logo-mark.png" alt="" width={180} height={320} className="flex-shrink-0 h-10 w-auto object-contain" />
      <span className="text-xl font-bold tracking-tight whitespace-nowrap" style={{ color }}>
        {demoConfig.business.name}
      </span>
    </span>
  )
}
