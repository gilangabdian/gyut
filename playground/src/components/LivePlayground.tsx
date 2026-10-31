'use client'

import { useEffect, useRef, useState } from 'react'
import { createGlitch } from 'gyuttt'
import type {
  GlitchInstance,
  GlitchPreset,
  GlitchShape,
  GlitchTrigger,
} from 'gyuttt'

export function LivePlayground() {
  const targetRef = useRef<HTMLHeadingElement>(null)
  const instanceRef = useRef<GlitchInstance | null>(null)

  // Playground state
  const [text, setText] = useState('EDIT ME')
  const [intensity, setIntensity] = useState(0.6)
  const [speed, setSpeed] = useState(1)
  const [shape, setShape] = useState<GlitchShape>('classic')
  const [preset, setPreset] = useState<GlitchPreset>('default')
  const [trigger, setTrigger] = useState<GlitchTrigger>('always')
  const [colorMode, setColorMode] = useState<'random' | 'custom'>('custom')
  const [customColors, setCustomColors] = useState('#FF5FCF, #FFFFFF')
  const [afterGlitchType, setAfterGlitchType] = useState<
    'none' | 'hide' | 'replace'
  >('none')
  const [replaceText, setReplaceText] = useState('GLITCH, HERE')

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
      preset,
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
    preset,
    trigger,
    colorMode,
    customColors,
    afterGlitchType,
    replaceText,
  ])

  // Natural looping cycle when trigger is 'always' and afterGlitch is active
  useEffect(() => {
    if (trigger !== 'always' || afterGlitchType === 'none') return

    let timeoutId: NodeJS.Timeout
    let active = true

    const runLoop = () => {
      if (!active) return

      // 1. Reset text to original content and hold clean for 1.8s
      if (targetRef.current) {
        targetRef.current.innerHTML = `<span class="gyut-base">${text}</span>`
        targetRef.current.setAttribute('data-gyut-text', text)
      }

      timeoutId = setTimeout(() => {
        if (!active) return
        // 2. Fire glitch morph into replacement text!
        instanceRef.current?.replay()

        // 3. Hold replacement text for 2.2s before cycling back
        timeoutId = setTimeout(() => {
          if (!active) return
          runLoop()
        }, 2200)
      }, 1800)
    }

    runLoop()

    return () => {
      active = false
      clearTimeout(timeoutId)
    }
  }, [trigger, afterGlitchType, text, replaceText, speed])

  const handleReplay = () => {
    if (afterGlitchType === 'replace' && targetRef.current) {
      targetRef.current.innerHTML = `<span class="gyut-base">${text}</span>`
      targetRef.current.setAttribute('data-gyut-text', text)
    }
    instanceRef.current?.replay()
  }

  const handleStop = () => {
    instanceRef.current?.stop()
  }

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-16">
      {/* Clean Heading without subtitle */}
      <div className="text-center mb-12">
        <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#EDEDED] tracking-wide">
          Playground
        </h2>
      </div>

      {/* Side-by-Side: Unboxed Scrolling Controls (left) & Sticky Live Preview (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left: Configuration Controls (5 cols) - unboxed, scrolls naturally */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#FF5FCF]">
              Settings
            </h3>
            <span className="text-[11px] font-mono text-[#737373]">
              v0.2.0
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

          {/* Motion Preset */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-mono text-[#EDEDED]/80 font-medium">
                Motion Preset
              </label>
              <span className="text-[11px] font-mono text-[#FF5FCF] capitalize font-semibold">
                {preset}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {(['default', 'smooth', 'lag', 'long'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPreset(p)}
                  className={`py-1.5 font-mono text-xs capitalize rounded-lg border transition-all ${
                    preset === p
                      ? 'bg-[#FF5FCF] text-black font-bold border-[#FF5FCF]'
                      : 'bg-[#12121a] text-[#EDEDED]/80 border-white/10 hover:border-white/30'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
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

          {/* Action Trigger Buttons */}
          <div className="pt-3 border-t border-white/10 flex gap-3">
            <button
              onClick={handleReplay}
              className="flex-1 py-2.5 rounded-lg bg-[#FF5FCF] text-black font-mono font-bold text-xs hover:bg-[#FF5FCF]/90 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-[#FF5FCF]/20 cursor-pointer"
            >
              <span>Replay</span>
              <span>↻</span>
            </button>
            <button
              onClick={handleStop}
              className="px-5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-[#EDEDED] font-mono text-xs hover:bg-white/10 transition-all cursor-pointer"
            >
              Stop
            </button>
          </div>
        </div>

        {/* Right: Sticky Live Preview Stage (7 cols) - Unboxed & pinned in viewport */}
        <div className="lg:col-span-7 lg:sticky lg:top-24 flex flex-col">
          {/* Status & Hints on top of preview */}
          <div className="flex items-center justify-between px-1 mb-3 font-mono text-xs text-[#737373]">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5FCF] animate-pulse" />
              <span className="truncate">
                {trigger === 'hover'
                  ? 'Hover over text to trigger glitch'
                  : trigger === 'once'
                    ? 'Fired once on mount (click Replay to re-trigger)'
                    : trigger === 'manual'
                      ? 'Manual mode (click Replay to trigger)'
                      : 'Real-time rendering'}
              </span>
            </span>
            <span className="shrink-0 ml-2">
              shape: {shape} • preset: {preset}
            </span>
          </div>

          {/* Pure floating canvas: No card wrapper, no border, no dots (Option A) */}
          <div className="w-full min-h-[380px] sm:min-h-[440px] flex items-center justify-center p-4 sm:p-8 relative">
            {/* Target Element */}
            <div className="text-center max-w-full overflow-hidden px-2">
              <h3
                ref={targetRef}
                className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-[#EDEDED] tracking-wide select-none cursor-default break-words"
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
