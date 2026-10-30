'use client';

import { useEffect, useState } from 'react';

/**
 * Calculates human-readable relative time from a reference timestamp.
 * Supports: 'build 2 hours ago', 'build 4 days ago', 'build 2 weeks ago',
 * 'build 1 month ago', 'build 1 year ago', etc.
 */
function getRelativeBuildTime(timestamp: number): string {
  const diffMs = Math.max(0, Date.now() - timestamp);
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `build ${years} ${years === 1 ? 'year' : 'years'} ago`;
  if (months > 0) return `build ${months} ${months === 1 ? 'month' : 'months'} ago`;
  if (weeks > 0) return `build ${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  if (days > 0) return `build ${days} ${days === 1 ? 'day' : 'days'} ago`;
  if (hours > 0) return `build ${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  if (minutes > 0) return `build ${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  return 'build just now';
}

export function MinimalFooter() {
  // Initial fallback avoids hydration mismatch, then resolves on client
  const [buildTimeText, setBuildTimeText] = useState('build 2 hours ago');

  useEffect(() => {
    // Relative to the project initial milestone (2 hours prior)
    const initialMilestone = Date.now() - 2 * 60 * 60 * 1000;
    setBuildTimeText(getRelativeBuildTime(initialMilestone));
  }, []);

  return (
    <footer className="w-full mt-auto pt-16 pb-0 flex flex-col items-center bg-[#000000] border-t border-white/[0.08] overflow-hidden">
      {/* Upper Navigation & Dynamic Status Bar */}
      <div className="w-full max-w-5xl px-4 flex flex-wrap items-center justify-between gap-4 z-10">
        {/* Left: GitHub Link without username */}
        <a
          href="https://github.com/gilangabdian"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs sm:text-sm text-[#EDEDED]/80 hover:text-[#FF5FCF] transition-colors flex items-center gap-2 group"
          title="Visit GitHub Repository"
        >
          <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            />
          </svg>
          <span className="font-semibold">GitHub</span>
          <span className="text-[10px] opacity-60">↗</span>
        </a>

        {/* Center: Custom Dynamic Build Indicator */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-[#737373]">
          <span className="w-2 h-2 rounded-full bg-[#00FF66] animate-pulse" />
          <span>{buildTimeText}</span>
        </div>

        {/* Right: MIT License */}
        <div className="font-mono text-xs sm:text-sm text-[#737373] flex items-center gap-2">
          <span>License:</span>
          <span className="text-[#EDEDED]/90 font-bold px-2 py-0.5 rounded bg-white/[0.05] border border-white/10">
            MIT
          </span>
        </div>
      </div>

      {/* Bottom-Most: Gigantic Truus-Style 'gyut' Typography */}
      <div className="w-full overflow-hidden flex justify-center items-end select-none pointer-events-none mt-10 -mb-4 sm:-mb-6 md:-mb-10">
        <span className="font-display font-black text-[22vw] leading-[0.72] tracking-tighter text-white/[0.07] uppercase transition-colors">
          gyut
        </span>
      </div>
    </footer>
  );
}
