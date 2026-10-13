import { demoConfig } from '@/lib/demo-config'
import Reveal from '@/components/Reveal'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/sections/Hero'
import TorneoHome from '@/components/sections/TorneoHome'
import AppShowcase from '@/components/sections/AppShowcase'
import Contact from '@/components/sections/Contact'
import CTA from '@/components/sections/CTA'
import Sponsors from '@/components/sections/Sponsors'

export default function Home() {
  const { sections } = demoConfig

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TorneoHome />
        {sections.appShowcase && <Reveal><AppShowcase /></Reveal>}
        <Reveal><Sponsors /></Reveal>
        {sections.cta     && <Reveal><CTA /></Reveal>}
        {sections.contact && <Reveal><Contact /></Reveal>}
      </main>
      <Footer />
    </>
  )
}
