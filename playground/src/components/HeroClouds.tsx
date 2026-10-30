'use client';

import { useEffect, useRef } from 'react';
import { createGlitch } from 'gyut';

export function HeroClouds() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const card1Ref = useRef<HTMLSpanElement>(null);
  const card2Ref = useRef<HTMLSpanElement>(null);
  const card3Ref = useRef<HTMLSpanElement>(null);
  const card4Ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const instances: ReturnType<typeof createGlitch>[] = [];

    // 1. Main Title Glitch: Auto-trigger ('always') with smooth relaxed cadence
    if (titleRef.current) {
      instances.push(
        createGlitch(titleRef.current, {
          intensity: 0.5,
          speed: 0.85,
          trigger: 'always',
          colors: ['#FF5FCF', '#FFFFFF'],
        })
      );
    }

    // 2. Simple Floating Visual Cards (Auto-glitching clean words, pure visual like image reference)
    if (card1Ref.current) {
      instances.push(
        createGlitch(card1Ref.current, {
          intensity: 0.45,
          speed: 0.9,
          trigger: 'always',
          shape: 'classic',
          colors: ['#FF5FCF', '#FFFFFF'],
        })
      );
    }

    if (card2Ref.current) {
      instances.push(
        createGlitch(card2Ref.current, {
          intensity: 0.5,
          speed: 1,
          trigger: 'always',
          shape: 'slice',
          colors: ['#FF5FCF', '#FFFFFF'],
        })
      );
    }

    if (card3Ref.current) {
      instances.push(
        createGlitch(card3Ref.current, {
          intensity: 0.4,
          speed: 0.85,
          trigger: 'always',
          shape: 'block',
          colors: ['#FF5FCF', '#FFFFFF'],
        })
      );
    }

    if (card4Ref.current) {
      instances.push(
        createGlitch(card4Ref.current, {
          intensity: 0.5,
          speed: 1.1,
          trigger: 'always',
          shape: 'slice',
          colors: ['#FF5FCF', '#FFFFFF'],
        })
      );
    }

    return () => {
      instances.forEach((inst) => inst.destroy());
    };
  }, []);

  return (
    <section className="relative w-full min-h-[85vh] flex flex-col justify-center items-center overflow-hidden bg-[#000000] pt-8 md:pt-12 pb-14 select-none">
      {/* Background Ambient Glow (Cloud removed) */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        {/* Soft Ambient Warm Pink Glow */}
        <div className="absolute w-[600px] h-[350px] bg-[#FF5FCF]/12 blur-[140px] rounded-full top-1/4 -translate-y-8" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 flex flex-col items-center">
        {/* Central Title Stage (Higher up, strictly cursor-default, #FF5FCF color) */}
        <div className="flex flex-col items-center text-center mt-0 mb-10 md:mb-14 cursor-default select-none">
          <h1
            ref={titleRef}
            className="font-display text-8xl sm:text-9xl md:text-[10rem] lg:text-[11.5rem] font-bold text-[#FF5FCF] tracking-normal leading-none drop-shadow-[0_14px_45px_rgba(255,95,207,0.4)] cursor-default select-none text-stroke-comic"
            style={{ cursor: 'default' }}
          >
            GYUT
          </h1>
          <p className="mt-3 font-mono text-sm sm:text-base md:text-lg font-bold tracking-[0.3em] text-[#EDEDED]/90 uppercase cursor-default select-none">
            glitch your text
          </p>
        </div>

        {/* Clean, Simple Floating Cards (Referencing the cute anime polaroids, zero text clutter) */}
        <div className="w-full max-w-3xl grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 px-2">
          {/* Card 1: Tilt -4deg */}
          <div className="group flex flex-col items-center bg-[#0d0d12] border-2 border-white/15 hover:border-[#FF5FCF]/70 rounded-2xl p-2.5 shadow-2xl backdrop-blur-md rotate-[-4deg] hover:rotate-0 transition-all duration-300">
            <div className="w-full aspect-[4/3] bg-black/80 rounded-xl flex items-center justify-center p-3 border border-white/5">
              <span
                ref={card1Ref}
                className="font-mono text-base sm:text-lg font-bold text-[#FF5FCF] tracking-wider"
              >
                glitch
              </span>
            </div>
          </div>

          {/* Card 2: Tilt +2deg */}
          <div className="group flex flex-col items-center bg-[#0d0d12] border-2 border-white/15 hover:border-[#FF5FCF]/70 rounded-2xl p-2.5 shadow-2xl backdrop-blur-md rotate-[2deg] hover:rotate-0 transition-all duration-300">
            <div className="w-full aspect-[4/3] bg-black/80 rounded-xl flex items-center justify-center p-3 border border-white/5">
              <span
                ref={card2Ref}
                className="font-mono text-base sm:text-lg font-bold text-[#EDEDED] tracking-wider"
              >
                0 deps
              </span>
            </div>
          </div>

          {/* Card 3: Tilt -2deg */}
          <div className="group flex flex-col items-center bg-[#0d0d12] border-2 border-white/15 hover:border-[#FF5FCF]/70 rounded-2xl p-2.5 shadow-2xl backdrop-blur-md rotate-[-2deg] hover:rotate-0 transition-all duration-300">
            <div className="w-full aspect-[4/3] bg-black/80 rounded-xl flex items-center justify-center p-3 border border-white/5">
              <span
                ref={card3Ref}
                className="font-mono text-base sm:text-lg font-bold text-[#FF5FCF] tracking-wider"
              >
                ~4kb
              </span>
            </div>
          </div>

          {/* Card 4: Tilt +4deg */}
          <div className="group flex flex-col items-center bg-[#0d0d12] border-2 border-white/15 hover:border-[#FF5FCF]/70 rounded-2xl p-2.5 shadow-2xl backdrop-blur-md rotate-[4deg] hover:rotate-0 transition-all duration-300">
            <div className="w-full aspect-[4/3] bg-black/80 rounded-xl flex items-center justify-center p-3 border border-white/5">
              <span
                ref={card4Ref}
                className="font-mono text-base sm:text-lg font-bold text-[#EDEDED] tracking-wider"
              >
                pure css
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
