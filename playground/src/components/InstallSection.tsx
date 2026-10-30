"use client";

import { useState } from "react";

type PackageManager = "pnpm" | "npm" | "yarn" | "bun";

export function InstallSection() {
  const [activePm, setActivePm] = useState<PackageManager>("pnpm");
  const [copied, setCopied] = useState(false);

  const commands: Record<PackageManager, string> = {
    pnpm: "pnpm add gyut",
    npm: "npm install gyut",
    yarn: "yarn add gyut",
    bun: "bun add gyut",
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(commands[activePm]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <section className="w-full max-w-3xl mx-auto px-4 py-12 flex flex-col items-center">
      <div className="w-full text-center mb-6">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#EDEDED] tracking-wide">
          Get Started in Seconds
        </h2>
      </div>

      {/* Terminal Box */}
      <div className="w-full bg-[#0c0c14] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header Tabs */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#12121e] border-b border-white/10">
          <div className="flex gap-2">
            {(["pnpm", "npm", "yarn", "bun"] as const).map((pm) => (
              <button
                key={pm}
                onClick={() => setActivePm(pm)}
                className={`px-3 py-1 text-xs font-mono rounded-lg transition-all ${
                  activePm === pm
                    ? "bg-[#FF5FCF] text-black font-bold shadow-md"
                    : "text-[#737373] hover:text-[#EDEDED] hover:bg-white/5"
                }`}>
                {pm}
              </button>
            ))}
          </div>

          <div className="flex gap-1.5 items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-white/20"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-white/20"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5FCF]/80"></span>
          </div>
        </div>

        {/* Code Bar & Copy Button */}
        <div className="flex items-center justify-between px-5 py-4 font-mono text-sm sm:text-base">
          <div className="flex items-center gap-3 overflow-x-auto text-[#EDEDED]">
            <span className="text-[#FF5FCF] select-none">$</span>
            <code className="text-[#EDEDED] font-semibold">{commands[activePm]}</code>
          </div>

          <button
            onClick={handleCopy}
            className="ml-4 shrink-0 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-[#FF5FCF]/20 hover:border-[#FF5FCF]/40 border border-white/10 text-xs font-mono text-[#EDEDED] transition-all flex items-center gap-1.5"
            title="Copy command">
            {copied ? (
              <>
                <svg className="w-4 h-4 text-[#FF5FCF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-[#FF5FCF] font-bold">Copied!</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 text-[#737373]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
