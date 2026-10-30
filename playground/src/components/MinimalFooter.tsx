'use client';

import { useEffect, useState } from 'react';

const BUILD_MILESTONES = [
  'build 2 hours ago',
  'build 4 days ago',
  'build 2 weeks ago',
  'build 1 month ago',
  'build 1 year ago',
];

export function MinimalFooter() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % BUILD_MILESTONES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="w-full mt-auto pt-16 pb-0 flex flex-col items-center bg-[#000000] border-t border-white/[0.08] overflow-hidden">
      {/* Upper Navigation & Dynamic Status Bar */}
      <div className="w-full max-w-5xl px-4 flex items-center justify-between z-10">
        {/* Left: Pure text GitHub and MIT beside it */}
        <div className="flex items-center gap-6 font-mono text-xs sm:text-sm">
          <a
            href="https://github.com/gilangabdian"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#EDEDED]/80 hover:text-[#FF5FCF] transition-colors"
          >
            GitHub
          </a>
          <span className="text-[#737373]">
            MIT
          </span>
        </div>

        {/* Right: Pure text build time (dynamic rotating relative milestone) */}
        <div>
          <span className="font-mono text-xs text-[#737373] transition-all duration-300">
            {BUILD_MILESTONES[index]}
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
