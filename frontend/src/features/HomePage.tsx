import ColorBends from '#/components/ui/ColorBends'

import { Button } from '@/components/ui/button'
import { Plus, ArrowRight } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import colors from '#/constants/COLORS'
import MagicBento from '@/components/ui/MagicBento'
import Footer from '#/components/Footer'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <main className="min-h-screen  text-white relative">
      <div className="fixed inset-0 z-0 w-screen h-screen overflow-hidden">
        <ColorBends
          colors={['#000000', '#020a06', '#051a0e', '#0a2918', '#6a9e8a2A']}
          rotation={90}
          speed={0.2}
          scale={1}
          frequency={1}
          warpStrength={1}
          mouseInfluence={1}
          noise={0.15}
          parallax={0.5}
          iterations={1}
          intensity={1.5}
          bandWidth={6}
          transparent
          autoRotate={0}
        />
      </div>

      <div className="relative z-10 bg-transparent  pointer-events-none">
        <section className="pointer-events-auto flex flex-col items-center text-center px-6 pt-20 pb-16 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-6">
            Create polls that{' '}
            <span style={{ color: colors.sage }}>actually</span> get answered
          </h1>

          <p className="text-[#666] text-lg leading-relaxed max-w-xl mb-10">
            Build, share, and analyze polls in minutes. Anonymous or
            authenticated, simple or complex — Pollzy handles it all with live
            results.
          </p>

          <div className="flex items-center gap-3 flex-wrap justify-center">
            <Button
              size="lg"
              className="gap-2 font-medium text-black px-8"
              style={{ backgroundColor: colors.sage }}
            >
              <Plus size={16} />
              Create a poll
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="gap-2 border-[#333] text-[#888] hover:text-white hover:bg-[#111] hover:border-[#555]"
              onClick={() => navigate({ to: '/' })}
            >
              View public polls
              <ArrowRight size={15} />
            </Button>
          </div>
        </section>

        <section className="pointer-events-auto max-w-5xl flex flex-col mx-auto px-6 pb-24">
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-widest text-[#555] mb-3">
              Everything you need
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Packed with powerful features
            </h2>
          </div>

          <MagicBento
            textAutoHide={true}
            enableStars={true}
            enableSpotlight={true}
            enableBorderGlow={true}
            enableTilt={true}
            enableMagnetism={true}
            clickEffect={true}
            spotlightRadius={300}
            particleCount={12}
            glowColor="143, 179, 161"
            disableAnimations={false}
          />
        </section>

        <Footer />
      </div>
    </main>
  )
}
