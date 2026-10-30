'use client';

import { useEffect, useRef, useState } from 'react';
import { createGlitch } from 'gyut';
import type { GlitchShape } from 'gyut';

export function DemosShowcase() {
  const demo1Ref = useRef<HTMLDivElement>(null);
  const demo2Ref = useRef<HTMLDivElement>(null);
  const demo3Ref = useRef<HTMLDivElement>(null);
  const demo4Ref = useRef<HTMLDivElement>(null);

  const demo3InstanceRef = useRef<ReturnType<typeof createGlitch> | null>(null);
  const demo4InstanceRef = useRef<ReturnType<typeof createGlitch> | null>(null);

  const [activeShape, setActiveShape] = useState<GlitchShape>('classic');

  useEffect(() => {
    // 1. Random Colors Demo
    let g1: ReturnType<typeof createGlitch> | undefined;
    if (demo1Ref.current) {
      g1 = createGlitch(demo1Ref.current, {
        intensity: 0.5,
        speed: 1,
        trigger: 'always',
      });
    }

    // 2. Custom Chromatic Aberration Demo
    let g2: ReturnType<typeof createGlitch> | undefined;
    if (demo2Ref.current) {
      g2 = createGlitch(demo2Ref.current, {
        intensity: 0.65,
        speed: 1,
        trigger: 'always',
        colors: ['#FF5FCF', '#00F0FF', '#FFE600'],
      });
    }

    // 3. Shape Presets Demo
    if (demo3Ref.current) {
      demo3InstanceRef.current = createGlitch(demo3Ref.current, {
        intensity: 0.6,
        speed: 1,
        trigger: 'always',
        shape: activeShape,
        colors: ['#FF5FCF', '#00F0FF'],
      });
    }

    // 4. Post-Glitch Replace Demo
    if (demo4Ref.current) {
      demo4InstanceRef.current = createGlitch(demo4Ref.current, {
        intensity: 0.7,
        speed: 1.2,
        trigger: 'manual',
        shape: 'block',
        colors: ['#FF5FCF', '#00FF66'],
        afterGlitch: {
          type: 'replace',
          text: 'SYSTEM RESTORED',
        },
      });
    }

    return () => {
      g1?.destroy();
      g2?.destroy();
      demo3InstanceRef.current?.destroy();
      demo4InstanceRef.current?.destroy();
    };
  }, []);

  // Update shape when activeShape changes
  const handleShapeChange = (shape: GlitchShape) => {
    setActiveShape(shape);
    if (demo3Ref.current) {
      demo3InstanceRef.current?.destroy();
      demo3InstanceRef.current = createGlitch(demo3Ref.current, {
        intensity: 0.6,
        speed: 1,
        trigger: 'always',
        shape,
        colors: ['#FF5FCF', '#00F0FF'],
      });
    }
  };

  const handleTriggerDemo4 = () => {
    demo4InstanceRef.current?.replay();
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#EDEDED] tracking-wide">
          See what Gyut can do
        </h2>
        <p className="mt-2 text-sm sm:text-base font-mono text-[#737373]">
          Explore core behaviors running directly in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Default Random Colors */}
        <div className="flex flex-col justify-between bg-[#0b0b12] border border-white/10 rounded-2xl p-6 shadow-xl hover:border-white/20 transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs text-[#00F0FF] uppercase tracking-wider bg-[#00F0FF]/10 px-2.5 py-1 rounded-md border border-[#00F0FF]/20">
                01. Random Mode
              </span>
              <span className="font-mono text-xs text-[#737373]">trigger: &apos;always&apos;</span>
            </div>
            <h3 className="font-display text-xl font-bold text-[#EDEDED] mb-2">
              Coherent Random Palettes
            </h3>
            <p className="text-sm font-sans text-[#737373] mb-6">
              Random contrast pairs selected at burst onset, eliminating strobe flickering.
            </p>
          </div>

          <div className="h-28 bg-[#050508] border border-white/5 rounded-xl flex items-center justify-center p-4">
            <span
              ref={demo1Ref}
              className="font-mono text-lg sm:text-xl font-bold text-[#EDEDED] tracking-widest"
            >
              AUTONOMOUS BURST
            </span>
          </div>
        </div>

        {/* Card 2: Custom Multi-Colors */}
        <div className="flex flex-col justify-between bg-[#0b0b12] border border-white/10 rounded-2xl p-6 shadow-xl hover:border-white/20 transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs text-[#FF5FCF] uppercase tracking-wider bg-[#FF5FCF]/10 px-2.5 py-1 rounded-md border border-[#FF5FCF]/20">
                02. Custom Colors
              </span>
              <span className="font-mono text-xs text-[#737373]">3+ colors stacked</span>
            </div>
            <h3 className="font-display text-xl font-bold text-[#EDEDED] mb-2">
              Chromatic Aberration
            </h3>
            <p className="text-sm font-sans text-[#737373] mb-6">
              Multi-color displacement layers rendered via text-shadow without extra DOM nodes.
            </p>
          </div>

          <div className="h-28 bg-[#050508] border border-white/5 rounded-xl flex items-center justify-center p-4">
            <span
              ref={demo2Ref}
              className="font-mono text-lg sm:text-xl font-bold text-[#EDEDED] tracking-widest"
            >
              TRIPLE CHROMATIC
            </span>
          </div>
        </div>

        {/* Card 3: Shape Presets */}
        <div className="flex flex-col justify-between bg-[#0b0b12] border border-white/10 rounded-2xl p-6 shadow-xl hover:border-white/20 transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs text-[#FFE600] uppercase tracking-wider bg-[#FFE600]/10 px-2.5 py-1 rounded-md border border-[#FFE600]/20">
                03. Visual Shapes
              </span>
              <div className="flex gap-1.5">
                {(['classic', 'slice', 'block'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => handleShapeChange(s)}
                    className={`px-2 py-0.5 text-xs font-mono rounded capitalize transition-all ${
                      activeShape === s
                        ? 'bg-[#FFE600] text-black font-bold'
                        : 'bg-white/5 text-[#737373] hover:text-[#EDEDED]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <h3 className="font-display text-xl font-bold text-[#EDEDED] mb-2">
              Preset Distortion Geometry
            </h3>
            <p className="text-sm font-sans text-[#737373] mb-6">
              Switch between classic horizontal displacement, thin razor slices, or blocky fragments.
            </p>
          </div>

          <div className="h-28 bg-[#050508] border border-white/5 rounded-xl flex items-center justify-center p-4">
            <span
              ref={demo3Ref}
              className="font-mono text-lg sm:text-xl font-bold text-[#EDEDED] tracking-widest"
            >
              GEOMETRIC SHAPE
            </span>
          </div>
        </div>

        {/* Card 4: Post-Glitch Replace */}
        <div className="flex flex-col justify-between bg-[#0b0b12] border border-white/10 rounded-2xl p-6 shadow-xl hover:border-white/20 transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs text-[#00FF66] uppercase tracking-wider bg-[#00FF66]/10 px-2.5 py-1 rounded-md border border-[#00FF66]/20">
                04. Post-Glitch Action
              </span>
              <button
                onClick={handleTriggerDemo4}
                className="px-2.5 py-1 text-xs font-mono rounded-md bg-[#00FF66]/20 text-[#00FF66] hover:bg-[#00FF66] hover:text-black font-semibold transition-all border border-[#00FF66]/30 flex items-center gap-1"
              >
                <span>Trigger Replay</span>
                <span className="text-[10px]">▶</span>
              </button>
            </div>
            <h3 className="font-display text-xl font-bold text-[#EDEDED] mb-2">
              Smooth Text Replacement
            </h3>
            <p className="text-sm font-sans text-[#737373] mb-6">
              Glitch effect runs before smoothly resolving into new text without layout jump.
            </p>
          </div>

          <div className="h-28 bg-[#050508] border border-white/5 rounded-xl flex items-center justify-center p-4">
            <span
              ref={demo4Ref}
              className="font-mono text-lg sm:text-xl font-bold text-[#FF5FCF] tracking-widest"
            >
              BREACH DETECTED
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

