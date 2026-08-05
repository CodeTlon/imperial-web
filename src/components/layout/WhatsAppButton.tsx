import { WhatsAppIcon } from '@/components/icons/BrandIcons'
import { waLink } from '@/lib/utils'
import { demoConfig } from '@/lib/demo-config'

export default function WhatsAppButton() {
  const { business, cta } = demoConfig

  return (
    <a
      href={waLink(business.whatsapp, cta.whatsappMessage)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
      style={{ backgroundColor: '#25D366' }}
    >
      <WhatsAppIcon size={28} className="text-white" />
    </a>
  )
}
