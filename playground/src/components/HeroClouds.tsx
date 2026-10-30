'use client';

import { useEffect, useRef } from 'react';
import { createGlitch } from 'gyut';

export function HeroClouds() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const card1Ref = useRef<HTMLHeadingElement>(null);
  const card2Ref = useRef<HTMLHeadingElement>(null);
  const card3Ref = useRef<HTMLHeadingElement>(null);
  const card4Ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const instances: ReturnType<typeof createGlitch>[] = [];

    // Title Glitch: Auto-trigger ('always') with smooth periodic cadence
    if (titleRef.current) {
      const gTitle = createGlitch(titleRef.current, {
        intensity: 0.5,
        speed: 0.85,
        trigger: 'always',
        colors: ['#FF5FCF', '#00F0FF', '#FFE600'],
      });
      instances.push(gTitle);
    }

    // Informative Differentiator Cards: subtle periodic glitches
    if (card1Ref.current) {
      instances.push(
        createGlitch(card1Ref.current, {
          intensity: 0.4,
          speed: 0.9,
          shape: 'classic',
          colors: ['#00F0FF', '#FF5FCF'],
        })
      );
    }

    if (card2Ref.current) {
      instances.push(
        createGlitch(card2Ref.current, {
          intensity: 0.45,
          speed: 1,
          shape: 'slice',
          colors: ['#FF5FCF', '#FFE600'],
        })
      );
    }

    if (card3Ref.current) {
      instances.push(
        createGlitch(card3Ref.current, {
          intensity: 0.4,
          speed: 0.85,
          shape: 'classic',
          colors: ['#00FF66', '#00F0FF'],
        })
      );
    }

    if (card4Ref.current) {
      instances.push(
        createGlitch(card4Ref.current, {
          intensity: 0.35,
          speed: 1,
          shape: 'block',
          colors: ['#FF5FCF', '#00F0FF'],
        })
      );
    }

    return () => {
      instances.forEach((inst) => inst.destroy());
    };
  }, []);

  return (
    <section className="relative w-full min-h-[90vh] flex flex-col justify-between items-center overflow-hidden bg-[#000000] pt-12 md:pt-16 pb-0 select-none">
      {/* Background Cloud Artwork using /cloud.svg */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        {/* Soft Ambient Warm & Lo-Fi Glows */}
        <div className="absolute w-[600px] h-[380px] bg-[#FF5FCF]/12 blur-[130px] rounded-full top-1/4 -translate-y-6" />
        <div className="absolute w-[500px] h-[320px] bg-[#00F0FF]/8 blur-[140px] rounded-full top-1/3 translate-x-20" />

        {/* Cloud SVG from public/cloud.svg */}
        <img
          src="/cloud.svg"
          alt="Lo-Fi Anime Cloud Artwork"
          className="absolute w-[1150px] max-w-[145vw] h-auto top-4 opacity-35 mix-blend-screen filter drop-shadow-[0_0_60px_rgba(255,95,207,0.15)] animate-cloud-slow"
        />
      </div>

      {/* Hero Content Stage */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 flex flex-col items-center my-auto">
        {/* Top Badges / Pill Bar */}
        <div className="flex items-center gap-3 mb-6 flex-wrap justify-center">
          <span className="px-3.5 py-1 rounded-full text-xs font-mono font-medium tracking-wide bg-white/[0.04] border border-white/10 text-[#EDEDED]/80 shadow-sm">
            ⚡ 0 runtime dependencies
          </span>
          <span className="px-3.5 py-1 rounded-full text-xs font-mono font-medium tracking-wide bg-[#FF5FCF]/10 border border-[#FF5FCF]/30 text-[#FF5FCF] shadow-sm">
            framework agnostic
          </span>
          <span className="px-3.5 py-1 rounded-full text-xs font-mono font-medium tracking-wide bg-white/[0.04] border border-white/10 text-[#EDEDED]/80 shadow-sm">
            ~4kb gzip
          </span>
        </div>

        {/* Central Stage: Main Title with Auto-Glitch & Subtitle */}
        <div className="flex flex-col items-center text-center mt-2 mb-10">
          <h1
            ref={titleRef}
            className="font-display text-7xl sm:text-8xl md:text-9xl lg:text-[10.5rem] font-bold text-[#FF5FCF] tracking-tight leading-none drop-shadow-[0_12px_40px_rgba(255,95,207,0.35)] cursor-pointer text-stroke-comic"
          >
            GYUT
          </h1>
          <p className="mt-4 font-mono text-base sm:text-lg md:text-xl font-medium tracking-[0.28em] text-[#EDEDED]/90 uppercase">
            glitch your text
          </p>
        </div>

        {/* 4 Informative Differentiator Cards (Cozy Lo-Fi Badge Aesthetic) */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mt-4 max-w-5xl px-2">
          {/* Card 1: Zero Dependencies */}
          <div className="group flex flex-col justify-between bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-[#00F0FF]/40 rounded-2xl p-5 shadow-xl transition-all duration-300 backdrop-blur-sm">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30">
                  ⚡ Pure Native
                </span>
                <span className="text-[11px] font-mono text-[#737373]">#01</span>
              </div>
              <h3
                ref={card1Ref}
                className="font-display text-lg font-bold text-[#EDEDED] group-hover:text-[#00F0FF] transition-colors mb-2 tracking-wide"
              >
                Zero Dependencies
              </h3>
              <p className="text-xs font-sans text-[#737373] leading-relaxed">
                0 runtime deps. Built natively with modern Web APIs and zero third-party bloat.
              </p>
            </div>
          </div>

          {/* Card 2: CSS Compositor */}
          <div className="group flex flex-col justify-between bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-[#FF5FCF]/40 rounded-2xl p-5 shadow-xl transition-all duration-300 backdrop-blur-sm">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-[#FF5FCF]/15 text-[#FF5FCF] border border-[#FF5FCF]/30">
                  🎯 60 FPS
                </span>
                <span className="text-[11px] font-mono text-[#737373]">#02</span>
              </div>
              <h3
                ref={card2Ref}
                className="font-display text-lg font-bold text-[#EDEDED] group-hover:text-[#FF5FCF] transition-colors mb-2 tracking-wide"
              >
                CSS Compositor
              </h3>
              <p className="text-xs font-sans text-[#737373] leading-relaxed">
                Jitter & clip-path run on the browser GPU compositor without per-frame JS lag.
              </p>
            </div>
          </div>

          {/* Card 3: Any Color Combo */}
          <div className="group flex flex-col justify-between bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-[#00FF66]/40 rounded-2xl p-5 shadow-xl transition-all duration-300 backdrop-blur-sm">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-[#00FF66]/15 text-[#00FF66] border border-[#00FF66]/30">
                  🎨 Multi-Color
                </span>
                <span className="text-[11px] font-mono text-[#737373]">#03</span>
              </div>
              <h3
                ref={card3Ref}
                className="font-display text-lg font-bold text-[#EDEDED] group-hover:text-[#00FF66] transition-colors mb-2 tracking-wide"
              >
                Any Color Combo
              </h3>
              <p className="text-xs font-sans text-[#737373] leading-relaxed">
                Random coherent pairs or 3+ custom hex colors via zero-DOM chromatic text-shadow.
              </p>
            </div>
          </div>

          {/* Card 4: Tiny Footprint */}
          <div className="group flex flex-col justify-between bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-[#FFE600]/40 rounded-2xl p-5 shadow-xl transition-all duration-300 backdrop-blur-sm">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-[#FFE600]/15 text-[#FFE600] border border-[#FFE600]/30">
                  🪶 ~4KB Gzip
                </span>
                <span className="text-[11px] font-mono text-[#737373]">#04</span>
              </div>
              <h3
                ref={card4Ref}
                className="font-display text-lg font-bold text-[#EDEDED] group-hover:text-[#FFE600] transition-colors mb-2 tracking-wide"
              >
                Tiny Footprint
              </h3>
              <p className="text-xs font-sans text-[#737373] leading-relaxed">
                Ultra-lightweight on bundle size with zero framework lock-in.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Street Horizon Bar */}
      <div className="relative z-10 w-full mt-14">
        <div className="w-full h-7 bg-[#000000] border-t border-white/10 flex items-center justify-center overflow-hidden">
          <div className="flex gap-6 items-center opacity-40">
            {Array.from({ length: 18 }).map((_, i) => (
              <div
                key={i}
                className={`h-1 w-8 sm:w-12 rounded-full ${
                  i % 2 === 0 ? 'bg-[#FF5FCF]' : 'bg-[#FFE600]'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
