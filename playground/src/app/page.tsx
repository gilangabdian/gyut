import { HeroClouds } from '../components/HeroClouds'
import { DemosShowcase } from '../components/DemosShowcase'
import { InstallSection } from '../components/InstallSection'
import { UsageSection } from '../components/UsageSection'
import { LivePlayground } from '../components/LivePlayground'
import { MinimalFooter } from '../components/MinimalFooter'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-[#EDEDED] antialiased">
      <main className="flex-1 flex flex-col items-center w-full">
        {/* 1. Hero with Anime Clouds, "GYUTTT", "glitch your text", & 4 Tilted Polaroids */}
        <HeroClouds />

        {/* 2. Curated Feature Demos Showcase ("See what Gyuttt can do") */}
        <DemosShowcase />

        {/* 3. Quick Installation Terminal Box */}
        <InstallSection />

        {/* 4. Quick Usage Snippets with Vanilla/React/Morph Tabs */}
        <UsageSection />

        {/* 5. Full Live Interactive Playground */}
        <LivePlayground />
      </main>

      {/* 6. Minimal Dock Footer with gilangabdian GitHub */}
      <MinimalFooter />
    </div>
  )
}
