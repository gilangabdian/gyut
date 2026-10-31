'use client'

import { useSyncExternalStore } from 'react'

// Timestamp of the first commit in the repository (29 Oct 2026 06:44:47 +0700)
const PROJECT_INCEPTION = 1793231087000

function getProjectAge(): string {
  const diffMs = Math.max(0, Date.now() - PROJECT_INCEPTION)
  const seconds = Math.floor(diffMs / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (years > 0) return `build ${years} ${years === 1 ? 'year' : 'years'} ago`
  if (months > 0)
    return `build ${months} ${months === 1 ? 'month' : 'months'} ago`
  if (weeks > 0) return `build ${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`
  if (days > 0) return `build ${days} ${days === 1 ? 'day' : 'days'} ago`
  if (hours > 0) return `build ${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
  if (minutes > 0)
    return `build ${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`
  return 'build just now'
}

function subscribe(callback: () => void) {
  const interval = setInterval(callback, 60000)
  return () => clearInterval(interval)
}

function getSnapshot() {
  return getProjectAge()
}

function getServerSnapshot() {
  return 'build recently'
}

export function MinimalFooter() {
  const projectAge = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  )

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
          <span className="text-[#737373]">MIT</span>
        </div>

        {/* Right: Pure text build time (dynamically computed from inception) */}
        <div>
          <span className="font-mono text-xs text-[#737373] transition-all duration-300">
            {projectAge}
          </span>
        </div>
      </div>

      {/* Bottom-Most: Gigantic Truus-Style 'gyuttt' Typography */}
      <div className="w-full overflow-hidden flex justify-center items-end select-none pointer-events-none mt-10 -mb-4 sm:-mb-6 md:-mb-10">
        <span className="font-display font-black text-[22vw] leading-[0.72] tracking-tighter text-white/[0.07] uppercase transition-colors">
          gyuttt
        </span>
      </div>
    </footer>
  )
}
