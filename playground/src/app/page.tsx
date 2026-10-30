import { HeroClouds } from '../components/HeroClouds'
import { InstallSection } from '../components/InstallSection'
import { DemosShowcase } from '../components/DemosShowcase'
import { LivePlayground } from '../components/LivePlayground'
import { MinimalFooter } from '../components/MinimalFooter'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-[#EDEDED] antialiased">
      <main className="flex-1 flex flex-col items-center w-full">
        {/* 1. Hero with Anime Clouds, "GYUT", "glitch your text", & 4 Tilted Polaroids */}
        <HeroClouds />

        {/* 2. Quick Installation Terminal Box */}
        <InstallSection />

        {/* 3. Curated Feature Demos Showcase */}
        <DemosShowcase />

        {/* 4. Full Live Interactive Playground & Code Generator */}
        <LivePlayground />
      </main>

      {/* 5. Minimal Dock Footer with gilangabdian GitHub */}
      <MinimalFooter />
    </div>
  )
}
