'use client'

import { useEffect, useRef, useState } from 'react'
import { createGlitch } from 'gyuttt'
import type { GlitchInstance, GlitchShape, GlitchTrigger } from 'gyuttt'

export function LivePlayground() {
  const targetRef = useRef<HTMLHeadingElement>(null)
  const instanceRef = useRef<GlitchInstance | null>(null)

  // Playground state
  const [text, setText] = useState('CYBERNETIC SYSTEM')
  const [intensity, setIntensity] = useState(0.6)
  const [speed, setSpeed] = useState(1)
  const [shape, setShape] = useState<GlitchShape>('classic')
  const [trigger, setTrigger] = useState<GlitchTrigger>('always')
  const [colorMode, setColorMode] = useState<'random' | 'custom'>('custom')
  const [customColors, setCustomColors] = useState('#FF5FCF, #FFFFFF')
  const [afterGlitchType, setAfterGlitchType] = useState<
    'none' | 'hide' | 'replace'
  >('none')
  const [replaceText, setReplaceText] = useState('SYSTEM RESTORED')

  // Initialize or re-initialize glitch instance whenever options change
  useEffect(() => {
    if (!targetRef.current) return

    // Destroy existing instance
    if (instanceRef.current) {
      instanceRef.current.destroy()
    }

    // Set text
    targetRef.current.textContent = text

    // Parse colors
    let colors: string[] | undefined
    if (colorMode === 'custom') {
      colors = customColors
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean)
      if (colors.length === 0) colors = undefined
    }

    // Parse afterGlitch
    let afterGlitch
    if (afterGlitchType === 'hide') {
      afterGlitch = { type: 'hide' as const, mode: 'opacity' as const }
    } else if (afterGlitchType === 'replace') {
      afterGlitch = { type: 'replace' as const, text: replaceText }
    }

    instanceRef.current = createGlitch(targetRef.current, {
      intensity,
      speed,
      shape,
      trigger,
      colors,
      afterGlitch,
    })

    return () => {
      instanceRef.current?.destroy()
    }
  }, [
    text,
    intensity,
    speed,
    shape,
    trigger,
    colorMode,
    customColors,
    afterGlitchType,
    replaceText,
  ])

  // Auto-loop demo when trigger is 'always' and afterGlitch is active
  useEffect(() => {
    if (trigger !== 'always' || afterGlitchType === 'none') return

    const intervalId = setInterval(() => {
      instanceRef.current?.replay()
    }, 2800)

    return () => clearInterval(intervalId)
  }, [trigger, afterGlitchType, text, replaceText, speed])

  const handleReplay = () => {
    instanceRef.current?.replay()
  }

  const handleStop = () => {
    instanceRef.current?.stop()
  }

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-16">
      {/* Clean Heading without subtitle */}
      <div className="text-center mb-10">
        <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#EDEDED] tracking-wide">
          Playground
        </h2>
      </div>

      {/* Row 1: Side-by-Side Controls (left) & Live Real-Time Preview (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left: Configuration Controls Panel (5 cols) */}
        <div className="lg:col-span-5 bg-[#0a0a0f] border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col justify-between gap-5">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#FF5FCF]">
                Settings
              </h3>
              <span className="text-[11px] font-mono text-[#737373]">
                v0.1.0
              </span>
            </div>

            {/* Text Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-[#EDEDED]/80 font-medium">
                Text Content
              </label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full bg-[#12121a] border border-white/10 rounded-lg px-3 py-2 font-mono text-sm text-[#EDEDED] focus:outline-none focus:border-[#FF5FCF] transition-all"
              />
            </div>

            {/* Intensity Slider */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#EDEDED]/80 font-medium">Intensity</span>
                <span className="text-[#FF5FCF] font-bold">{intensity}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={intensity}
                onChange={(e) => setIntensity(parseFloat(e.target.value))}
                className="w-full accent-[#FF5FCF] cursor-pointer"
              />
            </div>

            {/* Speed Multiplier */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-[#EDEDED]/80 font-medium">
                Speed Multiplier
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[0.5, 1, 2].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    className={`py-1.5 font-mono text-xs rounded-lg border transition-all ${
                      speed === s
                        ? 'bg-[#FF5FCF] text-black font-bold border-[#FF5FCF]'
                        : 'bg-[#12121a] text-[#EDEDED]/80 border-white/10 hover:border-white/30'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>

            {/* Shape Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-[#EDEDED]/80 font-medium">
                Shape Preset
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['classic', 'slice', 'block'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setShape(s)}
                    className={`py-1.5 font-mono text-xs capitalize rounded-lg border transition-all ${
                      shape === s
                        ? 'bg-[#FF5FCF] text-black font-bold border-[#FF5FCF]'
                        : 'bg-[#12121a] text-[#EDEDED]/80 border-white/10 hover:border-white/30'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Trigger Mode */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-[#EDEDED]/80 font-medium">
                Trigger Mode
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['always', 'once', 'hover', 'manual'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTrigger(t)}
                    className={`py-1.5 font-mono text-xs capitalize rounded-lg border transition-all ${
                      trigger === t
                        ? 'bg-[#FF5FCF] text-black font-bold border-[#FF5FCF]'
                        : 'bg-[#12121a] text-[#EDEDED]/80 border-white/10 hover:border-white/30'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors Strategy */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-mono text-[#EDEDED]/80 font-medium">
                  Colors
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setColorMode('random')}
                    className={`px-2 py-0.5 text-[11px] font-mono rounded ${
                      colorMode === 'random'
                        ? 'bg-[#FF5FCF] text-black font-semibold'
                        : 'text-[#737373]'
                    }`}
                  >
                    Random
                  </button>
                  <button
                    onClick={() => setColorMode('custom')}
                    className={`px-2 py-0.5 text-[11px] font-mono rounded ${
                      colorMode === 'custom'
                        ? 'bg-[#FF5FCF] text-black font-semibold'
                        : 'text-[#737373]'
                    }`}
                  >
                    Custom
                  </button>
                </div>
              </div>

              {colorMode === 'custom' ? (
                <input
                  type="text"
                  value={customColors}
                  onChange={(e) => setCustomColors(e.target.value)}
                  placeholder="#FF5FCF, #FFFFFF"
                  className="w-full bg-[#12121a] border border-white/10 rounded-lg px-3 py-1.5 font-mono text-xs text-[#EDEDED] focus:outline-none focus:border-[#FF5FCF]"
                />
              ) : (
                <div className="p-2 bg-[#12121a] rounded-lg border border-white/5 text-xs font-mono text-[#737373]">
                  Auto coherent contrast pairs
                </div>
              )}
            </div>

            {/* After Glitch Dropdown */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-[#EDEDED]/80 font-medium">
                After Glitch
              </label>
              <select
                value={afterGlitchType}
                onChange={(e) =>
                  setAfterGlitchType(
                    e.target.value as 'none' | 'hide' | 'replace'
                  )
                }
                className="w-full bg-[#12121a] border border-white/10 rounded-lg px-3 py-1.5 font-mono text-xs text-[#EDEDED] focus:outline-none focus:border-[#FF5FCF]"
              >
                <option value="none">None</option>
                <option value="hide">Hide Text</option>
                <option value="replace">Replace Text</option>
              </select>

              {afterGlitchType === 'replace' && (
                <input
                  type="text"
                  value={replaceText}
                  onChange={(e) => setReplaceText(e.target.value)}
                  placeholder="New text"
                  className="w-full mt-1 bg-[#12121a] border border-white/10 rounded-lg px-3 py-1.5 font-mono text-xs text-[#EDEDED] focus:outline-none focus:border-[#FF5FCF]"
                />
              )}
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="pt-3 border-t border-white/10 flex gap-3">
            <button
              onClick={handleReplay}
              className="flex-1 py-2 rounded-lg bg-[#FF5FCF] text-black font-mono font-bold text-xs hover:bg-[#FF5FCF]/90 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-[#FF5FCF]/20"
            >
              <span>Replay</span>
              <span>↻</span>
            </button>
            <button
              onClick={handleStop}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-[#EDEDED] font-mono text-xs hover:bg-white/10 transition-all"
            >
              Stop
            </button>
          </div>
        </div>

        {/* Right: Live Preview Stage (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          {/* Status & Hints OUTSIDE the Card */}
          <div className="flex items-center justify-between px-2 mb-2 font-mono text-xs text-[#737373]">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5FCF] animate-pulse" />
              <span>
                {trigger === 'hover'
                  ? 'Hover over text to trigger glitch'
                  : trigger === 'once'
                    ? 'Fired once on mount (click Replay to re-trigger)'
                    : trigger === 'manual'
                      ? 'Manual mode (click Replay to trigger)'
                      : 'Real-time rendering'}
              </span>
            </span>
            <span>shape: {shape}</span>
          </div>

          {/* Clean Canvas Display (Card murni hanya menampilkan teks) */}
          <div className="w-full flex-1 min-h-[380px] bg-[#0a0a0f] border border-white/10 rounded-2xl flex items-center justify-center p-8 relative overflow-hidden shadow-2xl">
            {/* Subtle Canvas Dot Grid Background */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(circle, #ffffff 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            {/* Target Element */}
            <div className="relative z-10 text-center">
              <h3
                ref={targetRef}
                className={`font-display text-4xl sm:text-5xl md:text-6xl font-bold text-[#EDEDED] tracking-wide select-none ${'cursor-default'}`}
              >
                {text}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
