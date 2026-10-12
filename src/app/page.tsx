import { demoConfig } from '@/lib/demo-config'
import Reveal from '@/components/Reveal'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/layout/WhatsAppButton'
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Services from '@/components/sections/Services'
import Gallery from '@/components/sections/Gallery'
import FotoFecha from '@/components/sections/FotoFecha'
import AppShowcase from '@/components/sections/AppShowcase'
import Pricing from '@/components/sections/Pricing'
import Testimonials from '@/components/sections/Testimonials'
import FAQ from '@/components/sections/FAQ'
import Contact from '@/components/sections/Contact'
import Team from '@/components/sections/Team'
import Schedule from '@/components/sections/Schedule'
import Stats from '@/components/sections/Stats'
import CTA from '@/components/sections/CTA'
import Sponsors from '@/components/sections/Sponsors'

export default function Home() {
  const { sections } = demoConfig

  return (
    <>
      <Navbar />
      <main>
        {sections.hero         && <Hero />}
        {sections.stats        && <Reveal><Stats /></Reveal>}
        {sections.about        && <Reveal><About /></Reveal>}
        {sections.services     && <Reveal><Services /></Reveal>}
        {sections.gallery      && <Reveal><Gallery /></Reveal>}
        <Reveal><FotoFecha /></Reveal>
        {sections.appShowcase  && <Reveal><AppShowcase /></Reveal>}
        <Reveal><Sponsors /></Reveal>
        {sections.schedule     && <Reveal><Schedule /></Reveal>}
        {sections.pricing      && <Reveal><Pricing /></Reveal>}
        {sections.testimonials && <Reveal><Testimonials /></Reveal>}
        {sections.team         && <Reveal><Team /></Reveal>}
        {sections.faq          && <Reveal><FAQ /></Reveal>}
        {sections.cta          && <Reveal><CTA /></Reveal>}
        {sections.contact      && <Reveal><Contact /></Reveal>}
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
