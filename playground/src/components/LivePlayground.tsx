'use client';

import { useEffect, useRef, useState } from 'react';
import { createGlitch } from 'gyut';
import type { GlitchInstance, GlitchShape, GlitchTrigger } from 'gyut';

export function LivePlayground() {
  const targetRef = useRef<HTMLHeadingElement>(null);
  const instanceRef = useRef<GlitchInstance | null>(null);

  // Playground state
  const [text, setText] = useState('CYBERNETIC SYSTEM');
  const [intensity, setIntensity] = useState(0.6);
  const [speed, setSpeed] = useState(1);
  const [shape, setShape] = useState<GlitchShape>('classic');
  const [trigger, setTrigger] = useState<GlitchTrigger>('always');
  const [colorMode, setColorMode] = useState<'random' | 'custom'>('custom');
  const [customColors, setCustomColors] = useState('#FF5FCF, #00F0FF, #FFE600');
  const [afterGlitchType, setAfterGlitchType] = useState<'none' | 'hide' | 'replace'>('none');
  const [replaceText, setReplaceText] = useState('SYSTEM RESTORED');
  const [copiedCode, setCopiedCode] = useState(false);

  // Initialize or re-initialize glitch instance whenever options change
  useEffect(() => {
    if (!targetRef.current) return;

    // Destroy existing instance
    if (instanceRef.current) {
      instanceRef.current.destroy();
    }

    // Set text
    targetRef.current.textContent = text;

    // Parse colors
    let colors: string[] | undefined;
    if (colorMode === 'custom') {
      colors = customColors
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);
      if (colors.length === 0) colors = undefined;
    }

    // Parse afterGlitch
    let afterGlitch;
    if (afterGlitchType === 'hide') {
      afterGlitch = { type: 'hide' as const, mode: 'opacity' as const };
    } else if (afterGlitchType === 'replace') {
      afterGlitch = { type: 'replace' as const, text: replaceText };
    }

    instanceRef.current = createGlitch(targetRef.current, {
      intensity,
      speed,
      shape,
      trigger,
      colors,
      afterGlitch,
    });

    return () => {
      instanceRef.current?.destroy();
    };
  }, [text, intensity, speed, shape, trigger, colorMode, customColors, afterGlitchType, replaceText]);

  const handleReplay = () => {
    instanceRef.current?.replay();
  };

  const handleStop = () => {
    instanceRef.current?.stop();
  };

  // Generate dynamic TypeScript code snippet
  const generatedCode = `import { createGlitch } from 'gyut';

const glitch = createGlitch('#target', {
  intensity: ${intensity},
  speed: ${speed},
  shape: '${shape}',
  trigger: '${trigger}',${
    colorMode === 'custom'
      ? `\n  colors: [${customColors
          .split(',')
          .map((c) => `'${c.trim()}'`)
          .join(', ')}],`
      : '\n  // colors: undefined (default random coherent palettes)'
  }${
    afterGlitchType === 'hide'
      ? `\n  afterGlitch: {\n    type: 'hide',\n    mode: 'opacity',\n  },`
      : afterGlitchType === 'replace'
      ? `\n  afterGlitch: {\n    type: 'replace',\n    text: '${replaceText}',\n  },`
      : ''
  }
});`;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#EDEDED] tracking-wide">
          Playground
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5 bg-[#0c0c14] border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-[#FF5FCF]">
              Configuration Controls
            </h3>
            <span className="text-xs font-mono text-[#737373]">v0.1.0</span>
          </div>

          {/* Text Input */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono text-[#EDEDED]/80 font-medium">Text Content</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full bg-[#141420] border border-white/10 rounded-lg px-3 py-2 font-mono text-sm text-[#EDEDED] focus:outline-none focus:border-[#FF5FCF] transition-all"
            />
          </div>

          {/* Intensity Slider */}
          <div className="flex flex-col gap-2">
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

          {/* Speed Buttons */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono text-[#EDEDED]/80 font-medium">Speed Multiplier</label>
            <div className="grid grid-cols-3 gap-2">
              {[0.5, 1, 2].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`py-1.5 font-mono text-xs rounded-lg border transition-all ${
                    speed === s
                      ? 'bg-[#FF5FCF] text-black font-bold border-[#FF5FCF]'
                      : 'bg-[#141420] text-[#EDEDED]/80 border-white/10 hover:border-white/30'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* Shape Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono text-[#EDEDED]/80 font-medium">Glitch Shape</label>
            <div className="grid grid-cols-3 gap-2">
              {(['classic', 'slice', 'block'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setShape(s)}
                  className={`py-1.5 font-mono text-xs capitalize rounded-lg border transition-all ${
                    shape === s
                      ? 'bg-[#00F0FF] text-black font-bold border-[#00F0FF]'
                      : 'bg-[#141420] text-[#EDEDED]/80 border-white/10 hover:border-white/30'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Trigger Mode */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono text-[#EDEDED]/80 font-medium">Trigger Mode</label>
            <div className="grid grid-cols-3 gap-2">
              {(['always', 'hover', 'manual'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTrigger(t)}
                  className={`py-1.5 font-mono text-xs capitalize rounded-lg border transition-all ${
                    trigger === t
                      ? 'bg-[#FFE600] text-black font-bold border-[#FFE600]'
                      : 'bg-[#141420] text-[#EDEDED]/80 border-white/10 hover:border-white/30'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Colors Selection */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-mono text-[#EDEDED]/80 font-medium">Color Strategy</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setColorMode('random')}
                  className={`px-2 py-0.5 text-[11px] font-mono rounded ${
                    colorMode === 'random' ? 'bg-white/20 text-[#EDEDED]' : 'text-[#737373]'
                  }`}
                >
                  Random
                </button>
                <button
                  onClick={() => setColorMode('custom')}
                  className={`px-2 py-0.5 text-[11px] font-mono rounded ${
                    colorMode === 'custom' ? 'bg-white/20 text-[#EDEDED]' : 'text-[#737373]'
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
                placeholder="#FF5FCF, #00F0FF, #FFE600"
                className="w-full bg-[#141420] border border-white/10 rounded-lg px-3 py-2 font-mono text-xs text-[#EDEDED] focus:outline-none focus:border-[#FF5FCF]"
              />
            ) : (
              <div className="p-2 bg-[#141420] rounded-lg border border-white/5 text-xs font-mono text-[#737373]">
                Random vibrant contrast pairs per burst
              </div>
            )}
          </div>

          {/* After Glitch Dropdown */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono text-[#EDEDED]/80 font-medium">Post-Glitch Transition</label>
            <select
              value={afterGlitchType}
              onChange={(e) => setAfterGlitchType(e.target.value as 'none' | 'hide' | 'replace')}
              className="w-full bg-[#141420] border border-white/10 rounded-lg px-3 py-2 font-mono text-xs text-[#EDEDED] focus:outline-none focus:border-[#FF5FCF]"
            >
              <option value="none">None (Continuous or Manual)</option>
              <option value="hide">Hide Text</option>
              <option value="replace">Replace Text</option>
            </select>

            {afterGlitchType === 'replace' && (
              <input
                type="text"
                value={replaceText}
                onChange={(e) => setReplaceText(e.target.value)}
                placeholder="New text after glitch"
                className="w-full mt-1 bg-[#141420] border border-white/10 rounded-lg px-3 py-2 font-mono text-xs text-[#EDEDED] focus:outline-none focus:border-[#FF5FCF]"
              />
            )}
          </div>

          {/* Action Trigger Controls */}
          <div className="pt-2 border-t border-white/10 flex gap-3">
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

        {/* Live Canvas & Generated Code Column (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Live Stage Display */}
          <div className="w-full min-h-[320px] bg-[#0c0c14] border-2 border-white/10 rounded-2xl flex flex-col items-center justify-center p-8 relative overflow-hidden shadow-2xl">
            {/* Subtle Canvas Dot Grid Background */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            {/* Target Element */}
            <div className="relative z-10 text-center">
              <h3
                ref={targetRef}
                className="font-display text-3xl sm:text-5xl md:text-6xl font-bold text-[#EDEDED] tracking-wide select-none cursor-pointer"
              >
                {text}
              </h3>
              <p className="mt-4 font-mono text-xs text-[#737373]">
                {trigger === 'hover' ? '← Hover over text to trigger glitch →' : 'Real-time rendering'}
              </p>
            </div>
          </div>

          {/* Generated TypeScript Code Box */}
          <div className="w-full bg-[#0c0c14] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
            <div className="flex items-center justify-between px-4 py-3 bg-[#12121e] border-b border-white/10">
              <span className="font-mono text-xs text-[#737373]">TypeScript Code Snippet</span>
              <button
                onClick={handleCopyCode}
                className="px-3 py-1 rounded bg-white/10 hover:bg-[#FF5FCF]/20 border border-white/10 text-xs font-mono text-[#EDEDED] transition-all flex items-center gap-1.5"
              >
                {copiedCode ? (
                  <span className="text-[#00FF66]">Copied!</span>
                ) : (
                  <span>Copy Code</span>
                )}
              </button>
            </div>
            <pre className="p-4 overflow-x-auto font-mono text-xs leading-relaxed text-[#EDEDED]/90 bg-[#08080d]">
              <code>{generatedCode}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}

